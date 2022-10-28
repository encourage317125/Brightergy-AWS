"use strict";

var _            = require("lodash");
var async        = require("async");
var moment       = require("moment");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var log          = require("../../../libs/log")(module);

const MONTH_FORMAT = "DD MMM";
const YEAR_FORMAT = "MMM YY";

/**
 * Aggregate data from tempoIQ
 * @param data
 * @param tsTransformator function to transform datapoint.ts (used for aggregation)
 * @returns {{}}
 */
function transformTempoiqResponse(data, tsTransformator, nodeList) {
    if (!tsTransformator) {
        tsTransformator = function(ts) {
            return moment.utc(ts).format(YEAR_FORMAT);
        };
    }

    var result = {};

    if (!data.dataPoints) {
        log.warn("transformTempoiqResponse: wrong object structure");
        return {};
    }

    _.forEach(data.dataPoints, function(datapoint) {

        var key = tsTransformator(datapoint.ts);
        result[key] = result[key] || { energy: 0, cost: 0} ;

        _.forOwn(datapoint.values, function(metrics, deviceId) {

            var rate = nodeList[deviceId].rate || 0;

            _.forOwn(metrics, function(value, metricName) {

                // need to divide by 1000 because client need kWh
                var kwh = (value / 1000);

                result[key].energy += kwh;

                result[key].cost += kwh * rate;
                //log.debug("ts: " + datapoint.ts + ", deviceId: " + deviceId +
                //    ", kwh: " + kwh + ", rate: " + rate);
            });
        });
    });

    return result;
}

/**
 * Calculate startDate and endDate for annual case
 *
 * @param inputDate
 * @returns {{startDate: *, endDate: *}}
 */
function calculateDataInterval(inputDate, dateTimeUtils) {
    if (!inputDate) {
        inputDate = moment.utc();
    }

    var endDate = inputDate.clone().endOf("month");
    var startDate = dateTimeUtils.getYearRange("month").start.add(-1, "year");
    return {
        startDate: startDate,
        endDate: endDate
    };
}

/**
 * transform data according to protocol and send to the client
 * @param transformedData result of transformTempoiqResponse
 * @param format can be month or year
 * @param socket io socket
 */
function sendAnswerToClient(transformedData, format, dateTimeUtils, clientAnswer) {
    log.debug("sendAnswerToClient");

    var categories = [];

    // create if not exists
    var getCategory = function(date) {
        var index = _.findIndex(categories, function(cat) {
            return cat.date === date;
        });
        if (index === -1) {
            categories.push({date: date});
            return _.last(categories);
        }
        return categories[index];
    };

    var currentYear = moment.utc().startOf("year");
    var currentYearNum = currentYear.year();
    var currentMonth = moment.utc().startOf("month");
    var currentMonthNum = currentMonth.month();

    // create all categories in advanve
    _.range(0, 12).forEach(function(month) {
        var monthData = moment.utc().year(currentYearNum).month(month).
            format(YEAR_FORMAT);
        getCategory(monthData);
    });

    _.forOwn(transformedData, function(record, date) {

        var value = record.energy;
        var cost = record.cost;

        var formattedDate;
        var cat;

        if (format === "year") {
            formattedDate = moment.utc(date, YEAR_FORMAT).year(currentYearNum).
                format(YEAR_FORMAT);

            cat = getCategory(formattedDate);

            if (moment.utc(date, YEAR_FORMAT) < currentYear) {
                cat.previous = value;
                cat.previousCost = cost;
            } else {
                cat.current = value;
                cat.currentCost = cost;
            }
        } else if (format === "month") {
            formattedDate = moment.utc(date, MONTH_FORMAT).month(currentMonthNum).
                format(MONTH_FORMAT);

            cat = getCategory(formattedDate);

            if (moment.utc(date, MONTH_FORMAT) < currentMonth) {
                cat.previous = value;
                cat.previousCost = cost;
            } else {
                cat.current = value;
                cat.currentCost = cost;
            }
        }
    });

    var currentSeries = [];
    var previousSeries = [];
    var meanSerieas = [];
    var currentCostSeries = [];
    var previousCostSeries = [];

    var categoriesList = [];

    categories.forEach(function(cat) {
        categoriesList.push(cat.date);
        currentSeries.push(_.isNumber(cat.current) ? cat.current : 0);
        previousSeries.push(_.isNumber(cat.previous) ? cat.previous : 0);
        currentCostSeries.push(_.isNumber(cat.currentCost) ? cat.currentCost :  0);
        previousCostSeries.push(_.isNumber(cat.previousCost) ? cat.previousCost : 0);

        var mean = ((cat.current || 0) + (cat.previous || 0)) / 2;
        if (!cat.current || !cat.previous) {
            mean = mean * 2;
        }
        meanSerieas.push(mean);
    });

    var categoryFormat = format === "year" ? YEAR_FORMAT: MONTH_FORMAT;

    var result = {
        category: _.map(categoriesList, function(cat) {
            return dateTimeUtils.formatDate(moment.utc(cat, categoryFormat));
        }),
        series: [
            {
                name: "current",
                data: currentSeries
            },
            {
                name: "currentCost",
                data: currentCostSeries
            },
            {
                name: "previous",
                data: previousSeries
            },
            {
                name: "previousCost",
                data: previousCostSeries
            },
            {
                name: "mean",
                data: meanSerieas
            }
        ]
    };

    clientAnswer.send(result);
}

/**
 * Load data from tempoiq for the client (for two previous years)
 * @param clientObject the client object from websocket
 */
function loadData(clientObject, finalCallback) {
    if (!clientObject || !clientObject.socket) {
        return;
    }

    var clientAnswer = new utils.ClientWebsocketAnswer(clientObject.socket,
                                                       consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator);

    var nodeList = clientObject.nodeList;
    var selection = clientObject.selection;

    // check answer in the cache

    if (selection.devices.or.length === 0) {
        return clientAnswer.error(new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION));
    }

    async.waterfall([
        // load data for previous year
        function (next) {
            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] //kwh data
                }, {
                    "name": "rollup",
                    "arguments": ["sum", "1month"] //set user dimension
                }]
            };

            var interval = calculateDataInterval(moment.utc(), clientObject.dateTimeUtils);

            var range = {
                start: interval.startDate,
                end: interval.endDate
            };

            var tempoiqOptions = {
                selection: selection,
                pipeline: pipeline
            };

            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, next);
        },
        function(data, next) {
            var transformedResult = transformTempoiqResponse(data, null, nodeList);
            sendAnswerToClient(transformedResult, "year", clientObject.dateTimeUtils, clientAnswer);
            data = null;
            next();
        }
    ],
    function(err) {
        if (err) {
            log.error(err);
            if(finalCallback) {
                finalCallback(err);
            }
            return clientAnswer.error(err);
        }
        if (finalCallback) {
            finalCallback(err);
        }
    });
}

exports.loadData = loadData;
// for UT
exports.calculateDataInterval = calculateDataInterval;
// for UT
exports.transformTempoiqResponse = transformTempoiqResponse;

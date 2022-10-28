"use strict";

var _                 = require("lodash");
var async             = require("async");
var moment            = require("moment");
var weatherSrvc       = require("weather-service");
var utils             = require("../../../libs/utils");
var consts            = require("../../../libs/consts");
var forecastConverter = require("../../../general/core/forecast/forecast-converter");
var dataProvider      = require("dataprovider-service");
var log               = require("../../../libs/log")(module);
var profiling         = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy);

const YEAR_FORMAT = "MMM YYYY";

// Month factors from #97370016
const MONTH_FACTORS = {
    Jan: 0.0583,
    Feb: 0.0675,
    Mar: 0.0903,
    Apr: 0.0972,
    May: 0.1036,
    Jun: 0.1003,
    Jul: 0.1032,
    Aug: 0.1010,
    Sep: 0.0902,
    Oct: 0.0778,
    Nov: 0.0591,
    Dec: 0.0515
};

// 1450 is the amount of sun-hours per kWp that we can expect.
// This is based on an irradiation map. It varies by location.
// But, 1450 is a safe value across most of the U.S.
const SUN_HOURS = 1450;

var getFormat = function(dateRange) {
    if (dateRange === "total") {
        return "YYYY";
    }
    return YEAR_FORMAT;
};

function getFacilityIdsByDeviceIds(facilitiesList) {
    var result = {};

    _.forOwn(facilitiesList, function(facilityObj, facilityId) {
        _.forOwn(facilityObj.scopes, function(scopeObj, scopeId) {
            _.forOwn(scopeObj.nodes, function(info, deviceId) {
                result[deviceId] = facilityId;
            });
        });
    });

    return result;
}


/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
function calculateDateInterval(drange, inputDate, dateTimeUtils) {
    if (!inputDate) {
        inputDate = moment.utc();
    }

    var dimension;
    var end = inputDate;
    var start, dataStart;

    switch (drange) {
        case "total":
            start = dateTimeUtils.getTotalRange().start;
            dataStart = start.clone();
            dimension = "1month";
            break;
        case "year":
            start = dateTimeUtils.getYearRange("month").start;
            dataStart = dateTimeUtils.getTotalRange().start;
            dimension = "1month";
            break;
        default:
            throw new Error("Incorrect dateRange: "+ drange);
    }

    return {
        dimension: dimension,
        dateRange: drange,
        start: start,
        end: end,
        dataStart: dataStart,
        dataEnd: end.clone()
    };
}

/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
function createCategories(iStart, iEnd, dateRange) {
    var start = iStart.clone();
    var end = iEnd.clone();

    var categories = [];

    while (start <= end) {
        categories.push(start.clone().format(YEAR_FORMAT));
        start.add(1, "month");
    }

    return categories;
}


function _groupResultByYear(result) {
    var yearResult = {
        categories: [],
        series: [
            {
                name: "Actual Energy",
                data: []
            },
            {
                name: "Predicted Energy",
                data: []
            }
        ],
        tooltips: [],
        dateRange: "total",
        dimension: "1year"
    };

    var valuesByYear = {};

    _.each(result.categories, function(cat, index) {
        var year = moment.utc(cat, YEAR_FORMAT).get("year");

        valuesByYear[year] = valuesByYear[year] || {
            actualEnergy: 0,
            predictedEnergy: 0,
            cloudydays:0,
            sunnydays: 0
        };

        function wrap(value) {
            return value > 0 ? value : 0;
        }

        var currentYear = valuesByYear[year];
        currentYear.actualEnergy += wrap(result.series[0].data[index]);
        currentYear.predictedEnergy += wrap(result.series[1].data[index]);
        currentYear.cloudydays += wrap(result.tooltips[index].cloudydays);
        currentYear.sunnydays += wrap(result.tooltips[index].sunnydays);
    });

    yearResult.categories = _.keys(valuesByYear);
    log.debug("valuesByYear: " + JSON.stringify(valuesByYear));
    _.each(yearResult.categories, function(category, index) {
        var year = category;
        var prevYear = category - 1;

        var getValueByYear = function(year, field) {
            var yearVal = valuesByYear[year];
            if (!yearVal) {
                return -1;
            }
            return yearVal[field] || -1;
        };

        yearResult.series[0].data.push(valuesByYear[year].actualEnergy);
        yearResult.series[1].data.push(valuesByYear[year].predictedEnergy);
        yearResult.tooltips.push({
            cloudydays: getValueByYear(year, "cloudydays"),
            sunnydays: getValueByYear(year, "sunnydays"),
            prevYearActualEnergy: getValueByYear(prevYear, "actualEnergy"),
            prevYearPredictedEnergy: getValueByYear(prevYear, "predictedEnergy"),
            prevYearCloudyDays: getValueByYear(prevYear, "cloudydays"),
            prevYearSunnyDays: getValueByYear(prevYear, "sunnydays")
        });
    });

    log.debug("yearResult ready");
    return yearResult;
}

// this object encapsulate the logic of prediction
var PredictionObject = function(actualData, facilitiesList) {
    this.actualData = actualData;
    this.facilitiesList = facilitiesList;
};

/**
 * Predict value for month
 * @param key {Stirng} month of YEAR_FORMAT
 * @return predicted value
 */
PredictionObject.prototype.predict = function(key) {
    var result = 0;
    var tm = moment(key, YEAR_FORMAT);
    var month = tm.format("MMM");
    var facilitiesList = this.facilitiesList;
    var actualData = this.actualData;

    _.forEach(_.keys(this.facilitiesList), function(facilityId) {
        
        // getValuesForPreviousMonths
        var year = tm.year();
        var value, prevMonthsValues = [];
        var predictedForFaciltiy;
        
        do {
            year = year - 1;
            var newKey = month + " " + year;
            value = actualData["byFacility"][facilityId][newKey];
            if (!_.isUndefined(value)) {
                prevMonthsValues.push(value);
            }
        } while (!_.isUndefined(value));

        // calculate Predicted Energy for Facility
        if (!_.isEmpty(prevMonthsValues)) {
            // we use AVG(MonthX of previous years) - 10%
            predictedForFaciltiy =  0.9 * _.sum(prevMonthsValues) / prevMonthsValues.length;
        } else {
            // no value for previous months, so we use next formula:
            // Source's Total System Size * SUN_HOURS * MonthX Factor
            var monthKey = moment(key, YEAR_FORMAT).format("MMM");
            var factor = MONTH_FACTORS[monthKey];
            var potentialPowerOfFacility = facilitiesList[facilityId]["potentialPower"] || 0;
            predictedForFaciltiy = potentialPowerOfFacility * factor * SUN_HOURS;
        }
        result += predictedForFaciltiy;

        // log.info("@@@@@ predict "+ key + " " + facilityId + " : " + predictedForFaciltiy);
    });

    return result;
};

function loadTempoIQData(interval, selection, dateTimeUtils, callback) {
    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] // kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"]
        }]
    };

    profiling.start("Tempoiq");

    var intervals = dataProvider.splitInterval(
        interval.dataStart,
        interval.dataEnd,
        "month"
    );

    async.map(intervals, function(interval, next) {
        log.debug("interval: " + JSON.stringify(interval));

        var tempoiqOptions = {
            selection: selection,
            pipeline: pipeline
        };
        dataProvider.loadData(interval, dateTimeUtils, tempoiqOptions, next);
    }, function (err, results) {
        profiling.endTime("Tempoiq");
        if (err) {
            return callback(err);
        }
        var finalResult = dataProvider.getCombinedParallelData(results);
        callback(err, finalResult);
    });
}


/**
 * Function calculates data from tempoiq. * @param {string} dateRange
 * @returns {void}
 */
function transformTempoiqResponse(data, dateRange, facilitiesList) {
    if (!data.dataPoints) {
        log.warn("transformTempoiqResponse: wrong object structure");
        return {};
    }

    var facilityIdsByDeviceIds = getFacilityIdsByDeviceIds(facilitiesList);
    var actual = { "byFacility": {} };

    _.forEach(data.dataPoints, function(datapoint) {

        var key = moment(datapoint.ts).format(YEAR_FORMAT);
        actual[key] = actual[key] || 0 ;

        _.forOwn(datapoint.values, function(metrics, deviceId) {

            var facilityId = facilityIdsByDeviceIds[deviceId];
            actual["byFacility"][facilityId] = actual["byFacility"][facilityId] || {};
            actual["byFacility"][facilityId][key] = actual["byFacility"][facilityId][key] || 0;

            _.forOwn(metrics, function(value, metricName) {

                // need to divide by 1000 because client need kWh
                actual[key] += (value / 1000);
                actual["byFacility"][facilityId][key] += (value / 1000);
            });
        });
    });

    data = null;
    return actual;
}


/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {string} dateRange
 * @returns {void}
 */
function transformWeatherResponse(data, dateRange) {
    log.silly("transformWeatherResponse");
    var transformed = {};

    if (dateRange !== "total" && dateRange !== "year" && dateRange !== "month") {
        log.warn("transformWeatherResponse: wrong date range input");
        return {};
    }

    _.forEach(data, function(item) {
        var key = moment(item.time, "X").format(YEAR_FORMAT);
        transformed[key] = transformed[key] || { "cloudydays": 0, "sunnydays": 0 };

        if (item.icon === "clear-day" || item.icon === "partly-cloudy-day") {
            transformed[key].sunnydays += 1;
        } else {
            transformed[key].cloudydays += 1;
        }
    });

    data = null;
    log.debug("transformed weather: " + JSON.stringify(transformed));

    return transformed;
}


/**
 * Get weather data from weather-service
 */
function loadWeatherData(location, interval, dateTimeUtils, callback) {
    var ctz = dateTimeUtils.getClientOffset();
    var latitude = location.latitude;
    var longitude = location.longitude;
    var start = interval.dataStart.unix();
    var end = interval.dataEnd.unix();
    var includes = "icon";

    log.debug("loadWeatherData");

    weatherSrvc
        .getForRange(latitude, longitude, start, end, ctz, includes)
        .then(function(weatherItems) {
            var result = _.map(weatherItems, function(item) {
                return {
                    time: moment.unix(item.time).format("X"),
                    icon: forecastConverter.replaceNightWithDay(item.icon)
                };
            });
            callback(null, result);
        })
        .catch(callback);
}


/**
 * Load data from tempoiq & weather-service
 *
 * @param clientObject the client object from websocket
 */
function loadData(clientObject, finalCallback) {
    log.debug("actual-predicted-energy");

    var clientAnswer = new utils.ClientWebsocketAnswer(
        clientObject.socket,
        consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy);

    var dataObject = clientObject.actualPredictedEnergy;

    var selection = clientObject.selection;
    if (selection.devices.or.length === 0) {
        return clientAnswer.error(new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION));
    }

    //var nodeList = clientObject.nodeList;
    //var zoneOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    //log.debug("zoneOffset = " + zoneOffset);

    var potentialPower = _.chain(clientObject.facilitiesList)
        .map(function(value, name) {
            return value;
        })
        .pluck("potentialPower")
        .sum()
        .value() || 0;

    log.silly("potentialPower: " + potentialPower);

    var interval = calculateDateInterval(dataObject.dateRange, null, clientObject.dateTimeUtils);
    log.debug("interval = " + JSON.stringify(interval));

    async.waterfall([
        function (next) {
            async.parallel([
                function(callback){
                    loadTempoIQData(interval, selection, clientObject.dateTimeUtils, callback);
                },
                function(callback) {
                    loadWeatherData(clientObject.geo, interval, clientObject.dateTimeUtils, callback);
                }
            ],
            function(err, results) {
                if (err) {
                    clientAnswer.error(err);
                }
                next(err, results);
            });
        }],
        function(err, data) {
            if (err) {
                log.error(err);
                if (finalCallback) {
                    return finalCallback(err);
                }
                return;
            }

            var tempoIQData = data[0];
            var weatherData = data[1];

            var actual = transformTempoiqResponse(tempoIQData, dataObject.dateRange, clientObject.facilitiesList);
            var predictionObject = new PredictionObject(actual, clientObject.facilitiesList);
            var weather = transformWeatherResponse(weatherData, dataObject.dateRange);

            var actualArray = [];
            var predictedArray = [];
            var tooltips = [];
            var dateFormat = YEAR_FORMAT;
            var categories = createCategories(interval.start, interval.end, interval.dateRange);

            _.each(categories, function(category) {
                var prevCategory = moment(category, dateFormat)
                    .subtract(1, "year")
                    .format(dateFormat);

                actualArray.push(actual[category] || 0);
                predictedArray.push(predictionObject.predict(category) || 0);
                tooltips.push({
                    cloudydays: (weather[category] || {}).cloudydays || -1,
                    sunnydays: (weather[category] || {}).sunnydays || -1,
                    prevYearCloudyDays: (weather[prevCategory] || {}).cloudydays || -1,
                    prevYearSunnyDays: (weather[prevCategory] || {}).sunnydays || -1,
                    prevYearActualEnergy: actual[prevCategory] || -1,
                    prevYearPredictedEnergy: predictionObject.predict(prevCategory) || -1
                });
            });

            var result = {
                categories: categories,
                series: [
                    {
                        name: "Actual Energy",
                        data: actualArray
                    },
                    {
                        name: "Predicted Energy",
                        data: predictedArray
                    }
                ],
                tooltips: tooltips,
                dateRange: interval.dateRange,
                dimension: interval.dimension
            };

            // Special logic for the case when period is total and total months exceeds 24
            if (result.dateRange === "total" && result.categories.length > 24) {
                result = _groupResultByYear(result);
            }

            result.categories = _.map(result.categories, function(cat) {
                var format = getFormat(interval.dateRange);
                log.debug("format = " + format + ", cat = " + cat);
                return clientObject.dateTimeUtils.formatDate(moment.utc(cat, format));
            });


            clientAnswer.send(result);

            if (finalCallback) {
                finalCallback(err);
            }
        });
}

exports.loadData = loadData;
exports.transformTempoiqResponse = transformTempoiqResponse;
exports.transformWeatherResponse = transformWeatherResponse;
exports.PredictionObject = PredictionObject;

exports.SUN_HOURS = SUN_HOURS;
exports.createCategories = createCategories;
exports.getFormat = getFormat;
exports.calculateDateInterval = calculateDateInterval;

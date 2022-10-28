"use strict";

var _            = require("lodash");
var async        = require("async");
var moment       = require("moment");
var log          = require("../../../libs/log")(module);
var dataProvider = require("dataprovider-service");
var consts       = require("../../../libs/consts");
var calcUtils    = require("./calculator-utils");

const REALTIME = "realtime";
const HISTORY = "history";

/**
 * calculate start and end intervals from dateRange
 * @param dateRange {String}
 * @return {Object}
 */
function calculateInterval(dateRange, end, dateTimeUtils) {
    if (!end) {
        end = moment.utc();
    }
    var historyEnd, mode, dimension, tailLimit, range;

    switch (dateRange) {
        // for debug
        case "5-minutes":
            range = dateTimeUtils.getNMinutesRange(5, "minute", "minute");
            dimension = "1min";
            mode = REALTIME;
            tailLimit = 5;
            break;
        case "3-hours":
            range = dateTimeUtils.getNHoursRange(3, "minute", "minute");
            dimension = "1min";
            tailLimit = 3 * 60;
            mode = REALTIME;
            break;
        case "24-hours":
            range = dateTimeUtils.getNHoursRange(23, "hour");//current hour and prev 23 hours
            dimension = "1hour";
            mode = HISTORY;
            tailLimit = 24;
            break;
        case "week":
            range = dateTimeUtils.getWeekRange("hour");
            historyEnd = end.clone().startOf("day");
            dimension = "1hour";
            mode = HISTORY;
            tailLimit = 7 * 24;
            break;
        case "month":
            range = dateTimeUtils.getNDaysRange(29, "day");//current day and prev 29 days = 30 days
            historyEnd = end.clone().startOf("day");
            dimension = "1day";
            mode = HISTORY;
            tailLimit = 31;
            break;
        case "year":
            range = dateTimeUtils.getYearRange("month");
            historyEnd = end.clone().startOf("day");
            dimension = "1month";
            mode = HISTORY;
            tailLimit = 12;
            break;
        default:
            return undefined;
    }

    return {
        start: range.start,
        end: range.end,
        historyEnd: historyEnd,
        mode: mode,
        dimension: dimension,
        dateRange: dateRange,
        tailLimit: tailLimit
    };
}

function createCategories(interval, dateTimeUtils) {
    var step = interval.dimension.substr(1);
    step = (step === "min") ? "minute" : step;
    var stepOffset = interval.stepOffset? interval.stepOffset: 1;

    var start = interval.start.clone();
    var end = interval.end.clone().startOf("minute");
    log.silly("precreate categories: start = " + start.format() + ", end = " +
              end.format() +", step = " + step);
    var result = [];
    while (start < end) {
        result.push(dateTimeUtils.formatDate(start.clone()));
        start.add(stepOffset, step);
    }
    return result;
}

/**
 * just wrapper for tempoiq select params
 *
 */
var loadTempoiqData = function(query, dateTimeUtils, cb) {
    var tempoiqOptions = {
        selection: query.selection,
        pipeline: query.pipeline
    };

    // special case for year, tempoiq returns 504
    if ((query.end - query.start) >= moment.duration(3, "months")) {
        return dataProvider.loadDataParallelByTime(
            query,
            dateTimeUtils,
            tempoiqOptions,
            "month",
            cb);
    }

    dataProvider.loadDataParallel(query, dateTimeUtils, tempoiqOptions, cb);
};

function loadLastMinuteData(clientObject, cb) {
    var range = clientObject.dateTimeUtils.getMinuteRange();

    var tempoiqQuery = {
        start: range.start,
        end: range.end,
        selection: clientObject.electricDemandSelection,
        pipeline: {
            "functions":[{
                "name": "rollup",
                "arguments": ["mean", "1min"]
            }]
        }
    };

    dataProvider.loadLastValues(clientObject.dateTimeUtils, tempoiqQuery, cb);
}

function convertTempoIQArrayToObject(tempoiqdata) {
    var obj = {};
    for (var i = 0; i < tempoiqdata.dataPoints.length; i++) {
        var key = tempoiqdata.dataPoints[i].ts;
        obj[key] = tempoiqdata.dataPoints[i];
    }
    return obj;
}

function processHistoricalTempoIQResponse(tempoIQData, categories, nodeList, storage, sourcesData) {
    var len = categories.length;
    var prevPeriodkW = 0;
    var totalkw = 0;
    var k = 0;
    var seriesId = null;
    if(!sourcesData) {
        sourcesData = {};
    }

    var getValueAndTrend = function(series, destObject, sourcesData) {
        var last = _.last(series.data) || 0;
        var trend = sourcesData? sourcesData.trend : null;

        destObject.trend = trend;
        destObject.last = last;
        destObject.sum += last;
        if (destObject.min === 0 || destObject.min > last) {
            destObject.min = last;
        }
        if (destObject.max === 0 || destObject.max < last) {
            destObject.max = last;
        }
    };

    var getEmptySourceDemand = function(series, sourcesData) {
        return {
            last: 0,
            min: 0,
            max: 0,
            sum: 0,
            name: series.name,
            trend: sourcesData? sourcesData.trend : null
        };
    };

    for (var i = 0 ; i < len; i++) {
        var tempoiqItem = tempoIQData[categories[i]];
        if (tempoiqItem) {
            var values = tempoiqItem.values;
            var inverters = Object.keys(tempoiqItem.values);

            var periodKw = 0;
            var tableItem = {
                date: categories[i],
                percent: 0,
                sources: {},
                totalPerPeriod: 0
            };
            var iterationSegmentsValues = {};//stores facilities (scopes) values for current iteration

            for (var j = 0; j < inverters.length; j++) {
                var thisInv = inverters[j];
                var facility = nodeList[thisInv].facilityId;//find facility by inverter

                //if one facility selected, use scopes as labels
                var segmentId = facility;
                var segmentName = nodeList[thisInv].facilityName;

                var metric = Object.keys(values[thisInv])[0];

                var ed = Math.abs(values[thisInv][metric] / 1000);

                if (!tableItem.sources[segmentId]) {
                    tableItem.sources[segmentId] = {
                        name: segmentName,
                        value: 0
                    };
                }

                tableItem.sources[segmentId].value += ed;
                tableItem.totalPerPeriod += ed;

                if (!iterationSegmentsValues[segmentId]) {
                    iterationSegmentsValues[segmentId] = 0;
                }
                iterationSegmentsValues[segmentId] += ed;

                totalkw += ed;

                periodKw += ed;
            }

            storage.mainChart.categories.push(categories[i]);
            storage.mainChart.series[0].data.push(periodKw);

            //add data to sources series (facility, scope)
            for (k = 1; k < storage.mainChart.series.length; k++) {
                seriesId = storage.mainChart.series[k].sourceId;

                if (iterationSegmentsValues[seriesId]) {
                    //we have data for that series
                    storage.mainChart.series[k].data.push(iterationSegmentsValues[seriesId]);
                } else {
                    //value not exists, use zero
                    storage.mainChart.series[k].data.push(0);
                }

                if(!storage.demandBySources[seriesId]) {
                    storage.demandBySources[seriesId] = getEmptySourceDemand(storage.mainChart.series[k],
                        sourcesData[seriesId]);
                }
                getValueAndTrend(storage.mainChart.series[k], storage.demandBySources[seriesId], sourcesData[seriesId]);
            }

            storage.table.push(tableItem);
            prevPeriodkW = periodKw;
        } else {
            storage.mainChart.categories.push(categories[i]);

            //add zero to sources series (facility, scope)
            for (k = 0; k < storage.mainChart.series.length; k++) {
                seriesId = storage.mainChart.series[k].sourceId;
                storage.mainChart.series[k].data.push(0);

                if (k > 0) {
                    if(!storage.demandBySources[seriesId]) {
                        storage.demandBySources[seriesId] = getEmptySourceDemand(storage.mainChart.series[k],
                            sourcesData[seriesId]);
                    }
                    getValueAndTrend(storage.mainChart.series[k], storage.demandBySources[seriesId],
                        sourcesData[seriesId]);
                }
            }
        }
    }

    for (i = 0; i < storage.table.length; i++) {
        storage.table[i].percent = (Math.abs(storage.table[i].totalPerPeriod) / Math.abs(totalkw)) * 100;
    }

    _.each(storage.demandBySources, function(source) {
        storage.totalDemand.last += source.last;
        storage.totalDemand.sum += source.sum;
        storage.totalDemand.min += source.min;
        storage.totalDemand.max += source.max;
    });
}

function calculateHistory(element, clientObject, callback) {
    var electricDemandSelection = element.electricDemandSelection;
    var interval = element.interval;
    var nodeList = element.nodeList;

    var tempoiqQuery = {
        pipeline: null,
        start: interval.start,
        end: interval.end,
        selection: electricDemandSelection
    };

    if (element.interval.mode === HISTORY) {
        tempoiqQuery.pipeline = {"functions":[{
            "name": "rollup",
            "arguments": ["max", interval.dimension]
        }]};
    } else {
        tempoiqQuery.pipeline = {
            "functions":[{
                "name": "rollup",
                "arguments": ["mean", "1min"]
            }]
        };
    }

    log.debug("query: " + JSON.stringify(tempoiqQuery));

    async.waterfall([
        function(next) {
            loadTempoiqData(tempoiqQuery, clientObject.dateTimeUtils, next);
        },
        function(tempoiqdata, next) {
            loadLastMinuteData(clientObject, function(err, lastMinuteTempoiqdata) {
                if (err) {
                    return next(err);
                }
                var lastTempoiqPoint = _.last(tempoiqdata.dataPoints);
                var lastMinutePoint = _.last(lastMinuteTempoiqdata.dataPoints);
                if (lastTempoiqPoint && lastMinutePoint) {
                    lastTempoiqPoint.values = lastMinutePoint.values;
                }
                next(null, tempoiqdata);
            });
        }
    ], function(finalErr, data) {
        if (finalErr) {
            return callback(finalErr);
        }
        var storage = {
            demandBySources: {},
            totalDemand: {
                last: 0,
                min: 0,
                max: 0,
                sum: 0,
                name: "Total",
                trend: consts.TREND.UP
            },
            mainChart: {
                categories: [],
                series: [{
                    name: "Total",
                    data: []
                }]
            },
            table: [],
            dateRange: interval.dateRange,
            realtime: false
        };

        calcUtils.addHighchartsSeriesPerSource(nodeList, false, storage.mainChart);
        var convertedTempoiqData = convertTempoIQArrayToObject(data);
        var categories = createCategories(interval, clientObject.dateTimeUtils);

        var sourcesData = clientObject.sources.savedResult;
        processHistoricalTempoIQResponse(convertedTempoiqData, categories, nodeList, storage, sourcesData);
        convertedTempoiqData = null;
        categories = null;
        data = null;

        callback(null, storage);
    });
}

function initElement(clientObject, elementData) {
    var dateRange = elementData.dateRange;
    var clientAnswer = elementData.clientAnswer;

    if (elementData.savedResult) {
        elementData.savedResult = null;
    }

    log.silly("loadData, dateRange: " + dateRange);

    if (!clientAnswer) {
        log.error("Logic error: empty clientAnswer");
        process.exit(1);
    }

    if (_.isEmpty(dateRange)) {
        return clientAnswer.error("Wrong date range");
    }

    if (!clientObject.dateTimeUtils) {
        return clientAnswer.error("Client timezone not initialized");
    }

    var interval = calculateInterval(dateRange, null, clientObject.dateTimeUtils);
    if (!interval) {
        return clientAnswer.error("Wrong date range");
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var billingInterval = _.chain(clientObject.facilitiesList).
        filter("selected").
        filter("billingInterval").
        pluck("billingInterval").
        first().
        value();

    var facilitiesList = _(nodeList)
        .map(function(value, key) {
            return {
                name: value.facilityName,
                id: value.facilityId
            };
       })
       .uniq(function(item) {
           return item.id;
       })
       .value();

    log.silly("facilitiesList: " + JSON.stringify(facilitiesList));

    // default value
    billingInterval = _.isEmpty(billingInterval) ? 30 : billingInterval;
    var period = "" + billingInterval + "min";

    log.silly("billingInterval: " + billingInterval + ", period: " + period);
    log.silly("calculateInterval: " + JSON.stringify(interval));

    return {
        ans: clientAnswer,
        interval: interval,
        selection: selection,
        electricDemandSelection: clientObject.electricDemandSelection,
        dateRange: dateRange,
        nodeList: nodeList,
        dateTimeUtils: clientObject.dateTimeUtils,
        facilitiesList: facilitiesList,
        billingInterval: billingInterval,
        period: period
    };
}

var loadData = function(clientObject, electricDemandData, isPreloading, finalCallback) {
    var thisDateRange = electricDemandData.dateRange;
    var thisSelection = clientObject.selection;
    var element = initElement(clientObject, electricDemandData);
    if (!element) {
        return;
    }

    calculateHistory(element, clientObject, function(err, data) {
        if (err) {
            return element.ans.error(err);
        }

        if (!isPreloading && calcUtils.isSameElementSettings(
                thisDateRange,
                electricDemandData.dateRange,
                thisSelection,
                clientObject.selection)
        ) {
            electricDemandData.savedResult = data;
            electricDemandData.isHistoricalDataLoaded = true;
            element.ans.send(data);
        }

        if (finalCallback) {
            finalCallback();
        }
    });
};

var processKinesisResponse = function(recordsArray, electricDemandData, clientObject) {
    if (!electricDemandData.isHistoricalDataLoaded) {
        return;
    }

    var interval = calculateInterval(electricDemandData.dateRange, null, clientObject.dateTimeUtils);
    var includeMainChart = interval.mode !== HISTORY;


    electricDemandData.savedResult.totalDemand.last = 0;
    electricDemandData.savedResult.totalDemand.min = 0;
    electricDemandData.savedResult.totalDemand.max = 0;
    electricDemandData.savedResult.totalDemand.sum = 0;
    _.each(electricDemandData.savedResult.demandBySources, function(source, sourceId) {
        electricDemandData.savedResult.demandBySources[sourceId].last = 0;

        if(clientObject.sources.savedResult[sourceId] && clientObject.sources.savedResult[sourceId].trend) {
            var thisTrend = clientObject.sources.savedResult[sourceId].trend;
            electricDemandData.savedResult.demandBySources[sourceId].trend = thisTrend;
        }
    });

    var nodeList = clientObject.nodeList;
    var response = {
        mainChart: {
            categories: [],
            series: []
        },
        table: [],
        dateRange: electricDemandData.savedResult.dateRange,
        realtime: true
    };

    if(includeMainChart) {
        //if it is historical mode, we need update only total demand and demand by sources.
        //main chart should not be updated. It will be empty object.
        response.mainChart.categories.push(recordsArray[0].ts);
        response.table.push({
            date: recordsArray[0].ts,
            percent: 0,
            sources: {},
            totalPerPeriod: 0
        });
    }

    var mainChartMap = {};

    _.each(electricDemandData.savedResult.mainChart.series, function(series) {
        var key = series.sourceId? series.sourceId: "total";
        mainChartMap[key] = {
            name: series.name,
            sourceId: series.sourceId,
            data: []
        };
    });

    var total = 0;
    _.each(recordsArray, function (record) {
        var device = record.device.trim();

        var facilityId = nodeList[device].facilityId; // find facility by inverter
        var facility = nodeList[device].facilityName; // find facility by inverter
        var electricDemandMetricId = nodeList[device].electricDemandMetricId;
        var thisVal = record.values[electricDemandMetricId] / 1000 || 0;
        total += thisVal;

        var segmentId = facilityId;
        var segmentName = facility;

        if (includeMainChart) {
            if (!response.table[0].sources[segmentId]) {
                response.table[0].sources[segmentId] = {
                    name: segmentName,
                    value: 0
                };
            }
            response.table[0].totalPerPeriod += thisVal;
            response.table[0].sources[segmentId].value += thisVal;
        }

        if (mainChartMap[segmentId].data.length === 0) {
            //add new value
            mainChartMap[segmentId].data.push(thisVal);
        } else {
            //increase existing value
            mainChartMap[segmentId].data[0] += thisVal;
        }

        electricDemandData.savedResult.demandBySources[segmentId].sum += thisVal;
        electricDemandData.savedResult.demandBySources[segmentId].last += thisVal;
    });

    mainChartMap["total"].data.push(total);

    electricDemandData.savedResult.totalDemand.trend = clientObject.realTimePower.savedResult.currentPower.trend;

    _.each(electricDemandData.savedResult.demandBySources, function(source, sourceId) {
        electricDemandData.savedResult.totalDemand.last += source.last;
        electricDemandData.savedResult.totalDemand.sum += source.sum;

        //set min/max for each source
        electricDemandData.savedResult.demandBySources[sourceId].min =
            _.min([mainChartMap[sourceId].data[0], electricDemandData.savedResult.demandBySources[sourceId].min]);
        electricDemandData.savedResult.demandBySources[sourceId].max =
            _.max([mainChartMap[sourceId].data[0], electricDemandData.savedResult.demandBySources[sourceId].max]);

        //set min/max for total
        electricDemandData.savedResult.totalDemand.min += electricDemandData.savedResult.demandBySources[sourceId].min;
        electricDemandData.savedResult.totalDemand.max += electricDemandData.savedResult.demandBySources[sourceId].max;
    });

    if(includeMainChart) {
        response.table[0].percent =
            (response.table[0].totalPerPeriod / Math.abs(electricDemandData.savedResult.totalDemand.sum)) * 100;

        _.each(mainChartMap, function(seriesData) {
            if(seriesData.data.length === 0) {
                seriesData.data.push(0);
            }
            if(includeMainChart) {
                response.mainChart.series.push(seriesData);
            }
        });

        electricDemandData.savedResult.mainChart = response.mainChart;
    }


    response.totalDemand = electricDemandData.savedResult.totalDemand;
    response.demandBySources = electricDemandData.savedResult.demandBySources;

    electricDemandData.clientAnswer.send(response);
};

module.exports = {
    _calculateInterval: calculateInterval,
    loadData: loadData,
    processKinesisResponse: processKinesisResponse,
    createCategories: createCategories,
    initElement: initElement,
    calculateHistory: calculateHistory,
    convertTempoIQArrayToObject: convertTempoIQArrayToObject,
    _processHistoricalTempoIQResponse: processHistoricalTempoIQResponse,
    MODES: {
        HISTORY: HISTORY,
        REALTIME: REALTIME
    }
};

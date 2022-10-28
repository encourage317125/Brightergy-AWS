"use strict";

var _              = require("lodash");
var async          = require("async");
var utils          = require("../../../libs/utils");
var consts         = require("../../../libs/consts");
var dataProvider   = require("dataprovider-service");
var calcUtils      = require("./calculator-utils");
var electricDemand = require("./electric-demand");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {void}
 */
function processHistoricalTempoIQResponse(tempoIQData, categories, nodeList, storage, sourcesData) {
    var len = categories.length;
    var prevPeriodkW = 0;
    var totalkw = 0;
    var k = 0;
    var seriesId = null;
    var firstFacilityKey = Object.keys(sourcesData)[0];

    var getValueAndTrend = function(series, sourcesData) {
        var last = _.last(series.data) || 0;
        return {
            value: last,
            name: series.name,
            trend: sourcesData.trend
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

                var kw = Math.abs(values[thisInv][metric] / 1000);

                if (!tableItem.sources[segmentId]) {
                    tableItem.sources[segmentId] = {
                        name: segmentName,
                        value: 0
                    };
                }

                tableItem.sources[segmentId].value += kw;
                tableItem.totalPerPeriod += kw;

                if (!iterationSegmentsValues[segmentId]) {
                    iterationSegmentsValues[segmentId] = 0;
                }
                iterationSegmentsValues[segmentId] += kw;

                totalkw += kw;

                periodKw += kw;
            }

            storage.mainChart.categories.push(categories[i]);
            storage.mainChart.series[0].data.push(periodKw);

            storage.currentPower = getValueAndTrend(storage.mainChart.series[0], sourcesData[firstFacilityKey]);

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

                storage.currentPowerBySources[seriesId] = getValueAndTrend(storage.mainChart.series[k],
                    sourcesData[seriesId]);
            }

            storage.table.push(tableItem);
            prevPeriodkW = periodKw;
        } else {
            storage.mainChart.categories.push(categories[i]);

            //add zero to sources series (facility, scope)
            for (k = 0; k < storage.mainChart.series.length; k++) {
                seriesId = storage.mainChart.series[k].sourceId;
                storage.mainChart.series[k].data.push(0);

                if(k > 0) {
                    storage.currentPowerBySources[seriesId] = getValueAndTrend(storage.mainChart.series[k],
                        sourcesData[seriesId]);
                }
                storage.currentPower = getValueAndTrend(storage.mainChart.series[0], sourcesData[firstFacilityKey]);
            }
        }
    }

    for (i = 0; i < storage.table.length; i++) {
        storage.table[i].percent = (Math.abs(storage.table[i].totalPerPeriod) / Math.abs(totalkw)) * 100;
    }
}

function loadHistoricalData(clientObject, dateRange, isPreloading, clintAnswerObj, finalCallback) {
    var socket = clientObject.socket;

    var dimension = null,
        range = null;

    //var tempoiqParams = {};
    var tempoiqOptions = {
        query: {},
        nocache: false
    };

    var cacheTempoiqData = true;
    var interval = {};

    switch (dateRange) {
        case "10-mins":
            range = clientObject.dateTimeUtils.getNMinutesRange(10, "minute", "minute");
            dimension = "1min";
            cacheTempoiqData = false;
            interval.dimension = "1min";
            tempoiqOptions.nocache = true;
            break;
        case "3-hours":
            range = clientObject.dateTimeUtils.getNHoursRange(3, "minute", "minute");
            dimension = "1min";
            cacheTempoiqData = false;
            interval.dimension = "1min";
            tempoiqOptions.nocache = true;
            break;
        case "24-hours":
            range = clientObject.dateTimeUtils.getNHoursRange(23, "hour");//current hour and prev 23 hours
            dimension = "1hour";
            interval.dimension = "1hour";
            break;
        case "week":
            range = clientObject.dateTimeUtils.getWeekRange("hour");
            dimension = "1hour";
            interval.dimension = "1hour";
            break;
        case "month":
            range = clientObject.dateTimeUtils.getNDaysRange(29, "day");//current day and prev 29 days = 30 days
            dimension = "1day";
            interval.dimension = "1day";
            break;
        case "year":
            range = clientObject.dateTimeUtils.getYearRange("hour");
            dimension = "1day";
            tempoiqOptions.query.limit = 100;
            interval.dimension = "1day";
            break;
        default :
            range = clientObject.dateTimeUtils.getNHoursRange(3, "minute", "minute");
            dimension = "1min";
            cacheTempoiqData = false;
            interval.dimension = "1min";
            break;
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    interval.start = range.start;
    interval.end = range.end;
    interval.tempoiqOptions = tempoiqOptions;

    var categories = electricDemand.createCategories(interval, clientObject.dateTimeUtils);

    var isOneFacility = false;

    var pipeline = dimension ? {
        "functions": [{
            "name": "rollup",
            "arguments": ["max", dimension]
        }]
    } : null;

    tempoiqOptions.selection = selection;
    tempoiqOptions.pipeline = pipeline;

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.EMS.RealTimePower, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function (cb) {
            if (tempoiqOptions.query.limit) {
                dataProvider.loadDataParallel(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
            } else {
                dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
            }
        },
        function (tempoiqData, cb) {
            var storage = {
                currentPower: {
                    value: 0,
                    trend: consts.TREND.UP
                },
                currentPowerBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                },
                table: [],
                dateRange: dateRange,
                realtime: false
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            var addedSeries = [];
            for (var nodeId in nodeList) {
                if (nodeList[nodeId]) {

                    var name = isOneFacility ? nodeList[nodeId].scopeName : nodeList[nodeId].facilityName;
                    var sourceId = isOneFacility ? nodeList[nodeId].scopeId : nodeList[nodeId].facilityId;

                    if (addedSeries.indexOf(sourceId) < 0) {
                        //name not added
                        addedSeries.push(sourceId);

                        storage.currentPowerBySources[sourceId] = {
                            name: name,
                            value: 0
                        };
                    }
                }
            }

            var convertedTempoiqData = electricDemand.convertTempoIQArrayToObject(tempoiqData);

            var sourcesData = clientObject.sources.savedResult;
            processHistoricalTempoIQResponse(convertedTempoiqData, categories, nodeList, storage, sourcesData);
            tempoiqData = null;
            convertedTempoiqData = null;
            categories = null;
            interval = null;
            cb(null, storage);
        }
    ], function (finalErr, storage) {
        if (finalErr) {
            clintAnswerObj.error(finalErr);
        } else if (!isPreloading && calcUtils.isSameElementSettings(
                dateRange,
                clientObject.realTimePower.dateRange,
                selection,
                clientObject.selection)
        ) {
            clientObject.realTimePower.savedResult = storage;
            clientObject.realTimePower.dateRange = storage.dateRange;
            clientObject.realTimePower.isHistoricalDataLoaded = true;
            clintAnswerObj.send(storage);
        }

        if (finalCallback) {
            finalCallback(finalErr);
        }
    });
}

function processKinesisResponse(recordsArray, clientObject, clientAnswerObj) {
    if (!clientObject.realTimePower.isHistoricalDataLoaded) {
        return;
    }
    var historicalDateRanges = ["week", "month", "year"];
    if (historicalDateRanges.indexOf(clientObject.realTimePower.dateRange) > -1) {
        return;
    }

    recordsArray = calcUtils.getLastDevicesDataPoint(recordsArray);
    var totalSeriesLen = clientObject.realTimePower.savedResult.mainChart.series[0].data.length;
    var prevotalVal = clientObject.realTimePower.savedResult.mainChart.series[0].data[totalSeriesLen -1];

    _.each(clientObject.realTimePower.savedResult.currentPowerBySources, function(source, sourceId) {
        clientObject.realTimePower.savedResult.currentPowerBySources[sourceId].value = 0;

        if(clientObject.sources.savedResult[sourceId] && clientObject.sources.savedResult[sourceId].trend) {
            var thisTrend = clientObject.sources.savedResult[sourceId].trend;
            clientObject.realTimePower.savedResult.currentPowerBySources[sourceId].trend = thisTrend;
        }
    });

    var nodeList = clientObject.nodeList;
    var response = {
        mainChart: {
            categories: [recordsArray[0].ts],
            series: []
        },
        dateRange: clientObject.realTimePower.dateRange,
        realtime: true
    };

    var mainChartMap = {};

    _.each(clientObject.realTimePower.savedResult.mainChart.series, function(series) {
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
        var powerMetricId = nodeList[device].powerMetricId;
        var thisVal = record.values[powerMetricId] / 1000 || 0;
        total += thisVal;

        var segmentId = facilityId;

        if(mainChartMap[segmentId].data.length === 0) {
            //add new value
            mainChartMap[segmentId].data.push(thisVal);
        } else {
            //increase existing value
            mainChartMap[segmentId].data[0] += thisVal;
        }

        clientObject.realTimePower.savedResult.currentPowerBySources[segmentId].value += thisVal;
    });

    mainChartMap["total"].data.push(total);

    clientObject.realTimePower.savedResult.currentPower.trend = prevotalVal < total? consts.TREND.UP: consts.TREND.DOWN;

    clientObject.realTimePower.savedResult.currentPower.value =
        _.reduce(clientObject.realTimePower.savedResult.currentPowerBySources, function(result, curSourcePower, key) {
            return result + curSourcePower.value;
        }, 0);

    _.each(mainChartMap, function(seriesData) {
        if(seriesData.data.length === 0) {
            seriesData.data.push(0);
        }
        response.mainChart.series.push(seriesData);
    });

    clientObject.realTimePower.savedResult.mainChart = response.mainChart;
    response.currentPower = clientObject.realTimePower.savedResult.currentPower;
    response.currentPowerBySources = clientObject.realTimePower.savedResult.currentPowerBySources;

    clientAnswerObj.send(response);
}

exports.loadHistoricalData = loadHistoricalData;
exports.processHistoricalTempoIQResponse = processHistoricalTempoIQResponse;
exports.processKinesisResponse = processKinesisResponse;

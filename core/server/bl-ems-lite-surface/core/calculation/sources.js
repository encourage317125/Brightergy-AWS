"use strict";

var _            = require("lodash");
var moment       = require("moment");
var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var calcUtils    = require("./calculator-utils");

const LAST_REPORTED_VALUE = "lastReportedValue";
const MAX_VALUE_CURRENT_DAY = "maxValueCurrentDay";
const MIN_VALUE_CURRENT_DAY = "minValueCurrentDay";
const MAX_VALUE_HISTORICAL = "maxValueHistorical";

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {string} timeKey
 * @param {string} valueKey
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, timeKey, valueKey) {

    var totalkwh = 0;
    var todayMidnight = calcUtils.setDateToMidnight(moment.utc());

    var getTrend = function (series) {
        var twoLast = _.takeRight(series.data, 2);
        var first = twoLast[0] || 0;
        var last = _.last(series.data) || 0;
        var trend = first < last ? consts.TREND.UP : consts.TREND.DOWN;
        return trend;
    };

    var seriesMap = {};

    for (var i = 0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by inverter
            var scope = nodeList[thisInv].scopeId;
            var node = nodeList[thisInv].id;
            var metric = Object.keys(values[thisInv])[0];

            var kw = Math.abs((values[thisInv][metric] / 1000));

            var nodeVal = storage[facility].scopes[scope].nodes[node][valueKey];

            //add values to result object
            if (timeKey) {
                storage[facility][timeKey] = ts;
                storage[facility].scopes[scope][timeKey] = ts;
                storage[facility].scopes[scope].nodes[node][timeKey] = ts;
            }

            if (valueKey === LAST_REPORTED_VALUE) {
                if (moment.utc(ts).isAfter(todayMidnight)) {
                    //we should calculate percentage and currentValue if last value in current day
                    storage[facility].lastReportedValue += kw;
                    storage[facility].scopes[scope].lastReportedValue += kw;
                    storage[facility].scopes[scope].nodes[node].lastReportedValue = kw;
                    totalkwh += kw;
                } else {
                    storage[facility].lastReportedValue = 0;
                    storage[facility].scopes[scope].lastReportedValue = 0;
                    storage[facility].scopes[scope].nodes[node].lastReportedValue = 0;
                }
            } else if (valueKey === MAX_VALUE_CURRENT_DAY || valueKey === MAX_VALUE_HISTORICAL) {

                if (nodeVal === 0 || nodeVal < kw) {
                    storage[facility].scopes[scope].nodes[node][valueKey] = kw;
                }
            } else if (valueKey === MIN_VALUE_CURRENT_DAY) {
                if (nodeVal === 0 || nodeVal > kw) {
                    storage[facility].scopes[scope].nodes[node][valueKey] = kw;
                }
            }

            if (valueKey === MAX_VALUE_CURRENT_DAY) {

                if (!seriesMap[facility]) {
                    seriesMap[facility] = {
                        data: []
                    };
                }
                seriesMap[facility].data.push(kw);

                var trend = getTrend(seriesMap[facility]);
                storage[facility].trend = trend;
                storage[facility].scopes[scope].trend = trend;
                storage[facility].scopes[scope].nodes[node].trend = trend;
            }
        }
    }

    return totalkwh;
}

function setParentsFields(facilities, total, trendValues) {

    if (total === 0) {
        total = 1;
    }

    for (var facilityId in facilities) {
        if (facilities[facilityId]) {
            var facilityPercent = Math.round((facilities[facilityId].lastReportedValue / total) * 100);
            facilities[facilityId].percent = facilityPercent;

            var trend = null;
            if(trendValues) {
                trend = facilities[facilityId].lastReportedValue < trendValues[facilityId] ?
                    consts.TREND.DOWN: consts.TREND.UP;
            }

            facilities[facilityId].trend = trend? trend: facilities[facilityId].trend;

            for (var scopeId in facilities[facilityId].scopes) {
                if (facilities[facilityId].scopes[scopeId]) {

                    facilities[facilityId].scopes[scopeId].trend = trend?
                        trend: facilities[facilityId].scopes[scopeId].trend;

                    if (facilities[facilityId].lastReportedValue) {
                        facilities[facilityId].scopes[scopeId].percent =
                            Math.round((facilities[facilityId].scopes[scopeId].lastReportedValue /
                                facilities[facilityId].lastReportedValue) * 100);
                    }

                    if (facilities[facilityId].lastReportedTime <
                        facilities[facilityId].scopes[scopeId].lastReportedTime) {

                        facilities[facilityId].lastReportedTime =
                            facilities[facilityId].scopes[scopeId].lastReportedTime;
                    }

                    for (var nodeId in facilities[facilityId].scopes[scopeId].nodes) {
                        if (facilities[facilityId].scopes[scopeId].nodes[nodeId]) {

                            facilities[facilityId].scopes[scopeId].nodes[nodeId].trend = trend?
                                trend: facilities[facilityId].scopes[scopeId].nodes[nodeId].trend;

                            if (facilities[facilityId].scopes[scopeId].nodes[nodeId].lastReportedValue) {
                                facilities[facilityId].scopes[scopeId].nodes[nodeId].percent = Math.round(
                                    (facilities[facilityId].scopes[scopeId].nodes[nodeId].lastReportedValue /
                                    facilities[facilityId].scopes[scopeId].lastReportedValue) * 100);
                            }

                            facilities[facilityId].scopes[scopeId][MIN_VALUE_CURRENT_DAY] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MIN_VALUE_CURRENT_DAY];

                            facilities[facilityId].scopes[scopeId][MAX_VALUE_CURRENT_DAY] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_CURRENT_DAY];

                            facilities[facilityId].scopes[scopeId][MAX_VALUE_HISTORICAL] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_HISTORICAL];

                            facilities[facilityId][MIN_VALUE_CURRENT_DAY] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MIN_VALUE_CURRENT_DAY];

                            facilities[facilityId][MAX_VALUE_CURRENT_DAY] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_CURRENT_DAY];

                            facilities[facilityId][MAX_VALUE_HISTORICAL] +=
                                facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_HISTORICAL];
                        }
                    }
                }
            }
        }
    }
}

function loadData(clientObject, clientAnswerObj, finalCallback) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var facilities = _.cloneDeep(clientObject.facilitiesList);

    var pipelineMaxHist = {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", "1year"]
        }]
    };

    var pipelineMaxThisDay = {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", "1min"]//use minutely value for setting trend
        }]
    };

    var pipelineMinThisDay = {
        "functions":[{
            "name": "rollup",
            "arguments": ["min", "1month"]
        }]
    };

    var rangeMonth = clientObject.dateTimeUtils.getMonthRange("hour");
    var rangeMin = clientObject.dateTimeUtils.getCurrentDayStartOfMidnightRange();
    var rangeMax = clientObject.dateTimeUtils.getCurrentDayStartOfMidnightRange();

    var tempoiqOptionsHist = {
        selection: selection,
        pipeline: pipelineMaxHist
    };

    var tempoiqOptionsMaxThisDay = {
        selection: selection,
        pipeline: pipelineMaxThisDay
    };

    var tempoiqOptionsMinThisDay = {
        selection: selection,
        pipeline: pipelineMinThisDay
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.EMS.Sources, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function(callback) {
            async.parallel([
                function(cb) {
                    dataProvider.loadData(rangeMonth, clientObject.dateTimeUtils, tempoiqOptionsHist, cb);
                },
                function(cb) {
                    dataProvider.loadData(rangeMin, clientObject.dateTimeUtils, tempoiqOptionsMinThisDay, cb);
                },
                function(cb) {
                    dataProvider.loadData(rangeMax, clientObject.dateTimeUtils, tempoiqOptionsMaxThisDay, cb);
                },
                function(cb) {
                    dataProvider.loadLastValues(clientObject.dateTimeUtils, tempoiqOptionsHist, cb);
                }
            ], function(err, tempoIQResults) {
                callback(err, tempoIQResults[0], tempoIQResults[1], tempoIQResults[2], tempoIQResults[3]);
            });
        },
        function(tempoiqHist, tempoiqMinCurrentDay, tempoiqMaxCurrentDay, tempoiqLastValues, cb) {
            //calculate data based on tempoiq response
            var total = processTempoIQResponse(tempoiqLastValues, nodeList,
                facilities, "lastReportedTime", LAST_REPORTED_VALUE);
            processTempoIQResponse(tempoiqHist, nodeList, facilities, null, MAX_VALUE_HISTORICAL);
            processTempoIQResponse(tempoiqMinCurrentDay, nodeList, facilities, null, MIN_VALUE_CURRENT_DAY);
            processTempoIQResponse(tempoiqMaxCurrentDay, nodeList, facilities, null, MAX_VALUE_CURRENT_DAY);
            setParentsFields(facilities, total, null);
            tempoiqHist = null;
            tempoiqLastValues = null;
            cb(null, facilities);
        }
    ], function(finalErr, storage) {
        if (finalErr) {
            clientAnswerObj.error(finalErr);
        } else {
            clientObject.sources.isHistoricalDataLoaded = true;
            clientObject.sources.savedResult = facilities;
            clientAnswerObj.send(storage);
        }
        if (finalCallback) {
            finalCallback();
        }
    });

}

function processKinesisResponse(recordsArray, clientObject, clientAnswerObj) {
    if (!clientObject.sources.isHistoricalDataLoaded) {
        return;
    }

    var facilities = clientObject.sources.savedResult;
    var nodeList = clientObject.nodeList;

    var previousValues = {};

    //clear lastValues
    _.each(facilities, function(facility, facilityId) {
        previousValues[facilityId] = facilities[facilityId].lastReportedValue;
        facilities[facilityId].lastReportedValue = 0;
        facilities[facilityId].percent = 0;
        facilities[facilityId][MIN_VALUE_CURRENT_DAY] = 0;
        facilities[facilityId][MAX_VALUE_CURRENT_DAY] = 0;
        facilities[facilityId][MAX_VALUE_HISTORICAL] = 0;
        _.each(facilities[facilityId].scopes, function(scope, scopeId) {
            facilities[facilityId].scopes[scopeId].lastReportedValue = 0;
            facilities[facilityId].scopes[scopeId].percent = 0;
            facilities[facilityId].scopes[scopeId][MIN_VALUE_CURRENT_DAY] = 0;
            facilities[facilityId].scopes[scopeId][MAX_VALUE_CURRENT_DAY] = 0;
            facilities[facilityId].scopes[scopeId][MAX_VALUE_HISTORICAL] = 0;
            _.each(facilities[facilityId].scopes[scopeId].nodes, function(node, nodeId) {
                facilities[facilityId].scopes[scopeId].nodes[nodeId].lastReportedValue = 0;
                facilities[facilityId].scopes[scopeId].nodes[nodeId].percent = 0;
            });
        });
    });

    var total =0;

    //build nodes response
    _.each(recordsArray, function(record) {
        var node = nodeList[record.device];
        var nodeId = node.id;
        var facilityId = nodeList[record.device].facilityId;//find facility by inverter
        var scopeId = nodeList[record.device].scopeId;
        var powerMetricId = nodeList[record.device].powerMetricId;
        var thisVal = record.values[powerMetricId] / 1000;
        total += thisVal;

        facilities[facilityId].lastReportedTime = record.ts;
        facilities[facilityId].lastReportedValue += thisVal;

        facilities[facilityId].scopes[scopeId].lastReportedTime = record.ts;
        facilities[facilityId].scopes[scopeId].lastReportedValue += thisVal;

        facilities[facilityId].scopes[scopeId].nodes[nodeId].lastReportedValue = thisVal;
        facilities[facilityId].scopes[scopeId].nodes[nodeId].lastReportedTime = record.ts;

        if (thisVal < facilities[facilityId].scopes[scopeId].nodes[nodeId][MIN_VALUE_CURRENT_DAY]) {
            facilities[facilityId].scopes[scopeId].nodes[nodeId][MIN_VALUE_CURRENT_DAY] = thisVal;
        }

        if (thisVal > facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_CURRENT_DAY]) {
            facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_CURRENT_DAY] = thisVal;
        }

        if (thisVal > facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_HISTORICAL]) {
            facilities[facilityId].scopes[scopeId].nodes[nodeId][MAX_VALUE_HISTORICAL] = thisVal;
        }
    });

    setParentsFields(facilities, total, previousValues);

    clientAnswerObj.send(facilities);
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;
exports.processKinesisResponse = processKinesisResponse;

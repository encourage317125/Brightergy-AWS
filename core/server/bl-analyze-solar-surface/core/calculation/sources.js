"use strict";

var _            = require("lodash");
var moment       = require("moment");
var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var profiling    = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.Sources);
var calcUtils    = require("./calculator-utils");

const LAST_REPORTED_VALUE = "lastReportedValue";
const TOTAL_ENERGY_GENERATED = "totalEnergyGenerated";

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
    var totalkwh =0;
    var todayMidnight = calcUtils.setDateToMidnight(moment.utc());
    var len = tempoIQData.dataPoints.length;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId; // find facility by inverter
            var scope = nodeList[thisInv].scopeId;
            var metric = Object.keys(values[thisInv])[0];

            var destNode = storage[facility].scopes[scope].nodes[thisInv];

            var kwh = (values[thisInv][metric] / 1000);

            //add values to result object
            if (timeKey) {
                storage[facility][timeKey] = ts;
                storage[facility].scopes[scope][timeKey] = ts;
                destNode[timeKey] = ts;
            }

            //destNode[valueKey] = destNode[valueKey] || 0;



            if (valueKey === LAST_REPORTED_VALUE) {
                if (moment.utc(ts).isAfter(todayMidnight)) {
                    //we should calculate percentage and lastReportedValue if last value in current day
                    storage[facility][valueKey] += kwh;
                    storage[facility].scopes[scope][valueKey] += kwh;
                    destNode[valueKey] += kwh;
                    totalkwh += kwh;
                } else {
                    storage[facility][valueKey] = 0;
                    storage[facility].scopes[scope][valueKey] = 0;
                    destNode[valueKey] = 0;
                }
            } else {
                storage[facility][valueKey] += kwh;
                storage[facility].scopes[scope][valueKey] += kwh;
                destNode[valueKey] += kwh;
            }

            if (valueKey === TOTAL_ENERGY_GENERATED && i > 1 && i === (len -1) && !storage[facility].trend) {
                //this is last datapoint and we have previous value
                if(tempoIQData.dataPoints[i-1].values[thisInv]) {
                    var prevValue = tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000;

                    if (kwh > prevValue) {
                        storage[facility].trend = consts.TREND.UP;
                        storage[facility].scopes[scope].trend = consts.TREND.UP;
                        destNode.trend = consts.TREND.UP;
                    } else {
                        storage[facility].trend = consts.TREND.DOWN;
                        storage[facility].scopes[scope].trend = consts.TREND.DOWN;
                        destNode.trend = consts.TREND.DOWN;
                    }
                }
            }
        }
    }

    return totalkwh;
}

/**
 * calculatePercentage
 */
function calculatePercentage(tags, parentValue) {
    if (!parentValue) {
        return;
    }

    var totalPercent = 0;
    _.forOwn(tags, function(obj, id) {
        if (obj.lastReportedValue) {
            obj.percent = Math.round(obj.lastReportedValue / parentValue * 100);
            totalPercent += obj.percent;
        }
    });
}


function loadData(clientObject, totalMonthlyData) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var facilities = _.cloneDeep(clientObject.facilitiesList);

    var pipelinekWh = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"] //by month
        }]
    };

    var rangeTotal = clientObject.dateTimeUtils.getTotalRange();

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipelinekWh
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Sources, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function(finallCback) {
            profiling.start("Tempoiq");
            async.parallel([
                function(cb) {
                    if (totalMonthlyData) {
                        cb(null, totalMonthlyData);
                    } else {
                        dataProvider.loadData(rangeTotal, clientObject.dateTimeUtils, tempoiqOptions, cb);
                    }
                },
                function(cb) {
                    dataProvider.loadLastValues(clientObject.dateTimeUtils, tempoiqOptions, cb);
                }
            ], function(err, tempoIQResults) {
                profiling.endTime("Tempoiq");
                if (err) {
                    finallCback(err);
                } else {
                    finallCback(null, tempoIQResults[0], tempoIQResults[1]);
                }
            });
        },
        function(tempoiqData, tempoiqLastValues, cb) {
            //calculate data based on tempoiq response
            processTempoIQResponse(tempoiqLastValues, nodeList,
                facilities, "lastReportedTime", LAST_REPORTED_VALUE);
            var total = _.sum(_.pluck(facilities, "lastReportedValue")) || 0;
            processTempoIQResponse(tempoiqData, nodeList, facilities, null, TOTAL_ENERGY_GENERATED);

            var totalFacilityPercent = 0;

            for(var facilityName in facilities) {
                if (facilities[facilityName]) {
                    if(facilities[facilityName].lastReportedValue && total) {
                        var facilityPercent = Math.round((facilities[facilityName].lastReportedValue / total) * 100);
                        facilities[facilityName].percent = facilityPercent;
                        totalFacilityPercent += facilityPercent;
                    }

                    calculatePercentage(
                        facilities[facilityName].scopes,
                        facilities[facilityName].lastReportedValue
                    );

                    for(var scopeName in facilities[facilityName].scopes) {
                        if (facilities[facilityName].scopes[scopeName]) {
                            calculatePercentage(
                                facilities[facilityName].scopes[scopeName].nodes,
                                facilities[facilityName].scopes[scopeName].lastReportedValue
                            );

                            if (facilities[facilityName].firstReportedTime >
                                facilities[facilityName].scopes[scopeName].firstReportedTime) {

                                facilities[facilityName].firstReportedTime =
                                    facilities[facilityName].scopes[scopeName].firstReportedTime;
                            }

                            if (facilities[facilityName].lastReportedTime <
                                facilities[facilityName].scopes[scopeName].lastReportedTime) {

                                facilities[facilityName].lastReportedTime =
                                    facilities[facilityName].scopes[scopeName].lastReportedTime;
                            }
                        }
                    }
                }
            }

            tempoiqData = null;
            tempoiqLastValues = null;
            cb(null, facilities);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Sources, finalResult);
        } else if(calcUtils.isSameSelection(clientObject.selection, selection)) {
            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Sources, finalResult);
        }
        storage = null;
        finalResult = null;
    });
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;

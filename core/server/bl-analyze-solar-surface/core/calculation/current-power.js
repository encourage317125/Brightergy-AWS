"use strict";

var _            = require("lodash");
var async        = require("async");
var moment       = require("moment");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var dataProvider = require("dataprovider-service");
var profiling    = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart);

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @returns {object} data for chart
 */
function processTempoIQResponse(tempoIQData, nodeList, isOneFacility, dateTimeUtils) {
    var len = tempoIQData.dataPoints.length;
    var startDate = moment.utc().subtract(24, "hours").startOf("hour");

    var storage = {
        totalGeneration: 0,
        totalProductionBySources: {},
        energyChart: {
            categories: [],
            series: [{
                name: "Total energy",
                data: []
            }]
        },
        powerChart: {
            categories: [],
            series: [{
                name: "Total power",
                data: []
            }]
        }
    };

    var tmp = [];
    for(var i = 0; i < tempoIQData.dataPoints.length; i++) {
        // Skip point if it was too early ...
        var ts = tempoIQData.dataPoints[i].ts;
        var momentTS = moment.utc(ts);
        if (momentTS < startDate) {
            continue;
        }
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKw = 0;

        var iterationSegmentsValues = {}; //stores facilities (scopes) values for current iteration

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility ? scope : facility;
            // var sourceId = isOneFacility ? nodeList[thisInv].scopeId: nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000 / 12; // 12 - because we're working with 5 minutes intervals

            storage.totalGeneration += kwh;

            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = {
                    value: 0,
                    trend: null,
                    // sourceId: sourceId,
                    name: sourceName
                };
            }
            storage.totalProductionBySources[segmentName].value += kwh;

            if (!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kwh;


            if (i > 1 && i === (len -1) && !storage.totalProductionBySources[segmentName].trend) {
                //this is last datapoint and we have previous value
                if (tempoIQData.dataPoints[i-1].values[thisInv]) {
                    var prevValue = tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000 / 12;

                    if (kwh > prevValue) {
                        storage.totalProductionBySources[segmentName].trend = "up";
                    } else {
                        storage.totalProductionBySources[segmentName].trend = "down";
                    }
                }
            }

            periodKw += kwh;
        }

        storage.powerChart.categories.push(ts);
        storage.powerChart.series[0].data.push(periodKw * 12); // back again to kW

        tmp.push({
            ts: ts,
            v: periodKw
        });
    }

    var HOUR_FORMAT = "h:00a, MMMM DD, YYYY";

    var byHour = _.groupBy(tmp, function(point){
        return moment.utc(point.ts).format(HOUR_FORMAT);
    });

    _.forOwn(byHour, function(value, key) {
        var N = 0;
        var sum = _.reduce(value, function(sum, el) {
            N++;
            return sum + el.v;
        }, 0.0);
        storage.energyChart.categories.push(moment.utc(key, HOUR_FORMAT));
        storage.energyChart.series[0].data.push(sum / N);
    });

    return storage;
}

function loadData(clientObject) {
    var socket = clientObject.socket;
    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    //var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var range = clientObject.dateTimeUtils.getDayRange("hour");

    var isOneFacility = false;

    var pipeline =  {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "5min"] // power data
        }]
    };

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipeline
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function(cb) {
            profiling.start("Tempoiq");
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                profiling.endTime("Tempoiq");
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            });
        },
        function(newCacheData, cb) {
            var storage = processTempoIQResponse(newCacheData, nodeList, isOneFacility, clientObject.dateTimeUtils);
            newCacheData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if (finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            finalResult = new utils.serverAnswer(true, storage);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, finalResult);
        storage = null;
        finalResult = null;
    });
}

exports.loadData = loadData;

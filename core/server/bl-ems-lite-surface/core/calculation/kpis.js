"use strict";

var dataProvider = require("dataprovider-service"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    _ = require("lodash"),
    async = require("async"),
    electricDemand = require("./electric-demand");

function processEnergyTempoIQResponse(tempoIQData, nodeList, storage, calculateCurrentDay) {

    var min = null,
        max = null;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKwh = 0;

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];

            var metric = Object.keys(values[thisInv])[0];

            var kwh = Math.abs(values[thisInv][metric] / 1000);
            var thisSavings = (kwh * nodeList[thisInv].rate);

            if(calculateCurrentDay) {
                storage.currentDayEnergy += kwh;
                storage.currentDayRate += thisSavings;
            } else {
                storage.monthApproximateRate += thisSavings;
                periodKwh += kwh;
            }
        }

        if(min === null || periodKwh < min) {
            min = periodKwh;
        }

        if(max === null || periodKwh > max) {
            max = periodKwh;
        }
    }

    if(!calculateCurrentDay) {
        storage.minEnergy = min;
        storage.maxEnergy = max;
    }
}

function loadEnergyData(clientObject, clientAnswerObj, finalCallback) {

    var selection = clientObject.selection,
        nodeList = clientObject.nodeList;

    var pipelineCurrentDay = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"]
        }]
    };

    //average daily kwh
    var pipelinePrevDays= {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"]
        }]
    };

    var range = clientObject.dateTimeUtils.getCurrentDayStartOfMidnightRange();
    var rangeMonth = clientObject.dateTimeUtils.getMonthRange("month");

    if(rangeMonth.start.isAfter(range.start)) {
        rangeMonth.start.subtract(1, "month");
    }

    var tempoiqOptionsCurrentDays = {
        selection: selection,
        pipeline: pipelineCurrentDay
    };

    var tempoiqOptionsPrevDays = {
        selection: selection,
        pipeline: pipelinePrevDays
    };

    if (selection.devices.or.length === 0) {
        return clientAnswerObj.error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
    }

    async.parallel([
        function(cb) {
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptionsCurrentDays, cb);
        },
        function(cb) {
            //past days for current month
            dataProvider.loadData(rangeMonth, clientObject.dateTimeUtils, tempoiqOptionsPrevDays, cb);
        }
    ], function(err, results) {
        if(err) {
            clientAnswerObj.error(err);
        } else {
            var storage = {
                currentDayEnergy: 0,
                currentDayRate: 0,
                monthApproximateRate: 0,
                minEnergy: 0,
                maxEnergy: 0
            };

            processEnergyTempoIQResponse(results[0], nodeList, storage, true);
            processEnergyTempoIQResponse(results[1], nodeList, storage, false);

            var startCurrentDay = moment.utc().startOf("day"),
                startDayMonth = moment.utc().startOf("month"),
                endDayMonth = moment.utc().endOf("month");

            var prevDaysDiff = startCurrentDay.diff(startDayMonth, "day");
            var nextDaysDiff = endDayMonth.diff(startCurrentDay, "day");

            storage.monthApproximateRate *= prevDaysDiff;
            storage.monthApproximateRate += (storage.currentDayRate * nextDaysDiff);
            results = null;
            clientAnswerObj.send(storage);
        }

        if(finalCallback) {
            finalCallback();
        }

    });
}

function loadCurrentDemandData(clientObject, clientAnswerObj, finalCallback) {

    var selection = clientObject.electricDemandSelection,
        socket = clientObject.socket;

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.EMS.CurrentDemand,
            new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
        return;
    }

    var elementData = {
        dateRange: "24-hours",
        clientAnswer: clientAnswerObj
    };

    var element = electricDemand.initElement(clientObject, elementData);
    if (_.isEmpty(element)) {
        return;
    }

    electricDemand.calculateHistory(element, clientObject, function(err, result) {
        if (err) {
            element.ans.error(err);
        } else {
            var response = {
                minDemand: result.totalDemand.min,
                maxDemand: result.totalDemand.max,
                currentDemand: result.totalDemand.last,
                currentDayDemand: result.totalDemand.sum
            };

            result = null;
            clientObject.currentDemand.savedResult = response;
            clientObject.currentDemand.isHistoricalDataLoaded = true;
            element.ans.send(response);

            if (finalCallback) {
                finalCallback();
            }
        }
    });
}

var processKinesisResponse = function(recordsArray, currentDemandData, clientObject) {
    if (!currentDemandData.isHistoricalDataLoaded) {
        return;
    }

    var nodeList = clientObject.nodeList;

    currentDemandData.savedResult.currentDemand = 0;

    var total = 0;

    _.each(recordsArray, function (record) {
        var device = record.device.trim();

        var electricDemandMetricId = nodeList[device].electricDemandMetricId;
        var thisVal = record.values[electricDemandMetricId] / 1000 || 0;

        total += thisVal;
    });

    currentDemandData.savedResult.currentDemand = total;

    currentDemandData.savedResult.minDemand =
        _.min([currentDemandData.savedResult.minDemand, currentDemandData.savedResult.currentDemand]);
    currentDemandData.savedResult.maxDemand =
        _.max([currentDemandData.savedResult.maxDemand, currentDemandData.savedResult.currentDemand]);

    currentDemandData.clientAnswer.send(currentDemandData.savedResult);
};

exports.loadEnergyData = loadEnergyData;
exports.processEnergyTempoIQResponse = processEnergyTempoIQResponse;
exports.loadCurrentDemandData = loadCurrentDemandData;
exports.processKinesisResponse = processKinesisResponse;

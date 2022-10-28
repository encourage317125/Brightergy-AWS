"use strict";

var consts    = require("../../../libs/consts");
var utils     = require("../../../libs/utils");
var calcUtils = require("./calculator-utils");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData) {
    var total = 0;

    for(var i = 0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var metric = Object.keys(values[thisInv])[0];
            var kwh = values[thisInv][metric] / 1000;
            total += kwh;
        }
    }

    return total;
}

function calculateData(clientObject, data, queryOptions) {
    if (!queryOptions.isPreloading) {
        var storage = {
            totalEnergyGeneration: 0
        };
        storage.totalEnergyGeneration = processTempoIQResponse(data);

        var finalResult = new utils.serverAnswer(true, storage);

        if (clientObject.totalEnergyGeneration.dateRange === queryOptions.dateRange &&
            calcUtils.isSameSelection(clientObject.selection, queryOptions.selection)) {
            clientObject.socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration, finalResult);
        }
    }
}

exports.calculateData = calculateData;

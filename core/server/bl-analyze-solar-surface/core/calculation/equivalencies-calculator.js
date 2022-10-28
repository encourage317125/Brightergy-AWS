"use strict";

var _         = require("lodash");
var utils     = require("../../../libs/utils");
var consts    = require("../../../libs/consts");
var EquivCalc = require("../../../general/core/calculation/equivalencies-calculator").EquivalenciesCalculator;
var calcUtils = require("./calculator-utils");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {object}
 */
function processTempoIQResponse(clientObject, tempoIQData) {
    var start = null,
        end = null;

    if (tempoIQData.dataPoints.length > 0) {
        start = tempoIQData.dataPoints[0].ts;
        end = tempoIQData.dataPoints[tempoIQData.dataPoints.length - 1].ts;
    }

    var facilitiesData = {};
    _.each(clientObject.facilitiesList, function(facilityObj) {
        facilitiesData[facilityObj.id] = {
            "facilityId": facilityObj.id,
            "constEmissionFactor": facilityObj.constEmissionFactor,
            "kwh": 0
        };
    });

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];

            var metric = Object.keys(values[thisInv])[0];

            var facilityId = clientObject.nodeList[thisInv].facilityId;

            facilitiesData[facilityId].kwh += (values[thisInv][metric] / 1000);
        }
    }

    return {
        startDate: start,
        endDate: end,
        facilitiesData: facilitiesData
    };
}

function calculateData(clientObject, data, queryOptions) {
    if (!queryOptions.isPreloading) {
        var equivInitData = processTempoIQResponse(clientObject, data);

        var equivCalc = new EquivCalc(
            equivInitData.facilitiesData,
            equivInitData.startDate,
            equivInitData.endDate
        );

        var storage = equivCalc.calc();
        var finalResult = new utils.serverAnswer(true, storage);

        if (clientObject.equivalencies.dateRange === queryOptions.dateRange &&
            calcUtils.isSameSelection(clientObject.selection, queryOptions.selection)) {
            clientObject.socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies, finalResult);
        }
    }
}

function calculateCO2AvoidedData(clientObject, data) {
    var equivInitData = processTempoIQResponse(clientObject, data);

    var equivCalc = new EquivCalc(equivInitData.facilitiesData, 
        equivInitData.startDate, equivInitData.endDate);

    return equivCalc.calc().avoidedCarbon;
}

function calculateCO2AvoidedTotalData(clientObject, data) {
    var equivInitData = processTempoIQResponse(clientObject, data);

    var equivCalc = new EquivCalc(equivInitData.facilitiesData, 
        equivInitData.startDate, equivInitData.endDate);

    return equivCalc.calc().avoidedCarbonTotal;
}

exports.calculateData = calculateData;
exports.calculateCO2AvoidedData = calculateCO2AvoidedData;
exports.calculateCO2AvoidedTotalData = calculateCO2AvoidedTotalData;

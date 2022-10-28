"use strict";

var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var calcUtils    = require("./calculator-utils");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {

    var totalkwh =0;
    var i=0;

    for(i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var tableItem = {
            date: tempoIQData.dataPoints[i].ts,
            percent: 0,
            sources: {},
            totalPerPeriod: 0
        };

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;

            // var sourceId = isOneFacility ? nodeList[thisInv].scopeId : nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility ? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;
            var thisSavings = (kwh * nodeList[thisInv].rate);
            totalkwh += kwh;

            if(!tableItem.sources[segmentName]) {
                tableItem.sources[segmentName] = {
                    // sourceId: sourceId,
                    name: sourceName,
                    savings: 0,
                    kwh: 0
                };
            }

            tableItem.sources[segmentName].kwh +=  kwh;
            tableItem.sources[segmentName].savings +=  thisSavings;
            tableItem.totalPerPeriod += kwh;
        }

        storage.table.push(tableItem);
    }

    if(totalkwh !== 0) {
        for (i = 0; i < storage.table.length; i++) {
            storage.table[i].percent = (storage.table[i].totalPerPeriod / totalkwh) * 100;
        }
    }
}

function loadData(clientObject, finalCallback) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var isOneFacility = false;

    var range = clientObject.dateTimeUtils.getYearRange("month");

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings,
            new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
        return ;
    }

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"] //set user dimension
        }]
    };

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipeline
    };

    async.waterfall([
        function(cb) {
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
        },
        function(tempoiqData, cb) {
            var storage = {
                table: []
            };
            processTempoIQResponse(tempoiqData, nodeList, storage, isOneFacility);
            tempoiqData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if (finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Table, finalResult);
        } else if(calcUtils.isSameSelection(clientObject.selection, selection)) {
            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Table, finalResult);
        }
        storage = null;
        finalResult = null;

        if(finalCallback) {
            finalCallback(finalErr);
        }
    });

}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;

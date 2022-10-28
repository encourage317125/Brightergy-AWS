"use strict";

var _            = require("lodash");
var moment       = require("moment");
var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var log          = require("../../../libs/log")(module);
var profiling    = require("../../../libs/profiling")();
var calcUtils    = require("./calculator-utils");

function processMinMaxEnergyTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {
    var energyByDay = _.map(tempoIQData.dataPoints, function(point) {
        var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
            var metric = _.first(_.keys(el)); // We are expecting powr or Pac
            var val = el[metric];
            return _.isNumber(val) ? parseFloat(val) : 0;
        }), function(sum, x) {
            return sum + x;
        }, 0.0);
        return {
            "ts": point.ts,
            "kWh": sumOfNodes / 1000.0
        };
    });

    storage.minEnergy = _.min(_.pluck(energyByDay, "kWh"));
    storage.maxEnergy = _.max(_.pluck(energyByDay, "kWh"));

    energyByDay = null;
}


function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {
    var today = calcUtils.setDateToMidnight(moment.utc());
    for (var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var metric = Object.keys(values[thisInv])[0];
            var kwh = values[thisInv][metric] / 1000;

            storage.utilitySavingMonth += (kwh * nodeList[thisInv].rate);
            if (moment(ts).isAfter(today)){
                storage.utilitySavingToday += (kwh * nodeList[thisInv].rate);
                storage.energyToday += kwh;
            }
        }
    }
}


function processPowerTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {

    if (tempoIQData.dataPoints.length === 0) {
        log.silly("Power: No data in tempoIQ");
        return;
    }

    //log.silly("tempoIQData: " + JSON.stringify(tempoIQData));

	var today = moment.utc().hour(0).minute(0).second(0).millisecond(0);

    var periodTodayPower = 0, periodTodayPoints = 0;
    var usedInverters = [];

    var maxObject = {};

    // last point in data
    var initialTime = moment(tempoIQData.dataPoints[tempoIQData.dataPoints.length - 1].ts)
        .unix();

    for (var i = tempoIQData.dataPoints.length - 1; i >= 0; i--) {
        var ts = tempoIQData.dataPoints[i].ts;
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        // for finding max and min currentPower we are grouping
        // the data to several segments (20 minutes each), starting from the latest data
        var aggrKey = Math.floor((initialTime - moment(ts).unix()) / (60 * 20));
        maxObject[aggrKey] = maxObject[aggrKey] || {};

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var metric = Object.keys(values[thisInv])[0];
            var kw = values[thisInv][metric] / 1000;

            // we put maximum value of the inverter during period (20 min) to the object
            maxObject[aggrKey][thisInv] = _.max([maxObject[aggrKey][thisInv], kw]);

            if (moment(ts).isAfter(today)) {

                periodTodayPower += kw;
                periodTodayPoints++;

                if (usedInverters.indexOf(thisInv) < 0) {

                    //use last value for calculating currentPower and then remember that inverter is used
                    usedInverters.push(thisInv);
                    storage.currentPower += kw;
                }
            }
        }
    }

    if (periodTodayPoints !== 0) {
        storage.currentDayPower = periodTodayPower / periodTodayPoints;
    }

    //log.silly("maxObject = " + JSON.stringify(maxObject));

    var maxValues = _.map(maxObject, function(value, key) {
        return _.chain(value).
            values().
            reduce(function(sum, node) {
                return sum + node;
            }, 0).
            value();
    });

    storage.maxPower = _.max(maxValues);
    // this is useless, because it will be zero most of the time
    //  storage.minPower = _.min(maxValues);
    storage.minPower = 0;
}


function loadData(clientObject, finalCallback) {
    var socket = clientObject.socket;
    //var dataObject = clientObject.energyToday;

    var range = clientObject.dateTimeUtils.getMonthRange("month");
    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = false;

    var storage = {
        energyToday : 0,
        utilitySavingToday: 0,
        utilitySavingMonth: 0,
        minEnergy: 0,
        maxEnergy: 0
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Energy, new utils.serverAnswer(false, err));
        return;
    }
    var profileScope = profiling.createScope(consts.WEBSOCKET_EVENTS.ASSURF.Energy);

    async.parallel({
        minMax : function(cb){
            var pipeline = {
               "functions":[{
                   "name": "rollup",
                   "arguments": ["mean", "1hour"] //kwh data
               }, {
                   "name": "rollup",
                   "arguments": ["sum", "1day"] //set user dimension
               }]
            };

            var tempoiqOptions = {
                selection: selection,
                pipeline: pipeline
            };

            profileScope.start("Tempoiq1");
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err,data) {
                profileScope.endTime("Tempoiq1");
                if (err){
                    cb(err);
                } else {
                    processMinMaxEnergyTempoIQResponse(data, nodeList, storage, isOneFacility);
                    cb(null, storage);
                }
           });
        },
        main : function(cb){
            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] //kwh data
                }]
            };

            var tempoiqOptions = {
                selection: selection,
                pipeline: pipeline
            };

            profileScope.start("Tempoiq2");
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                profileScope.endTime("Tempoiq2");
                if(err) {
                    cb(err);
                } else {
                    processTempoIQResponse(data, nodeList, storage, isOneFacility);
                    data = null;
                    cb(null, storage);
                }
            });
        }
    }, function(err, res){
        var finalResult = null;
        if (err) {
            finalResult = new utils.serverAnswer(false, err);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Energy, finalResult);
        } else if(calcUtils.isSameSelection(clientObject.selection, selection)) {
            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Energy, finalResult);
            storage = null;
            finalResult = null;
        }

        if(finalCallback) {
            finalCallback(null);
        }
    });
}

function loadPowerData(clientObject, finalCallback) {
    var socket = clientObject.socket;
    //var dataObject = clientObject.currentPower;

    var range = clientObject.dateTimeUtils.getDayRange("hour");

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var tempoiqOptions = {
        selection: selection,
        pipeline: null
    };

    var isOneFacility = false;

    var storage = {
        currentPower : 0,
        currentDayPower: 0,
        minPower : 0,
        maxPower : 0,
        selectedFacilities : [],
        selectedScopes : []
    };

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Power,
            new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
        return ;
    }

    var profileScope = profiling.createScope(consts.WEBSOCKET_EVENTS.ASSURF.Power);
    profileScope.start("Tempoiq");
    //load raw data
    dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
        profileScope.endTime("Tempoiq");
        var finalResult = null;
        if(err) {
            finalResult = new utils.serverAnswer(err, storage);
        } else {
            processPowerTempoIQResponse(data, nodeList, storage, isOneFacility);
            storage.selectedFacilities = clientObject.selectedFacilities;
            storage.selectedScopes = clientObject.selectedScopes;
            finalResult = new utils.serverAnswer(true, storage);
        }

        if(calcUtils.isSameSelection(clientObject.selection, selection)) {
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Power, finalResult);
        }
        data = null;
        finalResult = null;

        if(finalCallback) {
            finalCallback(null);
        }
    });
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;
exports.loadPowerData = loadPowerData;
exports.processPowerTempoIQResponse = processPowerTempoIQResponse;

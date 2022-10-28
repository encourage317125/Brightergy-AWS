"use strict";

var _               = require("lodash");
var moment          = require("moment");
var async           = require("async");
var dataProvider    = require("dataprovider-service");
var utils           = require("../../../libs/utils");
var consts          = require("../../../libs/consts");
var log             = require("../../../libs/log")(module);
var profiling       = require("../../../libs/profiling")();
var solarGenFenCalc = require("./solar-energy-generation-calculator");
var totalEnGenCalc  = require("./total-energy-generation-calculator");
var equivCalc       = require("./equivalencies-calculator");

function processEvent(clientObject, event, err, data, queryOpts) {
    if (err) {
        var finalResult = new utils.serverAnswer(false, err);
        clientObject.socket.emit(event, finalResult);
    } else {
        switch (event) {
            case consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration:
                solarGenFenCalc.calculateData(clientObject, data, queryOpts);
                break;
            case consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies:
                equivCalc.calculateData(clientObject, data, queryOpts);
                break;
            case consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration:
                totalEnGenCalc.calculateData(clientObject, data, queryOpts);
                break;
        }
    }
}

function loadData(clientObject, dateRange, selectedYear, selectedMonth, events, isPreloading, finalCallback) {
    //var socket = clientObject.socket;

    var dimension = null,
        range = null;

    if(!selectedYear) {
        switch (dateRange) {
            case "total":
                range = clientObject.dateTimeUtils.getTotalRange();
                dimension = "1month";
                break;
            case "year":
                range = clientObject.dateTimeUtils.getYearRange("month");
                dimension = "1month";
                break;
            case "month":
                range = clientObject.dateTimeUtils.getMonthRange("day");
                dimension = "1day";
                break;
            case "week":
                range = clientObject.dateTimeUtils.getWeekRange("hour");
                dimension = "1hour";
                break;
            default:
                range = clientObject.dateTimeUtils.getYearRange("month");
                dimension = "1month";
                break;
        }
    } else {
        range = clientObject.dateTimeUtils.getMonthStartOfDayRange(selectedYear, selectedMonth, "day");
        dimension = "1month";
        if(utils.isValidMonth(selectedMonth)) {
            dimension = "1day";
        }
    }

    var selection = clientObject.selection;
    var queryOptions = {
        dateRange: dateRange,
        selectedMonth: selectedMonth,
        selectedYear: selectedYear,
        selection: selection,
        isPreloading: isPreloading,
        originalRange: _.clone(range),
        dimension: dimension
    };
    //var nodeList = clientObject.nodeList;

    //var isOneFacility = clientObject.selectedFacilities.length === 1;

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", dimension] //set user dimension
        }]
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        clientObject.socket.emit(events, new utils.serverAnswer(false, err));
        return;
    }

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipeline
    };

    if (events.length === 1) {
        async.waterfall([
            function (cb) {
                log.debug("startDate = " + moment.utc(range.start).format() + " " + JSON.stringify(events));

                profiling.start("united " + events);
                dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                    profiling.endTime("united " + events);
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, data);
                    }
                });
        }],
        function(finalErr, tempoIQdata) {
            processEvent(clientObject, events[0], finalErr, tempoIQdata, queryOptions);
            if(finalCallback) {
                finalCallback(finalErr);
            }
        });
    } else {
        profiling.start("united " + events);
        dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function (err, data) {
            profiling.endTime("united " + events);
            for (var i = 0; i < events.length; i++) {
                processEvent(clientObject, events[i], err, data, queryOptions);
            }
            if(finalCallback) {
                finalCallback(err);
            }
        });
    }
}

function loadCarbonAvoidedData(clientObject, totalMonthlyData) {
    var socket = clientObject.socket;
    var dataObject = clientObject.CarbonAvoided;

    var dimension = null,
        dateRange = dataObject.dateRange,
        range = null,
        rangeTotal = clientObject.dateTimeUtils.getTotalRange();

    var profileScope = profiling.createScope(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided);

    async.parallel({
        carbon: function(cb){
            switch (dateRange) {
                case "total":
                    range = clientObject.dateTimeUtils.getTotalRange();
                    dimension = "1month";
                    break;
                case "year":
                    range = clientObject.dateTimeUtils.getYearRange("hour");
                    dimension = "1month";
                    break;
                case "month":
                    range = clientObject.dateTimeUtils.getMonthRange("hour");
                    dimension = "P1W";
                    break;
                default :
                    range = clientObject.dateTimeUtils.getYearRange("hour");
                    dimension = "1month";
                    break;
            }

            var selection = clientObject.selection;

            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] //kwh data
                }, {
                    "name": "rollup",
                    "arguments": ["sum", dimension] //set user dimension
                }]
            };

            if (selection.devices.or.length === 0){
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided,
                    new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
                return ;
            }

            var tempoiqOptions = {
                selection: selection,
                pipeline: pipeline
            };

            profileScope.start("Tempoiq1");
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                profileScope.endTime("Tempoiq1");
                if (err) {
                    cb(err);
                } else {
                    cb(null, equivCalc.calculateCO2AvoidedData(clientObject, data));
                }
            });
        },
        total: function(cb){

            if(totalMonthlyData) {
                //we have total monthly data, so do not load again
                cb(null, equivCalc.calculateCO2AvoidedTotalData(clientObject, totalMonthlyData));
            } else {

                var selection = clientObject.selection;

                var pipeline = {
                    "functions": [{
                        "name": "rollup",
                        "arguments": ["mean", "1hour"] //kwh data
                    }, {
                        "name": "rollup",
                        "arguments": ["sum", "1month"] //set user dimension
                    }]
                };

                if (selection.devices.or.length === 0) {
                    socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided,
                        new utils.serverAnswer(false,
                            new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
                    return;
                }

                var tempoiqOptions = {
                    selection: selection,
                    pipeline: pipeline
                };

                profileScope.start("Tempoiq2");
                dataProvider.loadData(rangeTotal, clientObject.dateTimeUtils, tempoiqOptions, function (err, data) {
                        profileScope.endTime("Tempoiq2");
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, equivCalc.calculateCO2AvoidedTotalData(clientObject, data));
                        }
                    });
            }
        }
    }, function(err, res) {
        var finalResult = null;
        if (err) {
            finalResult = new utils.serverAnswer(false, err);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, finalResult);
        } else {
            var result = {
                "carbonAvoided": res["carbon"],
                "carbonAvoidedTotal": res["total"],
                "dateRange": dateRange
            };
            finalResult = new utils.serverAnswer(true, result);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, finalResult);
            result = null;
            res = null;
        }
    });

}

function loadTotalMonthlyData(clientObject, cb) {
    var selection = clientObject.selection;
    var range = clientObject.dateTimeUtils.getTotalRange();

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"]
        }]
    };

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipeline
    };

    dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

exports.loadData = loadData;
exports.loadCarbonAvoidedData = loadCarbonAvoidedData;
exports.loadTotalMonthlyData = loadTotalMonthlyData;

"use strict";

var _            = require("lodash");
var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var calcUtils    = require("./calculator-utils");

const EXPECTED_ENERGY_DATA_POINTS_DIFFERENCE = 300; // 5min

function processTempoIQResponse(tempoIQData, storage, chartType, nodeList, isOneFacility, calculateProduction) {
    //var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        //calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodVal = 0;

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;
            var segmentName = isOneFacility? scope : facility;
            var metric = Object.keys(values[thisInv])[0];

            // var sourceId = isOneFacility ? nodeList[thisInv].scopeId: nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            var val = values[thisInv][metric] / 1000;

            periodVal += val;

            if(calculateProduction) {
                storage.totalProduction += val;
                //total production by source data
                if (!storage.totalProductionBySources[segmentName]) {
                    storage.totalProductionBySources[segmentName] = { 
                        kwh: 0, 
                        // sourceId: sourceId, 
                        name: sourceName 
                    };
                }
                storage.totalProductionBySources[segmentName].kwh += val;
            }
        }

        storage.addCategoryData(chartType, ts, periodVal);

        //storage[chartType].categories.push(ts);
        //storage[chartType].series[0].data.push(periodVal);
    }
}

function loadData(clientObject) {
    var socket = clientObject.socket;
    var viewerTZOffset = clientObject.energyTodayKPIDrilldown.viewerTZOffset;
    //var dataObject = clientObject.currentPower;

    if(_.isUndefined(viewerTZOffset)) {
        return;
    }

    var rangeEnergy = clientObject.dateTimeUtils.getCurrentDayStartOfMidnightRange(viewerTZOffset);
    var rangePower = clientObject.dateTimeUtils.getCurrentDayStartOfMidnightRange(viewerTZOffset);

    var categoriesEnergy = clientObject.dateTimeUtils.createTimes(rangeEnergy, "1hour");
    var categoriesPower = clientObject.dateTimeUtils.createTimes(rangePower, "5min", {stepOffset: 5});

    var zeroEnergySeriesData = _.map(categoriesEnergy, function() { return 0; });
    var zeroPowerSeriesData = _.map(categoriesPower, function() { return 0; });

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = false;

    var pipelineEnergy = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }]
    };

    var pipelinePower = {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", "1min"] //kw data
        }]
    };


    var tempoiqOptionsEnergy = {
        selection: selection,
        pipeline: pipelineEnergy
    };

    var tempoiqOptionsPower = {
        selection: selection,
        pipeline: pipelinePower
    };

    async.waterfall([
        function(cb) {
            async.parallel([
                function(cb) {
                    //load energy
                    dataProvider.loadData(rangeEnergy, clientObject.dateTimeUtils, tempoiqOptionsEnergy, cb);
                },
                function(cb) {
                    //load power value
                    dataProvider.loadData(rangePower, clientObject.dateTimeUtils, tempoiqOptionsPower, cb);
                }
            ], cb);
        },
        function(tempoiqData, cb) {
            //calculate data based on tempoiq response
            var storage = {
                totalProduction: 0,
                totalProductionBySources: {},
                energy : {
                    categories:  _.clone(categoriesEnergy),
                    series: [{
                        type: "column",
                        name: "Today Energy",
                        data: _.clone(zeroEnergySeriesData)
                    }]
                },
                power : {
                    categories:  _.clone(categoriesPower),
                    series: [{
                        type: "spline",
                        name: "Current Power",
                        data: _.clone(zeroPowerSeriesData)
                    }]
                },

                addCategoryData: function(chartType, categoryName, periodVal) {
                    var chart = chartType === "energy"? this.energy: this.power;
                    var index = _.indexOf(chart.categories, categoryName);
                    if (index < 0) {
                        throw new Error("logic error for energyTodayKPIDrilldown, no such category: " +
                            categoryName + " inside: " + JSON.stringify(chart.categories));
                    }

                    chart.series[0].data[index] = periodVal;
                }
            };

            processTempoIQResponse(tempoiqData[0], storage, "energy", nodeList, isOneFacility, true);
            var interpolatedPower = calcUtils.interepolateTempoiqResponse(
                tempoiqData[1],
                EXPECTED_ENERGY_DATA_POINTS_DIFFERENCE
            );
            processTempoIQResponse(interpolatedPower, storage, "power", nodeList, isOneFacility, false);
            tempoiqData = null;
            interpolatedPower = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, finalResult);
        } else if(calcUtils.isSameSelection(clientObject.selection, selection)){
            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, finalResult);
        }
        storage = null;
        finalResult = null;
    });
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;

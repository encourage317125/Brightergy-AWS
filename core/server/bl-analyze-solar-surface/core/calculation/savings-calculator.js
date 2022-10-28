"use strict";

var async        = require("async");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var profiling    = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.Savings);
var calcUtils    = require("./calculator-utils");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @param {boolean} calculateTotal
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility, calculateTotal) {

    var totalkwh =0;
    var i=0;

    for(i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKwh = 0;
        var periodSavings = 0;

        var iterationSegmentsValues = {};//stores facilities (scopes) values for current iteration

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;

            // var sourceId = isOneFacility ? nodeList[thisInv].scopeId: nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;
            var thisSavings = (kwh * nodeList[thisInv].rate);

            if(!calculateTotal) {
                //save value per segment in that iteration
                if (!iterationSegmentsValues[segmentName]) {
                    iterationSegmentsValues[segmentName] = 0;
                }
                iterationSegmentsValues[segmentName] += thisSavings;

                storage.totalSavingPerDateRange += thisSavings;

            } else {
                storage.totalProduction += kwh;
                storage.totalSavings += (kwh * nodeList[thisInv].rate);

                //total production by source data
                if (!storage.totalProductionBySources[segmentName]) {
                    storage.totalProductionBySources[segmentName] = { 
                        kwh: 0, 
                        // sourceId: sourceId, 
                        name: sourceName 
                    };
                }
                storage.totalProductionBySources[segmentName].kwh += kwh;
            }

            periodKwh += kwh;
            periodSavings += thisSavings;
        }

        if(!calculateTotal) {

            storage.areaChart.categories.push(tempoIQData.dataPoints[i].ts);
            storage.comboChart.categories.push(tempoIQData.dataPoints[i].ts);

            //add data to sources series (facility, scope)
            for (var k = 0; k < storage.areaChart.series.length; k++) {
                var seriesName = storage.areaChart.series[k].sourceId;

                if (iterationSegmentsValues[seriesName]) {
                    //we have data for that series
                    storage.areaChart.series[k].data.push(iterationSegmentsValues[seriesName]);
                } else {
                    //value not exists, use zero
                    storage.areaChart.series[k].data.push(0);
                }
            }

            storage.comboChart.series[0].data.push(periodSavings);
            storage.comboChart.series[1].data.push(periodKwh);
        }
    }

    return totalkwh;
}

function loadData(clientObject, dateRange, selectedYear, totalMonthlydata, isPreloading, finalCallback) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var isOneFacility = false;

    var dimension = null,
        range = null,
        rangeTotal = clientObject.dateTimeUtils.getTotalRange();

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings, 
            new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
        return ;
    }

    if(!selectedYear) {
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
                range = clientObject.dateTimeUtils.getMonthRange("day");
                dimension = "1day";
                break;
            case "week":
                range = clientObject.dateTimeUtils.getWeekRange("hour");
                dimension = "1hour";
                break;
            default :
                range = clientObject.dateTimeUtils.getYearRange("hour");
                dimension = "1month";
                break;
        }
    } else {
        dimension = "1month";
        range = clientObject.dateTimeUtils.getYearRange("hour");
    }

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", dimension] //set user dimension
        }]
    };

    var pipelineTotal = {
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
    var tempoiqOptionsTotal = {
        selection: selection,
        pipeline: pipelineTotal
    };

    async.waterfall([
        function(finallCallback) {
            //make requests to tempoiq
            async.parallel([
                function(cb) {
                    //load value according date range
                    profiling.start("Tempoiq1");
                    dataProvider.loadData(range,clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                        profiling.endTime("Tempoiq1");
                        cb(err, data);
                    });
                },
                function(cb) {
                    if(totalMonthlydata) {
                        cb(null, totalMonthlydata);
                    } else {
                        //load total value
                        profiling.start("Tempoiq2");
                        dataProvider.loadData(rangeTotal ,clientObject.dateTimeUtils, tempoiqOptionsTotal,
                            function (err, data) {
                                profiling.endTime("Tempoiq2");
                                cb(err, data);
                            }
                        );
                    }
                }
            ], finallCallback);
        },
        function(tempoiqData, cb) {
            //calculate data based on tempoiq response
            var storage = {
                totalSavingPerDateRange : 0,
                totalSavings : 0,
                totalProduction : 0,
                totalProductionBySources: {},
                areaChart: {
                    categories: [],
                    series: []
                },
                comboChart: {
                    categories: [],
                    series: [{
                        type: "column",
                        name: "Savings",
                        data: []
                    }, {
                        type: "spline",
                        name: "kWh",
                        data: []
                    }]
                },
                dateRange: dateRange
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.areaChart);

            processTempoIQResponse(tempoiqData[0], nodeList, storage, isOneFacility, false);
            processTempoIQResponse(tempoiqData[1], nodeList, storage, isOneFacility, true);
            tempoiqData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            finalResult = new utils.serverAnswer(true, storage);
        }
        if(!isPreloading && dateRange === clientObject.savings.dateRange &&
            selectedYear === clientObject.savings.year &&
            calcUtils.isSameSelection(clientObject.selection, selection)) {
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings, finalResult);
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

"use strict";

var async        = require("async");
var moment       = require("moment");
var utils        = require("../../../libs/utils");
var consts       = require("../../../libs/consts");
var dataProvider = require("dataprovider-service");
var calcUtils    = require("./calculator-utils");

const CURRENT_DATA = "current";
const MONTH_DATA = "month";
const LAST_VALUE = "lastvalue";

function processHistoricalTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility, calcType) {

    var totalkwh = 0,
        i= 0,
        len = tempoIQData.dataPoints.length,
        prevPeriodkWh = 0,
        todayMidnight = calcUtils.setDateToMidnight(moment.utc());

    for (i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKwh = 0;

        var tableItem = {
            date: ts,
            percent: 0,
            sources: {},
            totalPerPeriod: 0
        };

        var iterationSegmentsValues = {};//stores facilities (scopes) values for current iteration

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by inberter
            var scope = nodeList[thisInv].scopeId;

            //if one facility selected, use scopes as labels
            var segmentId = isOneFacility? scope : facility;
            var segmentName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = Math.abs(values[thisInv][metric] / 1000);

            periodKwh += kwh;
            totalkwh += kwh;

            if(!tableItem.sources[segmentId]) {
                tableItem.sources[segmentId] = {
                    name: segmentName,
                    value: 0
                };
            }

            tableItem.sources[segmentId].value +=  kwh;
            tableItem.totalPerPeriod += kwh;

            if(!iterationSegmentsValues[segmentId]) {
                iterationSegmentsValues[segmentId] = 0;
            }
            iterationSegmentsValues[segmentId] += kwh;

            if (calcType === CURRENT_DATA) {
                storage.consumptionBySources[segmentId].value += kwh;

                if (i > 1 && i === (len -1) && !storage.consumptionBySources[segmentId].trend) {
                    //this is last datapoint and we have previous value
                    if (tempoIQData.dataPoints[i-1].values[thisInv]) {

                        var currentValue = Math.abs(tempoIQData.dataPoints[i].values[thisInv][metric] / 1000);
                        var prevValue = Math.abs(tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000);

                        if (currentValue > prevValue) {
                            storage.consumptionBySources[segmentId].trend = consts.TREND.UP;
                            storage.consumption.trend = consts.TREND.UP;
                        } else {
                            storage.consumptionBySources[segmentId].trend = consts.TREND.DOWN;
                            storage.consumption.trend = consts.TREND.DOWN;
                        }
                    }
                }
            } else if (calcType === LAST_VALUE && moment.utc(ts).isAfter(todayMidnight)) {
                storage.currentPowerBySources[segmentId].value += kwh;
                storage.currentPower += kwh;
            }
        }

        if (calcType === CURRENT_DATA) {
            storage.mainChart.categories.push(ts);
            storage.mainChart.series[0].data.push(periodKwh);

            //add data to sources series (facility, scope)
            for (var k = 1; k < storage.mainChart.series.length; k++) {
                var seriesId = storage.mainChart.series[k].sourceId;

                if (iterationSegmentsValues[seriesId]) {
                    //we have data for that series
                    storage.mainChart.series[k].data.push(iterationSegmentsValues[seriesId]);
                } else {
                    //value not exists, use zero
                    storage.mainChart.series[k].data.push(0);
                }
            }

            storage.consumption.value += periodKwh;
            storage.table.push(tableItem);

        } else if (calcType === MONTH_DATA) {
            storage.monthConsumption += periodKwh;
        }

        prevPeriodkWh = periodKwh;
    }


    if (calcType === CURRENT_DATA && totalkwh !== 0) {
        for (i = 0; i < storage.table.length; i++) {
            storage.table[i].percent = (Math.abs(storage.table[i].totalPerPeriod) / Math.abs(totalkwh)) * 100;
        }
    }
}


function loadHistoricalData(clientObject, dateRange, isPreloading, clintAnswerObj, finalCallback) {
    var socket = clientObject.socket;

    var dimension = null,
        range = null,
        rangeMonth = clientObject.dateTimeUtils.getRangeForMonthYear(moment.utc().year(), moment.utc().month());

    var tempoiqOptions = {
        query: {}
    };

    var cacheTempoiqData = true;

    switch (dateRange) {
        case "3-hours":
            range = clientObject.dateTimeUtils.getNHoursRange(3, "minute", "minute");
            //dimension = "1min";//kwh data can not be less than 1 hour
            cacheTempoiqData = false;
            break;
        case "24-hours":
            range = clientObject.dateTimeUtils.getNHoursRange(23, "hour");//current hour and prev 23 hours
            //dimension = "10min";//kwh data can not be less than 1 hour
            break;
        case "week":
            range = clientObject.dateTimeUtils.getWeekRange("hour");
            //dimension = "1hour";//default 1 hour
            break;
        case "month":
            range = clientObject.dateTimeUtils.getMonthRange("hour");
            dimension = "1day";
            break;
        case "year":
            range = clientObject.dateTimeUtils.getYearRange("hour");
            dimension = "1day";
            tempoiqOptions.query.limit = 100;
            break;
        default :
            range = clientObject.dateTimeUtils.getNHoursRange(3, "minute", "minute");
            cacheTempoiqData = false;
            break;
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = false;

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }]
    };

    if (dimension) {
        pipeline.functions.push({
            "name": "rollup",
            "arguments": ["sum", dimension] //set user dimension
        });
    }

    var pipelineMonth = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"]
        }]
    };

    tempoiqOptions.selection = selection;
    tempoiqOptions.pipeline = pipeline;

    var tempoiqOptionsMonth = {
        selection: selection,
        pipeline: pipelineMonth
    };

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption,
            new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
        return ;
    }

    async.waterfall([
        function(callback) {
            async.parallel([
                function(cb) {
                    if (tempoiqOptions.query.limit) {
                        dataProvider.loadDataParallel(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
                    } else {
                        dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
                    }
                },
                function(cb) {
                    dataProvider.loadData(rangeMonth, clientObject.dateTimeUtils, tempoiqOptionsMonth, cb);
                },
                function(cb) {
                    dataProvider.loadLastValues(clientObject.dateTimeUtils, tempoiqOptions, cb);
                }
            ], function(err, tempoIQResults) {
                if (err) {
                    return callback(err);
                } else {
                    var tempoiqData = [
                        tempoIQResults[0],
                        tempoIQResults[1]
                    ];
                    callback(null, tempoiqData, tempoIQResults[2]);
                }
            });
        },
        function(tempoiqData, lastValues, cb) {
            var storage = {
                monthConsumption: 0,
                consumption: {
                    trend: consts.TREND.UP,
                    value: 0
                },
                table: [],
                consumptionBySources: {},
                currentPower: 0,
                currentPowerBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Consumption",
                        data: []
                    }]
                },
                dateRange: dateRange
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            var addedSeries = [];
            for (var nodeId in nodeList) {
                if (nodeList[nodeId]) {

                    var name = isOneFacility ? nodeList[nodeId].scopeName: nodeList[nodeId].facilityName;
                    var sourceId = isOneFacility ? nodeList[nodeId].scopeId: nodeList[nodeId].facilityId;

                    if (addedSeries.indexOf(sourceId) < 0) {
                        //sourceId not added
                        addedSeries.push(sourceId);
                        storage.consumptionBySources[sourceId] = {
                            name: name,
                            prevValue: null,
                            value: 0,
                            trend: null
                        };

                        storage.currentPowerBySources[sourceId] = {
                            name: name,
                            value: 0
                        };
                    }
                }
            }

            processHistoricalTempoIQResponse(tempoiqData[0], nodeList, storage, isOneFacility, CURRENT_DATA);
            processHistoricalTempoIQResponse(tempoiqData[1], nodeList, storage, isOneFacility, MONTH_DATA);
            processHistoricalTempoIQResponse(lastValues, nodeList, storage, isOneFacility, LAST_VALUE);
            tempoiqData = null;
            lastValues = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        if (finalErr) {
            clintAnswerObj.error(finalErr);
        } else if(!isPreloading && calcUtils.isSameElementSettings(
                dateRange,
                clientObject.kwhEnergyConsumption.dateRange,
                selection,
                clientObject.selection)
        ) {
            clintAnswerObj.send(storage);
        }

        if (finalCallback) {
            finalCallback(finalErr);
        }
    });
}

exports.processHistoricalTempoIQResponse = processHistoricalTempoIQResponse;
exports.loadHistoricalData = loadHistoricalData;

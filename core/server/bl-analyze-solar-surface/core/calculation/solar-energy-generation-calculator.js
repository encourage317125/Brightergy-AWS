"use strict";

var _            = require("lodash");
var async        = require("async");
var moment       = require("moment");
var utils        = require("../../../libs/utils");
var log          = require("../../../libs/log")(module);
var consts       = require("../../../libs/consts");
var dataProvider = require("dataprovider-service");
var calcUtils    = require("./calculator-utils");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {void}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {
    var i =0;
    var pieData = {};

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

            var sourceId = isOneFacility ? nodeList[thisInv].scopeId: nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;
            var thisSavings = kwh * nodeList[thisInv].rate;

            //save value per segment in that iteration
            if(!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kwh;

            storage.totalSaving += thisSavings;
            storage.totalProduction += kwh;

            //pie data
            if (!pieData[segmentName]) {
                pieData[segmentName] = {
                    kwh: 0,
                    sourceId: sourceId,
                    name: sourceName
                };
            }
            pieData[segmentName].kwh += kwh;

            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = {
                    kwh: 0,
                    // sourceId: sourceId,
                    name: sourceName
                };
            }
            storage.totalProductionBySources[segmentName].kwh += kwh;

            periodKwh += kwh;
            periodSavings += thisSavings;
        }

        storage.addCategoryData(
            moment.utc(tempoIQData.dataPoints[i].ts).toISOString(),
            periodKwh,
            periodSavings,
            iterationSegmentsValues);
    }

    if (storage.totalProduction !== 0) {
        for (var prop in pieData) {
            if (pieData[prop]) {
                var pieObj = {
                    name: pieData[prop].name,
                    percent: (pieData[prop].kwh / storage.totalProduction) * 100,
                    kwh: pieData[prop].kwh,
                    sourceId: pieData[prop].sourceId
                };
                // modified due to request #95060578
                storage.pie.series[0].data.push(pieObj);
            }
        }
    }
    pieData = null;
}


function processTempoIQResponseCandlestick(tempoIQData, storage, nodeList, isOneFacility) {
    //var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var len =  tempoIQData.dataPoints.length;

    var prevTS = null,
        prevMonth = null,
        prevDay = null,
        prevMonthMax = null,
        prevMonthMin = null,
        monthFirstDay = null,
        monthLastDay = null,
        monthMinTS = null,
        monthMaxTS = null;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = tempoIQData.dataPoints[i].ts;
        var momentTS = moment.utc(tempoIQData.dataPoints[i].ts);

        var thisMonth = momentTS.month();
        var thisDay = momentTS.date();

        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);


        var dayKwh = 0;

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;
            var segmentName = isOneFacility? scope : facility;

            // var sourceId = isOneFacility ? nodeList[thisInv].scopeId: nodeList[thisInv].facilityId;
            var sourceName = isOneFacility ? nodeList[thisInv].scopeName: nodeList[thisInv].facilityName;

            var metric = Object.keys(values[thisInv])[0];
            var kwh = values[thisInv][metric] / 1000;


            dayKwh += kwh;

            storage.totalSaving += (kwh * nodeList[thisInv].rate);
            storage.totalProduction += kwh;
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

        //this is new monthy
        var isNewMonth = (prevMonth !== null && thisMonth !== prevMonth);

        //this is new monthy OR last day
        if(isNewMonth || (i === len - 1)) {

            var label = prevTS? prevTS : ts;

            storage.candlestick.series.data.push(/*[
                label,
                monthLastDay,
                prevMonthMax,
                prevMonthMin,
                monthFirstDay
            ]*/ {
                timestamp: label,
                initial: monthFirstDay,
                minimum: prevMonthMin,
                minimumTimestamp: monthMinTS,
                maximum: prevMonthMax,
                maximumTimestamp: monthMaxTS,
                final: monthLastDay
            });

            //clear min/max values
            prevMonthMax = null;
            prevMonthMin = null;
            monthMinTS = null;
            monthMaxTS = null;
        }

        prevMonth = thisMonth;
        prevDay = thisDay;
        prevTS = ts;

        if(!prevMonthMax || prevMonthMax < dayKwh) {
            prevMonthMax = dayKwh;
            monthMaxTS = ts;
        }

        if(!prevMonthMin || prevMonthMin > dayKwh) {
            prevMonthMin = dayKwh;
            monthMinTS = ts;
        }

        if(i === 0 || isNewMonth) {
            monthFirstDay = dayKwh;
        }
        monthLastDay = dayKwh;
    }
}

function bindSepTotalOldYearsColumns(storage) {
    
    var numOfCats = storage.mainChart.categories.length,
        numOfSeries = storage.mainChart.series.length,
        endDate = moment(storage.mainChart.categories[numOfCats-1]),
        newMainChart = _.cloneDeep(storage.mainChart),
        i, j;

    if (storage.dateRange === "total" && storage.dimension === "1month") {
        newMainChart.categories = [];
        for (i = 0; i < numOfSeries; i ++) {
            newMainChart.series[i].data = [];
        }
    }

    var categoryTypeByDimension = {
        "1month": "month",
        "1day": "day",
        "1hour": "hour"
    };
    var iNewCat = -1;

    for (i = 0; i < numOfCats; i ++) {
        
        if (storage.dateRange === "total" && storage.dimension === "1month") {

            var iDate = moment(storage.mainChart.categories[i]);

            if (iDate.year() >= endDate.year() - 1) {
                // current year or previous year

                iNewCat ++;
                newMainChart.categories[iNewCat] = {
                    "type": "month",
                    "value": storage.mainChart.categories[i]
                };
                for (j = 0; j < numOfSeries; j ++) {
                    newMainChart.series[j].data[iNewCat] = storage.mainChart.series[j].data[i];
                }
                
            } else {
                // earlier than previous year

                if (i === 0 || moment(newMainChart.categories[iNewCat].value).year() !== iDate.year()) {
                    // the very first column or different(next) year from the previous iteration

                    iNewCat ++;
                    newMainChart.categories[iNewCat] = {
                        "type": "year",
                        "value": storage.mainChart.categories[i]
                    };
                    for (j = 0; j < numOfSeries; j ++) {
                        newMainChart.series[j].data[iNewCat] = storage.mainChart.series[j].data[i];
                    }
                } else {
                    // same year with the previous iteration, thus sum up the kWh value

                    for (j = 0; j < numOfSeries; j ++) {
                        newMainChart.series[j].data[iNewCat] += storage.mainChart.series[j].data[i];
                    }
                }
            }
        } else { //storage.dateRange === "total" && storage.dimension === "1month"

            iNewCat ++;
            newMainChart.categories[i] = {
                "type": categoryTypeByDimension[storage.dimension],
                "value": storage.mainChart.categories[i]
            };

        }
    }

    storage.mainChart = newMainChart;
}

function bindSepDrilldownTotalOldYearsColumns(storage) {
    var data = storage.candlestick.series.data,
        numOfOldCols = data.length,
        endDate = moment(data[numOfOldCols-1].timestamp),
        i;

    if (storage.dateRange === "total" && !storage.selectedYear) {

        var newData = [], iNewCol = -1;

        for (i = 0; i < numOfOldCols; i ++) {

            var iDate = moment(data[i].timestamp);

            if (iDate.year() >= endDate.year() - 1) {
                // current year or previous year

                iNewCol ++;
                newData[iNewCol] = _.clone(data[i]);
                newData[iNewCol].type = "month";
                
            } else {
                // earlier than previous year

                if (i === 0 || moment(newData[iNewCol].timestamp).year() !== iDate.year()) {
                    // the very first column or different(next) year from the previous iteration

                    iNewCol ++;
                    newData[iNewCol] = _.clone(data[i]);
                    newData[iNewCol].type = "year";

                } else {
                    // same year with the previous iteration, thus do comparation

                    newData[iNewCol].timestamp = data[i].timestamp;
                    newData[iNewCol].final = data[i].final;
                    if (newData[iNewCol].minimum > data[i].minimum) {
                        newData[iNewCol].minimum = data[i].minimum;
                        newData[iNewCol].minimumTimestamp = data[i].minimumTimestamp;
                    }
                    if (newData[iNewCol].maximum < data[i].maximum) {
                        newData[iNewCol].maximum = data[i].maximum;
                        newData[iNewCol].maximumTimestamp = data[i].maximumTimestamp;
                    }
                }
            }
        }

        storage.candlestick.series.data = newData;

    } else { //storage.dateRange === "total" && !storage.selectedYear

        for (i = 0; i < numOfOldCols; i ++) {
            data[i].type = "month";
        }
    }
}

function calculateData(clientObject, data, queryOptions) {
    var range = queryOptions.originalRange;
    if(data.dataPoints.length > 0) {
        range = {
            start: moment.utc(data.dataPoints[0].ts),
            end: moment.utc(data.dataPoints[data.dataPoints.length - 1].ts)
        };
    }

    var categories = clientObject.dateTimeUtils.
        createTimes(
        range,
            queryOptions.dimension,
            {convertToClientTZ: true}
    );
    var zeroSeriesData = _.map(categories, function() { return 0; });

    if (!queryOptions.isPreloading) {
        var storage = {
            totalSaving: 0,
            totalProduction: 0,
            totalProductionBySources: {},
            pie: {
                series: [{
                    type: "pie",
                    name: "Generation Per Sources",
                    data: []
                }]
            },
            mainChart: {
                categories: _.clone(categories),
                series: [{
                    name: "Total Generation",
                    data: _.clone(zeroSeriesData)
                }, {
                    name: "Savings",
                    data: _.clone(zeroSeriesData)
                }]
            },
            dateRange: queryOptions.dateRange,
            dimension: queryOptions.dimension,

            addCategoryData: function(categoryName, periodKwh, periodSavings, iterationSegmentsValues) {
                var index = _.indexOf(this.mainChart.categories, categoryName);
                if (index < 0) {
                    throw new Error("logic error for solarEnergyGeneration, no such category: " +
                                    categoryName + " inside: " + JSON.stringify(this.mainChart.categories));
                }

                this.mainChart.series[0].data[index] = periodKwh;
                this.mainChart.series[1].data[index] = periodSavings;
                for (var k = 2; k < this.mainChart.series.length; k++) {
                    var series = storage.mainChart.series[k];
                    if (_.isEmpty(series.data)) {
                        series.data = _.clone(zeroSeriesData);
                    }
                    series.data[index] = iterationSegmentsValues[series.sourceId] || 0;
                }
            }
        };

        var nodeList = clientObject.nodeList;
        var isOneFacility = false;

        calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);
        processTempoIQResponse(data, nodeList, storage, isOneFacility);

        bindSepTotalOldYearsColumns(storage);

        var finalResult = new utils.serverAnswer(true, storage);

        if (queryOptions.dateRange === clientObject.solarEnergyGeneration.dateRange &&
            queryOptions.selectedYear === clientObject.solarEnergyGeneration.year &&
            queryOptions.selectedMonth === clientObject.solarEnergyGeneration.month &&
            calcUtils.isSameSelection(clientObject.selection, queryOptions.selection)) {
            clientObject.socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration, finalResult);
        }
    }
}

function loadCandlestick(clientObject, dateRange, selectedYear) {
    var socket = clientObject.socket;
    var range = null;

    if (!selectedYear) {
        switch (dateRange) {
            case "total":
                range = clientObject.dateTimeUtils.getTotalRange();
                break;
            case "year":
                range = clientObject.dateTimeUtils.getYearRange("month");
                break;
            /*case "month":
                startDate = moment.utc().add(-1, "month");
                dimension = "1day";
                break;
            case "week":
                startDate = moment.utc().add(-1, "week");
                dimension = "1hour";
                break;*/
            default :
                range = clientObject.dateTimeUtils.getYearRange("month");
                break;
        }
    } else {
        range = clientObject.dateTimeUtils.getRangeForYear(selectedYear);
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = false;

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

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function(cb) {
            log.debug("SolarEnergyGeneration range: " + JSON.stringify(range));
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
        },
        function(tempoiqData, cb) {
            var storage = {
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                candlestick: {
                    series: {
                        type: "candlestick",
                        name: "Candlestick Chart",
                        data: []
                    }
                },
                dateRange: dateRange,
                selectedYear: selectedYear
            };

            processTempoIQResponseCandlestick(tempoiqData, storage, nodeList, isOneFacility);

            bindSepDrilldownTotalOldYearsColumns(storage);

            tempoiqData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, finalResult);
        } else if(dateRange === clientObject.solarEnergyGenerationDrilldown.dateRange &&
            selectedYear === clientObject.solarEnergyGenerationDrilldown.year &&
            calcUtils.isSameSelection(clientObject.selection, selection)){
            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, finalResult);
        }
        storage = null;
        finalResult = null;
    });
}

exports.calculateData = calculateData;
exports.loadCandlestick = loadCandlestick;
exports.processTempoIQResponseCandlestick = processTempoIQResponseCandlestick;

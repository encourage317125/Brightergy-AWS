"use strict";

var _            = require("lodash");
var moment       = require("moment");
var async        = require("async");
var utils        = require("../../../libs/utils");
var log          = require("../../../libs/log")(module);
var consts       = require("../../../libs/consts");
var dataProvider = require("dataprovider-service");
var profiling    = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower);
var calcUtils    = require("./calculator-utils");

/**
 * This function returns the new data which wasn't send to the client yet
 * see story #92419612
 * @param newData the data, which were calculated from tempoIQ
 * @param clientObject object from websocket
 * @return {object} diff object
 */
function calculateDiff(newData, clientObject) {

    //log.debug("calculateDiff");

    // special case for mainChart
    function processMainChart(newChart, savedChart) {

        if (_.isEqual(newChart, savedChart)) {
            return {};
        }

        var indexesToReplace = [];

        _.each(newChart.categories, function(category, index) {
            if (!_.contains(savedChart.categories, category)) {
                indexesToReplace.push(index);
            }
        });

        _.each(newChart.series, function(series, sIndex) {
            _.each(series.data, function(data, index) {
                if (!savedChart.series[sIndex]) {
                    indexesToReplace.push(index);
                    return;
                }
                if (savedChart.series[sIndex].data[index] !== data) {
                    indexesToReplace.push(index);
                }
            });
        });

        if (_.isEmpty(indexesToReplace)) {
            return {};
        }

        // create resulting diff object
        var mainChartResult = {
            categories: [],
            series: _.map(newChart.series, function(s) {
                return { name: s.name, data: [], sourceId: s.sourceId };
            })
        };

        _.each(_.chain(indexesToReplace).sort().uniq(true).value(), function(index) {
            mainChartResult.categories.push(newChart.categories[index]);
            _.each(mainChartResult.series, function(series, sIndex) {
                series.data.push(newChart.series[sIndex].data[index]);
            });
        });

        return mainChartResult;
    }

    // entry point to function
    var savedData = clientObject.realTimePower.savedData;

    if (_.isEmpty(savedData)) {
        log.silly("savedData is empty");
        clientObject.realTimePower.savedData = _.cloneDeep(newData);
        newData.history = false;
        return newData;
    }

    if (newData.dateRange !== savedData.dateRange) {
        log.silly("newData.dateRange != savedData.dateRange, new: " +
                  newData.dateRange + ", old: " + savedData.dateRange);
        clientObject.realTimePower.savedData = _.cloneDeep(newData);
        newData.history = false;
        return newData;
    }

    var diff = {
        history: true
    };

    if (_.isEqual(newData, savedData)) {
        log.debug("newData is equal to savedData");
        return diff;
    }

    log.debug("newData is not equal to savedData");
    _.forOwn(newData, function(newValue, key) {

        var savedValue = savedData[key];

        if (_.isEqual(savedValue, newValue)) {
            return;
        }

        if (key === "mainChart") {
            // special logic
            diff[key] = processMainChart(newValue, savedValue);
        } else {
            diff[key] = newValue;
        }

    });

    clientObject.realTimePower.savedData = _.cloneDeep(newData);
    return diff;
}


/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @param format time format
 * @returns {void}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {

    //var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    var getValueAndTrend = function(series) {
        var twoLast = _.takeRight(series.data, 2);
        var first = twoLast[0] || 0;
        var last = _.last(series.data) || 0;
        var trend = first < last ? consts.TREND.UP : consts.TREND.DOWN;
        return {
            kw: last,
            sourceId: series.sourceId,
            name: series.name,
            trend: trend
        };
    };

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKw = 0;

        var iterationSegmentsValues = {}; //stores facilities (scopes) values for current iteration

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityId;//find facility by imberter
            var scope = nodeList[thisInv].scopeId;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kw = values[thisInv][metric] / 1000;
            periodKw += kw;

            if (!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kw;
        }

        storage.mainChart.categories.push(tempoIQData.dataPoints[i].ts);
        storage.mainChart.series[0].data.push(periodKw);

        //add data to sources series (facility, scope)
        for(var k=1; k < storage.mainChart.series.length; k++) {
            var seriesName = storage.mainChart.series[k].sourceId;

            if(iterationSegmentsValues[seriesName]) {
                //we have data for that series
                storage.mainChart.series[k].data.push(iterationSegmentsValues[seriesName]);
            } else {
                //value not exists, use zero
                storage.mainChart.series[k].data.push(0);
            }

            storage.generationBySources[seriesName] = getValueAndTrend(storage.mainChart.series[k]);
        }

        storage.totalGeneration = getValueAndTrend(storage.mainChart.series[0]);
    }
}

/**
 * Function normalize data from tempoiq response - 
 *          interpolate in inconsistent gaps for multiple sources with different intervals
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @returns {object} normalized tempoIQData
 */
function normalizeTempoIQResponse(tempoIQData, nodeList, dimension) {
    var sourceIds = Object.keys(nodeList);

    if (sourceIds.length < 2) {
        return tempoIQData;
    }

    var fillableGapInMinutes;
    switch (dimension) {
        // dateRange: today
        case "1min": fillableGapInMinutes = 60; break;
        // dateRange: month
        case "1day": fillableGapInMinutes = 2*24*60; break;
        // dateRange: week
        case "1hour": fillableGapInMinutes = 1*24*60; break;
    }

    for(var i = 0; i < tempoIQData.dataPoints.length; i++) {
        for (var j = 0; j < sourceIds.length; j++) {
            var srcId = sourceIds[j];
            if (tempoIQData.dataPoints[i].values[srcId] === undefined) {

                // Find the nearest non-empty dataPoint
                var k = i, next = -1;
                while (k < tempoIQData.dataPoints.length-1 && next === -1) {
                    k ++;
                    if (tempoIQData.dataPoints[k].values[srcId] !== undefined) {
                        next = k;
                    }
                }

                // Decide method to fill the gap
                var iTime = moment(tempoIQData.dataPoints[i].ts);
                var kTime = moment(tempoIQData.dataPoints[k].ts);
                var gap = kTime.diff(iTime, "minutes");
                var fillType, fixedVal, metric, h;
                if (gap < fillableGapInMinutes) {
                    if (i === 0) {
                        fillType = "fixed";
                        if (next === -1) {
                            fixedVal = 0;
                        } else {
                            metric = Object.keys(tempoIQData.dataPoints[next].values[srcId])[0];
                            fixedVal = tempoIQData.dataPoints[next].values[srcId][metric];
                        }
                    } else if (next === -1) {
                        fillType = "fixed";
                        metric = Object.keys(tempoIQData.dataPoints[i-1].values[srcId])[0];
                        fixedVal = tempoIQData.dataPoints[i-1].values[srcId][metric];
                    } else {
                        fillType = "interpolate";
                    }
                } else {
                    fillType = "fixed";
                    fixedVal = 0;
                }

                // Fill the gap accordingly
                if (fillType === "fixed") {
                    for (h = i; h <= (next === -1 ? k : next -1); h++) {
                        tempoIQData.dataPoints[i].values[srcId] = { "tinker": fixedVal };
                    }
                } else if (fillType === "interpolate") {
                    var metricA = Object.keys(tempoIQData.dataPoints[i-1].values[srcId])[0];
                    var valA = tempoIQData.dataPoints[i-1].values[srcId][metricA];
                    var metricB = Object.keys(tempoIQData.dataPoints[next].values[srcId])[0];
                    var valB = tempoIQData.dataPoints[next].values[srcId][metricB];
                    var fillCount = next - i +1;
                    for (h = 1; h < fillCount; h++) {
                        tempoIQData.dataPoints[i+h-1].values[srcId] = { "tinker": valA + (valB-valA)/fillCount*h };
                    }
                }
            }
        }
    }

    return tempoIQData;
}


function loadData(clientObject, dateRange, selectedDay, isPreloading, finalCallback) {

    if (!finalCallback) {
        finalCallback = function(){};
    }
    var socket = clientObject.socket;

    var dimension = null;
    var range = null;
    var nocache = false;

    if(!selectedDay) {
        switch (dateRange) {
            case "today":
                range = clientObject.dateTimeUtils.getDayRange("hour");
                dimension = "1min";
                nocache = true;
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
                range = clientObject.dateTimeUtils.getMonthRange("day");
                dimension = "1day";
                break;
        }
    } else {
        dimension = "1min";
        range = clientObject.dateTimeUtils.rangeForDay(selectedDay);
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = false;

    var pipeline =  {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", dimension]
        }]
    };

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, new utils.serverAnswer(false, err));
        return;
    }

    var tempoiqOptions = {
        selection: selection,
        pipeline: pipeline,
        nocache: nocache
    };

    async.waterfall([
        function(cb) {
            profiling.start("Tempoiq");
            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, function(err, data) {
                profiling.endTime("Tempoiq");
                if(err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            });
        },
        function(tempoiqData, cb) {
            cb(null, normalizeTempoIQResponse(tempoiqData, nodeList, dimension));
        },
        function(tempoiqData, cb) {
            var storage = {
                totalGeneration: {
                    value: 0,
                    trend: null
                },
                generationBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                },
                dateRange: dateRange
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            processTempoIQResponse(tempoiqData, nodeList, storage, isOneFacility);
            tempoiqData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if (isPreloading) {
            return finalCallback(finalErr);
        }

        if (finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            var diff = calculateDiff(storage, clientObject);
            diff.dateRange = dateRange;
            finalResult = new utils.serverAnswer(true, diff);
        }

        if(dateRange === clientObject.realTimePower.dateRange &&
            selectedDay === clientObject.realTimePower.day &&
            calcUtils.isSameSelection(clientObject.selection, selection)) {

            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, finalResult);
        }

        storage = null;
        finalResult = null;
        finalCallback(finalErr);
    });
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;

// for UT
exports._calculateDiff = calculateDiff;
exports._normalizeTempoIQResponse = normalizeTempoIQResponse;

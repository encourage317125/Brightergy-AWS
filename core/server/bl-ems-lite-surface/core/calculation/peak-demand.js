"use strict";

var _              = require("lodash");
var calcUtils      = require("./calculator-utils");
var electricDemand = require("./electric-demand");

function convertElectricDemandMaxToPeakFormat(electricResult) {
    var result = {
        dateRange: electricResult.dateRange,
        peakDemandBySources: {},
        peakDemand: electricResult.totalDemand.max,
        lowestDemand: electricResult.totalDemand.min
    };
    _.each(electricResult.demandBySources, function(record, sourceId) {
        result.peakDemandBySources[sourceId] = {
            name: record.name,
            value: record.max
        };
    });
    return result;
}

var loadData = function(clientObject, elementData, isPreloading, finalCallback) {
    var thisDateRange = elementData.dateRange;
    var thisSelection = clientObject.selection;
    var element = electricDemand.initElement(clientObject, elementData);
    if (!element) {
        return;
    }

    electricDemand.calculateHistory(element, clientObject, function(err, data) {
        if (err) {
            return element.ans.error(err);
        }

        if (!isPreloading && calcUtils.isSameElementSettings(
                thisDateRange,
                elementData.dateRange,
                thisSelection,
                clientObject.selection)
        ) {
            var peakDemandData = convertElectricDemandMaxToPeakFormat(data);
            elementData.savedResult = data;
            elementData.isHistoricalDataLoaded = true;
            element.ans.send(peakDemandData);
        }

        if (finalCallback) {
            finalCallback();
        }
    });
};


var processKinesisResponse = function(recordsArray, peakDemandData, clientObject) {
    if (!peakDemandData.isHistoricalDataLoaded) {
        return;
    }
    var interval = electricDemand._calculateInterval(peakDemandData.dateRange, null, clientObject.dateTimeUtils);
    if(interval.mode === electricDemand.MODES.HISTORY) {
        return;
    }

    peakDemandData.savedResult.totalDemand.last = 0;
    peakDemandData.savedResult.totalDemand.sum = 0;
    peakDemandData.savedResult.totalDemand.min = 0;
    peakDemandData.savedResult.totalDemand.max = 0;
    _.each(peakDemandData.savedResult.demandBySources, function(source, sourceId) {
        peakDemandData.savedResult.demandBySources[sourceId].last = 0;
    });

    var nodeList = clientObject.nodeList;
    var response = {
        dateRange: peakDemandData.savedResult.dateRange,
        peakDemandBySources: {},
        peakDemand: 0,
        lowestDemand: 0
    };

    var mainChartMap = {};

    _.each(recordsArray, function (record) {
        var device = record.device.trim();

        var facilityId = nodeList[device].facilityId; // find facility by inverter
        var electricDemandMetricId = nodeList[device].electricDemandMetricId;
        var thisVal = record.values[electricDemandMetricId] / 1000 || 0;

        var segmentId = facilityId;

        if(!mainChartMap[segmentId]) {
            mainChartMap[segmentId] = {
                data: []
            };
        }

        if (mainChartMap[segmentId].data.length === 0) {
            //add new value
            mainChartMap[segmentId].data.push(thisVal);
        } else {
            //increase existing value
            mainChartMap[segmentId].data[0] += thisVal;
        }

        peakDemandData.savedResult.demandBySources[segmentId].sum += thisVal;
        peakDemandData.savedResult.demandBySources[segmentId].last = thisVal;
    });

    _.each(peakDemandData.savedResult.demandBySources, function(source, sourceId) {
        peakDemandData.savedResult.totalDemand.last += source.last;
        peakDemandData.savedResult.totalDemand.sum += source.sum;

        peakDemandData.savedResult.demandBySources[sourceId].min =
            _.min([mainChartMap[sourceId].data[0], peakDemandData.savedResult.demandBySources[sourceId].min]);
        peakDemandData.savedResult.demandBySources[sourceId].max =
            _.max([mainChartMap[sourceId].data[0], peakDemandData.savedResult.demandBySources[sourceId].max]);

        peakDemandData.savedResult.totalDemand.min += peakDemandData.savedResult.demandBySources[sourceId].min;
        peakDemandData.savedResult.totalDemand.max += peakDemandData.savedResult.demandBySources[sourceId].max;

        response.peakDemandBySources[sourceId] = {
            name: peakDemandData.savedResult.demandBySources[sourceId].max,
            value: peakDemandData.savedResult.demandBySources[sourceId].name
        };
    });

    response.peakDemand = peakDemandData.savedResult.totalDemand.max;
    response.lowestDemand = peakDemandData.savedResult.totalDemand.min;

    peakDemandData.clientAnswer.send(response);
};

module.exports.loadData = loadData;
// for UT
module.exports.processKinesisResponse = processKinesisResponse;

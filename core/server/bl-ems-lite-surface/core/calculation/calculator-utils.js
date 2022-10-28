"use strict";

var _      = require("lodash");
var moment = require("moment");
var consts = require("../../../libs/consts");

function getTempoIQParametersByUserSources(firstLoading, originalEMSTags, selectedSources, cachedSources) {
    var i = 0;
    var j = 0;
    var k = 0;
    var emsTags = _.cloneDeep(originalEMSTags.facilities);
    var emsThermostats = _.cloneDeep(originalEMSTags.thermostatList);
    var selectedFacilitiesId = selectedSources.selectedFacilities,
        selectedScopesId = selectedSources.selectedScopes,
        selectedNodesId = selectedSources.selectedNodes,
        selectedThermostatsId = selectedSources.selectedThermostats;

    var firstSelectedSources = {
        selectedFacilities: [],
        selectedScopes: [],
        selectedNodes: [],
        selectedThermostats: []
    };

    if (firstLoading) {
        //use only selected sources
        emsTags = _.filter(emsTags, function(facility) {
            return facility.selected;
        });

        emsThermostats = _.filter(emsThermostats, function(thermostat) {
            return thermostat.selected;
        });

        for (i = 0; i < emsTags.length;i++) {
            emsTags[i].scopes = _.filter(emsTags[i].scopes, function(scope) {
                return scope.selected;
            });// jshint ignore:line

            for (j = 0; j < emsTags[i].scopes.length; j++) {
                emsTags[i].scopes[j].nodes = _.filter(emsTags[i].scopes[j].nodes, function (node) {
                    return node.selected;
                });// jshint ignore:line
            }
        }

        if (cachedSources && cachedSources.selectedFacilities) {
            firstSelectedSources.selectedFacilities = cachedSources.selectedFacilities;
        }
        if (cachedSources && cachedSources.selectedScopes) {
            firstSelectedSources.selectedScopes = cachedSources.selectedScopes;
        }
        if (cachedSources && cachedSources.selectedNodes) {
            firstSelectedSources.selectedNodes = cachedSources.selectedNodes;
        }
        if (cachedSources && cachedSources.selectedThermostats) {
            firstSelectedSources.selectedThermostats = cachedSources.selectedThermostats;
        }
    }

    //filter sources by selected Id
    var scopeCountOfSelectedFacilities = 0,
        nodeCountOfSSelectedFacilities = 0;

    if (selectedFacilitiesId && selectedFacilitiesId.length && selectedFacilitiesId.length > 0) {
        emsTags = _.filter(emsTags, function(facility) {
            return selectedFacilitiesId.indexOf(facility.id) > -1;
        });
    }

    if (selectedScopesId && selectedScopesId.length && selectedScopesId.length > 0) {
        for (i = 0; i < emsTags.length;i++) {
            scopeCountOfSelectedFacilities += emsTags[i].scopes.length;
            emsTags[i].scopes = _.filter(emsTags[i].scopes, function(scope) {
                return selectedScopesId.indexOf(scope.id) > -1;
            });// jshint ignore:line
        }
    }

    if (selectedNodesId && selectedNodesId.length && selectedNodesId.length > 0) {
        for (i = 0; i < emsTags.length;i++) {
            for (j = 0; j < emsTags[i].scopes.length; j++) {
                nodeCountOfSSelectedFacilities += emsTags[i].scopes[j].nodes.length;
                emsTags[i].scopes[j].nodes = _.filter(emsTags[i].scopes[j].nodes, function(node) {
                    return selectedNodesId.indexOf(node.id) > -1;
                });// jshint ignore:line
            }
        }
    }

    if (selectedThermostatsId && selectedThermostatsId.length && selectedThermostatsId.length > 0) {
        emsThermostats = _.filter(emsThermostats, function(thermostat) {
            return selectedThermostatsId.indexOf(thermostat.id) > -1;
        });
    }

    var isExpanded = !firstLoading && (
        (selectedScopesId && selectedScopesId.length > 0 && selectedScopesId.length < scopeCountOfSelectedFacilities) ||
        (selectedNodesId && selectedNodesId.length > 0 && selectedNodesId.length < nodeCountOfSSelectedFacilities)
    );

    if (!isExpanded) {
        //we use only facility, so we should use only supply and thermostat nodes
        for (i = 0; i < emsTags.length;i++) {
            for (j = 0; j < emsTags[i].scopes.length; j++) {
                emsTags[i].scopes[j].nodes = _.filter(emsTags[i].scopes[j].nodes, function(node) {
                    return node.nodeType === consts.NODE_TYPE.Supply || node.nodeType === consts.NODE_TYPE.Thermostat;
                });// jshint ignore:line
            }
        }
    }

    var nodesSelection = [];
    var nodeList =  {};
    var nodeArray = [];
    var facilitiesList = {};
    var metricId = [];
    var electricDemandMetricId = [];

    //build internal arrays
    for (i = 0; i < emsTags.length;i++) {

        var facilityObj = {
            name: emsTags[i].name,
            displayName: emsTags[i].displayName || emsTags[i].name,
            scopes: {},
            lastReportedValue: 0,
            lastReportedTime: null,
            maxValueHistorical: 0,
            maxValueCurrentDay: 0,
            minValueCurrentDay: 0,
            percent: 0,
            trend: null,
            billingInterval: emsTags[i].billingInterval || 30
        };

        for (j = 0; j < emsTags[i].scopes.length; j++) {
            facilityObj.scopes[emsTags[i].scopes[j].id] = {
                name: emsTags[i].scopes[j].name,
                displayName: emsTags[i].scopes[j].displayName || emsTags[i].scopes[j].name,
                lastReportedValue: 0,
                lastReportedTime: null,
                maxValueHistorical: 0,
                maxValueCurrentDay: 0,
                minValueCurrentDay: 0,
                percent: 0,
                nodes: {},
                trend: null
            };

            for (k = 0; k < emsTags[i].scopes[j].nodes.length; k++) {
                facilityObj.scopes[emsTags[i].scopes[j].id].nodes[emsTags[i].scopes[j].nodes[k].id] = {
                    name: emsTags[i].scopes[j].nodes[k].name,
                    nodeId: emsTags[i].scopes[j].nodes[k].nodeId,
                    displayName: emsTags[i].scopes[j].nodes[k].displayName || emsTags[i].scopes[j].nodes[k].name,
                    lastReportedValue: 0,
                    lastReportedTime: null,
                    maxValueHistorical: 0,
                    maxValueCurrentDay: 0,
                    minValueCurrentDay: 0,
                    percent: 0,
                    trend: null
                };

                if (emsTags[i].scopes[j].nodes[k].nodeType !== consts.NODE_TYPE.Thermostat) {
                    nodesSelection.push(
                        {
                            "key": emsTags[i].scopes[j].nodes[k].nodeId
                        }
                    );

                    if (emsTags[i].scopes[j].nodes[k].powerMetricId) {
                        metricId.push(emsTags[i].scopes[j].nodes[k].powerMetricId);
                    }
                    if (emsTags[i].scopes[j].nodes[k].electricDemandMetricId) {
                        electricDemandMetricId.push(emsTags[i].scopes[j].nodes[k].electricDemandMetricId);
                    }
                    if (emsTags[i].scopes[j].nodes[k].tempMetricID) {
                        metricId.push(emsTags[i].scopes[j].nodes[k].tempMetricID);
                    }
                }

                nodeList[emsTags[i].scopes[j].nodes[k].nodeId] = {
                    facilityName: emsTags[i].name,
                    facilityDisplayName: emsTags[i].displayName || emsTags[i].name,
                    facilityId: emsTags[i].id,
                    scopeName: emsTags[i].scopes[j].nodes[k].scopeName ,
                    scopeDisplayName: emsTags[i].scopes[j].displayName || emsTags[i].scopes[j].nodes[k].scopeName,
                    nodeName: emsTags[i].scopes[j].nodes[k].name,
                    nodeDisplayName: emsTags[i].scopes[j].nodes[k].displayName || emsTags[i].scopes[j].nodes[k].name,
                    rate: emsTags[i].scopes[j].nodes[k].rate,
                    deviceOffset: emsTags[i].scopes[j].nodes[k].deviceOffset,
                    powerMetricId: emsTags[i].scopes[j].nodes[k].powerMetricId || null,
                    electricDemandMetricId: emsTags[i].scopes[j].nodes[k].electricDemandMetricId || null,
                    dateTimeFormat: emsTags[i].scopes[j].dateTimeFormat,
                    id: emsTags[i].scopes[j].nodes[k].id,
                    scopeId: emsTags[i].scopes[j].id
                };

                nodeArray.push(emsTags[i].scopes[j].nodes[k].nodeId);
            }
        }

        facilitiesList[emsTags[i].id] = facilityObj;
    }

    //add thermostat Id to array for kinesis
    /*for(i=0; i < emsThermostats.length;i++) {
        nodeArray.push(emsThermostats[i].nodeId);
    }*/

    metricId = _.uniq(metricId);
    electricDemandMetricId = _.uniq(electricDemandMetricId);

    var sensors = _.map(metricId, function(id) {
        return {
            "key": id
        };
    });
    var electricDemandSensors = _.map(electricDemandMetricId, function(id) {
        return {
            "key": id
        };
    });

    var selection = {
        "devices": {
            "or": nodesSelection
        },
        "sensors": {
            "or": sensors
        }
    };
    var electricDemandSelection = {
        "devices": {
            "or": nodesSelection
        },
        "sensors": {
            "or": electricDemandSensors
        }
    };

    return {
        selection: selection,
        electricDemandSelection: electricDemandSelection,
        nodeList: nodeList,
        nodeArray: nodeArray,
        facilitiesList: facilitiesList,
        firstSelectedSources: firstSelectedSources
    };
}

function setDateToMidnight(date) {
    date.hour(0).minute(0).second(0).millisecond(0);
    return date;
}

function addHighchartsSeriesPerSource(nodeList, isOneFacility, highchartsObj) {
    var addedSeries = [];//stores name of added series
    for (var nodeId in nodeList) {
        if (nodeList[nodeId]) {
            var name = isOneFacility ? nodeList[nodeId].scopeName: nodeList[nodeId].facilityName;
            var sourceId = isOneFacility ? nodeList[nodeId].scopeId: nodeList[nodeId].facilityId;

            if (addedSeries.indexOf(sourceId) < 0) {
                //name not added
                addedSeries.push(sourceId);
                highchartsObj.series.push({
                    name: name,
                    sourceId: sourceId,
                    data: []
                });
            }
        }
    }
}

function isThermostatKinesisData(record) {
    return record && record.type && record.type.toLowerCase().indexOf("thermostat") > -1;
}

/**
 * transform kinesis record to tempoiq object
 */
var kinesisToTempoIQ = function(kinesisRecord, nodeList) {
    var values = {};
    values[kinesisRecord.device] = {};
    if (nodeList[kinesisRecord.device] &&
        nodeList[kinesisRecord.device].powerMetricId &&
        !_.isUndefined(kinesisRecord.values[nodeList[kinesisRecord.device].powerMetricId])) {
        var metricId = nodeList[kinesisRecord.device].powerMetricId;
        values[kinesisRecord.device][metricId] = kinesisRecord.values[metricId];
    }
    return {
        ts: kinesisRecord.ts,
        values: values
    };
};

/* transform a list of kinesis records to tempoiq objects */
function convertKinesisToTempoiq1mAggregated(recordList, nodeList) {

    // aggregate records by 1min first
    var groupedTempoiqRecords = _.chain(recordList)
        // transform each kinesis record to tempoiq record
        .map(function(record) {
            return kinesisToTempoIQ(record, nodeList);
        })
        // group by minute
        .groupBy(function(item) {
            return moment.utc(item.ts).minute();
        })
        // result is "2014-01-01 23:33": [ {ts: 2014-01-01 23:33, values: {"device1": 12}} , {}  etc]
        .value();

    var tempoiqRecords = _.chain(groupedTempoiqRecords)
        // collect values into one
        .mapValues(function(items) {
            return _.reduce(items, function(total, item) {
                return _.merge(total, item);
            }, {});
        })
        .values()
        .sortBy(function(item) {
            return item.ts;
        })
        .value();

    return tempoiqRecords;
}

function isSameElementSettings(usedDateRange, actualDateRange, usedSelection, actualSelection) {
    return usedDateRange === actualDateRange && _.isEqual(usedSelection, actualSelection);
}

function getLastDevicesDataPoint(dataPoints) {
    var devices = _(dataPoints)
        .pluck("device")
        .uniq()
        .value();

    return _.map(devices, function(device) {
        return _(dataPoints)
            .filter({ device: device })
            .last();
    });
}

exports.getTempoIQParametersByUserSources = getTempoIQParametersByUserSources;
exports.setDateToMidnight = setDateToMidnight;
exports.addHighchartsSeriesPerSource = addHighchartsSeriesPerSource;
exports.isThermostatKinesisData = isThermostatKinesisData;
exports.kinesisRecordToTempoiq = kinesisToTempoIQ;
exports.kinesisListToTempoiq1mAggregated = convertKinesisToTempoiq1mAggregated;
exports.isSameElementSettings = isSameElementSettings;
exports.getLastDevicesDataPoint = getLastDevicesDataPoint;

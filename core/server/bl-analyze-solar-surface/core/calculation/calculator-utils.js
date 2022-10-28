"use strict";

var _      = require("lodash");
var moment = require("moment");
var utils  = require("../../../libs/utils");

function getTempoIQParametersByUserSources(firstLoading, originalSolarTags, selectedSources, cachedSources) {
    var i=0;
    var j=0;
    var k=0;
    var solarTags = _.cloneDeep(originalSolarTags.facilities);

    var selectedFacilitiesId = selectedSources.selectedFacilities,
        selectedScopesId = selectedSources.selectedScopes,
        selectedNodesId = selectedSources.selectedNodes;

    var firstSelectedSources = {
        selectedFacilities: [],
        selectedScopes: [],
        selectedNodes: []
    };

    if(firstLoading) {
        //use only selected sources
        solarTags = _.filter(solarTags, function(facility) {
            return facility.selected;
        });

        for(i=0; i < solarTags.length;i++) {
            solarTags[i].scopes = _.filter(solarTags[i].scopes, function(scope) {
                return scope.selected;
            });// jshint ignore:line

            for(j=0; j < solarTags[i].scopes.length; j++) {

                solarTags[i].scopes[j].nodes = _.filter(solarTags[i].scopes[j].nodes, function (node) {
                    return node.selected;
                });// jshint ignore:line
            }
        }

        if(cachedSources && cachedSources.selectedFacilities) {
            firstSelectedSources.selectedFacilities = cachedSources.selectedFacilities;
        }

        if(cachedSources && cachedSources.selectedScopes) {
            firstSelectedSources.selectedScopes = cachedSources.selectedScopes;
        }

        if(cachedSources && cachedSources.selectedNodes) {
            firstSelectedSources.selectedNodes = cachedSources.selectedNodes;
        }
    }

    //filter sources by selected Id
    if(selectedFacilitiesId && selectedFacilitiesId.length && selectedFacilitiesId.length > 0) {
        solarTags = _.filter(solarTags, function(facility) {
            return selectedFacilitiesId.indexOf(facility.id) > -1;
        });
    }

    if(selectedScopesId && selectedScopesId.length && selectedScopesId.length > 0) {
        for(i=0; i < solarTags.length;i++) {
            solarTags[i].scopes = _.filter(solarTags[i].scopes, function(scope) {
                return selectedScopesId.indexOf(scope.id) > -1;
            });// jshint ignore:line
        }
    }

    if(selectedNodesId && selectedNodesId.length && selectedNodesId.length > 0) {
        for(i=0; i < solarTags.length;i++) {
            for(j=0; j < solarTags[i].scopes.length; j++) {
                solarTags[i].scopes[j].nodes = _.filter(solarTags[i].scopes[j].nodes, function(node) {
                    return selectedNodesId.indexOf(node.id) > -1;
                });// jshint ignore:line
            }
        }
    }

    var nodesSelection = [];
    var nodeList =  {};
    var facilitiesList = {};

    var metricId = [];

    //build internal arrays
    for(i=0; i < solarTags.length;i++) {
        var facilityObj = {
            name: solarTags[i].name,
            id: solarTags[i].id,
            sourceId: solarTags[i].id,
            displayName: solarTags[i].displayName || solarTags[i].name,
            scopes: {},
            lastReportedValue: 0,
            lastReportedTime: null,
            //firstReportedValue: 0,
            firstReportedTime: solarTags[i].commissioningDate,
            //maxValue: 0,
            //minValue: 0,
            totalEnergyGenerated: 0,
            percent: 0,
            trend: null,
            potentialPower: solarTags[i].potentialPower,
            facilityImage: solarTags[i].image,
            constEmissionFactor: solarTags[i].constEmissionFactor
        };

        for(j=0; j < solarTags[i].scopes.length; j++) {

            facilityObj.scopes[solarTags[i].scopes[j].id] = {
                name: solarTags[i].scopes[j].name,
                id: solarTags[i].scopes[j].id,
                sourceId: solarTags[i].scopes[j].id,
                displayName: solarTags[i].scopes[j].displayName || solarTags[i].scopes[j].name,
                lastReportedValue: 0,
                lastReportedTime: null,
                //firstReportedValue: 0,
                firstReportedTime: solarTags[i].scopes[j].commissioningDate,
                //maxValue: 0,
                //minValue: 0,
                totalEnergyGenerated: 0,
                percent: 0,
                trend: null,
                nodes: {}
            };

            // alias
            var scopeObj = facilityObj.scopes[solarTags[i].scopes[j].id];

            for(k=0; k < solarTags[i].scopes[j].nodes.length; k++) {

                scopeObj.nodes[solarTags[i].scopes[j].nodes[k].nodeId] = {
                    id: solarTags[i].scopes[j].nodes[k].id,
                    sourceId: solarTags[i].scopes[j].nodes[k].id,
                    name: solarTags[i].scopes[j].nodes[k].name,
                    displayName: solarTags[i].scopes[j].nodes[k].displayName || solarTags[i].scopes[j].nodes[k].name,
                    rate: solarTags[i].scopes[j].nodes[k].rate,
                    //deviceOffset: solarTags[i].scopes[j].nodes[k].deviceOffset,
                    powerMetricId: solarTags[i].scopes[j].nodes[k].powerMetricId,
                    lastReportedValue: 0,
                    lastReportedTime: null,
                    totalEnergyGenerated: 0,
                    firstReportedTime: solarTags[i].scopes[j].nodes[k].commissioningDate,
                    percent: 0,
                    trend: null
                };

                nodesSelection.push(
                    {
                        "key": solarTags[i].scopes[j].nodes[k].nodeId
                    }
                );

                nodeList[solarTags[i].scopes[j].nodes[k].nodeId] = {
                    id: solarTags[i].scopes[j].nodes[k].id,
                    sourceId: solarTags[i].scopes[j].nodes[k].id,
                    facilityName: solarTags[i].displayName || solarTags[i].name,
                    facilityId: solarTags[i].id,
                    scopeName: solarTags[i].scopes[j].nodes[k].scopeName,
                    scopeId: solarTags[i].scopes[j].id,
                    rate: solarTags[i].scopes[j].nodes[k].rate,
                    deviceTimeZone: solarTags[i].scopes[j].nodes[k].deviceTimeZone,
                    powerMetricId: solarTags[i].scopes[j].nodes[k].powerMetricId
                };

                if(solarTags[i].scopes[j].nodes[k].powerMetricId) {
                    metricId.push(solarTags[i].scopes[j].nodes[k].powerMetricId);
                }
            }
        }

        facilitiesList[solarTags[i].id] = facilityObj;
    }

    metricId = _.uniq(metricId);

    var sensors = _.map(metricId, function(id) {
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

    return {
        selection: selection,
        nodeList: nodeList,
        facilitiesList: facilitiesList,
        firstSelectedSources: firstSelectedSources
    };
}

function addHighchartsSeriesPerSource(nodeList, isOneFacility, highchartsObj) {
    var addedSeries = [];//stores name of added series
    for(var nodeId in nodeList) {
        if(nodeList[nodeId]) {

            var name = isOneFacility ? nodeList[nodeId].scopeName: nodeList[nodeId].facilityName;
            var sourceId = isOneFacility ? nodeList[nodeId].scopeId: nodeList[nodeId].facilityId;

            if(addedSeries.indexOf(sourceId) < 0) {
                //name not added
                addedSeries.push(sourceId);
                highchartsObj.series.push({
                    name: name,
                    data: [],
                    sourceId: sourceId
                });
            }
        }
    }
}

function getDeviceTimeZoneByNodeList(nodeList, viewerTZOffset) {
    var nodeIds = Object.keys(nodeList);
    if(nodeIds.length > 0 && nodeList[nodeIds[0]].deviceTimeZone) {
        var tz = nodeList[nodeIds[0]].deviceTimeZone;
        return tz;
    } else {
        return null;
    }
}

function setDateToMidnight(date) {
    date.hour(0).minute(0).second(0).millisecond(0);
    return date;
}

function isSameSelection(clientObjectSelection, actualSelection) {
    return _.isEqual(clientObjectSelection, actualSelection);
}

function interpolatePoint(source, destination, leftPoint, rightPointIndex, expectedDiff) {
    var rightPoint = source.dataPoints[rightPointIndex];
    var leftTs = moment.utc(leftPoint.ts);
    var rightTs = moment.utc(rightPoint.ts);

    var tsDiff = rightTs.diff(leftTs, "second");//in minutes
    if(expectedDiff < tsDiff ) {
        //interpolate
        var interpolatedTime = leftTs.clone().add(expectedDiff, "second");

        var interpolatedPoint = {
            ts: interpolatedTime.toISOString(),
            values: {}
        };

        var nodeNames = Object.keys(leftPoint.values);

        _.each(nodeNames, function(nodeName) {
            interpolatedPoint.values[nodeName] = {};
            var metricNames = Object.keys(leftPoint.values[nodeName]);

            _.each(metricNames, function(metricName) {
                var leftVal = leftPoint.values[nodeName][metricName];
                if(rightPoint.values[nodeName]) {
                    var rightVal = rightPoint.values[nodeName][metricName];
                    if (utils.isNumber(leftVal) && utils.isNumber(rightVal)) {

                        interpolatedPoint.values[nodeName][metricName] =
                            utils.getLinearInterpolatedValue(leftTs.unix(), rightTs.unix(), leftVal, rightVal,
                                interpolatedTime.unix());
                    }
                } else {
                    interpolatedPoint.values[nodeName][metricName] = leftVal;
                }
            });
        });

        destination.dataPoints.push(interpolatedPoint);

        interpolatePoint(source, destination, interpolatedPoint, rightPointIndex, expectedDiff);
    } else {
        //interval is the same, just add current point
        destination.dataPoints.push(rightPoint);

        rightPointIndex++;
        //process next point
        if(rightPointIndex < source.dataPoints.length) {
            interpolatePoint(source, destination, rightPoint, rightPointIndex, expectedDiff);
        }
    }
}

//use linear interpolation
function interepolateTempoiqResponse(tempoiResults, expectedDiff) {

    if(tempoiResults.dataPoints.length > 1) {
        //more than 2 points
        var results = {
            dataPoints: [tempoiResults.dataPoints[0]]
        };
        interpolatePoint(tempoiResults, results, tempoiResults.dataPoints[0], 1, expectedDiff);
        return results;
    }

    return tempoiResults;
}

exports.getTempoIQParametersByUserSources = getTempoIQParametersByUserSources;
exports.addHighchartsSeriesPerSource = addHighchartsSeriesPerSource;
exports.setDateToMidnight = setDateToMidnight;
exports.getDeviceTimeZoneByNodeList = getDeviceTimeZoneByNodeList;
exports.isSameSelection = isSameSelection;
exports.interepolateTempoiqResponse = interepolateTempoiqResponse;

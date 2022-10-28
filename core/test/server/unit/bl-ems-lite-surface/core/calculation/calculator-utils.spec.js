/* jshint expr: true */
/* jshint -W079 */

"use strict";

const serverRoot = '../../../../../../server';

var mongoose  = require('mongoose');
var chai      = require('chai');
var expect    = chai.expect;
var sinon     = require('sinon');
var calcUtils = require(serverRoot + '/bl-ems-lite-surface/core/calculation/calculator-utils.js');
chai.use(require('sinon-chai'));

describe('calculatorUtils', function () {
    describe("getTempoIQParametersByUserSources", function() {
        var solarTags = {
            "facilities": [
                {
                    "id": "549012531e94a8881e6e8e54",
                    "name": "Enphase Facility",
                    "scopes": [
                        {
                            "id": "54902ef4ba2ca1141e4afd74",
                            "name": "Envoy_4",
                            "potentialPower": 0,
                            "nodes": [
                                {
                                    "scopeName": "Envoy_4",
                                    "nodeId": "Envoy:406326",
                                    "rate": 0,
                                    "deviceOffset": -360,
                                    "powerMetricId": "Pac",
                                    "nodeType": "Supply"
                                }
                            ]
                        }
                    ],
                    "potentialPower": 1
                }
            ],
            "geo": {
                "latitude": 38.53724,
                "longitude": -90.273231
            },
            "thermostatList": [{
                id: "111",
                "selected": true,
                "scopeName": "GEM_1",
                "nodeId": "tempId1",
                "rate": 0,
                "deviceOffset": -360,
                "powerMetricId": "Pac",
                "nodeType": "Thermostat"
            }, {
                id: "222",
                "scopeName": "GEM_1",
                "nodeId": "tempId2",
                "rate": 0,
                "deviceOffset": -360,
                "powerMetricId": "Pac",
                "nodeType": "Thermostat"
            }]
        };

        var emptySources = {
            selectedFacilities: [],
            selectedScopes: [],
            selectedNodes: [],
            selectedThermostats: ["222"]
        };

        it('should filter sources tempoiq response', function () {
            var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags, emptySources);
            var nodeKeys = Object.keys(tmp.nodeList);
            expect(nodeKeys.length).to.equal(1);

            expect(tmp.nodeArray.indexOf("tempId1") > -1).to.equal(false);
            expect(tmp.nodeArray.indexOf("tempId2") > -1).to.equal(false);
        });
    });

    describe("kinesisRecordToTempoiq", function() {
        it("should correctly convert kinesis to tempoiq", function() {
            var kinesis = {
                ts: "2015-06-03T13:12:00.0Z",
                device: "node1",
                type: "GEM",
                values: {
                    "W": 400,
                    "A": 300
                }
            };

            var nodeList = {
                "node1": {
                    "powerMetricId": "W"
                }
            };

            var res = calcUtils.kinesisRecordToTempoiq(kinesis, nodeList);
            expect(res).deep.equal({
                "ts": "2015-06-03T13:12:00.0Z",
                "values": {
                    "node1": {
                        "W": 400
                    }
                }
            });
        });
    });

    describe("isSameElementSettings", function() {
        it("should return correct value for isSameElementSettings", function() {
            expect(calcUtils.isSameElementSettings("test", "test", {}, {})).to.equal(true);
            expect(calcUtils.isSameElementSettings("test", "test", {aaa: "bbb"}, {aaa: "bbb"})).to.equal(true);
            expect(calcUtils.isSameElementSettings("test", "test", {}, {devices: {}})).to.equal(false);
            expect(calcUtils.isSameElementSettings("test", "test1", {}, {})).to.equal(false);
        });
    });

    describe("getLastDevicesDataPoint", function() {
        function test(dataPoints, expected) {
            var actual = calcUtils.getLastDevicesDataPoint(dataPoints);
            expect(actual).eql(expected);
        }

        it("should return empty array when dataPoints is empty", function() {
            var dataPoints = [];
            var expected = [];

            test(dataPoints, expected);
        });

        it("should return last point for device when dataPoints contains only one device", function() {
            var dataPoints = [
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 691.45, "ED":422 }},
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 692.45, "ED":423 }}
            ]
            var expected = [
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 692.45, "ED":423 }}
            ];

            test(dataPoints, expected);
        });

        it("should return last point for device when dataPoints contains two devices", function() {
            var dataPoints = [
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 691.45, "ED":422 }},
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 691.45, "ED":422 }},
                { "device": "egauge17983:Grid", "type": "eGauge", "values": { "W": 321.12, "ED":341 }},
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 692.45, "ED":423 }}
            ]
            var expected = [
                { "device": "egauge17984:Grid", "type": "eGauge", "values": { "W": 692.45, "ED":423 }},
                { "device": "egauge17983:Grid", "type": "eGauge", "values": { "W": 321.12, "ED":341 }}
            ];

            test(dataPoints, expected);
        });
    });
});

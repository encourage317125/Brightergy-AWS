"use strict";

const serverRoot = "../../../../../server";

var chai      = require("chai");
var expect    = chai.expect;
var calcUtils = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/calculator-utils");
chai.use(require("sinon-chai"));

describe("calculator-utils", function () {
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
                                "powerMetricId": "Pac"
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
        }
    };

    var emptySources = {
        selectedFacilities: [],
        selectedScopes: [],
        selectedNodes: []
    };

    it("should filter sources tempoiq response", function () {
        var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags, emptySources);
        var nodeKeys = Object.keys(tmp.nodeList);
        expect(nodeKeys.length).to.equal(1);
    });


    it("should return the displayName equals to name if not displayName difined", function() {
        var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags, emptySources);
        expect(tmp.facilitiesList["549012531e94a8881e6e8e54"].name).equals("Enphase Facility");
        expect(tmp.facilitiesList["549012531e94a8881e6e8e54"].displayName).equals("Enphase Facility");
        var scopes = tmp.facilitiesList["549012531e94a8881e6e8e54"].scopes;
        expect(scopes).has.property("54902ef4ba2ca1141e4afd74");
        expect(scopes["54902ef4ba2ca1141e4afd74"].name).equals("Envoy_4");
        expect(scopes["54902ef4ba2ca1141e4afd74"].displayName).equals("Envoy_4");
    });


    it("should return given displayName if defined", function() {
        solarTags.facilities[0].displayName = "aaa";
        solarTags.facilities[0].scopes[0].displayName = "bbb";
        var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags, emptySources);
        expect(tmp.facilitiesList["549012531e94a8881e6e8e54"].displayName).equals("aaa");
        var scopes = tmp.facilitiesList["549012531e94a8881e6e8e54"].scopes;
        expect(scopes["54902ef4ba2ca1141e4afd74"].displayName).equals("bbb");
    });

    it("should test equivalencies selection", function() {
        expect(calcUtils.isSameSelection({}, {})).equals(true);
        expect(calcUtils.isSameSelection({}, {fake: true})).equals(false);
    });

    var tempoiqData = {
        "dataPoints": [{
            "ts": "2015-09-18T00:00:00.000Z",
            "values": {
                "Envoy:310950": {
                    "powr": 100
                },
                "WR7KU020:2002263788": {
                    "Pac": 2000
                }
            }
        }, {
            "ts": "2015-09-18T00:15:00.000Z",
            "values": {
                "Envoy:310950": {
                    "powr": 200
                }
            }
        }, {
            "ts": "2015-09-18T00:30:00.000Z",
            "values": {
                "Envoy:310950": {
                    "powr": 300
                },
                "WR7KU020:2002263788": {
                    "Pac": 4000
                }
            }
        }]
    };

    it("should cinterpolate tempoiq response by 5 min", function() {

        var interpolatedInterval = 300;//5 min
        var interpolated = calcUtils.interepolateTempoiqResponse(tempoiqData, interpolatedInterval);

        expect(interpolated.dataPoints.length).equals(7);
        expect(interpolated.dataPoints[0].ts).equals("2015-09-18T00:00:00.000Z");
        expect(interpolated.dataPoints[1].ts).equals("2015-09-18T00:05:00.000Z");
        expect(interpolated.dataPoints[2].ts).equals("2015-09-18T00:10:00.000Z");
        expect(interpolated.dataPoints[3].ts).equals("2015-09-18T00:15:00.000Z");
        expect(interpolated.dataPoints[4].ts).equals("2015-09-18T00:20:00.000Z");
        expect(interpolated.dataPoints[5].ts).equals("2015-09-18T00:25:00.000Z");
        expect(interpolated.dataPoints[6].ts).equals("2015-09-18T00:30:00.000Z");

        expect(Math.round(interpolated.dataPoints[1].values["Envoy:310950"]["powr"])).equals(133);
    });
});

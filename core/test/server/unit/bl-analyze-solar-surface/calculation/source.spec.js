"use strict";

const serverRoot = "../../../../../server";

var chai        = require("chai");
var expect      = chai.expect;
var sourcesCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/sources");
chai.use(require("sinon-chai"));

describe("source", function () {
    it("should filter sources tempoiq response", function () {
        var tempoIResponse = {
            "dataPoints": [
                {
                    "ts": "2001-01-07T19:30:25.000Z",
                    "values": {
                        "WR7KU020:2007305255": {
                            "Pac": 43.441441
                        }
                    }
                }
            ],
            "selection": {
                "devices": {
                    "or": [
                        {
                            "key": "WR7KU020:2007305255"
                        }
                    ]
                },
                "sensors": {
                    "or": [
                        {
                            "key": "Pac"
                        },
                        {
                            "key": "powr"
                        },
                        {
                            "key": "W"
                        }
                    ]
                }
            }
        };

        var nodeList = {
            "WR7KU020:2007305255": {
                deviceOffset: -360,
                facilityId: "facility12345",
                facilityName: "facilityA",
                rate: 0,
                scopeId: "scope12345",
                scopeName: "scopeA"
            }
        };

        var storage = {
            "facility12345": {
                firstReportedTime: null,
                firstReportedValue: 0,
                lastReportedTime: null,
                lastReportedValue: 0,
                maxValue: 0,
                minValue: 0,
                scopes: {
                    "scope12345": {
                        firstReportedTime: null,
                        firstReportedValue: 0,
                        lastReportedTime: null,
                        lastReportedValue: 0,
                        maxValue: 0,
                        minValue: 0,
                        nodes: {
                            "WR7KU020:2007305255": {
                                rate: 0
                            }
                        }
                    }
                }
            }
        };

        sourcesCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, "firstReportedTime", "firstReportedValue");
        expect(storage["facility12345"].firstReportedValue).to.equal(43.441441 / 1000);
    });
});

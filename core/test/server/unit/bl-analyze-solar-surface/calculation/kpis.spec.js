"use strict";

const serverRoot = "../../../../../server";

var chai          = require("chai");
var expect        = chai.expect;
var moment        = require("moment");
var kpiEnergyCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/kpis");
chai.use(require("sinon-chai"));

describe("kpis", function () {
    it("should filter kW tempoiq response", function () {
        var tempoIResponse = {
            "dataPoints": [
                {
                    "ts": "2015-03-14T19:30:25.000Z",
                    "values": {
                        "WR7KU020:2007305255": {
                            "Pac": 1200
                        }
                    }
                },
                {
                    "ts": moment.utc().add(-2, "hour").toISOString(),
                    "values": {
                        "WR7KU020:2007305255": {
                            "Pac": 800
                        }
                    }
                },
                {
                    "ts": moment.utc().toISOString(),
                    "values": {
                        "WR7KU020:2007305255": {
                            "Pac": 1800
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
                            "key": "Wh"
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
                scopeName: "scopeA"
            }
        };

        var storage = {
            currentPower : 0,
            currentDayPower: 0
        };


        kpiEnergyCalc.processPowerTempoIQResponse(tempoIResponse, nodeList, storage, false);
        expect(storage.currentPower).to.equal(1.8);
    });
});

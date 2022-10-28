"use strict";

const serverRoot = "../../../../../server";

var chai        = require("chai");
var expect      = chai.expect;
var tableCalc   = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/table-chart-calculator");
chai.use(require("sinon-chai"));

describe("table-chart-calculator", function () {
    it("should filter table tempoiq response", function () {
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
                scopeName: "scopeA"
            }
        };

        var storage = {
            table: []
        };

        tableCalc.processTempoIQResponse(tempoIResponse, nodeList, storage);

        expect(storage.table.length).to.equal(1);
        expect(storage.table[0].totalPerPeriod).to.equal(43.441441 / 1000);
        expect(storage.table[0].percent).to.equal(100);
    });
});

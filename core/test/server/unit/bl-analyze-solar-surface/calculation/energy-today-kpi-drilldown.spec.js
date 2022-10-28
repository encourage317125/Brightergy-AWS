"use strict";

const serverRoot = "../../../../../server";

var _                           = require("lodash");
var chai                        = require("chai");
var expect                      = chai.expect;
var energyTodayKPIDrilldownCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/energy-today-kpi-drilldown");
chai.use(require("sinon-chai"));

describe("energy-today-kpi-drilldown", function () {
    it("should filter solar generation candelstick tempoiq response", function () {
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
            totalProduction: 0,
            totalProductionBySources: {},
            energy : {
                categories: ["2001-01-07T19:30:25.000Z", "2001-01-07T20:30:25.000Z"],
                series: [{
                    type: "column",
                    name: "Today Energy",
                    data: [0, 0]
                }]
            },
            power : {
                categories: ["2001-01-07T19:30:25.000Z", "2001-01-07T19:35:25.000Z"],
                series: [{
                    type: "spline",
                    name: "Current Power",
                    data: [0, 0]
                }]
            },
            addCategoryData: function(chartType, categoryName, periodVal) {
                var chart = chartType === "energy"? this.energy: this.power;
                var index = _.indexOf(chart.categories, categoryName);
                if (index < 0) {
                    throw new Error("logic error for solarEnergyGeneration, no such category: " +
                        categoryName + " inside: " + JSON.stringify(chart.categories));
                }
                chart.series[0].data[index] = periodVal;
            }
        };

        energyTodayKPIDrilldownCalc.processTempoIQResponse(tempoIResponse, storage, "energy", nodeList, true, true);

        expect(storage.energy.series[0].data.length).to.equal(2);
        expect(storage.energy.series[0].data[0]).to.equal(43.441441 / 1000);
        expect(storage.energy.series[0].data[1]).to.equal(0);
    });
});

"use strict";

const serverRoot = "../../../../../server";

var chai            = require("chai");
var expect          = chai.expect;
var moment          = require("moment");
var sinon           = require("sinon");
var DateTimeUtils   = require(serverRoot + "/libs/date-time-utils");
var solarEnergyCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/solar-energy-generation-calculator");
chai.use(require("sinon-chai"));

describe("solar-energy-generation-calculator", function () {
    describe("calculateData", function() {
        var tempoIResponse = {
            "dataPoints": [
                {
                    "ts": "2001-01-01T00:00:00.000Z",
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

        it("should not send SEG response", function () {
            var socket = { emit: function(event, repsponse) {} };

            var clientObj = {
                socket: socket,
                solarEnergyGeneration: {
                    dateRange: "month",
                    year: null,
                    month: null
                },
                nodeList: nodeList,
                selection: {},
                dateTimeUtils: new DateTimeUtils(null)
            };
            var queryOptions = {
                dateRange: "year",
                selectedMonth: null,
                selectedYear: null,
                selection: {},
                isPreloading: false,
                originalRange: { start: moment.utc("2001-01-01"), end: moment.utc("2002-01-01") },
                dimension: "1month"
            };

            sinon.stub(socket, "emit", function(event, socketResponse) {
                return socketResponse;
            });

            solarEnergyCalc.calculateData(clientObj, tempoIResponse, queryOptions);
            expect(clientObj.socket.emit.notCalled).equals(true);
        });

        it("should send SEG response", function () {
            var socket = { emit: function(event, repsponse) {} };

            var clientObj = {
                socket: socket,
                solarEnergyGeneration: {
                    dateRange: "month",
                    year: null,
                    month: null
                },
                nodeList: nodeList,
                selection: {},
                dateTimeUtils: new DateTimeUtils(null)
            };

            var queryOptions = {
                dateRange: "month",
                selectedMonth: null,
                selectedYear: null,
                selection: {},
                isPreloading: false,
                originalRange: { start: moment.utc("2001-01-01"), end: moment.utc("2001-02-01") },
                dimension: "1day"
            };

            sinon.stub(socket, "emit", function(event, socketResponse) {
                expect(socketResponse.success).to.equal(1);
                expect(socketResponse.message.mainChart.series[0].data.length).to.equal(1);
                expect(socketResponse.message.totalProduction).to.equal(43.441441 / 1000);
                return socketResponse;
            });

            solarEnergyCalc.calculateData(clientObj, tempoIResponse, queryOptions);
            expect(clientObj.socket.emit).to.have.been.calledOnce;
            expect(clientObj.socket.emit.notCalled).equals(false);
        });
    });

    describe("processTempoIQResponseCandlestick", function () {
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
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                candlestick: {
                    series: {
                        type: "candlestick",
                        name: "Candlestick Chart",
                        data: []
                    }
                }
            };

            solarEnergyCalc.processTempoIQResponseCandlestick(tempoIResponse, storage, nodeList);

            expect(storage.candlestick.series.data.length).to.equal(1);
            expect(storage.totalProduction).to.equal(43.441441 / 1000);
        });
    });
});

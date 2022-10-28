"use strict";

const serverRoot = "../../../../../server";

var chai         = require("chai");
var expect       = chai.expect;
var realTimeCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/real-time-power-calculator");
chai.use(require("sinon-chai"));

describe("real-time-power", function () {
    describe("_normalizeTempoIQResponse", function() {
        it("should do nothing when only one source is selected", function () {
            var tempoiqData = {
                "dataPoints": [{
                    "ts": "2015-09-18T20:00:00+03:00",
                    "values": {
                        "Envoy:310950": {
                            "powr": 100
                        }
                    }
                }]
            };

            var nodeList = {
                "Envoy:310950": {
                    "id": "55df5a24603d443500d3af5e",
                    "sourceId": "55df5a24603d443500d3af5e",
                    "facilityName": "Ross & Baruzzini",
                    "facilityId": "55d60385c63da8e403d760fe",
                    "scopeName": "Envoy",
                    "scopeId": "55df58b5603d443500d3af5d",
                    "rate": 0.1,
                    "deviceOffset": -300,
                    "powerMetricId": "powr"
                }
            };

            var normalizedData = realTimeCalc._normalizeTempoIQResponse(tempoiqData, nodeList, "1min");

            expect(Object.keys(normalizedData.dataPoints[0].values).length).to.equal(1);
            expect(normalizedData.dataPoints[0].values["Envoy:310950"]["powr"]).to.equal(100);
        });

        it("should interpolate when gap distance is less than 60 mins (for Today dateRange)", function () {
            var tempoiqData = {
                "dataPoints": [{
                    "ts": "2015-09-18T20:00:00+03:00",
                    "values": {
                        "Envoy:310950": {
                            "powr": 100
                        },
                        "WR7KU020:2002263788": {
                            "Pac": 2000
                        }
                    }
                }, {
                    "ts": "2015-09-18T20:05:00+03:00",
                    "values": {
                        "Envoy:310950": {
                            "powr": 200
                        }
                    }
                }, {
                    "ts": "2015-09-18T20:10:00+03:00",
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

            var nodeList = {
                "Envoy:310950": {
                    "id": "55df5a24603d443500d3af5e",
                    "sourceId": "55df5a24603d443500d3af5e",
                    "facilityName": "Ross & Baruzzini",
                    "facilityId": "55d60385c63da8e403d760fe",
                    "scopeName": "Envoy",
                    "scopeId": "55df58b5603d443500d3af5d",
                    "rate": 0.1,
                    "deviceOffset": -300,
                    "powerMetricId": "powr"
                }, "WR7KU020:2002263788": {
                    "id": "55d60385c63da8e403d76100",
                    "sourceId": "55d60385c63da8e403d76100",
                    "facilityName": "Ross & Baruzzini",
                    "facilityId": "55d60385c63da8e403d760fe",
                    "scopeName": "WebBox (Legacy)",
                    "scopeId": "55d60385c63da8e403d760ff",
                    "rate": 0.1,
                    "deviceOffset": -300,
                    "powerMetricId": "Pac"
                }
            };

            var normalizedData = realTimeCalc._normalizeTempoIQResponse(tempoiqData, nodeList, "1min");
            expect(normalizedData.dataPoints[1].values["WR7KU020:2002263788"]["tinker"]).to.equal(3000);
        });

        it("should fill zero when gap distance is more than 60 mins (for Today dateRange)", function () {
            var tempoiqData = {
                "dataPoints": [{
                    "ts": "2015-09-18T20:00:00+03:00",
                    "values": {
                        "Envoy:310950": {
                            "powr": 100
                        },
                        "WR7KU020:2002263788": {
                            "Pac": 2000
                        }
                    }
                }, {
                    "ts": "2015-09-18T20:05:00+03:00",
                    "values": {
                        "Envoy:310950": {
                            "powr": 200
                        }
                    }
                }, {
                    "ts": "2015-09-18T22:00:00+03:00",
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

            var nodeList = {
                "Envoy:310950": {
                    "id": "55df5a24603d443500d3af5e",
                    "sourceId": "55df5a24603d443500d3af5e",
                    "facilityName": "Ross & Baruzzini",
                    "facilityId": "55d60385c63da8e403d760fe",
                    "scopeName": "Envoy",
                    "scopeId": "55df58b5603d443500d3af5d",
                    "rate": 0.1,
                    "deviceOffset": -300,
                    "powerMetricId": "powr"
                }, "WR7KU020:2002263788": {
                    "id": "55d60385c63da8e403d76100",
                    "sourceId": "55d60385c63da8e403d76100",
                    "facilityName": "Ross & Baruzzini",
                    "facilityId": "55d60385c63da8e403d760fe",
                    "scopeName": "WebBox (Legacy)",
                    "scopeId": "55d60385c63da8e403d760ff",
                    "rate": 0.1,
                    "deviceOffset": -300,
                    "powerMetricId": "Pac"
                }
            };

            var normalizedData = realTimeCalc._normalizeTempoIQResponse(tempoiqData, nodeList, "1min");
            expect(normalizedData.dataPoints[1].values["WR7KU020:2002263788"]["tinker"]).to.equal(0);
        });
    });

    describe("processTempoIQResponse", function () {
        it("should filter real time tempoiq response", function () {
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
                totalGeneration: {
                    kw: 0,
                    trend: null
                },
                totalProductionBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                }
            };

            realTimeCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, false);

            expect(storage.totalGeneration.kw).to.equal(43.441441 / 1000);
            expect(storage.mainChart.series[0].data.length).to.equal(1);
        });
    });

    describe("_calculateDiff", function() {
        var getClientObject = function(savedData) {
            return {
                socket: {
                    id: "someId"
                },
                realTimePower: {
                    savedData: savedData
                }
            };
        };

        it("should return new object if old is not exists", function() {
            var newData = {a: 1};
            var diff = realTimeCalc._calculateDiff(newData, getClientObject({}));
            expect(diff).deep.equals(newData);
        });

        it("should return empty object if oldObject === newObject", function() {
            var newData = {a: 1};
            var diff = realTimeCalc._calculateDiff(newData, getClientObject(newData));
            expect(diff).deep.equals({history: true});
        });

        it("should replace totalGeneration if new differ from old", function() {
            var newData = {a: 1, totalGeneration: { data: "someNewData" }};
            var savedData = {a: 1, totalGeneration: { data: "someOldData" }};
            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equal({
                totalGeneration: {
                    data: "someNewData"
                },
                "history": true
            });
        });

        it("should replace totalProductionBySources if new differ from old", function() {
            var newData = {
                a: 1,
                "totalProductionBySources": {
                    "SacredHeartCatholicChurch(ValleyPark)-Church-STL": {
                        "value": 226.23238376100036,
                        "trend": "down"
                    },
                    "MoundCityR-2SchoolDistrict-HighSchool-KC": {
                        "value": 225.79537743794268,
                        "trend": null
                    },
                    "BrentwoodSchoolDistrict-AdministrationBuilding-STL": {
                        "value": 233.4535465922354,
                        "trend": "down"
                    }
                },
                totalGeneration: { data: "someData" }
            };

            var savedData = {
                a: 1,
                totalGeneration: { data: "someData" }
            };

            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equal({
                "history": true,
                "totalProductionBySources": {
                    "SacredHeartCatholicChurch(ValleyPark)-Church-STL": {
                        "value": 226.23238376100036,
                        "trend": "down"
                    },
                    "MoundCityR-2SchoolDistrict-HighSchool-KC": {
                        "value": 225.79537743794268,
                        "trend": null
                    },
                    "BrentwoodSchoolDistrict-AdministrationBuilding-STL": {
                        "value": 233.4535465922354,
                        "trend": "down"
                    }
                }
            });
        });

        it("should add mainCharts categories (not fully replace)", function() {
            var newData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015",
                        "5:00am, March 16, 2015",
                        "5:00am, March 17, 2015"
                    ]
                }
            };
            var savedData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015"
                    ]
                }
            };
            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equals({
                "history": true,
                "mainChart": {
                    "categories": [
                        "5:00am, March 16, 2015",
                        "5:00am, March 17, 2015"
                    ],
                    series: []
                }
            });
        });

        it("should add and replace data in mainCharts categories", function() {
            var newData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015",
                        "5:00am, March 16, 2015",
                        "5:00am, March 17, 2015"
                    ],
                    "series": [
                        {
                            "name": "Total Generation",
                            "data": [
                                22.179704563017857,
                                30.81641776594914,
                                31.65982380181255,
                                32.65982380181255
                            ]
                        },
                        {
                            "name": "MoundCityR-2SchoolDistrict-HighSchool-KC",
                            "data": [
                                9.668145498395834,
                                8.817427565708332,
                                10.209949893874999,
                                32.65982380181255
                            ]
                        }
                    ]
                }
            };
            var savedData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015",
                        "5:00am, March 16, 2015",
                        "5:00am, March 17, 2015"
                    ],
                    "series": [
                        {
                            "name": "Total Generation",
                            "data": [
                                22.179704563017857,
                                30.81641776594914,
                                32.65982380181255,
                                32.65982380181255
                            ]
                        },
                        {
                            "name": "MoundCityR-2SchoolDistrict-HighSchool-KC",
                            "data": [
                                9.668145498395834,
                                8.817427565708332,
                                10.209949893874999
                            ]
                        }
                    ]
                }
            };
            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equal({
                "history": true,
                "mainChart": {
                    "categories": [
                        "5:00am, March 16, 2015",
                        "5:00am, March 17, 2015"
                    ],
                    "series": [
                        {
                            "name": "Total Generation",
                            "data": [
                                31.65982380181255,
                                32.65982380181255
                            ],
                            sourceId: undefined
                        },
                        {
                            "name": "MoundCityR-2SchoolDistrict-HighSchool-KC",
                            "data": [
                                10.209949893874999,
                                32.65982380181255
                            ],
                            sourceId: undefined
                        }
                    ]
                }
            });
        });

        it("should return empty object for equal mainChart", function() {
            var newData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015"
                    ]
                }
            };
            var savedData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015"
                    ]
                }
            };

            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equals({history: true});

        });

        it("should return diff of other objects for equal mainChart", function() {
            var newData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015"
                    ]
                },
                a: 1
            };
            var savedData = {
                "mainChart": {
                    "categories": [
                        "5:00am, March 14, 2015",
                        "5:00am, March 15, 2015"
                    ]
                }
            };

            var diff = realTimeCalc._calculateDiff(newData, getClientObject(savedData));
            expect(diff).deep.equals({
                    a: 1,
                    history: true
                }
            );
        });
    });
});

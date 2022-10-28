"use strict";

const serverRoot = "../../../../../server";

var chai      = require("chai");
var expect    = chai.expect;
var sinon     = require("sinon");
var equivCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/equivalencies-calculator");
chai.use(require("sinon-chai"));

describe("equivalencies-calculator", function () {
    var socket = {
        emit: function(){}
    };

    describe("calculateData", function() {
        beforeEach(function () {
            sinon.stub(socket, "emit", function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);
                expect(socketResponse.message.homeElectricityUse).to.equal(0.823724);
                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it("should filter equivalencies tempoiq response", function () {
            var clientObject = {};
            clientObject.socket = socket;
            clientObject.facilitiesList = {
                "55d60388c63da8e403d7774c": {
                    "name": "AcademieLafayette-OakStreet-KC",
                    "id": "55d60388c63da8e403d7774c",
                    "sourceId": "55d60388c63da8e403d7774c",
                    "displayName": "3-8 Campus",
                    "scopes": {
                    },
                    "lastReportedValue": 0,
                    "lastReportedTime": null,
                    "firstReportedTime": "2013-02-06T00:00:00.000Z",
                    "totalEnergyGenerated": 0,
                    "percent": 0,
                    "trend": null,
                    "potentialPower": 24.800000000000004,
                    "facilityImage": null,
                    "constEmissionFactor": 0
                }
            };
            clientObject.nodeList = {
                "WR7KU009:2002127283": {
                    "id": "55d60388c63da8e403d7775a",
                    "sourceId": "55d60388c63da8e403d7775a",
                    "facilityName": "3-8 Campus",
                    "facilityId": "55d60388c63da8e403d7774c",
                    "scopeName": "WebBox (Legacy)",
                    "scopeId": "55d60388c63da8e403d7774d",
                    "rate": 0.1,
                    "deviceTimeZone": "America/Chicago",
                    "powerMetricId": "Pac"
                }
            };
            var tempoIResponse = {
                "dataPoints": [
                    {
                        "ts": "2015-01-07T19:30:25.000Z",
                        "values": {
                            "WR7KU009:2002127283": {
                                "Pac": 7270000
                            }
                        }
                    }
                ],
                "selection": {
                    "devices": {
                        "or": [
                            {
                                "key": "WR7KU009:2002127283"
                            }
                        ]
                    },
                    "sensors": {
                        "or": [
                            {
                                "key": "Pac"
                            }
                        ]
                    }
                }
            };
            var queryOptions = {
                isPreloading: true
            };

            equivCalc.calculateData(clientObject, tempoIResponse, queryOptions);
        });
    });

    describe("calculateCO2AvoidedData", function() {
        beforeEach(function () {
            sinon.stub(socket, "emit", function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);
                expect(Math.round(socketResponse.message *10000) / 10000).to.equal(13202.3084);
                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it("should filter equivalencies tempoiq response", function () {
            var clientObject = {};
            clientObject.socket = socket;
            clientObject.facilitiesList = {
                "55d60388c63da8e403d7774c": {
                    "name": "AcademieLafayette-OakStreet-KC",
                    "id": "55d60388c63da8e403d7774c",
                    "sourceId": "55d60388c63da8e403d7774c",
                    "displayName": "3-8 Campus",
                    "scopes": {
                    },
                    "lastReportedValue": 0,
                    "lastReportedTime": null,
                    "firstReportedTime": "2013-02-06T00:00:00.000Z",
                    "totalEnergyGenerated": 0,
                    "percent": 0,
                    "trend": null,
                    "potentialPower": 24.800000000000004,
                    "facilityImage": null,
                    "constEmissionFactor": 0
                }
            };
            clientObject.nodeList = {
                "WR7KU009:2002127283": {
                    "id": "55d60388c63da8e403d7775a",
                    "sourceId": "55d60388c63da8e403d7775a",
                    "facilityName": "3-8 Campus",
                    "facilityId": "55d60388c63da8e403d7774c",
                    "scopeName": "WebBox (Legacy)",
                    "scopeId": "55d60388c63da8e403d7774d",
                    "rate": 0.1,
                    "deviceTimeZone": "America/Chicago",
                    "powerMetricId": "Pac"
                }
            };
            var tempoIResponse = {
                "dataPoints": [
                    {
                        "ts": "2015-01-07T19:30:25.000Z",
                        "values": {
                            "WR7KU009:2002127283": {
                                "Pac": 7270000
                            }
                        }
                    }
                ],
                "selection": {
                    "devices": {
                        "or": [
                            {
                                "key": "WR7KU009:2002127283"
                            }
                        ]
                    },
                    "sensors": {
                        "or": [
                            {
                                "key": "Pac"
                            }
                        ]
                    }
                }
            };

            equivCalc.calculateCO2AvoidedData(clientObject, tempoIResponse);
        });
    });
});

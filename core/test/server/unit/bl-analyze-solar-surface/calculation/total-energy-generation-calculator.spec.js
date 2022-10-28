"use strict";

const serverRoot = "../../../../../server";

var chai            = require("chai");
var expect          = chai.expect;
var sinon           = require("sinon");
var totalEnergyCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/total-energy-generation-calculator");
chai.use(require("sinon-chai"));

describe("total-energy-generation-calculator", function () {
    var socket = {
        emit: function(){}
    };

    beforeEach(function () {
        sinon.stub(socket, "emit", function (event, socketResponse) {
            expect(socketResponse.success).to.equal(1);
            expect(socketResponse.message.totalEnergyGeneration).to.equal(43.441441 / 1000);
            return socketResponse;
        });
    });

    afterEach(function () {
        socket.emit.restore();
    });

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

    it("should not send filtered tempoiq response", function () {
        var clientObj = {
            socket: socket,
            totalEnergyGeneration: {
                dateRange: "month"
            },
            nodeList: nodeList,
            selection: {}
        };
        var queryOptions = {
            dateRange: "year",
            selectedMonth: null,
            selectedYear: null,
            selection: {},
            isPreloading: false
        };

        totalEnergyCalc.calculateData(clientObj, tempoIResponse, queryOptions);
        expect(clientObj.socket.emit.notCalled).equals(true);
    });

    it("should send filtered tempoiq response", function () {
        var clientObj = {
            socket: socket,
            totalEnergyGeneration: {
                dateRange: "month"
            },
            nodeList: nodeList,
            selection: {}
        };
        var queryOptions = {
            dateRange: "month",
            selectedMonth: null,
            selectedYear: null,
            selection: {},
            isPreloading: false
        };

        totalEnergyCalc.calculateData(clientObj, tempoIResponse, queryOptions);
        expect(clientObj.socket.emit).to.have.been.calledOnce;
        expect(clientObj.socket.emit.notCalled).equals(false);
    });
});

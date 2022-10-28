/**
 * Date: 29 May 2015
 * Author: Georgiy Pankov
 */

"use strict";

var chai = require("chai"),
    expect = chai.expect,
    moment = require("moment"),
    serverRoot = "../../../../../../server",
    utils = require(serverRoot + "/libs/utils"),
    sinon = require("sinon"),
    electricDemand = require(serverRoot + "/bl-ems-lite-surface/core/calculation/electric-demand"),
    calcUtils = require(serverRoot + "/bl-ems-lite-surface/core/calculation/calculator-utils"),
    cache = require(serverRoot + "/libs/cache"),
    DateTimeUtils = require(serverRoot + "/libs/date-time-utils.js");


describe("electricDemand element", function() {

    var clientAnswer = new utils.ClientWebsocketAnswer({emit: function() {}}, "event");
    var errorSpy, sendSpy;

    beforeEach(function() {
        errorSpy = sinon.spy(clientAnswer, "error");
        sendSpy = sinon.spy(clientAnswer, "send");
    });

    afterEach(function() {
        clientAnswer.error.restore();
        clientAnswer.send.restore();
        cache.end();
    });

    it("should return error on wrong dateRange", function() {
        electricDemand.loadData({}, {clientAnswer: clientAnswer}, false, null);
        expect(errorSpy.calledWith("Wrong date range")).true;
    });

    it("should use correct intervals for corresponding dateRanges", function() {
        var dtUtils = new DateTimeUtils(0, 0);
        expect(electricDemand._calculateInterval("trash")).to.be.an("undefined");
    });

    it('should generate correct demand historical response', function () {
        var tempoIResponse = {
            "dataPoints": [
                {
                    "ts": moment.utc().add(-60,"minute").startOf("minute").toISOString(),
                    "values": {
                        "WR7KU020:2007305255": {
                            "ED": 43
                        }
                    }
                },
                {

                    "ts": moment.utc().add(-59,"minute").startOf("minute").toISOString(),
                    "values": {
                        "WR7KU020:2007305255": {
                            "ED": 22
                        }
                    }
                }
            ]
        };

        var nodeList = {
            "WR7KU020:2007305255": {
                deviceOffset: -360,
                facilityId: "facility12345",
                facilityName: "facilityA",
                rate: 0,
                scopeName: "scopeA",
                nodeName: "nodeA",
                scopeId: "scopeAId",
                id: "nodeAId"
            }
        };

        var storage = {
            demandBySources: {},
            totalDemand: {
                last: 0,
                min: 0,
                max: 0,
                sum: 0,
                name: "Total",
                trend: "up"
            },
            mainChart: {
                categories: [],
                series: [{
                    name: "Total",
                    data: []
                }]
            },
            table: [],
            dateRange: "3-hours",
            realtime: false
        };

        calcUtils.addHighchartsSeriesPerSource(nodeList, false, storage.mainChart);
        var convertedTempoiqData = electricDemand.convertTempoIQArrayToObject(tempoIResponse);
        var interval = electricDemand._calculateInterval("3-hours", null, new DateTimeUtils(0, 0));
        var categories = electricDemand.createCategories(interval, new DateTimeUtils(0, 0));

        expect(categories.length).to.equal(180);

        var sourcesData = {
            "facility12345": {
                "trend": "up"
            }
        };

        electricDemand._processHistoricalTempoIQResponse(convertedTempoiqData, categories, nodeList, storage, sourcesData);
        expect(storage.mainChart.categories.length).to.equal(180);
        expect(storage.totalDemand.max).to.equal(0.043);
        expect(storage.totalDemand.sum).to.equal(0.065);
    });

});




module.exports = {};

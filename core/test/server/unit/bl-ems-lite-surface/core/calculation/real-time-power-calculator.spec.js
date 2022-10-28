/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        moment = require("moment"),
        consts = require(serverRoot + "/libs/consts"),
        cache = require(serverRoot + "/libs/cache");

    chai.use(require('sinon-chai'));

    describe('ems real-time power calculations test', function () {
        var realTimeCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/real-time-power-calculator.js');

        var clientAnswer = {
            send: function(){}
        }

        beforeEach(function () {
            sinon.stub(clientAnswer, 'send', function (response) {
                expect(response.currentPower.value).to.equal(0.5);
            });
        });

        afterEach(function () {
            clientAnswer.send.restore();
            cache.end();
        });

        it('should filter historical tempoiq response', function () {
            var tempoIResponse = {
                "2001-01-07T19:30:25.000Z": {
                    "ts": "2001-01-07T19:30:25.000Z",
                    "values": {
                        "WR7KU020:2007305255": {
                            "Pac": 43.441441
                        }
                    }
                }
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
                currentPower: {
                    value: 0.043441441,
                    trend: null
                },
                currentPowerBySources: {},
                table: [],
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                }
            };

            var categories = ["2001-01-07T19:30:25.000Z"];

            var sourcesData = {
                "facility12345": {
                    "trend": "up"
                }
            };

            realTimeCalc.processHistoricalTempoIQResponse(tempoIResponse, categories, nodeList, storage, sourcesData);

            expect(storage.currentPower.value).to.equal(43.441441 / 1000);
            expect(storage.mainChart.series[0].data.length).to.equal(1);
        });

        it('should create categories with zero if there is no values', function () {
            var tempoIResponse = {};

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
                currentPower: {
                    value: 0,
                    trend: null
                },
                totalProductionBySources: {
                    "facility12345":  {
                        prevValue: null,
                        value: 0,
                        trend: null
                    }
                },
                currentPowerBySources: {},
                table: [],
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                }
            };

            var categories = [moment.utc("2001-01-07T19:30:25.000Z")];

            var sourcesData = {
                "facility12345": {
                    "trend": "up"
                }
            };

            realTimeCalc.processHistoricalTempoIQResponse(tempoIResponse, categories, nodeList, storage, sourcesData);

            expect(storage.currentPower.value).to.equal(0);
            expect(storage.mainChart.series[0].data.length).to.equal(1);
            expect(storage.mainChart.series[0].data[0]).to.equal(0);
        });

        it('should send realtime kinesis response', function () {
            var record =[{
                ts: "2001-01-07T19:30:25.000Z",
                type: "GEM",
                device: "test",
                values: {
                    "W": 500
                }
            }];

            var clientObject = {
                nodeList: {
                    test: {
                        deviceOffset: -360,
                        facilityId: "facility12345",
                        facilityName: "facilityA",
                        rate: 0,
                        scopeName: "scopeA",
                        nodeName: "nodeA",
                        scopeId: "scopeAId",
                        id: "nodeAId",
                        powerMetricId: "W"
                    }
                },
                realTimePower: {
                    isHistoricalDataLoaded: true,
                    savedResult: {
                        totalProductionBySources: {
                            facility12345: {
                                value: 10,
                                trend: "up"
                            }
                        },
                        currentPowerBySources: {
                            facility12345: {
                                value: 1,
                                trend: "up"
                            }
                        },
                        currentPower: {
                            value: 15,
                            trend: "up"
                        },
                        mainChart: {
                            categories: [],
                            series: [{
                                name: "Total Generation",
                                sourceId: null,
                                data: []
                            }, {
                                name: "facility",
                                sourceId: "facility12345",
                                data: []
                            }]
                        }
                    }
                },
                sources: {
                    savedResult: {
                        facility12345: {
                            trend: "down"
                        }
                    }
                }
            };

            realTimeCalc.processKinesisResponse(record, clientObject, clientAnswer);
            expect(clientAnswer.send).to.have.been.calledOnce;

            var trendVal =  clientObject.realTimePower.savedResult.currentPowerBySources["facility12345"].trend;
            expect(trendVal).to.equal("down");

            var currTrend = clientObject.realTimePower.savedResult.currentPower.trend;
            expect(currTrend).to.equal("down");
        });
    });
}());

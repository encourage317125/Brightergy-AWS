/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts"),
        cache = require(serverRoot + "/libs/cache");

    chai.use(require('sinon-chai'));

    describe('ems source calculations test', function () {

        var sourcesCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/sources.js');

        var clientAnswer = {
            send: function(){}
        }

        beforeEach(function () {
            sinon.stub(clientAnswer, 'send', function (response) {
                expect(response.facility12345.scopes.scopeAId.nodes.nodeAId.lastReportedValue).to.equal(500 / 1000);
                expect(response.facility12345.scopes.scopeAId.nodes.nodeAId.maxValueCurrentDay).to.equal(500 / 1000);
                expect(response.facility12345.scopes.scopeAId.nodes.nodeAId.minValueCurrentDay).to.equal(500 / 1000);
            });
        });

        afterEach(function () {
            clientAnswer.send.restore();
            cache.end();
        });

        it('should filter sources tempoiq response', function () {

            beforeEach(function () {
            });

            afterEach(function () {
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
                    scopeName: "scopeA",
                    nodeName: "nodeA",
                    scopeId: "scopeAId",
                    id: "nodeAId"
                }
            };

            var storage = {
                facility12345: {
                    lastReportedTime: null,
                    lastReportedValue: 0,
                    maxValueHistorical: 0,
                    maxValueCurrentDay: 0,
                    minValueCurrentDay: 0,
                    scopes: {
                        scopeAId: {
                            lastReportedTime: null,
                            lastReportedValue: 0,
                            maxValueHistorical: 0,
                            maxValueCurrentDay: 0,
                            minValueCurrentDay: 0,
                            nodes: {
                                nodeAId: {
                                    lastReportedTime: null,
                                    lastReportedValue: 0,
                                    maxValueHistorical: 0,
                                    maxValueCurrentDay: 0,
                                    minValueCurrentDay: 0,
                                }
                            }
                        }
                    }
                }
            };

            sourcesCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, "lastReportedTime", "lastReportedValue");
            expect(storage.facility12345.lastReportedTime).to.equal("2001-01-07T19:30:25.000Z");
        });

        it('should send realtime data ', function () {

            var record = [{
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
                        facilityName: "facilityA",
                        scopeName: "scopeA",
                        nodeName: "nodeA",
                        powerMetricId: "W",
                        facilityId: "facility12345",
                        scopeId: "scopeAId",
                        id: "nodeAId"
                    }
                },
                "sources": {
                    isHistoricalDataLoaded: true,
                    savedResult: {
                        facility12345: {
                            lastReportedValue: 50,
                            lastReportedTime: null,
                            maxValueHistorical: 0,
                            maxValueCurrentDay: 0,
                            minValueCurrentDay: 0.7,
                            scopes: {
                                scopeAId: {
                                    lastReportedValue: 50,
                                    lastReportedTime: null,
                                    maxValueHistorical: 0,
                                    maxValueCurrentDay: 0,
                                    minValueCurrentDay: 0.7,
                                    nodes: {
                                        nodeAId: {
                                            lastReportedValue: 50,
                                            lastReportedTime: null,
                                            maxValueHistorical: 0,
                                            maxValueCurrentDay: 0,
                                            minValueCurrentDay: 0.7
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            sourcesCalc.processKinesisResponse(record, clientObject, clientAnswer);
            expect(clientAnswer.send).to.have.been.calledOnce;
        });
    });
}());

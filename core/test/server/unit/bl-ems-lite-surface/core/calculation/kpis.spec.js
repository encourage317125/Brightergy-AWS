/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        moment = require('moment'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('ems kpis energy calculations test', function () {

        var kpiCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/kpis.js');

        it('should filter kpi energy tempoiq response', function () {

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
                    rate: 0.3,
                    scopeName: "scopeA",
                    nodeName: "nodeA"
                }
            };

            var storage = {
                currentDayEnergy: 0,
                currentDayRate: 0,
                monthApproximateRate: 0,
                minEnergy: 0,
                maxEnergy: 0
            };

            kpiCalc.processEnergyTempoIQResponse(tempoIResponse, nodeList, storage, true);
            expect(storage.currentDayEnergy).to.equal(43.441441 / 1000);
            expect(storage.currentDayRate).to.equal( (43.441441 / 1000) * 0.3);
        });

    });
}());

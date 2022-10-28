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

    describe('ems kwh energy consumption  calculations test', function () {

        var kwhCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/kwh-energy-consumption-calculator.js');

        afterEach(function() {
            cache.end();
        });

        it('should filter historical tempoiq response', function () {

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
                monthConsumption: 0,
                consumption: {
                    value: 0,
                    trend: null
                },
                table: [],
                consumptionBySources: {},
                currentPower: 0,
                currentPowerBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Consumption",
                        data: []
                    }]
                },
                dateRange: "12hours"
            };

            kwhCalc.processHistoricalTempoIQResponse(tempoIResponse, nodeList, storage, true, "month");

            expect(storage.monthConsumption).to.equal(43.441441 / 1000);
            //expect(storage.mainChart.series[0].data.length).to.equal(1);
        });
    });
}());

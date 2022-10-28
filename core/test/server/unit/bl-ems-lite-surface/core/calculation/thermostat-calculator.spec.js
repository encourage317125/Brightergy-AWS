/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        moment = require('moment');

    chai.use(require('sinon-chai'));

    var calc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/thermostat-calculator.js');
    var cache = require(serverRoot + "/libs/cache");
    var consts = require(serverRoot + "/libs/consts");

    var clientAnswerThermostat = {
        send: function(){}
    }

    describe('emslite thermostat calculations test with cached temperature', function () {

        beforeEach(function () {

            sinon.stub(clientAnswerThermostat, 'send', function (record) {
                expect(record.type).to.equal("PearlThermostat");
            });
        });

        afterEach(function () {
            clientAnswerThermostat.send.restore();
            cache.end();
        });

        it('should send thermostat data to client', function () {

            var record = {
                device: 123,
                type: "PearlThermostat"
            };

            var clientObj = {
                nodeList: {
                    123: {
                        id: 456
                    }
                }
            };

            calc.processKinesisResponse(record,clientObj, clientAnswerThermostat);
        });
    });

    describe('emslite thermostat calculations test without cached temperature', function () {

        beforeEach(function () {

            sinon.stub(clientAnswerThermostat, 'send', function (record) {
                expect(record.type).to.equal("PearlThermostat");
            });
        });

        afterEach(function () {
            clientAnswerThermostat.send.restore();
            cache.end();
        });

        it('should send thermostat data to client', function () {

            var record = {
                device: 123,
                type: "PearlThermostat",
                values: {
                    local_temperature: 7
                }
            };

            var clientObj = {
                nodeList: {
                    123: {
                        id: 456
                    }
                }
            };

            calc.processKinesisResponse(record,clientObj, clientAnswerThermostat);
        });
    });

    describe('emslite thermostat calculations test system mode', function () {
        var record = {
            device: 123,
            type: "PearlThermostat",
            values: {
                local_temperature: 7
            }
        };

        calc._simulateMode(record);
        expect(record.values["system_mode"]).to.equal(undefined);

        record.values["local_temperature"] = 7;
        record.values["cool_setpoint"] = 10;
        record.values["heat_setpoint"] = 5;
        calc._simulateMode(record);
        expect(record.values["system_mode"]).to.equal("Idle");

        record.values["local_temperature"] = 7;
        record.values["cool_setpoint"] = 10;
        record.values["heat_setpoint"] = 10;
        calc._simulateMode(record);
        expect(record.values["system_mode"]).to.equal("Heating");

        record.values["local_temperature"] = 7;
        record.values["cool_setpoint"] = 5;
        record.values["heat_setpoint"] = 10;
        calc._simulateMode(record);
        expect(record.values["system_mode"]).to.equal("Cooling");

    });
}());

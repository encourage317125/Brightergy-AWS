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
        fs = require("fs");

    chai.use(require('sinon-chai'));

    describe('ems export wrong format  test', function () {

        var exportCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/export.js');

        var clientAnswer = {
            send: function(){},
            error: function(){}
        }

        beforeEach(function () {

            sinon.stub(fs, 'readdir', function (path, cb) {
                cb(null);
            });

            sinon.stub(clientAnswer, 'error', function (response) {
                expect(response.message).to.equal("Wrong export format");
            });
        });

        afterEach(function () {
            fs.readdir.restore();
            clientAnswer.error.restore();
        });

        it('should say error when use incorrect format parameter', function () {
            exportCalc.exportTable("test", "pd1", "test", clientAnswer);
        });
    });

    describe('ems export wrong input data  test', function () {

        var exportCalc = require(serverRoot + '/bl-ems-lite-surface/core/calculation/export.js');

        var clientAnswer = {
            send: function(){},
            error: function(){}
        }

        beforeEach(function () {

            sinon.stub(fs, 'readdir', function (path, cb) {
                cb(null);
            });

            sinon.stub(clientAnswer, 'error', function (response) {
                expect(response.message).to.equal("Wrong table data");
            });
        });

        afterEach(function () {
            fs.readdir.restore();
            clientAnswer.error.restore();
        });

        it('should say error when use incorrect input data parameter', function () {
            exportCalc.exportTable("test", "pdf", "test", clientAnswer);
        });
    });
}());

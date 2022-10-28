"use strict";

const serverRoot = "../../../../../server";

var chai         = require("chai");
var expect       = chai.expect;
var moment       = require("moment");
var sinon        = require("sinon");
var consts       = require(serverRoot + "/libs/consts");
var sunHoursCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/sun-hours-calculator");

describe("sun-hours-caclulator", function() {
    describe.skip("loadData", function() {
        // Doesn"t work remotely ( SyntaxError in plugin "gulp-mocha" Unexpected token F)
        var socket = {
            emit: function() {}
        };

        sinon.stub(socket, "emit", function (event, socketResponse) {
            expect(event).to.be.equal(consts.WEBSOCKET_EVENTS.ASSURF.SunHours);
            expect(socketResponse).to.have.property("success", 0);
            expect(socketResponse.message).equals("Incorrect input parameters");
            return socketResponse;
        });


        it("should emit error on wrong geo", function() {
            sunHoursCalc.loadData({}, socket);
            expect(socket.emit.calledOnce).to.be.true;
        });
    });

    describe("calculateDaysForInterval", function() {
        it("should return array with one element when the data is the same", function() {
            var days = sunHoursCalc.calculateDaysForInterval(moment.utc("2014-01-01"), moment.utc("2014-01-01"));
            expect(days).to.be.an("array");
            expect(days).to.have.length(1);
            expect(days[0].unix()).equal(moment.utc("2014-01-01").hour(12).unix());
        });

        it("should return array with 20 elements for corresponding interval", function() {
            var days = sunHoursCalc.calculateDaysForInterval(moment.utc("2014-01-01"), moment.utc("2014-01-20"));
            expect(days).to.be.an("array");
            expect(days).to.have.length(20);
        });
    });

    describe("calculateSunHours", function() {
        it("should return 0 if sunset <= sunrise", function() {
            var value = sunHoursCalc.calculateSunHours(
                moment("2015-01-01 14:00"),
                moment("2015-01-01 14:00"),
                null, 0);
            expect(value).to.be.equal(0);
        });

        it("should return 0 on full cloud Cover", function() {
            var value = sunHoursCalc.calculateSunHours(
                moment("2015-01-01 10:00"),
                moment("2015-01-01 20:00"),
                null, 1);
            expect(value).to.be.equal(0);
        });
    });
});

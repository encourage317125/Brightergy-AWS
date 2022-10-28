"use strict";

const serverRoot = "../../../../../../server";

var chai       = require("chai");
var expect     = chai.expect;
var sinon      = require("sinon");
var utils      = require(serverRoot + "/libs/utils");
var cache      = require(serverRoot + "/libs/cache");
var peakDemand = require(serverRoot + "/bl-ems-lite-surface/core/calculation/peak-demand");

describe("peakDemand element", function() {
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
        peakDemand.loadData({}, {clientAnswer: clientAnswer}, false, clientAnswer, null);
        expect(errorSpy.calledWith("Wrong date range")).true;
    });
});

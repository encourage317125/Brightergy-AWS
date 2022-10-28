"use strict";

const serverRoot = "../../../../../server";

var moment           = require("moment");
var chai             = require("chai");
var expect           = chai.expect;
var lastSunnyDayCalc = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/last-sunny-day");

describe("last-sunny-day", function () {
    describe("getLastSunnyDay", function() {
        it("should return sunny day when weather-service answer contains clear day", function () {
            var weatherItems = [
                { time: 1440633600, icon: "rain" },
                { time: 1440720000, icon: "clear-day" },
                { time: 1440806400, icon: "cloudy" }
            ];

            var expected = moment.unix(1440720000).utc();
            var actual = lastSunnyDayCalc.getLastSunnyDay(weatherItems);
            expect(actual.format()).be.eql(expected.format());
        });

        it("should return current time when weather-service answer doesn't contain clear day", function () {
            var weatherItems = [
                { time: 1440633600, icon: "rain" },
                { time: 1440720000, icon: "cloudy" },
                { time: 1440806400, icon: "cloudy" }
            ];

            var expected = moment.utc();
            var actual = lastSunnyDayCalc.getLastSunnyDay(weatherItems);
            expect(actual.date()).be.eql(expected.date());
        });
    });
});

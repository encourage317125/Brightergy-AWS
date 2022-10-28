"use strict";

const rootPath = "../../../../..";

var moment        = require("moment");
var Promise       = require("bluebird");
var weatherSrvc   = require("weather-service");
var chai          = require("chai");
var expect        = chai.expect;
var sinon         = require("sinon");
var EventEmitter  = require("events").EventEmitter;
var weather       = require(rootPath + "/server/bl-analyze-solar-surface/core/calculation/weather");
var consts        = require(rootPath + "/server/libs/consts");
var DateTimeUtils = require(rootPath + "/server/libs/date-time-utils");

describe("assurf weather", function() {
    describe("getWeather", function() {
        before(function() {
            sinon.stub(weatherSrvc, "getCurrent");
            sinon.stub(weatherSrvc, "getForecast");
            sinon.stub(weatherSrvc, "getForRange");
        });

        afterEach(function() {
            weatherSrvc.getCurrent.reset();
            weatherSrvc.getForecast.reset();
            weatherSrvc.getForRange.reset();
        });

        after(function() {
            weatherSrvc.getCurrent.restore();
            weatherSrvc.getForecast.restore();
            weatherSrvc.getForRange.restore();
        });

        function test(client, expected, isSuccessExpected, done) {
            var socket = new EventEmitter();
            socket.on(consts.WEBSOCKET_EVENTS.ASSURF.Weather, function(msg) {
                try {
                    expect(msg).eql(expected);
                    expect(weatherSrvc.getCurrent.called).equal(isSuccessExpected);
                    expect(weatherSrvc.getForecast.called).equal(isSuccessExpected);
                    expect(weatherSrvc.getForRange.called).equal(isSuccessExpected);
                    done();
                } catch (err) {
                    done(err);
                }
            });
            weather.getWeather(client, socket);
        }

        it("should return error when latitude is missing", function(done) {
            var client = {
                geo: { longitude: 1 },
                dateTimeUtils: new DateTimeUtils(0, 0)
            };
            var expected = {
                success: 0,
                message: "Incorrect latitude parameter"
            };

            test(client, expected, false, done);
        });

        it("should return error when longitude is missing", function(done) {
            var client = {
                geo: { latitude: 1 },
                dateTimeUtils: new DateTimeUtils(0, 0)
            };
            var expected = {
                success: 0,
                message: "Incorrect longitude parameter"
            };

            test(client, expected, false, done);
        });

        it("should return weather data when location is correct", function(done) {
            weatherSrvc.getCurrent.returns(Promise.resolve({
                temperature: 1
            }));
            weatherSrvc.getForecast.returns(Promise.resolve([
                { day: 11 },
                { day: 12 }
            ]));
            weatherSrvc.getForRange.returns(Promise.resolve([
                { day: 21 },
                { day: 22 }
            ]));
            var expected = {
                success: 1,
                message: {
                    current: {
                        temperature: 1,
                        latitude: 1,
                        longitude: 1,
                        sunriseTime: undefined,
                        sunsetTime: undefined,
                        sunriseDate: undefined,
                        sunsetDate: undefined
                    },
                    forecast: [
                        { day: 11 },
                        { day: 12 },
                    ],
                    history: [
                        { day: 21 },
                        { day: 22 }
                    ]
                }
            };
            var client = {
                geo: { longitude: 1, latitude: 1 },
                dateTimeUtils: new DateTimeUtils(0, 0)
            };

            test(client, expected, true, done);
        });
    });

    describe("getWeatherHistory", function() {
        before(function() {
            sinon.stub(weatherSrvc, "getForRange");
        });

        afterEach(function() {
            weatherSrvc.getForRange.reset();
        });

        after(function() {
            weatherSrvc.getForRange.restore();
        });

        function test(client, dateRange, expected, isSuccessExpected, done) {
            var socket = new EventEmitter();
            socket.on(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, function(msg) {
                try {
                    expect(msg).eql(expected);
                    expect(weatherSrvc.getForRange.called).equal(isSuccessExpected);
                    done();
                } catch (err) {
                    done(err);
                }
            });
            weather.getWeatherHistory(client, dateRange, socket);
        }

        describe("validations", function() {
            it("should emit error when latitude is missing", function(done) {
                var client = {
                    geo: { longitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var dateRange = {
                    from: moment("2015-06-01"),
                    to: moment("2015-06-02")
                };
                var expected = {
                    success: 0,
                    message: "Incorrect latitude parameter"
                };

                test(client, dateRange, expected, false, done);
            });

            it("should emit error when longitude is missing", function(done) {
                var client = {
                    geo: { latitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var dateRange = {
                    from: moment("2015-06-01"),
                    to: moment("2015-06-02")
                };
                var expected = {
                    success: 0,
                    message: "Incorrect longitude parameter"
                };

                test(client, dateRange, expected, false, done);
            });

            it("should emit error when dateRange is empty", function(done) {
                var client = {
                    geo: { latitude: 1, longitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var expected = {
                    success: 0,
                    message: "Incorrect dateRange parameter"
                };

                test(client, null, expected, false, done);
            });

            it("should emit error when dateRange is invalid", function(done) {
                var client = {
                    geo: { latitude: 1, longitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var dateRange = {
                    from: moment("2015-06-01")
                };
                var expected = {
                    success: 0,
                    message: "Incorrect dateRange parameter"
                };

                test(client, dateRange, expected, false, done);
            });

            it("should emit error when dateRange.to less than dataRange.from", function(done) {
                var client = {
                    geo: { latitude: 1, longitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var dateRange = {
                    from: moment("2015-06-01"),
                    to: moment("2015-05-20")
                };
                var expected = {
                    success: 0,
                    message: "Incorrect dateRange parameter"
                };

                test(client, dateRange, expected, false, done);
            });
        });

        describe("lodaData", function() {
            it("should emit an array with items when params are valid", function(done) {
                weatherSrvc.getForRange.returns(Promise.resolve([
                    { day: 21 },
                    { day: 22 }
                ]));
                var client = {
                    geo: { latitude: 1, longitude: 1 },
                    dateTimeUtils: new DateTimeUtils(0, 0)
                };
                var dateRange = {
                    from: moment("2015-06-01"),
                    to: moment("2015-06-02")
                };
                var expected = {
                    success: 1,
                    message: {
                        history: [
                            { day: 21 },
                            { day: 22 }
                        ]
                    }
                };

                test(client, dateRange, expected, true, done);
            });
        });
    });
});

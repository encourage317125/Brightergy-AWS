"use strict";

const serverRoot = "../../../../../../server";

var _             = require("lodash");
var moment        = require("moment");
var Promise       = require("bluebird");
var chai          = require("chai");
var expect        = chai.expect;
var sinon         = require("sinon");
var dataProvider  = require("dataprovider-service");
var DateTimeUtils = require(serverRoot + "/libs/date-time-utils");
var heatMap       = require(serverRoot + "/bl-ems-lite-surface/core/calculation/heat-map");
require("sinon-as-promised")(Promise);

describe("heat-map", function() {
    describe("_processTempoiqData", function() {
        function test(params, tempoiqData, expected) {
            var actual = heatMap._processTempoiqData(params, tempoiqData);
            expect(actual).eql(expected);
        }

        function getParams(dayCount) {
            return {
                dayCount: dayCount,
                range: {
                    start: moment("2016-01-15", moment.defaultFormat)
                },
                currentHour: 5
            };
        }

        function getHeatMapData(dayCount, value, currentHour) {
            var heatmapData = [];
            for (let i = 0; i < dayCount; i++) {
                var hoursCnt = i < (dayCount - 1) ? 24 : currentHour;
                var hoursData = _.times(hoursCnt, _.constant(value));
                heatmapData.push(hoursData);
            }
            return heatmapData;
        }

        function getTempoiqData(dayCount, currentHour) {
            var dataPoints = [];
            var cnt = (dayCount - 1 ) * 24 + currentHour;
            for (let i = 0; i < cnt; i++) {
                var dataPoint = {
                    ts: moment("2016-01-15", moment.defaultFormat).add(i, "h"),
                    values: {
                        device1: { W: 5000 }
                    }
                };
                dataPoints.push(dataPoint);
            }
            return {
                dataPoints: dataPoints
            };
        }

        it("should return an array with each item zero value when tempoiqData is undefined", function() {
            var dayCount = 2;
            var params = getParams(dayCount);
            var tempoiqData;
            var expected = getHeatMapData(dayCount, 0, params.currentHour + 1);

            test(params, tempoiqData, expected);
        });

        it("should return an array with each item zero value when tempoiqData.dataPoints is undefined", function() {
            var dayCount = 2;
            var params = getParams(dayCount);
            var tempoiqData = {};
            var expected = getHeatMapData(dayCount, 0, params.currentHour + 1);

            test(params, tempoiqData, expected);
        });

        it("should return an array with each item zero value when tempoiqData.dataPoints is empty", function() {
            var dayCount = 2;
            var params = getParams(dayCount);
            var tempoiqData = { dataPoints: [] };
            var expected = getHeatMapData(dayCount, 0, params.currentHour + 1);

            test(params, tempoiqData, expected);
        });

        it("should return a filled array when tempoiqData.dataPoints has data for each hour", function() {
            var dayCount = 2;
            var params = getParams(dayCount);
            var tempoiqData = getTempoiqData(dayCount, params.currentHour + 1);
            tempoiqData.dataPoints[10].values = {
                device1: { W: 3000 },
                device2: { W: 7000 }
            };
            tempoiqData.dataPoints[20].values = {
                device1: { W: 1000 },
                device2: { W: 2000 }
            };
            tempoiqData.dataPoints[27].values = {
                device1: { W: 1000 },
                device2: { W: 7000 },
                device3: { W: 7000 }
            };
            var expected = getHeatMapData(dayCount, 5, params.currentHour + 1);
            expected[0][10] = 10;
            expected[0][20] = 3;
            expected[1][3] = 15;

            test(params, tempoiqData, expected);
        });

        it("should return a filled array when tempoiqData.dataPoints has data not for each hour", function() {
            var dayCount = 2;
            var params = getParams(dayCount);
            var tempoiqData = getTempoiqData(dayCount, params.currentHour + 1);
            tempoiqData.dataPoints.splice(10, 1);
            tempoiqData.dataPoints.splice(20, 1);
            tempoiqData.dataPoints.splice(26, 1);
            var expected = getHeatMapData(dayCount, 5, params.currentHour + 1);
            expected[0][10] = 0;
            expected[0][21] = 0;
            expected[1][4] = 0;

            test(params, tempoiqData, expected);
        });
    });

    describe("_loadTempoiqData", function() {
        before(function() {
            sinon.stub(dataProvider, "loadDataAsync");
        });

        after(function() {
            dataProvider.loadDataAsync.restore();
        });

        it("should call dataProvider.loadDataAsync and pass params", function(done) {
            var selection = "devices";
            var params = { range: "start-end" };
            var dateTimeUtils = "dateTimeUtils";
            var expected = "ok";

            var tempoiqOts = {
                selection: selection,
                pipeline: {
                    functions: [{
                        name: "rollup",
                        arguments: ["mean", "1hour"]
                    }]
                }
            };
            dataProvider
                .loadDataAsync
                .withArgs(params.range, dateTimeUtils, tempoiqOts)
                .resolves("ok");

            heatMap
                ._loadTempoiqData(selection, params, dateTimeUtils)
                .then(function(res) {
                    expect(res).eql(expected);
                    done();
                })
                .catch(done);
        });
    });

    describe("_calcParams", function() {
        function test(dateRange, expected, isErrorExpected, done) {
            var dateTimeUtils = new DateTimeUtils();
            heatMap
                ._calcParams(dateRange, dateTimeUtils)
                .then(function(data) {
                    if (isErrorExpected) {
                        throw new Error("Unexpected resolve call");
                    }
                    expect(Math.ceil(data.dayCount)).eql(Math.ceil(expected.dayCount));
                    expect(data.range.start.format("YYYY-MM-DD hh:mm")).eql(expected.range.start.format("YYYY-MM-DD hh:mm"));
                    expect(data.range.end.format("YYYY-MM-DD hh:mm")).eql(expected.range.end.format("YYYY-MM-DD hh:mm"));
                    done();
                })
                .catch(function(err) {
                    if (isErrorExpected) {
                        expect(err).eql(expected);
                        done();
                    } else {
                        done(err);
                    }
                })
                .catch(done);
        }

        it("should reject with error when dataRange is not accepted", function(done) {
            var dateRange = "unsupported";
            var expected = new Error("Unsupported dateRange: unsupported");
            var isErrorExpected = true;

            test(dateRange, expected, isErrorExpected, done);
        });

        it("should resolve with generated params when dataRange is week", function(done) {
            var dateRange = "week";
            var range = {
                start: moment.utc().subtract(1, "w").startOf("d"),
                end: moment.utc()
            };
            var expected = {
                dayCount: moment.duration(range.end - range.start).asDays(),
                range
            };
            var isErrorExpected = false;

            test(dateRange, expected, isErrorExpected, done);
        });

        it("should resolve with generated params when dataRange is month", function(done) {
            var dateRange = "month";
            var range = {
                start: moment.utc().subtract(30, "d").startOf("d"),
                end: moment.utc()
            };
            var expected = {
                dayCount: moment.duration(range.end - range.start).asDays(),
                range
            };
            var isErrorExpected = false;

            test(dateRange, expected, isErrorExpected, done);
        });

        it("should resolve with generated params when dataRange is 6-months", function(done) {
            var dateRange = "6-months";
            var range = {
                start: moment.utc().subtract(180, "d").startOf("d"),
                end: moment.utc()
            };
            var expected = {
                dayCount: moment.duration(range.end - range.start).asDays(),
                range
            };
            var isErrorExpected = false;

            test(dateRange, expected, isErrorExpected, done);
        });
    });

    describe("loadData", function() {
        before(function() {
            sinon.stub(heatMap, "_calcParams");
            sinon.stub(heatMap, "_loadTempoiqData");
            sinon.stub(heatMap, "_processTempoiqData");
        });

        after(function() {
            heatMap._calcParams.restore();
            heatMap._loadTempoiqData.restore();
            heatMap._processTempoiqData.restore();
        });

        function test(clientObject, element, callback, expected, isErrorExpected, done) {
            heatMap.loadData(clientObject, element, callback)
                .then(function() {
                    if (isErrorExpected) {
                        expect(element.clientAnswer.error).eql(expected);
                    } else {
                        expect(element.clientAnswer.res).eql(expected);
                    }
                    done();
                })
                .catch(done);
        }

        function getClientObject() {
            return {
                selection: "selection",
                dateTimeUtils: "dateTimeUtils"
            };
        }

        function getElement() {
            return {
                dateRange: "month",
                clientAnswer: {
                    send: function(res) {
                        this.res = res;
                    },
                    error: function(err) {
                        this.error = err;
                    }
                }
            };
        }

        it("should don't all related functions when one of them thrown an error", function(done) {
            var clientObject = getClientObject();
            var element = getElement();
            var callback = function() {};
            var expected = new Error("Related function error");
            var isErrorExpected = true;

            var err = new Error("Related function error");
            heatMap
                ._calcParams
                .withArgs(element.dateRange, clientObject.dateTimeUtils)
                .rejects(err);

            test(clientObject, element, callback, expected, isErrorExpected, done);
        });

        it("should call all related functions when no one function thrown an error", function(done) {
            var clientObject = getClientObject();
            var element = getElement();
            var callback = function() {};
            var expected = {
                dateRange: "month",
                rangeStart: moment.utc().subtract(1, "M").startOf("d").toISOString(),
                rangeEnd: moment.utc().startOf("d").toISOString(),
                points: "heatmapData"
            };
            var isErrorExpected = false;

            var params = {
                dayCount: 30,
                range: {
                    start: moment.utc().subtract(1, "M").startOf("d"),
                    end: moment.utc().startOf("d")
                }
            };
            heatMap
                ._calcParams
                .withArgs(element.dateRange, clientObject.dateTimeUtils)
                .resolves(params);

            var tempoiqData = { dataPoints: "dataPoints" };
            heatMap
                ._loadTempoiqData
                .withArgs(clientObject.selection, params, clientObject.dateTimeUtils)
                .resolves(tempoiqData);

            var heatmapData = "heatmapData";
            heatMap
                ._processTempoiqData
                .withArgs(params, tempoiqData)
                .resolves(heatmapData);

            test(clientObject, element, callback, expected, isErrorExpected, done);
        });
    });
});

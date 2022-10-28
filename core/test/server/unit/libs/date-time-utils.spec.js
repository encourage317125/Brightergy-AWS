"use strict";

var serverRoot    = "../../../../server";
var moment        = require("moment");
var expect        = require("chai").expect;
var DateTimeUtils = require(serverRoot + "/libs/date-time-utils");

describe("libs", function() {
    describe("dateTimeUtils", function() {
        var chicago = "America/Chicago";
        var msk = "Europe/Moscow";

        function validate(actual, expected) {
            var actualStart = actual.start.format("YYYY-MM-DD hh:mm");
            var actualEnd = actual.end.format("YYYY-MM-DD hh:mm");
            var expectedStart = expected.start.format("YYYY-MM-DD hh:mm");
            var expectedEnd = expected.end.format("YYYY-MM-DD hh:mm");

            expect(actualStart).eql(expectedStart);
            expect(actualEnd).eql(expectedEnd);
        }

        describe("getTotalRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc("2012-01-01"),
                    end: moment.utc()
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getTotalRange();

                validate(actual, expected);
            });
        });

        describe("getNthsRange", function() {
            it("should return valid range (case 1)", function() {
                var expected = {
                    start: moment.utc().subtract(1, "d").startOf("h"),
                    end: moment.utc().startOf("m")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNthsRange("d", 1, "h", "m");

                validate(actual, expected);
            });

            it("should return valid range (case 2)", function() {
                var expected = {
                    start: moment.utc().subtract(5, "d").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNthsRange("d", 5, "d", "h");

                validate(actual, expected);
            });
        });

        describe("getNMinutesRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "m").startOf("m"),
                    end: moment.utc().startOf("s")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNMinutesRange(5, "m", "m");

                validate(actual, expected);
            });
        });

        describe("getMinuteRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "m").startOf("m"),
                    end: moment.utc().startOf("s")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getMinuteRange("m", "m");

                validate(actual, expected);
            });
        });

        describe("getNHoursRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "h").startOf("h"),
                    end: moment.utc().startOf("m")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNHoursRange(5, "h", "m");

                validate(actual, expected);
            });
        });

        describe("getHourRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "h").startOf("h"),
                    end: moment.utc().startOf("m")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getHourRange("h", "m");

                validate(actual, expected);
            });
        });

        describe("getNDaysRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "d").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNDaysRange(5, "d", "h");

                validate(actual, expected);
            });
        });

        describe("getDayRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "d").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getDayRange("d", "h");

                validate(actual, expected);
            });
        });

        describe("getNWeeksRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "w").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNWeeksRange(5, "d", "h");

                validate(actual, expected);
            });
        });

        describe("getWeekRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "w").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getWeekRange("d", "h");

                validate(actual, expected);
            });
        });

        describe("getNMonthsRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "M").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNMonthsRange(5, "d", "h");

                validate(actual, expected);
            });
        });

        describe("getMonthRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "M").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getMonthRange("d", "h");

                validate(actual, expected);
            });
        });

        describe("getNYearsRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(5, "y").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getNYearsRange(5, "d", "h");

                validate(actual, expected);
            });
        });

        describe("getYearRange", function() {
            it("should return valid range", function() {
                var expected = {
                    start: moment.utc().subtract(1, "y").startOf("d"),
                    end: moment.utc().startOf("h")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getYearRange("d", "h");

                validate(actual, expected);
            });
        });

        describe("getRangeForYear", function() {
            it("should return past year range when year param is undefined", function() {
                var year;
                var expected = {
                    start: moment.utc().subtract(1, "y").startOf("h"),
                    end: moment.utc()
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year);

                validate(actual, expected);
            });

            it("should return current year range when year param is incorrect", function() {
                var year = "incorrect";
                var expected = {
                    start: moment.utc().startOf("y"),
                    end: moment.utc().endOf("y")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year);

                validate(actual, expected);
            });

            it("should return year range when year param is correct", function() {
                var year = 2014;
                var expected = {
                    start: moment.utc(2014, "YYYY"),
                    end: moment.utc(2014, "YYYY").endOf("y")
                };
                
                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year, "h");

                validate(actual, expected);
            });
        });

        describe("getRangeForYear", function() {
            it("should return past year range when year param is undefined", function() {
                var year;
                var expected = {
                    start: moment.utc().subtract(1, "y").startOf("h"),
                    end: moment.utc()
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year);

                validate(actual, expected);
            });

            it("should return current year range when year param is incorrect", function() {
                var year = "incorrect";
                var expected = {
                    start: moment.utc().startOf("y"),
                    end: moment.utc().endOf("y")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year);

                validate(actual, expected);
            });

            it("should return year range when year param is correct", function() {
                var year = 2014;
                var expected = {
                    start: moment.utc(2014, "YYYY"),
                    end: moment.utc(2014, "YYYY").endOf("y")
                };
                
                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForYear(year, "h");

                validate(actual, expected);
            });
        });

        describe("getRangeForMonthYear", function() {
            it("should return past month range when year param is undefined", function() {
                var year;
                var month = 3;
                var expected = {
                    start: moment.utc().subtract(1, "M").startOf("h"),
                    end: moment.utc()
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForMonthYear(year, month);

                validate(actual, expected);
            });

            it("should return year, month range when year and month param are valid", function() {
                var year = 2014;
                var month = 3;
                var expected = {
                    start: moment.utc("2014-04", "YYYY-MM"),
                    end: moment.utc("2014-04", "YYYY-MM").endOf("M")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.getRangeForMonthYear(year, month);

                validate(actual, expected);
            });
        });

        describe("rangeForDay", function() {
            it("should return past day range when day param is undefined", function() {
                var day;
                var expected = {
                    start: moment.utc().subtract(1, "d").startOf("h"),
                    end: moment.utc()
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.rangeForDay(day);

                validate(actual, expected);
            });

            it("should return current day range when day param is incorrect", function() {
                var day = "incorrect";
                var expected = {
                    start: moment.utc().subtract(1, "d"),
                    end: moment.utc().subtract(1, "d").endOf("d")
                };

                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.rangeForDay(day);

                validate(actual, expected);
            });

            it("should return day range when day param is correct", function() {
                var day = 15;
                var expected = {
                    start: moment.utc().date(15).startOf("d"),
                    end: moment.utc().date(15).endOf("d")
                };
                
                var dtUtils = new DateTimeUtils(null);
                var actual = dtUtils.rangeForDay(day, "h");

                validate(actual, expected);
            });
        });

        describe("extendRangeFromLeft", function() {
            it("should do nothing when range is undefined", function() {
                var range;
                var nths = 1;
                var unit = "d";
                var expected;

                var dtUtils = new DateTimeUtils(null);
                dtUtils.extendRangeFromLeft(range, nths, unit);

                expect(range).eql(expected);
            });

            it("should do nothing when range.start is undefined", function() {
                var range = {};
                var nths = 1;
                var unit = "d";
                var expected = {};

                var dtUtils = new DateTimeUtils(null);
                dtUtils.extendRangeFromLeft(range, nths, unit);

                expect(range).eql(expected);
            });

            it("should do nothing when nths is undefined", function() {
                var range = {
                    start: moment("2016-01-11")
                };
                var nths;
                var unit = "d";
                var expected = {
                    start: moment("2016-01-11")
                };

                var dtUtils = new DateTimeUtils(null);
                dtUtils.extendRangeFromLeft(range, nths, unit);

                expect(range.start.format()).eql(expected.start.format());
            });

            it("should do nothing when unit is undefined", function() {
                var range = {
                    start: moment("2016-01-11")
                };
                var nths = 1;
                var unit;
                var expected = {
                    start: moment("2016-01-11")
                };

                var dtUtils = new DateTimeUtils(null);
                dtUtils.extendRangeFromLeft(range, nths, unit);

                expect(range.start.format()).eql(expected.start.format());
            });

            it("should extend range.start when all params are valid", function() {
                var range = {
                    start: moment("2016-01-11")
                };
                var nths = 1;
                var unit = "d";
                var expected = {
                    start: moment("2016-01-10")
                };

                var dtUtils = new DateTimeUtils(null);
                dtUtils.extendRangeFromLeft(range, nths, unit);

                expect(range.start.format()).eql(expected.start.format());
            });
        });

        describe("formatDate", function() {
            it("should return correct date with client timezone", function() {
                var dateStandart = moment.utc("2015-01-10T00:00:00.000Z");
                expect(new DateTimeUtils(null).formatDate(dateStandart)).equals("2015-01-10T00:00:00.000Z");
                expect(new DateTimeUtils(chicago).formatDate(dateStandart)).equals("2015-01-10T06:00:00.000Z");
                expect(new DateTimeUtils(msk).formatDate(dateStandart)).equals("2015-01-09T21:00:00.000Z");

                var dateDST = moment.utc("2015-04-10T00:00:00.000Z");
                expect(new DateTimeUtils(null).formatDate(dateDST)).equals("2015-04-10T00:00:00.000Z");
                expect(new DateTimeUtils(chicago).formatDate(dateDST)).equals("2015-04-10T05:00:00.000Z");
                expect(new DateTimeUtils(msk).formatDate(dateDST)).equals("2015-04-09T21:00:00.000Z");
            });
        });

        describe("revertCachedDate", function() {
            it("should revert cached date with client timezone", function() {
                var dateDST1 = moment.utc("2015-04-10T00:00:00.000Z");
                var dateStandart1 = moment.utc("2015-01-10T00:00:00.000Z");

                new DateTimeUtils(chicago).revertCachedDate(dateDST1);
                new DateTimeUtils(chicago).revertCachedDate(dateStandart1);

                expect(dateDST1.toISOString()).equals("2015-04-09T19:00:00.000Z");
                expect(dateStandart1.toISOString()).equals("2015-01-09T18:00:00.000Z");

                var dateDST2 = moment.utc("2015-04-10T00:00:00.000Z");
                var dateStandart2 = moment.utc("2015-01-10T00:00:00.000Z");

                new DateTimeUtils(msk).revertCachedDate(dateDST2);
                new DateTimeUtils(msk).revertCachedDate(dateStandart2);

                expect(dateDST2.toISOString()).equals("2015-04-10T03:00:00.000Z");
                expect(dateStandart2.toISOString()).equals("2015-01-10T03:00:00.000Z");
            });
        });

        describe("createTimes", function() {
            it("should build correct categories", function() {
                var dtUtils = new DateTimeUtils("America/Chicago");

                var categories1 = dtUtils.createTimes(
                    {
                        "start": moment.utc("2015-11-02T06:00:00.000Z"),
                        "end": moment.utc("2015-12-02T06:00:00.000Z")
                    },
                    "1day",
                    { convertToClientTZ: true }
                );
                expect(categories1.length).equals(31);
                expect(categories1[0]).equals("2015-11-02T06:00:00.000Z");
                expect(categories1[30]).equals("2015-12-02T06:00:00.000Z");

                var categories2 = dtUtils.createTimes(
                    {
                        "start": moment.utc("2014-12-01T06:00:00.000Z"),
                        "end": moment.utc("2015-12-01T06:00:00.000Z")
                    },
                    "1month",
                    { convertToClientTZ: true }
                );
                expect(categories2.length).equals(13);
                expect(categories2[0]).equals("2014-12-01T06:00:00.000Z");
                expect(categories2[12]).equals("2015-12-01T06:00:00.000Z");

                var categories3 = dtUtils.createTimes(
                    {
                        "start": moment.utc("2014-05-01T05:00:00.000Z"),
                        "end": moment.utc("2015-12-01T06:00:00.000Z")
                    },
                    "1month",
                    { convertToClientTZ: true }
                );
                expect(categories3.length).equals(20);
                expect(categories3[0]).equals("2014-05-01T05:00:00.000Z");
                expect(categories3[19]).equals("2015-12-01T06:00:00.000Z");
            });
        });
    });
});

"use strict";

// TODO:: moved to core-service

var _      = require("lodash");
var moment = require("moment-timezone");
var assert = require("assert");
var utils  = require("./utils");
var log    = require("./log")(module);

function DateTimeUtils(deviceTimeZone) {
    if (deviceTimeZone) {
        assert(_.isString(deviceTimeZone));
    }
    this.deviceTimeZone = deviceTimeZone;

    this.getNthsRange = function(unit, nths, startOf, endOf) {
        return {
            start: moment.utc().subtract(nths, unit).startOf(startOf),
            end: moment.utc().startOf(endOf)
        };
    };

    this.getNMinutesRange = function(nMinutes, startOf, endOf) {
        return this.getNthsRange("m", nMinutes, startOf, endOf);
    };

    this.getMinuteRange = function(startOf, endOf) {
        return this.getNthsRange("m", 1, startOf, endOf);
    };

    this.getNHoursRange = function(nHours, startOf, endOf) {
        return this.getNthsRange("h", nHours, startOf, endOf);
    };

    this.getHourRange = function(startOf, endOf) {
        return this.getNthsRange("h", 1, startOf, endOf);
    };

    this.getNDaysRange = function(nDays, startOf, endOf) {
        return this.getNthsRange("d", nDays, startOf, endOf);
    };

    this.getDayRange = function(startOf, endOf) {
        return this.getNthsRange("d", 1, startOf, endOf);
    };

    this.getNWeeksRange = function(nWeeks, startOf, endOf) {
        return this.getNthsRange("w", nWeeks, startOf, endOf);
    };

    this.getWeekRange = function(startOf, endOf) {
        return this.getNthsRange("w", 1, startOf, endOf);
    };

    this.getNMonthsRange = function(nMonths, startOf, endOf) {
        return this.getNthsRange("M", nMonths, startOf, endOf);
    };

    this.getMonthRange = function(startOf, endOf) {
        return this.getNthsRange("M", 1, startOf, endOf);
    };

    this.getNYearsRange = function(nYears, startOf, endOf) {
        return this.getNthsRange("y", nYears, startOf, endOf);
    };

    this.getYearRange = function(startOf, endOf) {
        return this.getNthsRange("y", 1, startOf, endOf);
    };

    this.getTotalRange = function() {
        return {
            start: moment.utc("2012-01-01"),
            end: moment.utc()
        };
    };

    this.getRangeForYear = function(year, startOf) {
        if (_.isUndefined(year)) {
            return this.getYearRange(startOf || "hour");
        }

        var start = moment.utc([year, 0, 1]);
        if (!start.isValid()) {
            start = moment.utc().startOf("year");
        }
        start = start.startOf(startOf);
        var end = start.clone().endOf("year");

        return { start: start, end: end };
    };

    this.getRangeForMonthYear = function(year, month, startOf) {
        if (_.isUndefined(year)) {
            return this.getMonthRange(startOf || "hour");
        }

        var start = moment.utc([year, 0, 1]);
        if (!start.isValid()) {
            start = moment.utc().startOf("year");
        }
        var end;
        if (utils.isValidMonth(month)) {
            start.set("month", month);
            end = start.clone().endOf("month");
        } else {
            end = start.clone().endOf("year");
        }
        start = start.startOf(startOf);

        return { start: start, end: end };
    };

    this.rangeForDay = function(day, startOf) {
        if (_.isUndefined(day)) {
            return this.getDayRange(startOf || "hour");
        }

        var start = day >= 1 && day <= 31 ?
            moment.utc().date(day).startOf("day") :
            moment.utc().add(-1, "day");

        start = start.startOf(startOf);
        var end = start.clone().endOf("day");

        return { start: start, end: end };
    };

    this.getCurrentDayStartOfMidnightRange = function(clientOffset) {
        if (clientOffset) {
            // kansas time = UTC-5 (in summer), offset = -300
            // when time in kansas is midnight, utc will be 05:00
            // so we need add 300, or utc - (-300)
            return {
                start: moment().utc().startOf("day").subtract(clientOffset, "m"),
                end: moment().utc().endOf("day").subtract(clientOffset, "m")
            };
        }
        return {
            start: moment().utc().startOf("day"),
            end: moment.utc()
        };
    };

    this.getShiftedDateByDevice = function(date) {
        if (this.deviceTimeZone) {
            var ms = moment.utc(date).format("x");
            var thisOffset = moment.tz.zone(this.deviceTimeZone).offset(ms) * -1;
            return moment.utc(date).subtract(thisOffset, "m");
        }
        return moment.utc(date);
    };

    this.formatDate = function(date) {
        return this.getShiftedDateByDevice(date).toISOString();
    };

    this.revertCachedDate = function(date) {
        if (this.deviceTimeZone) {
            var ms = moment.utc(date).format("x");
            var thisOffset = moment.tz.zone(this.deviceTimeZone).offset(ms) * -1;
            date.add(thisOffset, "m");
        }
    };

    this.getClientOffset = function() {
        return 0;
    };

    this.extendRangeFromLeft = function(range, nths, unit) {
        if (range && range.start && nths && unit) {
            range.start.subtract(nths, unit);
        }
    };

    /**
     * This function is used to generate array of times
     * based on range and step
     * @param range {Object} range from dateTimeUtils
     * @param step {String} step (1m, 1month, 1year)
     * @param extraParameters {Object} several extra params for generation
     * @return {Array[String]}
     */
    this.createTimes = function(range, step, extraParameters) {
        function addDate(start, result, isStartDST, ts) {
            var thisDST = moment.tz(start,ts).isDST();
            if (thisDST !== isStartDST) {
                //different dst offset, need add or subtract one hour
                var hourOffset = thisDST ? -1: 1;
                result.push(start.utc().clone().add(hourOffset, "hour").toISOString());
            } else {
                result.push(start.utc().toISOString());
            }
        }

        log.silly("range = " + JSON.stringify(range));

        if (step.indexOf("min") > -1) {
            step = "minute";
        }

        var firstLetter  = step.charAt(0);
        if (utils.isNumber(firstLetter)) {
            // 1day, 1year etc
            step = step.substr(1);
        }

        if (!extraParameters) {
            extraParameters = {};
        }

        var start = range.start.clone();
        var end = range.end.clone();

        if (start > end) {
            throw Error("createTimes: Incorrect range: start: " + start + ", end: " + end);
        }
        if (!step) {
            throw Error("createTimes: Incorrect step: " + step);
        }

        var stepOffset = extraParameters.stepOffset || 1;

        log.silly(`createTimes: start=${start.format()}, end=${end.format()}, step=${step}`);

        var isStartDST = moment.tz(start,this.deviceTimeZone).isDST();
        var isEndDST = moment.tz(end,this.deviceTimeZone).isDST();
        var result = [];
        while (start <= end) {
            // fucking magic. fucking times. fucking device offset
            addDate(start, result, isStartDST, this.deviceTimeZone);
            start.add(stepOffset, step);
        }

        if (!isStartDST && isEndDST) {
            //if dst was changed, hour offset will be different
            //in that case need explicitly add last date
            addDate(start, result, isStartDST, this.deviceTimeZone);
        }

        if (extraParameters.limit) {
            return _.take(result, extraParameters.limit);
        }
        return result;
    };
}

module.exports = DateTimeUtils;

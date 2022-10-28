"use strict";

// TODO:: moved to core-service

var _      = require("lodash");
var moment = require("moment");

module.exports = {
    isValidLatitude: function(latitude) {
        return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
    },
    isValidLongitude: function(longitude) {
        return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
    },
    isValidTimeOffset: function(offset) {
        return !isNaN(offset) && offset >= -720 && offset <= 840; // -12h <= tz <= +14h
    },
    isArraysDiff: function(standarArr, checkedArr) {
        return _.isArray(checkedArr) && _.difference(checkedArr, standarArr).length === 0;
    },
    isValidUnixDate: function(date) {
        return !isNaN(date) && date > 0;
    },
    isValidUnixDatesRange: function(start, end) {
        return start < end && moment.unix(end).diff(moment.unix(start), "y", true) <= 1.0;
    },
    isValidDateRange: function(dateRange) {
        if (!dateRange || !dateRange.from || !dateRange.to) {
            return false;
        }
        if (!moment(dateRange.from).isValid() || !moment(dateRange.to).isValid()) {
            return false;
        }
        if (moment(dateRange.from) > moment(dateRange.to)) {
            return false;
        }
        return true;
    },
    isValidEmail: function(email) {
        var re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;
        return email !== "" && re.test(email);
    },
    isValidObjectId: function(val) {
        var regexp = /^[0-9a-fA-F]{24}$/;
        return _.isString(val) && regexp.test(val);
    },
    isValidObjectIdArray: function(arr) {
        var regexp = /^[0-9a-fA-F]{24}$/;
        if(!_.isArray(arr) || arr.length === 0) {
            return false;
        }
        for(var i=0; i < arr.length; i++) {
            if(!(_.isString(arr[i]) && regexp.test(arr[i]))) {
                return false;
            }
        }
        return true;
    }
};

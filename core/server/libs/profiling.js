"use strict";

// TODO:: moved to core-service

var moment = require("moment"),
    log = require("./log")(module),
    config = require("../../config/environment");

var ids = {};
var startingId = 0;

/**
 * this class is used to receive the estimation of response time
 * for different elements of ASSurf elements (#91266342)
 */
var TimeProfiler = function(initPrefix) {
    this.initPrefix = initPrefix;
};


TimeProfiler.prototype._getLabel = function(id) {
    var label = "profiling.";
    if (this.initPrefix) {
        label += this.initPrefix + ".";
    }
    label += id;
    return label;
};


TimeProfiler.prototype.generateId = function() {
    startingId += 1;
    return startingId;
};


//
TimeProfiler.prototype.start = function(id) {
    var label  = this._getLabel(id);
    //log.debug("registering: " + label);

    // console.time(label);
    ids[label] = moment();
};


/**
 * function print end time to the log
 *
 */
TimeProfiler.prototype.endTime = function(id) {
    var label  = this._getLabel(id);
    var diff = this.getTime(id);
    log.info(label + " " + diff);
};


/**
 * description don't print endTime but return it
 *
 */
TimeProfiler.prototype.getTime = function(id) {
    var label = this._getLabel(id);
    var startTime = ids[label];
    if (!startTime) {
        return log.error("Profiling response time error: no such label: " + label);
    }
    var diff = moment() - startTime;
    delete ids[id];
    return diff;
};


// create new scope
TimeProfiler.prototype.createScope = function(id) {
    var newPrefix = this.initPrefix ? this.initPrefix + "." : "";
    newPrefix += id;
    return new TimeProfiler(newPrefix);
};


module.exports = function(id) {

    // return fake if profiling is disabled
    if (config.get("time_profiling_enable") !== true) {
        var FakeProfiler = function () { };
        FakeProfiler.prototype.start = function () {};
        FakeProfiler.prototype.endTime = function () {};
        FakeProfiler.prototype.getTime = function () {};
        FakeProfiler.prototype.createScope = function (id) { return new FakeProfiler(); };
        FakeProfiler.prototype.generateId = function (id) { return "0"; };
        return new FakeProfiler();
    }

    return new TimeProfiler(id);
};

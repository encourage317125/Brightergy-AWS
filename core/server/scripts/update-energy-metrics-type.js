"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({tagType: consts.TAG_TYPE.Metric}, callback);
        },
        function (foundMetrics, callback) {
            async.each(foundMetrics, function(metric, cb) {
                if(metric.name === consts.METRIC_NAMES.Wh || metric.name === consts.METRIC_NAMES.kWh) {
                    metric.metricType = consts.METRIC_TYPE.Calculated;

                    metric.save(cb);
                } else {
                    cb(null);
                }

            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    ], function (err, result) {
        if (err) {
            utils.logError(err);
        } else {
            console.log("Completed");
        }

        process.exit();

    });
});
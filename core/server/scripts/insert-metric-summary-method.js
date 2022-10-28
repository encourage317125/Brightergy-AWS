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
                switch (metric.name) {
                    case consts.METRIC_NAMES.Wh:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Total;
                        break;
                    case consts.METRIC_NAMES.kWh:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Total;
                        break;
                    case consts.METRIC_NAMES.Watts:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Average;
                        break;
                    case consts.METRIC_NAMES.kW:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Average;
                        break;
                    case consts.METRIC_NAMES.WattsMax:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Maximum;
                        break;
                    case consts.METRIC_NAMES.WattsMin:
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Minimum;
                        break;
                    default :
                        metric.summaryMethod = consts.METRIC_SUMMARY_METHODS.Total;
                        break;
                }

                metric.save(cb);

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
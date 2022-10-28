"use strict";
require("../general/models");
var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    TagSchedule = mongoose.model("tagschedule"),
    async = require("async");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            TagSchedule.find({}, callback);
        },
        function (foundSchedule, callback) {
            async.each(foundSchedule, function(item, cb) {
                item.isActive = true;
                item.save(cb);

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
            console.log(err.message);
        } else {
            console.log("Completed!!!");
        }
        process.exit();
    });
});
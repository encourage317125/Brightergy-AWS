"use strict";
require("../general/models");
var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({"name" : "GEM"}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                tag.interval  = 60;

                tag.save(cb);

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
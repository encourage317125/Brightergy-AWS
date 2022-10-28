"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    utils = require("../libs/utils"),
    log = require("../libs/log")(module);


mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                tag.fake = false;
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
            var convertedErr = utils.convertError(err);
            log.error(convertedErr);
        } else {
            console.log("Completed");
        }
        process.exit();
    });
});
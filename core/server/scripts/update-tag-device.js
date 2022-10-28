"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                if (tag.deviceID) {
                 tag.deviceID += utils.generateRandomString(3);
                }

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
            utils.logError(err);
        } else {
            console.log("Completed!!!");
        }
        process.exit();
    });
});
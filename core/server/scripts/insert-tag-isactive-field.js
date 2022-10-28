"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    utils = require("../libs/utils"),
    log = require("../libs/log")(module),
    consts = require("../libs/consts");


mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                if(tag.tagType === consts.TAG_TYPE.Node && tag.manufacturer.toLowerCase() === "brultech") {
                    //gem channel, main line should be active only
                    tag.isActive = tag.deviceID.indexOf("_30") > -1;
                } else {
                    tag.isActive = true;
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
            var convertedErr = utils.convertError(err);
            log.error(convertedErr);
        } else {
            console.log("Completed");
        }
        process.exit();
    });
});
"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils"),
    log = require("../libs/log")(module),
    tagDAO = require("../general/core/dao/tag-dao");


mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            console.log("Find Scope Tags");
            Tag.find({tagType: consts.TAG_TYPE.Scope}, callback);
        },
        function (foundTags, callback) {
            console.log("Update Scope tags count: " + foundTags.length);

            async.each(foundTags, function(tag, cb) {
                tagDAO.setTagTimeZone(tag, function(err) {
                    if(err) {
                        cb(err);
                    } else {
                        tag.save(cb);
                    }
                });
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
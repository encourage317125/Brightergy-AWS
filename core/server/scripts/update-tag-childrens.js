"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    tagDAO = require("../general/core/dao/tag-dao"),
    Tag = mongoose.model("tag"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (tags, callback) {
            async.each(tags, function(tag, tagCallback) {
                async.each(tag.children, function(children, childCallback) {
                    tagDAO.deleteChildbyId(tag._id, children.id, childCallback);
                }, function(childErr, childResult){
                    if (childErr) {
                        tagCallback(childErr, null);
                    } else {
                        tagCallback(null, childResult);
                    }
                });
            }, function (sourceErr, sourceResult) {
                if (sourceErr) {
                    callback(sourceErr, null);
                } else {
                    callback(null, sourceResult);
                }
            });
        }
    ],
    function (err, result) {
        if(err) {
            utils.logError(err);
        } else {
            log.info("[Your DB is now ready with fresh Tag collections!!!]");
        }
        process.exit();
    });
});
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
            Tag.find({$and: [
                {tagType: consts.TAG_TYPE.Node},
                {$or: [
                    {manufacturer: "SMA"},
                    {manufacturer: "Enphase"},
                    {manufacturer: "Fronius International"}
                ]}
            ]}, callback);
        },
        function (foundTags, callback) {

            console.log("Updating nodes: " + foundTags.length);
            async.each(foundTags, function(node, cb) {
                var snPart = node.deviceID.substring(node.deviceID.length - 3);
                node.displayName += (" " + snPart);
                node.save(cb);

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
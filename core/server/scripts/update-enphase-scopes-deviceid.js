"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({$and: [
                {tagType: consts.TAG_TYPE.Scope},
                {device: "Envoy"}
            ]}, callback);
        },
        function (foundScopes, callback) {
            async.each(foundScopes, function(scope, cb) {
                scope.deviceID = "Envoy:" + scope.deviceID;
                scope.save(cb);

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
            console.log(err);
        } else {
            console.log("Completed");
        }

        process.exit();

    });
});
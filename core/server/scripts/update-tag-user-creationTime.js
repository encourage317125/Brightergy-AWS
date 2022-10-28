"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    User = mongoose.model("user"),
    async = require("async"),
    utils = require("../libs/utils"),
    currentTime = new Date();

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                tag.creationTime = currentTime;

                tag.save(cb);

            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            User.find({}, callback);
        },
        function (users, callback) {
            async.each(users, function(user, cb) {
                user.creationTime = currentTime;

                user.save(cb);

            }, function(err) {
                if (err){
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
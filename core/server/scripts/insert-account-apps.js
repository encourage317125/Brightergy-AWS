"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment/index"),
    Account = mongoose.model("account"),
    async = require("async"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Account.find({}, callback);
        },
        function (foundAccounts, callback) {
            async.each(foundAccounts, function(acc, cb) {
                acc.apps = consts.ALLOWED_APPS;
                acc.save(cb);

            }, function(err) {
                callback(err);
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

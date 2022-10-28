"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    User = mongoose.model("user"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function getApp(app) {
        if(app === "Respond") {
            return consts.APPS.Control;
        }
        return app;
    }

    async.waterfall([
        function (callback) {
            User.find({}, callback);
        },
        function (users, callback) {
            users.forEach(function(user){
                if (user.apps.length > 0){
                    for (var i = 0; i < user.apps.length; i++) {
                        user.apps[i] = getApp(user.apps[i]);
                    }
                    user.markModified("apps");
                }

                user.defaultApp = getApp(user.defaultApp);
            });
            async.each(users, function(user, cb) {
                user.save(cb);
            }, function(saveerr) {
                if (saveerr){
                    callback(saveerr);
                } else {
                    callback(null, users);
                }
            });
        }
    ],
    function (err, result) {
        if(err) {
            utils.logError(err);
        } else {
            log.info("[Your DB is now ready with updated app names!]");
        }
        process.exit();
    });
});
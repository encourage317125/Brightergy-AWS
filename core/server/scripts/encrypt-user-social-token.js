"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    User = mongoose.model("user"),
    async = require("async"),
    utils = require("../libs/utils"),
    crypto = require("crypto"),
    cryptyAlgorithm = "aes-256-ctr",
    cryptoKey = config.get("oneall:usertokencryptokey");

function encryptUserToken(userToken){
    var cipher = crypto.createCipher(cryptyAlgorithm, cryptoKey);
    var crypted = cipher.update(userToken,"utf8","hex");
    crypted += cipher.final("hex");
    return crypted;
}

if(!cryptoKey) {
    console.log("Please add crypto key");
    process.exit();
} else {

    mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {

        async.waterfall([
            function (callback) {
                User.find({}, callback);
            },
            function (foundUsers, callback) {
                async.each(foundUsers, function (user, cb) {
                    if (user.socialToken) {
                        user.socialToken = encryptUserToken(user.socialToken);
                        user.save(cb);
                    } else {
                        cb(null);
                    }

                }, function (err) {
                    if (err) {
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
}
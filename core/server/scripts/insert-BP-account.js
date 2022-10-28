"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    consts = require("../libs/consts"),
    accountDAO = require("../general/core/dao/account-dao"),
    userDAO = require("../general/core/dao/user-dao"),
    _ = require("lodash"),
    async = require("async"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            accountDAO.findBPAccount(function (findBPAccountErr, foundBPAccount) {
                if (findBPAccountErr) {
                    callback(findBPAccountErr);
                } else {
                    if(foundBPAccount) {
                        callback(null, foundBPAccount);
                    }
                    else {
                        accountDAO.createBPAccount(function (createBPAccountErr, createdBPAccount) {
                            callback(null, createdBPAccount);
                        });
                    }
                }
            });
        },
        function (BPAccount, callback) {
            userDAO.getUsersByParams({role : consts.USER_ROLES.BP}, function (findBPErr, foundBPUsers) {
                if (findBPErr) {
                    callback(findBPErr);
                } else {
                    async.each(foundBPUsers, function(foundBPUser, foundBPUserCallback) {
                        if(_.indexOf(foundBPUser.accounts, BPAccount._id.toString()) === -1) {
                            userDAO.addUserAccount(foundBPUser, BPAccount, foundBPUserCallback);
                        }
                        else {
                            foundBPUserCallback(foundBPUser);
                        }
                    }, function (err) {
                        if(err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
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

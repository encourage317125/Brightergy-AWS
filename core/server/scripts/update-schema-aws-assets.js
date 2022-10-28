"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    consts = require("../libs/consts"),
    Account = mongoose.model("account"),
    Presentation = mongoose.model("bv_presentation"),
    Dashboard = mongoose.model("ds_dashboard"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {
    async.waterfall([
        function (callback) {
            Account.find({}, callback);
        },
        function (accounts, callback) {
            Presentation.find({}, function(err, presentations) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, accounts, presentations);
                }
            });
        },
        function (accounts, presentations, callback) {
            Dashboard.find({}, function(err, dashboards) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, accounts, presentations, dashboards);
                }
            });
        },
        function (accounts, presentations, dashboards, callback) {
            var collectionNames = ["bv_presentations", "ds_dashboards", "accounts"];

            async.each(collectionNames, function(collectionName, collectionsCallback) {
                var collection = mongoose.connection.db.collection(collectionName);

                collection.update({},
                    { $unset: {
                        gDriveAssetsFolderId: "",
                        gDriveUserFolderId: ""
                    }},
                    { multi: true },
                    collectionsCallback
                );
            }, function(saveerr) {
                if(saveerr) {
                    callback(saveerr, null);
                } else {
                    callback(null, accounts, presentations, dashboards);
                }
            });
        },
        function (accounts, presentations, dashboards, callback) {
            var collectionNames = ["accounts", "bv_presentations", "ds_dashboards"];
            async.each(collectionNames, function(collectionName, collectionsCallback) {
                var collection = mongoose.connection.db.collection(collectionName);
                collection.update({},
                    { $set:{
                        awsAssetsKeyPrefix: ""
                    }},
                    {multi: true},
                    collectionsCallback
                );
            }, function(saveerr) {
                if (saveerr) {
                    callback(saveerr, null);
                } else {
                    callback(null, accounts, presentations, dashboards);
                }
            });
        },
        function (accounts, presentations, dashboards, callback) {
            presentations.forEach(function(presentation){
                presentation.awsAssetsKeyPrefix = utils.generateRandomString(28);
            });
            async.each(presentations, function(presentation, cb) {
                presentation.save(cb);
            }, function(saveerr) {
                if (saveerr){
                    callback(saveerr);
                } else {
                    callback(null, accounts, presentations, dashboards);
                }
            });
        },
        function (accounts, presentations, dashboards, callback) {
            dashboards.forEach(function(dashboard){
                dashboard.awsAssetsKeyPrefix = utils.generateRandomString(28);
            });
            async.each(dashboards, function(dashboard, cb) {
                dashboard.save(cb);
            }, function(saveerr) {
                if (saveerr){
                    callback(saveerr);
                } else {
                    callback(null, accounts, presentations, dashboards);
                }
            });
        },
        function (accounts, presentations, dashboards, callback) {
            accounts.forEach(function(account){
                account.awsAssetsKeyPrefix = utils.generateRandomString(28);
            });
            async.each(accounts, function(account, cb) {
                account.save(cb);
            }, function(saveerr) {
                if (saveerr){
                    callback(saveerr);
                } else {
                    callback(null, consts.OK);
                }
            });
        }
    ],
    function(err, result) {
        if(err) {
            utils.logError(err);
        } else {
            log.info("[Your DB is now \"New Schema\" ready!]");
        }
        process.exit();
    });
});
"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    consts = require("../libs/consts"),
    argv = require("minimist")(process.argv.slice(2)),
    Account = mongoose.model("account"),
    User = mongoose.model("user"),
    Presentation = mongoose.model("bv_presentation"),
    Dashboard = mongoose.model("ds_dashboard"),
    DataSource = mongoose.model("datasource"),
    Tag = mongoose.model("tag"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils"),
    insertTagRules = require("./insert-tag-rules");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    if(!argv.email) {
        //Default BP email address
        argv.email = "emmanuel.ekochu@brightergy.com";
    }
    async.waterfall([
        function (callback) {
            User.find({}, callback);
        },
        function (users, callback) {
            Account.find({}, function(err, accounts) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, users, accounts);
                }
            });
        },
        function (users, accounts, callback) {
            Presentation.find({}, function(err, presentations) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, users, accounts, presentations);
                }
            });
        },
        function (users, accounts, presentations, callback) {
            Dashboard.find({}, function(err, dashboards) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, users, accounts, presentations, dashboards);
                }
            });
        },
        function (users, accounts, presentations, dashboards, callback) {
            DataSource.find({}, function(err, datasources) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, users, accounts, presentations, dashboards, datasources);
                }
            });
        },
        function (users, accounts, presentations, dashboards, datasources, callback) {
            accounts.forEach(function(account){
                account.awsAssetsKeyPrefix = account.get("gDriveAssetsFolderId") ? 
                    account.get("gDriveAssetsFolderId") : utils.generateRandomString(24);
            });
            async.each(accounts, function(account, cb) {
                account.save(cb);
            }, function(saveerr) {
                if (saveerr){
                    callback(saveerr);
                } else {
                    callback(null, users, accounts, presentations, dashboards, datasources);
                }
            });
        },
        function (users, accounts, presentations, dashboards, datasources, callback) {
            //convert user fields
            users.forEach(function(user){
                user.accessibleTags = [];
                for(var i=0; i< user.get("parents").length;i++) {
                    user.accessibleTags.push({
                        id: user.get("parents")[i].id,
                        tagType: user.get("parents")[i].tag
                    });
                }
            });

            async.each(users, function(user, cb) {
                user.save(cb);
            }, function(saveerr) {
                if(saveerr) {
                    callback(saveerr);
                } else {
                    callback(null, users, accounts, presentations, dashboards, datasources);
                }
            });
        },
        function (users, accounts, presentations, dashboards, datasources, callback) {
            //convert presentation fields
            presentations.forEach(function(presentation){
                presentation.tagBindings = [];
                presentation.awsAssetsKeyPrefix = presentation.get("gDriveAssetsFolderId") ? 
                    presentation.get("gDriveAssetsFolderId") : utils.generateRandomString(24);
                for(var i=0; i< presentation.get("parents").length;i++) {
                    presentation.tagBindings.push({
                        id: presentation.get("parents")[i].id,
                        tagType: presentation.get("parents")[i].tag
                    });
                }
            });

            async.each(presentations, function(presentation, cb) {
                presentation.save(cb);
            }, function(saveerr) {
                if(saveerr) {
                    callback(saveerr);
                } else {
                    callback(null, users, accounts, presentations, dashboards, datasources);
                }
            });
        },
        function (users, accounts, presentations, dashboards, datasources, callback) {
            //convert dashboard fields
            dashboards.forEach(function(dashboard){
                dashboard.awsAssetsKeyPrefix = dashboard.get("gDriveAssetsFolderId") ? 
                    dashboard.get("gDriveAssetsFolderId") : utils.generateRandomString(24);
                dashboard.segments = [];
                dashboard.segments.push({
                    id: mongoose.Types.ObjectId(),
                    name: "Untitled Segment",
                    tagBindings: []
                });
                for(var i=0; i< dashboard.get("parents").length;i++) {
                    dashboard.segments[0].tagBindings.push({
                        id: dashboard.get("parents")[i].id,
                        tagType: dashboard.get("parents")[i].tag
                    });
                }
                //set layout default values
                if(!dashboard.layout || utils.isNumber(dashboard.layout)) {
                    dashboard.layout =  {
                        selectedStyle: 2,
                        widgets: []
                    };
                }

                var newDashboard = new Dashboard(dashboard);
                delete newDashboard.widgets;
                newDashboard.widgets = [];

                var widgetsArray = dashboard.widgets;

                if (widgetsArray) {
                    widgetsArray.forEach(function (dsWidget) {
                        newDashboard.widgets.push({widget: dsWidget.widget});
                    });
                }

                delete dashboard.widgets;
                dashboard.widgets = [];
                dashboard.widgets = newDashboard.widgets.slice(0);
            });

            async.each(dashboards, function(dashboard, cb) {
                dashboard.save(cb);
            }, function(saveerr) {
                if(saveerr) {
                    callback(saveerr);
                } else {
                    callback(null, users, accounts, presentations, dashboards, datasources);
                }
            });
        },
        function (users, accounts, presentations, dashboards, datasources, callback) {
            //convert datasources fields
            async.eachSeries(datasources, function(datasource, sourcesCallback) {
                var partialDSObject = new DataSource(datasource);

                delete partialDSObject._id;
                delete partialDSObject.__v;
                delete partialDSObject.dataSourceType;
                delete partialDSObject.parents;
                delete partialDSObject.children;

                var currTag = new Tag(partialDSObject),
                    i = 0,
                    tagItem,
                    bindTagPair;

                currTag._id = datasource._id;
                currTag.tagType = datasource.dataSourceType;
                currTag.parents = [];
                currTag.children = [];
                currTag.usersWithAccess = [];
                currTag.appEntities = [];

                currTag.usersWithAccess.push({id: datasource.creator.toString()});

                for(i=0; i< datasource.get("parents").length; i++) {
                    tagItem = datasource.get("parents")[i];
                    bindTagPair = {id: tagItem.id, tagType: tagItem.tag};
                    currTag.parents.push(bindTagPair);
                }

                for(i=0; i< datasource.get("children").length; i++) {
                    tagItem = datasource.get("children")[i];
                    if(tagItem.tag === "Dashboard" || tagItem.tag === "Presentation") {
                        bindTagPair = {id: tagItem.id, appName: tagItem.tag};
                        currTag.appEntities.push(bindTagPair);
                    } else if(tagItem.tag === "User") {
                        currTag.usersWithAccess.push({id: tagItem.id});
                    } else {
                        bindTagPair = {id: tagItem.id, tagType: tagItem.tag};
                        currTag.children.push(bindTagPair);
                    }
                }
                currTag.save(function(saveerr, saveres) {
                    if(saveerr) {
                        sourcesCallback(saveerr);
                    } else {
                        sourcesCallback(null, saveres);
                    }
                });
            },
            function (sourcesError, sourcesResult) {
                if (sourcesError) {
                    callback(sourcesError, null);
                } else {
                    callback(null, sourcesResult);
                }
            });
        },
        //delete old fields
        function (result, callback) {
            var collectionNames = ["users", "bv_presentations", "ds_dashboards", "accounts"];

            async.each(collectionNames, function(collectionName, collectionsCallback) {
                var collection = mongoose.connection.db.collection(collectionName);

                collection.update({},
                    { $unset: {
                        sourceFacilities: "",
                        sourceDataLoggers: "",
                        sourceSensors: "",
                        sourceMetrics: "",
                        children: "",
                        parents: "",
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
                    callback(null, consts.OK);
                }
            });
        },
        function (result, callback) {
            var collectionNames = ["tagrules"];

            async.each(collectionNames, function(collectionName, collsCallback) {
                var collection = mongoose.connection.db.collection(collectionName);

                if (collection) {
                    collection.drop(collsCallback);
                } else {
                    collsCallback(null, consts.OK);
                }
            }, function(removeErr) {
                if(removeErr) {
                    callback(removeErr, null);
                } else {
                    callback(null, consts.OK);
                }
            });
        },
        function (result, callback) {
            insertTagRules.insertTagRules(argv.email, callback);
        },
        function (result, callback) {
            // Removing the datasources collection
            mongoose.connection.db.collection("datasources").drop(callback);
        }
    ],
    function (err, result) {
        if(err) {
            utils.logError(err);
        } else {
            log.info("[Your DB is now \"New Schema\" ready!]");
        }
        process.exit();
    });
});
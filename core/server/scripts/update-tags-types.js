"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    User = mongoose.model("user"),
    Dashboard = mongoose.model("ds_dashboard"),
    Presentation = mongoose.model("bv_presentation"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils"),
    log = require("../libs/log")(module),
    insertTagRules = require("./seeder/insert-tag-rules");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function getNewtagType(oldValue) {
        switch (oldValue) {
            case "Sensor":
                return consts.TAG_TYPE.Node;
            case "DataLogger":
                return consts.TAG_TYPE.Scope;
            default:
                return oldValue;
        }
    }

    async.waterfall([
        function (callback) {
            console.log("Find tags");
            Tag.find({}, callback);
        },
        function (foundTags, callback) {
            console.log("Save tags: " + foundTags.length);
            async.each(foundTags, function(tag, cb) {

                tag.tagType = getNewtagType(tag.tagType);
                var i=0;

                for(i=0; i < tag.children.length; i++) {
                    tag.children[i].tagType = getNewtagType(tag.children[i].tagType);
                }

                for(i=0; i < tag.parents.length; i++) {
                    tag.parents[i].tagType = getNewtagType(tag.parents[i].tagType);
                }

                tag.save(cb);

            }, function(err) {
                callback(err);
            });
        },
        function( callback) {
            console.log("Find users");
            User.find({}, callback);
        }, function(foundUsers, callback) {
            console.log("Save users: " + foundUsers.length);
            async.each(foundUsers, function(user, cb) {
                for(var i=0; i < user.accessibleTags.length; i++) {
                    user.accessibleTags[i].tagType = getNewtagType(user.accessibleTags[i].tagType);
                }

                user.save(cb);

            }, function(err) {
                callback(err);
            });
        }, function(callback) {
            console.log("Find dashboards");
            Dashboard.find({}, callback);
        }, function(foundDashboards, callback) {
            console.log("Save dashboards: " + foundDashboards.length);
            async.each(foundDashboards, function(dashboard, cb) {
                for(var i=0; i < dashboard.segments.length; i++) {

                    for(var j=0; j < dashboard.segments[i].tagBindings.length; j++) {
                        dashboard.segments[i].tagBindings[j].tagType =
                            getNewtagType(dashboard.segments[i].tagBindings[j].tagType);
                    }
                }

                dashboard.save(cb);

            }, function(err) {
                callback(err);
            });
        },
        function(callback) {
            console.log("Find presentations");
            Presentation.find({}, callback);
        }, function(foundPresentations, callback) {
            console.log("Save presentations: " + foundPresentations.length);
            async.each(foundPresentations, function(presentation, cb) {
                for(var i=0; i < presentation.tagBindings.length; i++) {
                    presentation.tagBindings[i].tagType = getNewtagType(presentation.tagBindings[i].tagType);
                }

                presentation.save(cb);

            }, function(err) {
                callback(err);
            });
        }, function(callback) {
            console.log("Insert tag rules");
            insertTagRules.insertTagRules(callback);
        }
    ], function (err, result) {
        if (err) {
            var convertedErr = utils.convertError(err);
            log.error(convertedErr);
        } else {
            console.log("Completed");
        }
        process.exit();
    });
});
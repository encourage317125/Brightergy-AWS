"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    User = mongoose.model("user"),
    async = require("async"),
    consts = require("../libs/consts"),
    log = require("../libs/log")(module),
    utils = require("../libs/utils"),
    _ = require("lodash");

function insertMetricUser() {
    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function(foundTags, cb) {
            User.find({}, function(err, users) {
                cb(err, foundTags, users);
            });
        },
        function (foundTags, users, callback) {

            var tagsToInsert = [];
            var tagsMap = {};
            var usersToInsert = [];
            var usersMap = {};

            _.each(foundTags, function(tag) {
                tagsMap[tag._id.toString()] = tag;
            });

            _.each(users, function(user) {
                usersMap[user._id.toString()] = user;
            });

            for(var i=0; i < foundTags.length; i++) {
                if(foundTags[i].tagType === consts.TAG_TYPE.Metric) {
                    var facilitiesId = _.filter(foundTags[i].parents, function(p) {
                        return p.tagType === consts.TAG_TYPE.Facility;
                    });// jshint ignore:line

                    if(facilitiesId.length > 0) {
                        var facilityId = facilitiesId[0].id.toString();
                        var facility = tagsMap[facilityId];
                        if (!facility) {
                            throw new Error("Logic error");
                        }

                        if (facility.usersWithAccess.length > 0) {
                            var thisUserId = facility.usersWithAccess[0].id.toString();
                            var user = usersMap[thisUserId];
                            if (!user) {
                                throw new Error("Logic error");
                            }

                            //find users in metrioc with that Id
                            var existingUsers = _.filter(foundTags[i].usersWithAccess, function (user) {
                                return user.id.toString() === thisUserId;
                            });// jshint ignore:line
                            if (existingUsers.length === 0) {
                                foundTags[i].usersWithAccess.push(facility.usersWithAccess[0]);

                                user.accessibleTags.push({
                                    "tagType": "Facility",
                                    "id": foundTags[i]._id
                                });

                                tagsToInsert.push(foundTags[i]);

                                usersToInsert.push(user);
                            }
                        }
                    }
                }
            }

            console.log("Update metrics: " + tagsToInsert.length);
            console.log("Update users: " + usersToInsert.length);

            callback(null, tagsToInsert, usersToInsert);
        },
        function(tagsToInsert, usersToInsert, callback) {
            async.each(tagsToInsert, function(tag, cb) {
                tag.save(cb);
            }, function(err) {
                callback(err, usersToInsert);
            });
        },
        function(usersToInsert, callback) {
            async.eachSeries(usersToInsert, function(user, cb) {
                user.save(cb);
            }, function(err) {
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            var correctErr = utils.convertError(err);
            log.error(correctErr);
        } else {
            console.log("OK");
        }

        process.exit();
    });


}

mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {

    insertMetricUser();
});
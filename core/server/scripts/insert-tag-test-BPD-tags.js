"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    Tag = mongoose.model("tag"),
    consts = require("../libs/consts"),
    config = require("../../config/environment"),
    async = require("async"),
    utils = require("../libs/utils"),
    log = require("../libs/log")(module);


mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({deviceID: new RegExp("^"+"c4:4e:ac:07:ac:cf"+"$", "i")}, callback);
        },
        function (foundTag, callback) {
            if (foundTag.length > 0) {
                callback("Tag with deviceID c4:4e:ac:07:ac:cf already exists. Please delete it first.");
            } else {
                Tag.find({deviceID: new RegExp("^"+"c4:4e:ac:0d:6e:33"+"$", "i")}, callback);
            }
        },
        function (foundTag, callback) {
            if (foundTag.length > 0) {
                callback("Tag with deviceID c4:4e:ac:0d:6e:33 already exists. Please delete it first.");
            } else {
                Tag.find({deviceID: new RegExp("^"+"CC:FA:00:CB:78:98"+"$", "i")}, callback);
            }
        },
        function (foundTag, callback) {
            if (foundTag.length > 0) {
                callback("Tag with deviceID CC:FA:00:CB:78:98 already exists. Please delete it first.");
            } else {
                callback(null);
            }
        },
        function (callback) {
            var tags = [];
            tags.push({
                "_id" : new ObjectId("55521cf9a25a0c541b38d90b"),
                "name" : "BPD-Mx2",
                "displayName" : "Brightergy Present Display",
                "tagType" : "BPD",
                "creatorRole" : "BP",
                "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                "potentialPower" : null,
                "nodeType" : null,
                "bpLock" : false,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : new ObjectId("55521beaa25a0c541b38d907"),
                        "tagType" : "Facility"
                    }
                ],
                "summaryMethod" : null,
                "formula" : null,
                "metricID" : null,
                "metricType" : null,
                "metric" : null,
                "rate" : null,
                "sensorTarget" : null,
                "password" : null,
                "username" : null,
                "dateTimeFormat" : "Local Time",
                "timezone" : "Central Standard Time",
                "enphaseUserId" : null,
                "endDate" : null,
                "weatherStation" : null,
                "longitude" : null,
                "latitude" : null,
                "webAddress" : null,
                "interval" : null,
                "destination" : null,
                "accessMethod" : null,
                "deviceID" : "c4:4e:ac:07:ac:cf",
                "device" : "MX2",
                "manufacturer" : "Matricom",
                "utilityAccounts" : [],
                "utilityProvider" : null,
                "nonProfit" : null,
                "taxID" : null,
                "address" : null,
                "street" : null,
                "state" : null,
                "postalCode" : null,
                "country" : null,
                "city" : null,
                "__v" : 0
            });

            tags.push({
                "_id" : new ObjectId("55521cf9a25a0c541b38d90c"),
                "name" : "Pavel's BPD",
                "displayName" : "Pavel's BPD",
                "tagType" : "BPD",
                "creatorRole" : "BP",
                "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                "potentialPower" : null,
                "nodeType" : null,
                "bpLock" : false,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : new ObjectId("55521beaa25a0c541b38d907"),
                        "tagType" : "Facility"
                    }
                ],
                "summaryMethod" : null,
                "formula" : null,
                "metricID" : null,
                "metricType" : null,
                "metric" : null,
                "rate" : null,
                "sensorTarget" : null,
                "password" : null,
                "username" : null,
                "dateTimeFormat" : "Local Time",
                "timezone" : null,
                "enphaseUserId" : null,
                "endDate" : null,
                "weatherStation" : null,
                "longitude" : null,
                "latitude" : null,
                "webAddress" : null,
                "interval" : null,
                "destination" : null,
                "accessMethod" : null,
                "deviceID" : "c4:4e:ac:0d:6e:33",
                "device" : "MX2",
                "manufacturer" : "Matricom",
                "utilityAccounts" : [],
                "utilityProvider" : null,
                "nonProfit" : null,
                "taxID" : null,
                "address" : null,
                "street" : null,
                "state" : null,
                "postalCode" : null,
                "country" : null,
                "city" : null,
                "__v" : 0
            });

            tags.push({
                "_id" : new ObjectId("55521cf9a25a0c541b38d90d"),
                "name" : "Pavel's BPD Sub 2",
                "displayName" : "Pavel's BPD Sub 2",
                "tagType" : "BPD",
                "creatorRole" : "BP",
                "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                "potentialPower" : null,
                "nodeType" : null,
                "bpLock" : false,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : new ObjectId("55521beaa25a0c541b38d907"),
                        "tagType" : "Facility"
                    }
                ],
                "summaryMethod" : null,
                "formula" : null,
                "metricID" : null,
                "metricType" : null,
                "metric" : null,
                "rate" : null,
                "sensorTarget" : null,
                "password" : null,
                "username" : null,
                "dateTimeFormat" : "Local Time",
                "timezone" : null,
                "enphaseUserId" : null,
                "endDate" : null,
                "weatherStation" : null,
                "longitude" : null,
                "latitude" : null,
                "webAddress" : null,
                "interval" : null,
                "destination" : null,
                "accessMethod" : null,
                "deviceID" : "CC:FA:00:CB:78:98",
                "device" : "MX2",
                "manufacturer" : "Matricom",
                "utilityAccounts" : [],
                "utilityProvider" : null,
                "nonProfit" : null,
                "taxID" : null,
                "address" : null,
                "street" : null,
                "state" : null,
                "postalCode" : null,
                "country" : null,
                "city" : null,
                "__v" : 0
            });

            async.each(tags, function (tag, saveCallback) {
                var TagModel = new Tag(tag);
                TagModel.save(saveCallback);
            }, function (saveErr, saveResult) {
                if (saveErr) {
                    callback(saveErr);
                } else {
                    callback(null, consts.OK);
                }
            });
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
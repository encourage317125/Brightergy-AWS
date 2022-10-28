"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    Group = mongoose.model("group"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertGroups(finalCallback) {

    Group.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var groups = [];
                    groups.push({
                        "_id": new ObjectId("54d49a63b806256d1059ac29"),
                        name: "GroupC",
                        usersWithAccess: [],
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        children: [ 
                            {
                                "id" : new ObjectId("54d496f26a983219102e62cd"),
                                "sourceType" : "Group"
                            }, 
                            {
                                "sourceType" : "Node",
                                "id" : new ObjectId("5458af3ffe540a120074c20a")
                            }
                        ]
                    });
                    groups.push({
                        "_id": new ObjectId("54d496f26a983219102e62cd"),
                        name: "GroupA",
                        usersWithAccess: [],
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        children: [
                            {
                                "sourceType" : "Scope",
                                "id" : new ObjectId("549012d1c15488681a64b6ab")
                            }, 
                            {
                                "sourceType" : "Node",
                                "id" : new ObjectId("5490697f81cda60823657639")
                            }
                        ]
                    });
                    groups.push({
                        "_id": new ObjectId("54d497f46a983219102e62ce"),
                        name: "GroupB",
                        usersWithAccess: [],
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        children: [
                            {
                                "id" : new ObjectId("54d496f26a983219102e62cd"),
                                "sourceType" : "Group"
                            }, 
                            {
                                "sourceType" : "Node",
                                "id" : new ObjectId("5458a8a95409c90e00884ce0")
                            }, 
                            {
                                "sourceType" : "Scope",
                                "id" : new ObjectId("5458a84f5409c90e00884cdf")
                            }, 
                            {
                                "sourceType" : "Metric",
                                "id" : new ObjectId("5458a8bc5409c90e00884ce1")
                            }
                        ]
                    });
                    async.each(groups, function (groupObj, saveCallback) {
                        var groupModel = new Group(groupObj);
                        groupModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                },
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertGroups = insertGroups;
"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    consts = require("../libs/consts"),
    argv = require("minimist")(process.argv.slice(2)),
    TagRule = mongoose.model("tagrule"),
    userDA0 = require("../general/core/dao/user-dao"),
    async = require("async"),
    log = require("../libs/log")(module),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            TagRule.remove({}, callback);
        },
        function (param1, param2, callback) {

            userDA0.getUserByEmail(argv.email, callback);
        },
        function (currentUser, callback) {
            if (currentUser.role !== consts.USER_ROLES.BP) {
                var error = new Error("User role must be BP");
                error.status = 422;
                callback(error);
            } else {
                callback(null, currentUser);
            }
        },
        function (currentUser, callback) {
            var rules = [];
            //facility
            rules.push({
                tagType: consts.TAG_TYPE.Facility,
                allowedParentTagTypes: ["None"],
                allowedChildrenTagTypes: [consts.TAG_TYPE.Scope, consts.TAG_TYPE.WeatherStation],
                creatorRole: currentUser.role,
                creator: currentUser._id
            });
            //datalogger
            rules.push({
                tagType: consts.TAG_TYPE.Scope,
                allowedParentTagTypes: [consts.TAG_TYPE.Facility, consts.TAG_TYPE.WeatherStation],
                allowedChildrenTagTypes: [consts.TAG_TYPE.Node, consts.TAG_TYPE.WeatherStation],
                creatorRole: currentUser.role,
                creator: currentUser._id
            });
            //weatherstation
            rules.push({
                tagType: consts.TAG_TYPE.WeatherStation,
                allowedParentTagTypes: [consts.TAG_TYPE.Facility, consts.TAG_TYPE.Scope],
                allowedChildrenTagTypes: [consts.TAG_TYPE.Node, consts.TAG_TYPE.Scope],
                creatorRole: currentUser.role,
                creator: currentUser._id
            });
            //sensor
            rules.push({
                tagType: consts.TAG_TYPE.Node,
                allowedParentTagTypes: [consts.TAG_TYPE.Scope, consts.TAG_TYPE.WeatherStation],
                allowedChildrenTagTypes: [consts.TAG_TYPE.Metric],
                creatorRole: currentUser.role,
                creator: currentUser._id
            });
            //metric
            rules.push({
                tagType: consts.TAG_TYPE.Metric,
                allowedParentTagTypes: [consts.TAG_TYPE.Node],
                creatorRole: currentUser.role,
                creator: currentUser._id
            });

            async.each(rules, function (ruleObj, saveCallback) {
                var ruleModel = new TagRule(ruleObj);
                ruleModel.save(saveCallback);
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
        } else {
            log.info(result);
        }

        process.exit();

        // Calling from another script - don't want to exit process just yet!
        //process.exit();
    });
});




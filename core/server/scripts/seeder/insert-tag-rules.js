"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    TagRule = mongoose.model("tagrule"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

//mongoose.connect(config.get("db:connection"), config.get("db:options"));

function insertTagRules(finalCallback) {

    TagRule.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var rules = [];
                    //facility
                    rules.push({
                        "_id": new ObjectId("545cbd822301d3ec1fe024da"),
                        tagType: consts.TAG_TYPE.Facility,
                        allowedParentTagTypes: ["None"],
                        allowedChildrenTagTypes: [
                            consts.TAG_TYPE.Scope,
                            consts.TAG_TYPE.WeatherStation,
                            consts.TAG_TYPE.BPD],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
                    });
                    //datalogger
                    rules.push({
                        "_id": new ObjectId("545cbd822301d3ec1fe024db"),
                        tagType: consts.TAG_TYPE.Scope,
                        allowedParentTagTypes: [
                            consts.TAG_TYPE.Facility,
                            consts.TAG_TYPE.WeatherStation,
                            consts.TAG_TYPE.Scope
                        ],
                        allowedChildrenTagTypes: [
                            consts.TAG_TYPE.Node,
                            consts.TAG_TYPE.WeatherStation,
                            consts.TAG_TYPE.Scope
                        ],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
                    });
                    //weatherstation
                    rules.push({
                        tagType: consts.TAG_TYPE.WeatherStation,
                        allowedParentTagTypes: [consts.TAG_TYPE.Facility, consts.TAG_TYPE.Scope],
                        allowedChildrenTagTypes: [consts.TAG_TYPE.Node, consts.TAG_TYPE.Scope],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
                    });
                    //sensor
                    rules.push({
                        "_id": new ObjectId("545cbd822301d3ec1fe024dc"),
                        tagType: consts.TAG_TYPE.Node,
                        allowedParentTagTypes: [consts.TAG_TYPE.Scope, consts.TAG_TYPE.WeatherStation],
                        allowedChildrenTagTypes: [consts.TAG_TYPE.Metric],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
                    });
                    //metric
                    rules.push({
                        "_id": new ObjectId("545cbd822301d3ec1fe024dd"),
                        tagType: consts.TAG_TYPE.Metric,
                        allowedParentTagTypes: [consts.TAG_TYPE.Node],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
                    });
                    //BPD
                    rules.push({
                        tagType: consts.TAG_TYPE.BPD,
                        allowedParentTagTypes: [consts.TAG_TYPE.Facility],
                        allowedChildrenTagTypes: [],
                        "creatorRole": "BP",
                        "creator": new ObjectId("5416f4647fd9bfec17c6253d")
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
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertTagRules = insertTagRules;
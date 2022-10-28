"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    config = require("../../config/environment"),
    TagRule = mongoose.model("tagrule"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {
    async.waterfall([
            function (callback) {
                TagRule.find({tagType: consts.TAG_TYPE.BPD}, callback);
            },
            function (foundRules, callback) {
                if (foundRules.length > 0) {
                    callback(null, "Tag rule for BPD already exists! So didn't add the requested one.");
                } else {
                    var rules = [];
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
                            callback(null, "Tag rule for BPD has been added successfully!");
                        }
                    });
                }
            },
            
        ],
        function (err, result) {
            if(err) {
                var correctErr = utils.convertError(err);
                log.error(correctErr);
            } else {
                log.info(result);
            }
            process.exit();
        });
});
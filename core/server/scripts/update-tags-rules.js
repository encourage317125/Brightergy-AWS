"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    TagRule = mongoose.model("tagrule"),
    log = require("../libs/log")(module),
    async = require("async"),
    utils = require("../libs/utils"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {
    async.waterfall([
            function (callback) {
                TagRule.find({tagType: consts.TAG_TYPE.Scope}, callback);
            },
            function (rules, callback) {
                rules.forEach(function(rule){

                    rule.allowedParentTagTypes.push(consts.TAG_TYPE.Scope);
                    rule.allowedChildrenTagTypes.push(consts.TAG_TYPE.Scope);
                });
                async.each(rules, function(rule, cb) {
                    rule.save(cb);
                }, function(saveerr) {
                    if (saveerr){
                        callback(saveerr);
                    } else {
                        callback(null, rules);
                    }
                });
            }
        ],
        function (err, result) {
            if(err) {
                utils.logError(err);
            } else {
                log.info("[Your DB is now ready with updated app names!]");
            }
            process.exit();
        });
});
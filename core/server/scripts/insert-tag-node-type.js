"use strict";
require("../general/models");
var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({tagType: consts.TAG_TYPE.Node}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                if (tag.manufacturer.toLowerCase().indexOf("egauge") > -1) {
                    tag.nodeType  = consts.NODE_TYPE.Supply;
                } else if(tag.manufacturer.toLowerCase().indexOf("sma") > -1) {//webbox
                    tag.nodeType  = consts.NODE_TYPE.Solar;
                } else if(tag.manufacturer.toLowerCase().indexOf("enphase") > -1) {
                    tag.nodeType  = consts.NODE_TYPE.Solar;
                }

                tag.save(cb);

            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    ], function (err, result) {
        if (err) {
           console.log(err.message);
        } else {
            console.log("Completed!!!");
        }
        process.exit();
    });
});
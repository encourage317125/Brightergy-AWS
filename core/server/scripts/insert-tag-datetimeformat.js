"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            Tag.find({tagType: consts.TAG_TYPE.Scope}, callback);
        },
        function (foundTags, callback) {
            async.each(foundTags, function(tag, cb) {
                switch(tag.manufacturer) {
                    case "eGauge":
                        tag.dateTimeFormat = consts.DATE_TIME_FORMAT.UTC;
                        break;
                    case "Enphase":
                        tag.dateTimeFormat = consts.DATE_TIME_FORMAT.UTC;
                        break;
                    case "SMA":
                        tag.dateTimeFormat = consts.DATE_TIME_FORMAT.AutomaticDaylightSavings;
                        break;
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
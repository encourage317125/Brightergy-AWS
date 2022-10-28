"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts"),
    log = require("../libs/log")(module),
    utils = require("../libs/utils"),
    _ = require("lodash"),
    argv = require("minimist")(process.argv.slice(2));

function buildParents(tag, TagsMap) {
    for(var i=0; i < tag.children.length;i++) {
        var child = TagsMap[tag.children[i].id.toString()];

        //copy all parentsId from parents to child
        if(tag.parents.length > 0) {
            //parent has own parents
            child.parents = _.union(child.parents, tag.parents);
        }

        buildParents(child, TagsMap);
    }
}

function insertALLTagParents(finalCallback) {
    async.waterfall([
        function (callback) {
            Tag.find({}, callback);
        },
        function (foundTags, callback) {

            var tagsMap = {};
            _.each(foundTags, function(tag) {
                tagsMap[tag._id.toString()] = tag;
            });

            for(var i=0; i < foundTags.length; i++) {
                if(foundTags[i].tagType === consts.TAG_TYPE.Facility) {
                    buildParents(foundTags[i], tagsMap);
                }
            }

            var tagsToInsert = _.values(tagsMap);
            async.each(tagsToInsert, function(tag, cb) {
                tag.save(cb);
            }, function(err) {
                callback(err);
            });
        }
    ], function (err, result) {
        if (err) {
            var correctErr = utils.convertError(err);
            log.error(correctErr);
            if(finalCallback) {
                return finalCallback(correctErr, null);
            }
        } else {
            log.info(result);
            if(finalCallback) {
                return finalCallback(null, result);
            }
        }

        if(!finalCallback) {
            console.log("OK");
            process.exit();
        }
    });


}

if(argv.run) {

    mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {

        insertALLTagParents(null);
    });
}

exports.insertALLTagParents = insertALLTagParents;
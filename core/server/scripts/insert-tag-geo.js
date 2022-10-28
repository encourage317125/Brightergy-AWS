"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
    config = require("../../config/environment"),
    async = require("async"),
    consts = require("../libs/consts"),
    sf = require("node-salesforce");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([

        function(callback) {
            console.log("LOADING SF ASSETS");
            var username = config.get("salesforce:auth:username");
            var password = config.get("salesforce:auth:password");

            var con = new sf.Connection({
                loginUrl: config.get("salesforce:auth:url")
            });

            con.login(username, password, function (authErr, userInfo) {
                if (authErr) {
                    callback(authErr, null);
                } else {
                    con.sobject("Project__c")
                        .select("Id, Name, UtilityTerritory_Latitude__c, UtilityTerritory_Longitude__c")
                        .where("UtilityTerritory_Latitude__c != null and UtilityTerritory_Longitude__c != null")
                        .execute(callback);
                }
            });
        },
        function(projects, callback) {
            Tag.find({}, function (tagsErr, foundTags) {
                callback(tagsErr, foundTags, projects);
            });
        }, function(foundTags, projects, callback) {

            var projectsMap ={};
            var tagsObj = {};
            var i= 0, j= 0, k=0;

            for(i=0; i < foundTags.length; i++) {
                tagsObj[foundTags[i]._id.toString()] = foundTags[i];
            }

            for(i=0; i < projects.length; i++) {
                projectsMap[projects[i].Name] = {
                    latitude: projects[i]["UtilityTerritory_Latitude__c"],
                    longitude: projects[i]["UtilityTerritory_Longitude__c"]
                };
            }

            var tagsToUpdate = [];

            var childId = null, child = null;
            for(i=0; i < foundTags.length; i++) {
                var tag = foundTags[i];
                if(tag.tagType === consts.TAG_TYPE.Facility) {
                    var thisProjectName = tag.name;

                    if (projectsMap[thisProjectName]) {

                        var lat = projectsMap[thisProjectName].latitude;
                        var long = projectsMap[thisProjectName].longitude;

                        if(lat && long) {
                            //insert latitude/longitude to scopes and nodes
                            for (j = 0; j < tag.children.length; j++) {
                                childId = tag.children[j].id.toString();
                                child = tagsObj[childId];

                                if(child.tagType === consts.TAG_TYPE.Scope) {

                                    child.latitude = lat;
                                    child.longitude = long;

                                    tagsToUpdate.push(child);

                                    for (k = 0; k < child.children.length; k++) {
                                        var nodeId = child.children[k].id.toString();
                                        var node = tagsObj[nodeId];

                                        if (node.tagType === consts.TAG_TYPE.Node) {
                                            node.latitude = lat;
                                            node.longitude = long;
                                            tagsToUpdate.push(node);
                                        }
                                    }
                                }
                            }
                        }

                        tagsToUpdate.push(tag);
                    }
                }
            }

            callback(null, tagsToUpdate);

        }, function(tagsToSave, callback) {
            async.each(tagsToSave, function(tag, cb) {
                tag.save(cb);
            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, consts.OK);
                }
            });
        }], function(err, result) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Completed!!!");
            console.log(result);
        }

        process.exit();
    });
});
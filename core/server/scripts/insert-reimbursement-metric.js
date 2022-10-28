"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function getReimbursementMetric(node, energyMetric) {
        if (energyMetric) {
            var metricObj = {
                "_id": mongoose.Types.ObjectId(),
                "name": consts.METRIC_NAMES.Reimbursement,
                "tagType": consts.TAG_TYPE.Metric,
                "creatorRole": energyMetric.creatorRole,
                "creator": energyMetric.creator,
                "bpLock": false,
                "usersWithAccess": [],
                "appEntities": [],
                "children": [],
                "parents": [
                    {
                        "id": node._id,
                        "tagType": consts.TAG_TYPE.Node
                    }
                ],
                "summaryMethod": "Total",
                "metricID": energyMetric.metricID,
                "metricType": "Calculated",
                "metric": "Standard",
                "rate": 0.1
            };

            node.children.push({
                "id": metricObj._id,
                "tagType": consts.TAG_TYPE.Metric
            });

            return new Tag(metricObj);
        } else {
            return null;
        }
    }

    async.waterfall([
        function (callback) {
            Tag.find({tagType: consts.TAG_TYPE.Node}, callback);
        },
        function (foundNodes, callback) {
            Tag.find({tagType: consts.TAG_TYPE.Metric}, function(err, foundMetrics) {
                callback(err, foundNodes, foundMetrics);
            });
        },
        function(foundNodes, foundMetrics, callback) {
            var metricsMap = {};
            var powerMetricsMap = {};
            var i=0;

            for(i=0; i < foundMetrics.length; i++) {
                var parentNodeId = foundMetrics[i].parents[0].id.toString();

                if(!metricsMap[parentNodeId]) {
                    metricsMap[parentNodeId] = [];
                }

                metricsMap[parentNodeId].push(foundMetrics[i].name);

                if(foundMetrics[i].name === consts.METRIC_NAMES.kW) {
                    powerMetricsMap[parentNodeId] = foundMetrics[i];
                }
            }

            var tagsToSave =[];

            for(i = 0; i < foundNodes.length; i++) {
                var nodeId = foundNodes[i]._id.toString();

                if(metricsMap[nodeId] && metricsMap[nodeId].indexOf(consts.METRIC_NAMES.Reimbursement) < 0) {
                    //Reimb metric not found

                    var reimbrMetric = getReimbursementMetric(foundNodes[i], powerMetricsMap[nodeId]);

                    if(reimbrMetric) {
                        tagsToSave.push(reimbrMetric);
                        tagsToSave.push(foundNodes[i]);
                    }
                }
            }

            callback(null, tagsToSave);
        },
        function(tagsToSave, callback) {
            async.each(tagsToSave, function(tag, cb) {
                tag.save(cb);
            }, function(err) {
                callback(err);
            });
        }
    ], function (err, result) {
        if (err) {
            utils.logError(err);
        } else {
            console.log("Completed");
        }
        process.exit();
    });
});
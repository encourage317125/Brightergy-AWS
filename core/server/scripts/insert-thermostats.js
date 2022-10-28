"use strict";
require("../general/models");
var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    argv = require("minimist")(process.argv.slice(2)),
    log = require("../libs/log")(module),
    consts = require("../libs/consts"),
    fs = require("fs"),
    _ = require("lodash");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function logError(err) {
        log.error(err.message);
        return process.exit();
    }

    function getTagsForInsert(gateway, fileData) {
        var newTags = [];
        for (var i = 0; i < fileData.thermostats.length; i++) {
            var thermostat = fileData.thermostats[i];
            if (!thermostat.deviceID || !thermostat.name) {
                return logError(new Error("Please specify correct thermostat data"));
            }

            var node = new Tag({
                tagType: consts.TAG_TYPE.Node,
                name: thermostat.name,
                displayName: thermostat.name,
                creator: gateway.creator,
                creatorRole: gateway.creatorRole,
                potentialPower: 0,
                nodeType: consts.NODE_TYPE.Thermostat,
                deviceID: thermostat.deviceID,
                device: thermostat.device || "Pearl Thermostat",
                manufacturer: thermostat.manufacturer ||"Centralite",
                interval: "Hourly",
                longitude: gateway.longitude,
                latitude: gateway.latitude,
                weatherStation: gateway.weatherStation,
                billingInterval: 30,
                parents: [{
                    tagType: consts.TAG_TYPE.Scope,
                    id: gateway._id
                }]
            });

            var j=0;
            for(j=0; j < gateway.parents.length; j++) {
                node.parents.push(gateway.parents[j]);
            }

            var metric = new Tag({
                tagType: consts.TAG_TYPE.Metric,
                name: consts.METRIC_NAMES.Temperature,
                creator: node.creator,
                creatorRole: node.creatorRole,
                nodeType: node.nodeType,
                summaryMethod: consts.METRIC_SUMMARY_METHODS.Average,
                externalId: gateway.deviceID + "-" + node.deviceID + "-" + "Temp",
                metricID: "desired_temperature",
                metricType: consts.METRIC_TYPE.Datafeed,
                metric: "Standard",
                dateTimeFormat: gateway.dateTimeFormat,
                timezone: gateway.timezone,
                longitude: gateway.longitude,
                latitude: gateway.latitude,
                deviceID: node.deviceID,
                device: node.device,
                manufacturer: node.manufacturer,
                billingInterval: node.billingInterval,
                datacoreMetricID : "Temp",
                parents: [{
                    tagType: consts.TAG_TYPE.Node,
                    id: node._id
                }]
            });

            for(j=0; j < node.parents.length; j++) {
                metric.parents.push(node.parents[j]);
            }

            node.children.push({
                tagType: consts.TAG_TYPE.Metric,
                id: metric._id
            });

            gateway.children.push({
                tagType: consts.TAG_TYPE.Node,
                id: node._id
            });

            newTags.push(metric);
            newTags.push(node);
        }

        newTags.push(gateway);
        return newTags;

    }

    var insertData = null;

    try {
        if (!argv.file) {
            throw new Error("Please specify file");
        }

        var fileData = fs.readFileSync(argv.file, "utf8");
        insertData = JSON.parse(fileData);
    } catch (err) {
        return logError(err);
    }

    if (!insertData.deviceID || !_.isArray(insertData.thermostats) || insertData.thermostats.length === 0) {
        throw new Error("Please specify gateway Id and thermostats");
    }
    Tag.findOne({deviceID: insertData.deviceID}, function (findGatewayErr, gateway) {
        if (findGatewayErr) {
            return logError(findGatewayErr);
        }
        if (!gateway) {
            return logError(new Error("Gateway doesn't exists with deviceID: " + insertData.deviceID));
        }

        var newTags = getTagsForInsert(gateway, insertData);
        async.each(newTags, function (tag, cb) {
            tag.save(cb);
        }, function (saveTagErr) {
            if (saveTagErr) {
                return logError(saveTagErr);
            } else {
                log.info("Completed!!!");
                process.exit();
            }
        });
    });
});
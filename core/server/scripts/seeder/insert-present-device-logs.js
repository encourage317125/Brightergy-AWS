"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    presentDeviceLog = mongoose.model("presentDeviceLog"),
    async = require("async"),
    log = require("../../libs/log")(module),
    moment = require("moment"),
    utils = require("../../libs/utils");

function insertPresentDeviceLogs(finalCallback) {

    presentDeviceLog.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var presentDeviceLogs = [];
                    presentDeviceLogs.push({
                        "_id": new ObjectId("54d49a63b806256d1059cc29"),
                        "timestamp":  moment("2014-12-01T00:00:00.000Z"),
                        "count": 12,
                        "ethernatStatus": "ethernet status",
                        "wifiStatus": "wifi status",
                        "memUsage": 2048,
                        "wsTrigger": 25,
                        "totalUpTime": 60000,
                        "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00067",
                        "version": "v1"
                    });
                    presentDeviceLogs.push({
                        "_id": new ObjectId("54d49a63b806256d1059dc29"),
                        "timestamp":  moment("2015-01-01T00:00:00.000Z"),
                        "count": 533,
                        "ethernatStatus": "enabled",
                        "wifiStatus": "disabled",
                        "memUsage": 4096,
                        "wsTrigger": 2500,
                        "totalUpTime": 120000,
                        "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00068",
                        "version": "v2"
                    });
                    async.each(presentDeviceLogs, function (presentDeviceLogObj, saveCallback) {
                        var presentDeviceLogModel = new presentDeviceLog(presentDeviceLogObj);
                        presentDeviceLogModel.save(saveCallback);
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

exports.insertPresentDeviceLogs = insertPresentDeviceLogs;
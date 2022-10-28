"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Device = mongoose.model("device"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertDevices(finalCallback) {

    Device.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var devices = [];
                    devices.push({
                        "_id" : new ObjectId("5421ab10885c2846dcce9d3e"),
                        "name" : "Envoy"
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a619885c2846dcce9db4"),
                        "name" : "EG3000"
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a62f885c2846dcce9db5"),
                        "name" : "Sunny WebBox"
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a62f885c2846dcce9db6"),
                        "name" : "Gateway"
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a62f885c2846dcce9db7"),
                        "name" : "Pearl Thermostat",
                        "__v" : 0
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a62f885c2846dcce9db8"),
                        "name" : "GEM",
                        "__v" : 0
                    });
                    devices.push({
                        "_id" : new ObjectId("5458a62f885c2846dcce9db9"),
                        "name" : "XBee ZigBee Gateway",
                        "__v" : 0
                    });
                    async.each(devices, function (device, saveCallback) {
                        var deviceModel = new Device(device);
                        deviceModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
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

exports.insertDevices = insertDevices;
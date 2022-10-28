"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    presentDevice = mongoose.model("presentdevice"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertPresentDevices(finalCallback) {
    presentDevice.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var devices = [];
                    devices.push({
                        "_id": new ObjectId("5421ab10885c2846dcce983e"),
                        "deviceName": "Device1",
                        "connectionType": "type1",
                        "ethernetState": true,
                        "ethernetDevice": "deviceA",
                        "ethernetIpType": "ipTypeA",
                        "ethernetIpAddress": "191.18.0.0",
                        "mask": "mask string",
                        "gateway": "gateWayA",
                        "dns1": "dns1 string",
                        "dns2": "dns2 string",
                        "wifiState": true,
                        "wifiIpAddress": "182.20.3.0",
                        "wifiName": "wifiName",
                        "wifiOpenState": true,
                        "enableCleanup": true,
                        "timeOfExecution": "time of execution",
                        "clearCache": true,
                        "clearOfflineData": true,
                        "clearSessions": true,
                        "clearCookies": true,
                        "clearHistory": true,
                        "clearFormData": true,
                        "clearPasswords": false,
                        "enableScheduleBrowserRestart": false,
                        "configureScheduleBrowserRestart": null,
                        "showStatusOnBrowser": true,
                        "timeIntervalToMonitorStatus": 20000,
                        "timeIntervalToReport": 60000,
                        "preventSuspension": false,
                        "durationToAttemptReconnection": 30000,
                        "enableAutomaticUpdateNewVersion": true,
                        "scheduleUpdateNewVersion": "version",
                        "remoteUpdatePath": "http://test.com",
                        "remoteApkPath": "remote apk path",
                        "userEmail": "dev.web@brightergy.com",
                        "presentationId": new ObjectId("545f2abe649db6140038fc6a"),
                        "deviceId": "68753A44-4D6F-1226-9C60-0050E4C00067",
                        "deviceToken": "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660"
                    });
                    devices.push({
                        "_id": new ObjectId("5421ab10885c2846dcce984e"),
                        "deviceName": "Device2",
                        "connectionType": "type1",
                        "ethernetState": true,
                        "ethernetDevice": "deviceB",
                        "ethernetIpType": "ipTypeB",
                        "ethernetIpAddress": "191.182.100.0",
                        "mask": "mask string",
                        "gateway": "gateWayB",
                        "dns1": "dns1 string",
                        "dns2": "dns2 string",
                        "wifiState": false,
                        "wifiIpAddress": "182.120.3.0",
                        "wifiName": "wifiName",
                        "wifiOpenState": false,
                        "enableCleanup": true,
                        "timeOfExecution": "time of execution",
                        "clearCache": true,
                        "clearOfflineData": true,
                        "clearSessions": true,
                        "clearCookies": true,
                        "clearHistory": true,
                        "clearFormData": true,
                        "clearPasswords": false,
                        "enableScheduleBrowserRestart": false,
                        "configureScheduleBrowserRestart": null,
                        "showStatusOnBrowser": true,
                        "timeIntervalToMonitorStatus": 10000,
                        "timeIntervalToReport": 40000,
                        "preventSuspension": false,
                        "durationToAttemptReconnection": 20000,
                        "enableAutomaticUpdateNewVersion": true,
                        "scheduleUpdateNewVersion": "version",
                        "remoteUpdatePath": "http://test.com",
                        "remoteApkPath": "remote apk path",
                        "userEmail": "dev.web@brightergy.com",
                        "presentationId": new ObjectId("545f8e3a049d8b2700320784"),
                        "deviceId": "68753A44-4D6F-1226-9C60-0050E4C00068",
                        "deviceToken": "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660"
                    });
                    async.each(devices, function (device, saveCallback) {
                        var deviceModel = new presentDevice(device);
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

exports.insertPresentDevices = insertPresentDevices;

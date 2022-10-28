"use strict";

// TODO:: moved to core-service

var log = require("../../../libs/log")(module),
    config = require("../../../../config/environment");
var SNS = require("sns-mobile");

var androidApp = new SNS({
    platform: SNS.SUPPORTED_PLATFORMS.ANDROID,
    region: "us-west-2",
    apiVersion: "2010-03-31",
    accessKeyId: config.get("aws:auth:accesskeyid"),
    secretAccessKey: config.get("aws:auth:secretaccesskey"),
    platformApplicationArn: config.get("aws:snsgcmarn")
    //sandbox: true (This is required for targetting (iOS) APNS_SANDBOX only)
});


function sendMessageToDevice(token, messageBody, callback) {

    log.silly("sending message: " + JSON.stringify(messageBody) + " to device " + token);

    androidApp.addUser(token, "", function(err, endpointArn) {
        if (err) {
            log.error("Can't add user: " + err.message);
            return callback(err);
        }

        log.debug("endpointArn: " + endpointArn);
        // TODO, we can save arn endpoint in redis, for example, and do not register
        // device every time...

        androidApp.sendMessage(endpointArn, JSON.stringify(messageBody), function(err, messageId) {
            if (err) {
                log.error("Can't send message: " + err.message);
            }
            log.silly("messageId: " + messageId);
            return callback(err, messageId);
        });
    });
}

exports.sendMessageToDevice = sendMessageToDevice;

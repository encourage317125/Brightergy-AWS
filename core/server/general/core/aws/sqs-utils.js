"use strict";

// TODO:: moved to core-service

var AWS      = require("aws-sdk");
var async    = require("async");
var config   = require("../../../../config/environment");
var consts   = require("../../../libs/consts");
var awsUtils = require("./utils");

function sendObject(queueName, data, callback) {
    if (!queueName || !data) {
        var err = new Error("Please specify queue name and data object");
        return callback(err);
    }

    awsUtils.setCredentials(AWS);
    var sqs = new AWS.SQS();
    var instance = config.get("instance") || "Default";

    async.waterfall([
        function(cb) {
            var params = {
                QueueName: queueName,
                Attributes: {
                    DelaySeconds: "0"
                }
            };
            sqs.createQueue(params, cb);
        },
        function(queueParameters, cb) {
            data.instance = instance;
            var params = {
                MessageBody: JSON.stringify(data),
                QueueUrl: queueParameters.QueueUrl,
                DelaySeconds: "0",
                MessageAttributes: {}
            };
            sqs.sendMessage(params, cb);
        }
    ], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, consts.OK);
        }
    });
}

exports.sendObject = sendObject;

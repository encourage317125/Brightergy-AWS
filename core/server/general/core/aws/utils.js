"use strict";

// TODO:: moved to core-service

var config = require("../../../../config/environment");

function setCredentials(AWS) {
    AWS.config.update({
        accessKeyId: config.get("aws:auth:accesskeyid"),
        secretAccessKey: config.get("aws:auth:secretaccesskey"),
        region: config.get("aws:auth:region")
    });
}

exports.setCredentials = setCredentials;
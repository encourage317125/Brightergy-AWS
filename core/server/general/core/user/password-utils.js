"use strict";

// TODO:: moved to auth-service

var uuid = require("node-uuid"),
    _ = require("lodash"),
    log = require("../../../libs/log")(module),
    emailSender = require("../../../libs/email-sender"),
    consts = require("../../../libs/consts");

function sendSetPasswordLink(user, callback) {

    var setPasswordToken = uuid.v1();
    var tokenObj = _.where(user.tokens, { "type": consts.USER_TOKENS.SET_PASSWORD });

    if(tokenObj.length > 0) {
        log.info("token exists");
        user.tokens = _.remove(user.tokens, function(token){
            return token.type !== consts.USER_TOKENS.SET_PASSWORD;
        });
    } else {
        log.info("token not exists");
        user.tokens = [];
    }
    user.tokens.push({
        type: consts.USER_TOKENS.SET_PASSWORD,
        token: setPasswordToken
    });

    emailSender.sendSetPasswordEmail(user, callback);
}

exports.sendSetPasswordLink = sendSetPasswordLink;

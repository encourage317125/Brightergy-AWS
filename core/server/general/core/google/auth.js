"use strict";

// TODO:: not used, can be deleted

var config = require("../../../../config/environment"),
    nodeUtil = require("util"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    request = require("request"),
    cache = require("../../../libs/cache"),
    BASE_AUTH_BODY = "client_id=%s&client_secret=%s&refresh_token=%s&grant_type=refresh_token";

function getAuthToken(callback) {

    var authLine = nodeUtil.format(BASE_AUTH_BODY, 
        config.get("google:auth:clientid"), 
        config.get("google:auth:clientsecret"), 
        config.get("google:auth:refreshtoken")
    );

    request.post({
        uri:config.get("google:auth:url"),
        headers:{"content-type": "application/x-www-form-urlencoded"},
        body:authLine
    },function(err,res,body){
        if(err) {
            utils.logError(err);
        } else {

            var ans = JSON.parse(body);
            var accessToken = utils.getObjectValue(ans, "access_token");

            //save to redis
            cache.set("googleAuthToken", accessToken, function(redisErr, redisRes) {
                if(redisErr) {
                    utils.logError(redisErr);
                } else {
                    log.info("saved google auth token: " + accessToken);

                    if(callback) {
                        callback();
                    }
                }
            });

        }
    });
}

exports.getAuthToken = getAuthToken;
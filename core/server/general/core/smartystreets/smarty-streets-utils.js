"use strict";

var nodeUtil = require("util"),
    config = require("../../../../config/environment"),
    request = require("request"),
    BASE_URL = "%s/?%s&auth-id=%s&auth-token=%s";


function getAddress(query, callback) {
    var apihUrl = config.get("smartystreets:apiurl");
    var authId = config.get("smartystreets:authid");
    var authToken = config.get("smartystreets:authtoken");
    var fullUrl = nodeUtil.format(BASE_URL, apihUrl, query, authId, authToken);

    console.log(fullUrl);

    request.get({
        uri:fullUrl
    },function(err,res,body){
        if(err) {
            callback(err);
        } else {
            if(body) {
                try {
                    var obj = JSON.parse(body);
                    callback(null, obj);
                } catch(err) {
                    callback(null, []);
                }
            } else {
                callback(null, []);
            }
        }
    });
}

exports.getAddress = getAddress;
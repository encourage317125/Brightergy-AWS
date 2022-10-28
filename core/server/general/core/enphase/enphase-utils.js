"use strict";

var nodeUtil = require("util"),
    utils = require("../../../libs/utils"),
    config = require("../../../../config/environment"),
    consts = require("../../../libs/consts"),
    //checkAuth = require("../user/check-auth"),
    userDAO = require("../dao/user-dao"),
    request = require("request"),
    BASE_AUTH_URL = "%s&redirect=%s/%s/users/enphase/auth",
    BASE_API_URL_AUTH = "?key=%s&user_id=%s";


function getAuthUrl() {
    var authUrl = config.get("enphase:authurl");
    var domain = utils.getDomain(false);
    var apiVersion = config.get("api:version");
    var fullUrl = nodeUtil.format(BASE_AUTH_URL, authUrl, domain, apiVersion);
    return fullUrl;
}

function saveEnphaseUserId(enphaseUserId, currentUser, callback) {
    if(!enphaseUserId) {
        var error = new Error(consts.SERVER_ERRORS.USER.UNKNOWN_ENPHASE_USER_ID);
        error.status = 422;
        callback(error, null);
    } else {
        currentUser.enphaseUserId = enphaseUserId;
        userDAO.saveUser(currentUser, function(saveUserErr, savedUser) {
            if(saveUserErr) {
                callback(saveUserErr, null);
            } else {
                callback(null, consts.OK);
            }
        });
    }
}

function addNextParam(sourceUrl, next) {
    var nextIndex = sourceUrl.indexOf("&next=");
    if(nextIndex > -1) {
        sourceUrl = sourceUrl.substring(0, nextIndex);
    }
    sourceUrl += "&next=" + next;
    return sourceUrl;
}

function addAuthToAPIUrl(url, apiKey, userId) {
    url += nodeUtil.format(BASE_API_URL_AUTH, apiKey, userId);
    return url;
}

function loadSystemsRecursive(systems, apiUrl, callback) {
    request.get({
        uri:apiUrl
    },function(err,res,body){
        if(err) {
            callback(err);
        } else {
            var enphaseData = JSON.parse(body);

            if(enphaseData.reason && enphaseData.reason !== "200") {
                var error = new Error(enphaseData.message.join(", "));
                error.status = 422;
                callback(error, null);
            } else if(enphaseData.next){
                console.log("NEXT:"+enphaseData.next);
                [].push.apply(systems, enphaseData.systems);

                apiUrl = addNextParam(apiUrl, enphaseData.next);
                loadSystemsRecursive(systems, apiUrl, callback);
            } else {
                [].push.apply(systems, enphaseData.systems);
                callback(null, systems);
            }
        }
    });
}

function getSystems(currentUser, callback) {
    var enphaseUserId = currentUser.enphaseUserId;
    if(!enphaseUserId) {
        var error = new Error(consts.SERVER_ERRORS.USER.UNKNOWN_ENPHASE_USER_ID);
        error.status = 422;
        callback(error, null);
    } else {
        var enphaseApiKey = config.get("enphase:apikey");
        var apiUrl = config.get("enphase:apiurl") + "/systems";
        apiUrl = addAuthToAPIUrl(apiUrl, enphaseApiKey, enphaseUserId);

        var systems = [];

        loadSystemsRecursive(systems, apiUrl, function(enphaseErr, result) {
            if(enphaseErr) {
                callback(enphaseErr, null);
            } else {
                console.log("SIZE:"+ result.length);
                callback(null, result);
            }
        });
    }
}

function getInventory(systemId, currentUser, callback) {
    var enphaseUserId = currentUser.enphaseUserId;
    var error;
    if(!enphaseUserId) {
        error = new Error(consts.SERVER_ERRORS.USER.UNKNOWN_ENPHASE_USER_ID);
        error.status = 422;
        callback(error, null);
    } else {
        var enphaseApiKey = config.get("enphase:apikey");
        var apiUrl =  config.get("enphase:apiurl") + "/systems/" + systemId + "/inventory";
        apiUrl = addAuthToAPIUrl(apiUrl, enphaseApiKey, enphaseUserId);

        request.get({
            uri:apiUrl
        },function(err,res,body){
            if(err) {
                callback(err);
            } else {
                var enphaseData = JSON.parse(body);

                if(enphaseData.reason && enphaseData.reason !== "200") {
                    error = new Error(enphaseData.message.join(", "));
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, enphaseData);
                }
            }
        });
    }
}

exports.saveEnphaseUserId = saveEnphaseUserId;
exports.getAuthUrl = getAuthUrl;
exports.getSystems = getSystems;
exports.getInventory = getInventory;

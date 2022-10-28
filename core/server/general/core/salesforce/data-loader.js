"use strict";

// TODO:: moved to auth-service

var async = require("async"),
    config = require("../../../../config/environment"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    cache = require("../../../libs/cache"),
    _ = require("lodash"),
    authUtils = require("./auth");

function loadObjectsRecursive(con, currentUrl, fieldName, result, loadCompletedCallback) {
    var ids = _.map(result, function (item) {
        if(item.accountId) {
            return item.accountId;
        } else {
            return item.projectId;
        }
    });

    con.apex.post(currentUrl, ids, function (err, loadedData) {
        if (err) {
            loadCompletedCallback(err, null);
        } else {
            var now = new Date();

            result = _.union(result, loadedData);
            if (loadedData.length > 0) {
                result = _.union(result, loadedData);

                console.log("LOADED " + fieldName + "   size:" + result.length + "   " + now.toString());
                
                loadedData = null;
                ids = null;
                loadObjectsRecursive(con, currentUrl, fieldName, result, loadCompletedCallback);
            } else {
                console.log("COMPLETED " + fieldName + "  size:" + result.length + "    " + now.toString());
                cache.set(fieldName, JSON.stringify(result), function (redisErr, redisRes) {
                    if (redisErr) {
                        loadCompletedCallback(redisErr, null);
                    } else {
                        log.info("salesforce " + fieldName + " data saved in redis");
                        loadCompletedCallback(null, redisRes);
                    }
                });
            }
        }
    });
}

function startJob(finalCallback) {

    var authData = authUtils.getSFAuthData();
    var con = authUtils.getSFConnection();

    con.login(authData.username, authData.password, function(loginErr, userInfo) {
        if (loginErr) {
            finalCallback(loginErr);
        } else {
            var tasks = [];
            
            tasks.push(function (callback) {
                loadObjectsRecursive(con, config.get("salesforce:projectsurl"), "sfdcprojects", [], callback);
            });
            
            tasks.push(function (callback) {
                loadObjectsRecursive(con, config.get("salesforce:accountsurl"), "sfdcaccounts", [], callback);
            });
            
            async.parallel(tasks, finalCallback);
        }
    });
}

function loadAllSalesforceData() {
    var now = new Date();
    log.info("loadAllSalesforceData ( " + now.toString() + " )");

    cache.get("CronJob-loadAllSalesforceData", function (redisErr, redisValue) {
        if (redisErr) {
            console.log(redisErr);
        } else {
            if(redisValue && (now.getTime() - parseInt(redisValue)) < 20 * 60 * 1000 ) { 
                // if last load time is smaller than 20 mins
                log.info("loadAllSalesforceData skipped");
            }
            else {
                cache.set("CronJob-loadAllSalesforceData", now.getTime());

                /*
                 * process cron job
                 */
                startJob(function (jobErr, jobResult) {
                    if(jobErr) {
                        utils.logError(jobErr);
                        log.info("loadAllSalesforceData failed");
                    }
                });
            }
        }
    });
}

exports.loadAllSalesforceData = loadAllSalesforceData;
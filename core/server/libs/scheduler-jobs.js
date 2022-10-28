"use strict";

// TODO:: not used, can be deleted

var //config = require("../../config/environment"),
    cronJob  = require("cron").CronJob,
    //awsAssetsUtils = require("../general/core/aws/assets-utils"),
    //salesforceDataLoader = require("../general/core/salesforce/data-loader"),
    tagScheduleDAO = require("../general/core/dao/tag-schedule-dao"),
    commands = require("../general/core/calculation/commands"),
    utils = require("./utils"),
    cache = require("./cache"),
    moment = require("moment"),
    log = require("./log")(module),
    flag = "is_master_schedule_server",
    ttl = 100;

function isMasterServer(callback) {
    cache.watch(flag);

    cache.get(flag, function (err, result) {
        if (err) {
            callback(err);
        } else if (result) {
            //flag is created, so we can not execute cron
            callback(null, false);
        } else {
            //flag is null, so current server will be master

            cache.multi()
                .setex(flag, ttl, "1")
                .exec(function (serErr) {
                    if (serErr) {
                        callback(serErr);
                    } else {
                        callback(null, true);
                    }
                });
        }
    });


}

function setMasterServerFlag() {
    log.silly("SET FLAG");
    cache.setex(flag, ttl, "1", function(setErr, setResult) {
        if(setErr) {
            utils.logError(setErr);
        }
    });
}

function sendThermostatCommands() {
    log.silly("THERMOSTAT SCHEDULE");
    setMasterServerFlag();
    tagScheduleDAO.getTagSchedulesByParams({}, function(err, schedules) {
        if(err) {
            utils.logError(err);
        } else {
            for(var i=0; i < schedules.length;i++ ) {
                //schedule stores hour and min in utc
                var scheduleTime = moment.utc();
                var scheduleHour = scheduleTime.hour();
                var scheduleMinute = scheduleTime.minute();
                var scheduleWeekDay = scheduleTime.isoWeekday();

                if(schedules[i].isActive && scheduleHour === schedules[i].fromHour &&
                    scheduleMinute === schedules[i].fromMinute &&
                    schedules[i].weekDays.indexOf(scheduleWeekDay) > -1) {
                    //send command
                    var deviceID = schedules[i].tag.deviceID;
                    var heatSetpoint = schedules[i].heatSetpoint;
                    var coolSetpoint = schedules[i].coolSetpoint;
                    var tagId = schedules[i].tag._id.toString();

                    commands.sendThermostatCommand(tagId, deviceID, heatSetpoint, coolSetpoint, function(sendErr) {
                        if(sendErr) {
                            utils.logError(sendErr);
                        }
                    });// jshint ignore:line
                }
            }
        }
    });
}

function runAllSchedulers() {
    /*var generalAssetsKeyPrefix = config.get("aws:assets:generalassetskeyprefix");
    awsAssetsUtils.storeImagesInCache(generalAssetsKeyPrefix);

    salesforceDataLoader.loadAllSalesforceData();

    var salesforceJob = new cronJob({
        cronTime: config.get("salesforce:loaddatacrontime"),
        onTick: function() {
            salesforceDataLoader.loadAllSalesforceData();
        },
        start: false
    });

    salesforceJob.start();
    */

    var tagTemperatureCommandJob = new cronJob({
        cronTime: "0 */1 * * * *",//each minute
        onTick: function() {
            sendThermostatCommands();
        },
        start: false
    });

    tagTemperatureCommandJob.start();
}

function start() {

    isMasterServer(function(err, result) {
        var delay = 30000;
        if(err) {
            utils.logError(err);
            //check flag again after 30 sec
            setTimeout(start, delay);
        } else if(result) {
            runAllSchedulers();
        } else {
            //check flag again after 30 sec
            setTimeout(start, delay);
        }
    });

}

exports.start = start;
exports.sendThermostatCommands = sendThermostatCommands;

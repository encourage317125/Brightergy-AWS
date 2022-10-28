/**
 * Created 17 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    async = require("async"),
    utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts"),
    log = require("../../../../libs/log")(module);
var deviceDao = require("../../../../general/core/dao/present-display-dao"),
    presentationDao = require("../../dao/presentation-dao");


function compareWithSaved(newData, deviceInfo) {

    var deviceId = newData.deviceConfig.deviceId;
    log.silly("compareWithSaved: " + deviceId);

    deviceInfo[deviceId] = deviceInfo[deviceId] || {};

    var saved = deviceInfo[deviceId];

    if (_.isEqual(newData.deviceConfig, saved.deviceConfig)) {
        log.silly("deviceConfigs are equal");
    } else {
        log.silly("deviceConfigs are not equal");
    }

    if (_.isEqual(newData.deviceLog, saved.deviceLog)) {
        log.silly("deviceLog are equal");
    } else {
        log.silly("deviceLog are not equal");
    }

    // if we already have this information return empty
    if (_.isEqual(newData.deviceConfig, saved.deviceConfig) &&
        _.isEqual(newData.deviceLog, saved.deviceLog)) {
        return {};
    }

    saved.deviceConfig = _.clone(newData.deviceConfig);
    saved.deviceLog = _.clone(newData.deviceLog);

    return newData;
}


function getMongooseObject(mongooseObject) {
    var res = mongooseObject;
    if (mongooseObject.toObject) {
        res = mongooseObject.toObject();
    }
    // delete res._id;
    delete res.__v;
    return res;
}


function getDevices(deviceInfo, deviceIdMode, user, callback) {

    if (!deviceIdMode) {

        // presentationIds mode
        presentationDao.getPresentationsByUser(user, function(err, presentations) {
            if (err) {
                return callback(err);
            }

            var presentationIds = _.pluck(presentations, "_id");

            deviceDao.getDevicesByPresentationIds(presentationIds, function(err, data) {
                return callback(err, data);
            });
        });

    } else {
        var deviceIds = deviceInfo.deviceIds;
        log.debug("process devices: " + deviceIds);

        // we have deviceIds here
        deviceDao.getDevicesByIds(deviceIds, function(err, data) {
            return callback(err, data);
        });
    }

} //


function process(clientObject, deviceIdMode) {

    log.silly("process: mode: "+ deviceIdMode);

    var deviceInfo;
    var socket = clientObject.socket;
    var user = clientObject.user;

    var event;
    if (deviceIdMode) {
        // deviceIds
        event = consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfoById;
        deviceInfo = clientObject.deviceInfoById;
        if (_.isEmpty(deviceInfo.deviceIds)) {
            return log.silly("deviceIds empty");
        }
    } else {
        deviceInfo = clientObject.deviceInfo;
        event = consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo;
    }

    var clientAns = new utils.ClientWebsocketAnswer(socket, event);

    getDevices(deviceInfo, deviceIdMode, user, function(err, data) {

        if (err) {
            log.error(err);
            return clientAns.error(err.message);
        }

        if (_.isEmpty(data)) {
            log.silly("No any devices");
            deviceInfo.deviceIds = [];
            deviceInfo.presentations = [];
            return clientAns.ok([]);
        }

        var result = {};
        var deviceIds = [];

        // group by deviceId
        _.each(data, function(device) {
            log.debug("deviceId = " + device.deviceId);
            result[device.deviceId] = { deviceConfig: getMongooseObject(device) };
            deviceIds.push(device.deviceId);
        });

        async.map(
            deviceIds,
            deviceDao.getLatestLogForDevice,
            function(err, logs) {

                if (err) {
                    return clientAns.error((err.message));
                }

                _.each(logs, function(deviceLog) {
                    if (!deviceLog) {
                        return;
                    }
                    result[deviceLog.deviceId].deviceLog = getMongooseObject(deviceLog);
                });

                var answer = [];

                // test if we already sent such deviceInfo
                _.forOwn(result, function(info) {
                    var diff = compareWithSaved(info, deviceInfo);
                    if (diff.deviceConfig || diff.deviceLog) {
                        var result = _.assign(diff.deviceLog, diff.deviceConfig);
                        answer.push(result);
                    }
                });

                if (!_.isEmpty(answer)) {
                    clientAns.send(answer);
                } else {
                    log.silly("answer is empty");
                }

            }
        );
    });
}


exports.process = process;

"use strict";

var mongoose = require("mongoose"),
    presentDevice = mongoose.model("presentdevice"),
    presentDeviceLog = mongoose.model("presentDeviceLog"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    async = require("async");

function getAvailableDevices(currentUser, finalCallback) {
    async.waterfall([
        function (callback) {
            presentDevice.find({}, function (deviceErr, foundDevices) {
                if (deviceErr) {
                    callback(deviceErr, null);
                } else {
                    callback(null, foundDevices);
                }
            });
        }
    ], function (err, foundDevices) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, foundDevices);
        }
    });
}

function getDeviceById(deviceId, callback) {

    presentDevice.findById(deviceId, function (err, foundDevice) {
        if (err) {
            callback(err, null);
        } else {
            if (foundDevice) {
                callback(null, foundDevice);
            } else {
                var error = new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENT_DEVICE_DOES_NOT_EXIST + deviceId);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}


/**
 * return list of devices
 * @param presentationIdList the list of presentation ids
 * @param callback
 */
function getDevicesByPresentationIds(presentationIdList, callback) {

    presentDevice.find({
        "presentationId": {
            "$in": presentationIdList
        }
    }).exec(function(err, data) {
        if (err) {
            return callback(err);
        }
        return callback(null, data);
    });
}


/**
 * return list of devices
 * @param deviceIds the list of ids
 * @param callback
 */
function getDevicesByIds(deviceIdList, callback) {

    presentDevice.find({
        "_id": {
            "$in": deviceIdList
        }
    }).exec(function(err, data) {
        if (err) {
            return callback(err);
        }
        return callback(null, data);
    });
}



function createDevice(deviceObj, currentUser, finalCallback) {
    delete deviceObj._id;
    async.waterfall([
        function (callback) {
            var thisdeviceObjModel = new presentDevice(deviceObj);
            thisdeviceObjModel.save(function(err, savedDevice) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null,savedDevice);
                }
            });
        }
    ], function (createDeviceError, savedDevice) {
        if (createDeviceError) {
            finalCallback(createDeviceError, null);
        } else {
            finalCallback(null, savedDevice);
        }
    });
}

function editDevice(deviceId, deviceObj, currentUser, callback) {
    delete deviceObj._id;
    getDeviceById(deviceId, function (findErr, foundDevice) {
        if (findErr) {
            callback(findErr, null);
        } else {
            var paramsToChange = Object.keys(deviceObj);
            paramsToChange.forEach(function (param) {
                foundDevice[param] = deviceObj[param];
            });

            foundDevice.save(function (saveErr, savedDevice) {
                if (saveErr) {
                    callback(saveErr, null);
                } else {
                    callback(null, savedDevice);
                }
            });
        }
    });
}

function getDeviceLogs(currentUser, finalCallback) {
    async.waterfall([
        function (callback) {
            presentDeviceLog.find({}, function (deviceErr, foundDeviceLogs) {
                if (deviceErr) {
                    callback(deviceErr, null);
                } else {
                    callback(null, foundDeviceLogs);
                }
            });
        }
    ], function (err, foundDeviceLogs) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, foundDeviceLogs);
        }
    });
}


/**
 * get the latest log
 * @param deviceId
 * @param callback
 */
function getLatestLogForDevice(deviceId, callback) {
    presentDeviceLog.
        find({deviceId: deviceId}).
        sort({timestamp: 1}).
        limit(1).
        exec(function(err, data) {
            if (data) {
                callback(err, data[0]);
            } else {
                callback(err, null);
            }
        });
}


function createLog(logObjs, currentUser, finalCallback) {
    async.map(logObjs, function(logObj, callback){
        utils.removeMongooseVersionField(logObj);
        delete logObj._id;
        async.waterfall([
            function (callback) {
                var presentDeviceLogModel = new presentDeviceLog(logObj);
                presentDeviceLogModel.save(function(err, savedLog) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null,savedLog);
                    }
                });
            }
        ], function (createLogError, savedLog) {
            if (createLogError) {
                callback(createLogError, null);
            } else {
                callback(null, savedLog);
            }
        });
    }, function (err, results){
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, results);
        }
    });
}

exports.getAvailableDevices = getAvailableDevices;
exports.getDeviceLogs = getDeviceLogs;
exports.getLatestLogForDevice = getLatestLogForDevice;
exports.createLog = createLog;
exports.editDevice = editDevice;
exports.createDevice = createDevice;
exports.getDevicesByIds = getDevicesByIds;
exports.getDevicesByPresentationIds = getDevicesByPresentationIds;

"use strict";

var mongoose = require("mongoose"),
    presentDeviceConfig = mongoose.model("presentDeviceConfig"),
    presentDeviceStatus = mongoose.model("presentDeviceStatus"),
    presentDeviceLogcatLink = mongoose.model("presentDeviceLogcatLink"),
    ObjectId = mongoose.Types.ObjectId,
    tagDAO = require("./tag-dao"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    async = require("async");


/**
 * return Present device config
 * @param deviceId of the config to search
 * @param callback
 */
function getPresentDeviceConfigByDeviceId(deviceId, callback) {

    presentDeviceConfig.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundConfig) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundConfig);
            }
    });
}

/**
 * update presentDeviceConfig info in database by device
 * @param tagState obj for config to update
 * @param callback
 */
function updatePresentDeviceConfig(configObj, finalCallback) {
    utils.removeMongooseVersionField(configObj);
    delete configObj._id;

    async.waterfall([
        function (callback) {
            if (configObj.deviceID) {
                tagDAO.getTagsByParams({deviceID: new RegExp("^"+configObj.deviceID+"$", "i")}, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                configObj.tag = foundTags[0]._id;
                configObj.deviceID = foundTags[0].deviceID;

                getPresentDeviceConfigByDeviceId(configObj.deviceID, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    configObj.deviceID), null);
            }
        },
        function (foundConfig, callback) {
            if (!foundConfig) {
                configObj.dataType = consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG;

                var configObjModel = new presentDeviceConfig(configObj);

                configObjModel.save(callback);
            } else {
                var paramsToChange = Object.keys(configObj);

                paramsToChange.forEach(function (param) {
                    foundConfig[param] = configObj[param];
                });

                foundConfig.save(callback);
            }
        }
    ], function (err, savedConfig) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedConfig);
        }
    });
}

/**
 * return Present device config
 * @param tagId of the config to search
 * @param callback
 */
function getPresentDeviceConfigByTagId(tagId, callback) {

    presentDeviceConfig.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG, tag: new ObjectId(tagId)},
        function (err, foundConfig) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundConfig);
            }
    });
}

/**
 * get the latest log
 * @param deviceId
 * @param callback
 */
function getLatestStatusForDevice(deviceId, callback) {
    presentDeviceStatus.
        find({dataType: consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS, deviceID: new RegExp("^"+deviceId+"$", "i")}).
        sort({timestamp: -1}).
        limit(1).
        exec(function(err, data) {
            if (data) {
                callback(err, data[0]);
            } else {
                callback(err, null);
            }
        });
}

/**
 * add presentDeviceStatus info in database by device
 * @param tagState obj for status to add
 * @param callback
 */
function createPresentDeviceStatus(statusData, finalCallback) {
    
    async.waterfall([
        function (callback) {
            if (statusData.deviceID) {
                tagDAO.getTagsByParams({deviceID: new RegExp("^"+statusData.deviceID+"$", "i")}, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                async.map(statusData.statusArray, function(statusObj, mapCallback) {

                    utils.removeMongooseVersionField(statusObj);
                    delete statusObj._id;

                    statusObj.deviceID = foundTags[0].deviceID;
                    statusObj.tag = foundTags[0]._id;
                    statusObj.dataType = consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS;

                    var statusObjModel = new presentDeviceStatus(statusObj);
                    statusObjModel.save(mapCallback);

                }, function(createStatusError, results) {
                    callback(createStatusError, results);
                });
                
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    statusData.deviceID), null);
            }
        }
    ], function (err, savedStatuses) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedStatuses);
        }
    });
}

/**
 * return array of Present device status
 * @param tagId of the status to search
 * @param callback
 */
function getPresentDeviceStatusByTagId(tagId, callback) {

    presentDeviceStatus.
        find({dataType: consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS, tag: new ObjectId(tagId)}).
        sort({timestamp: -1}).
        exec(function(err, foundStatuses) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundStatuses);
            }
        });
}

/**
 * add presentDeviceLogcatLink info in database by device
 * @param tagState obj for logcat link to add
 * @param callback
 */
function createPresentDeviceLogcatLink(linkObj, finalCallback) {
    utils.removeMongooseVersionField(linkObj);
    delete linkObj._id;
    
    async.waterfall([
        function (callback) {
            if (linkObj.deviceID) {
                if (linkObj.link) {
                    tagDAO.getTagsByParams({deviceID: new RegExp("^"+linkObj.deviceID+"$", "i")}, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.LOGCAT_LINK_REQUIRED), null);
                }
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                linkObj.tag = foundTags[0]._id;
                linkObj.deviceID = foundTags[0].deviceID;
                linkObj.dataType = consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_LOGCAT_LINK;

                var linkObjModel = new presentDeviceLogcatLink(linkObj);

                linkObjModel.save(callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    linkObj.deviceID), null);
            }
        }
    ], function (err, savedLink) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedLink);
        }
    });
}


exports.getPresentDeviceConfigByDeviceId = getPresentDeviceConfigByDeviceId;
exports.updatePresentDeviceConfig = updatePresentDeviceConfig;
exports.getLatestStatusForDevice = getLatestStatusForDevice;
exports.createPresentDeviceStatus = createPresentDeviceStatus;
exports.getPresentDeviceConfigByTagId = getPresentDeviceConfigByTagId;
exports.getPresentDeviceStatusByTagId = getPresentDeviceStatusByTagId;
exports.createPresentDeviceLogcatLink = createPresentDeviceLogcatLink;

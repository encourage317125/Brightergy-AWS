"use strict";

var mongoose = require("mongoose"),
    presentDeviceConfig = mongoose.model("presentDeviceConfig"),
    presentDeviceStatus = mongoose.model("presentDeviceStatus"),
    presentDeviceLogcatLink = mongoose.model("presentDeviceLogcatLink"),
    digiConfig = mongoose.model("digiConfig"),
    digiEndList = mongoose.model("digiEndList"),
    digiEventLog = mongoose.model("digiEventLog"),
    digiStatus = mongoose.model("digiStatus"),
    gemConfig = mongoose.model("gemConfig"),
    gatewaySoftware = mongoose.model("gatewaySoftware"),
    gatewayNetwork = mongoose.model("gatewayNetwork"),
    thermostatTemperature = mongoose.model("thermostatTemperature"),
    ObjectId = mongoose.Types.ObjectId,
    presentDeviceDAO = require("./tag-state-present-device-dao"),
    digiDAO = require("./tag-state-digi-dao"),
    // tagDAO = require("./tag-dao"),
    // utils = require("../../../libs/utils"),
    // async = require("async"),
    consts = require("../../../libs/consts");

/**
 * create or update tagState info in database
 * @param dataType type of tagState data
 * @param tagState obj to create or update
 * @param callback
 */
function postTagState(dataType, stateObj, callback) {

    if (!stateObj.deviceID && stateObj.deviceId) {
        stateObj.deviceID = stateObj.deviceId;
    }

    switch (dataType) {
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG:
            presentDeviceDAO.updatePresentDeviceConfig(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS:
            presentDeviceDAO.createPresentDeviceStatus(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_LOGCAT_LINK:
            presentDeviceDAO.createPresentDeviceLogcatLink(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_CONFIG:
            digiDAO.updateDigiConfig(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_END_LIST:
            digiDAO.updateDigiEndList(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_EVENT_LOG:
            digiDAO.createDigiEventLog(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_STATUS:
            digiDAO.createDigiStatus(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.GEM_CONFIG:
            digiDAO.updateGEMConfig(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE:
            digiDAO.updateGatewaySoftware(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK:
            digiDAO.updateGatewayNetwork(stateObj, callback);
            break;
        case consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE:
            digiDAO.updateThermostatTemperature(stateObj, callback);
            break;
        default:
            var errRequiredParam = new Error(consts.SERVER_ERRORS.TAG.STATE.VALID_DATATYPE_REQUIRED);
            errRequiredParam.status = 422;
            callback(errRequiredParam, null);
    }
}

/**
 * return array of tagStates found according to given parameters
 * @param tagId of the tag state to search
 * @param dataType type of tagState data
 * @param operators an object contains limit, offset, sort, sortDesc, etc
 * @param callback
 */
function getTagStates(tagId, deviceId, dataType, operators, callback) {

    var model = null;
    switch (dataType) {
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG:
            model = presentDeviceConfig;
            break;
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS:
            model = presentDeviceStatus;
            break;
        case consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_LOGCAT_LINK:
            model = presentDeviceLogcatLink;
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_CONFIG:
            model = digiConfig;
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_END_LIST:
            model = digiEndList;
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_EVENT_LOG:
            model = digiEventLog;
            break;
        case consts.TAG_STATE_DATATYPE.DIGI_STATUS:
            model = digiStatus;
            break;
        case consts.TAG_STATE_DATATYPE.GEM_CONFIG:
            model = gemConfig;
            break;
        case consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE:
            model = gatewaySoftware;
            break;
        case consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK:
            model = gatewayNetwork;
            break;
        case consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE:
            model = thermostatTemperature;
            break;
        default:
            var errRequiredParam = new Error(consts.SERVER_ERRORS.TAG.STATE.VALID_DATATYPE_REQUIRED);
            errRequiredParam.status = 422;
            callback(errRequiredParam, null);
            return;
    }

    if (!model) {
        var errModelFailed = new Error("Failed to load model.");
        errModelFailed.status = 422;
        callback(errModelFailed, null);
        return;
    }

    var findExpr = null;
    if (tagId) {
        findExpr = {dataType: dataType, tag: new ObjectId(tagId)};
    } else if (deviceId) {
        findExpr = {dataType: dataType, deviceID: new RegExp("^"+deviceId+"$", "i")};
    } else {
        var errRequiredId = new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_OR_DEVICE_ID_REQUIRED);
        errRequiredId.status = 422;
        callback(errRequiredId, null);
        return;
    }
    var sortExpr = null;
    if (operators.sort) {
        sortExpr = operators.sort;
    } else if (operators.sortDesc) {
        sortExpr = "-" + operators.sortDesc;
    }

    model.
        find(findExpr).
        sort(sortExpr).
        skip(operators.offset).
        limit(operators.limit).
        lean().exec(function(err, foundStates) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundStates);
            }
        });
}


exports.getTagStates = getTagStates;
exports.postTagState = postTagState;
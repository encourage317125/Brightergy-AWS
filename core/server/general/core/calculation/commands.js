"use strict";

var utils = require("../../../libs/utils"),
    sqsUtils = require("../aws/sqs-utils"),
    consts = require("../../../libs/consts");

function sendThermostatCommand(tagId, tagDeviceID, heatSetpoint, coolSetpoint, callback) {

    var err = null;
    if(!utils.isNumber(heatSetpoint) || !utils.isNumber(coolSetpoint)) {
        err = new Error("Please specify heatSetpoint and coolSetpoint correctly.");
        err.status = 422;
        callback(err);
        return;
    }

    heatSetpoint = parseFloat(heatSetpoint);
    coolSetpoint = parseFloat(coolSetpoint);

    if(heatSetpoint >= coolSetpoint ||
        heatSetpoint < consts.THERMOSTAT_TEMPERATURE_LOWER_LIMIT ||
        coolSetpoint > consts.THERMOSTAT_TEMPERATURE_UPPER_LIMIT) {
        err = new Error("Please specify proper heatSetpoint and coolSetpoint.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_address": tagDeviceID,
        "action": "desired_temperture",
        "method": "set",
        "heat_setpoint": heatSetpoint,
        "cool_setpoint": coolSetpoint
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendGEMConfigCommand(tagDeviceID, configObj, callback) {
    if (!configObj) {
        var err = new Error("Configuration data is required.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "gem_config",
        "config": configObj
    };
    sqsUtils.sendObject(queue, data, callback);
}


function sendGatewayNetworkCommand(tagDeviceID, cmdObj, callback) {
    if (!cmdObj || !cmdObj.networkState) {
        var err = new Error("Please specify networkState.");
        err.status = 422;
        callback(err);
        return;
    }

    var paramErr = null;
    if (consts.GATEWY_NETWORK_STATES.indexOf(cmdObj.networkState) === -1) {
        paramErr = new Error("Unknown networkState value: " + cmdObj.state);
    } else if (cmdObj.networkState === "open") {   
        if (!cmdObj.interval) {
            cmdObj.interval = 300;
        } else {
            if (isNaN(cmdObj.interval)) {
                paramErr = new Error("The interval must be a number.");
            } else if (cmdObj.interval < 0) {
                paramErr = new Error("The interval must be a positive number.");
            } else if (parseInt(cmdObj.interval) > consts.GATEWAY_NETWORK_MAX_INTERVAL) {
                paramErr = new Error("The interval must be less then " + consts.GATEWAY_NETWORK_MAX_INTERVAL);
            } else {
                cmdObj.interval = parseInt(cmdObj.interval);
            }
        }
    } else {
        cmdObj.interval = null;
    }

    if (paramErr) {
        paramErr.status = 422;
        callback(paramErr);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "gateway_network",
        "state": cmdObj.networkState        
    };
    if (cmdObj.interval) {
        data.interval = cmdObj.interval;
    }
    sqsUtils.sendObject(queue, data, callback);
}

function sendGatewaySoftwareCommand(tagDeviceID, cmdObj, callback) {
    if (!cmdObj || !cmdObj.softwareUrl) {
        var err = new Error("Please specify softwareUrl.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "software_upgrade",
        "software_url": cmdObj.softwareUrl
    };
    sqsUtils.sendObject(queue, data, callback);
}


function sendBPDConfigUpdateCommand(tagDeviceID, configObj, callback) {
    if (!configObj) {
        var err = new Error("Configuration data is required.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-bpd-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "config_update",
        "config": configObj
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendBPDStatusRequestCommand(tagDeviceID, callback) {
    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-bpd-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "status_request"
    };
    sqsUtils.sendObject(queue, data, callback);
}


function sendDigiConfigCommand(tagDeviceID, configObj, callback) {
    if (!configObj) {
        var err = new Error("Configuration data is required.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "configure_setting",
        "configuration": configObj
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendDigiEndListCommand(tagDeviceID, endlistObj, callback) {
    if (!endlistObj) {
        var err = new Error("EndList data is required.");
        err.status = 422;
        callback(err);
        return;
    }

    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "configure_endlist",
        "endlist": endlistObj
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendDigiRebootCommand(tagDeviceID, callback) {
    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "reboot"
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendDigiStatusReportCommand(tagDeviceID, callback) {
    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "status_report"
    };
    sqsUtils.sendObject(queue, data, callback);
}

function sendDigiEventLogReportCommand(tagDeviceID, callback) {
    var deviceId = utils.multiReplace(tagDeviceID, [":", "-", "."], "");
    deviceId = utils.removeAllSpaces(deviceId);
    var queue = "bl-ems-" + deviceId.toLowerCase();

    var data = {
        "device_id": tagDeviceID,
        "action": "event_log_report"
    };
    sqsUtils.sendObject(queue, data, callback);
}


exports.sendThermostatCommand = sendThermostatCommand;
exports.sendGEMConfigCommand = sendGEMConfigCommand;
exports.sendGatewayNetworkCommand = sendGatewayNetworkCommand;
exports.sendGatewaySoftwareCommand = sendGatewaySoftwareCommand;
exports.sendBPDConfigUpdateCommand = sendBPDConfigUpdateCommand;
exports.sendBPDStatusRequestCommand = sendBPDStatusRequestCommand;
exports.sendDigiConfigCommand = sendDigiConfigCommand;
exports.sendDigiEndListCommand = sendDigiEndListCommand;
exports.sendDigiRebootCommand = sendDigiRebootCommand;
exports.sendDigiStatusReportCommand = sendDigiStatusReportCommand;
exports.sendDigiEventLogReportCommand = sendDigiEventLogReportCommand;

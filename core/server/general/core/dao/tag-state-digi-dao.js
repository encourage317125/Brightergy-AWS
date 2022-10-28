"use strict";

var mongoose = require("mongoose"),
    digiConfig = mongoose.model("digiConfig"),
    digiEndList = mongoose.model("digiEndList"),
    digiEventLog = mongoose.model("digiEventLog"),
    digiStatus = mongoose.model("digiStatus"),
    gemConfig = mongoose.model("gemConfig"),
    gatewaySoftware = mongoose.model("gatewaySoftware"),
    gatewayNetwork = mongoose.model("gatewayNetwork"),
    thermostatTemperature = mongoose.model("thermostatTemperature"),
    // ObjectId = mongoose.Types.ObjectId,
    tagDAO = require("./tag-dao"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    async = require("async");


/**
 * return Digi config
 * @param deviceId of the config to search
 * @param callback
 */
function getDigiConfigByDeviceId(deviceId, callback) {

    digiConfig.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.DIGI_CONFIG, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundConfig) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundConfig);
            }
    });
}

/**
 * add or update digiConfig info in database
 * @param tagState obj for config to update
 * @param callback
 */
function updateDigiConfig(configObj, finalCallback) {
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

                getDigiConfigByDeviceId(configObj.deviceID, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    configObj.deviceID), null);
            }
        },
        function (foundConfig, callback) {
            if (!foundConfig) {
                configObj.dataType = consts.TAG_STATE_DATATYPE.DIGI_CONFIG;

                var configObjModel = new digiConfig(configObj);

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
 * return Digi endlist
 * @param deviceId of the endlist to search
 * @param callback
 */
function getDigiEndListByDeviceId(deviceId, callback) {

    digiEndList.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.DIGI_END_LIST, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundEndList) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundEndList);
            }
    });
}

/**
 * add or update digiEndList info in database
 * @param tagState obj for endlist to update
 * @param callback
 */
function updateDigiEndList(endlistObj, finalCallback) {
    utils.removeMongooseVersionField(endlistObj);
    delete endlistObj._id;

    async.waterfall([
        function (callback) {
            if (endlistObj.deviceID) {
                tagDAO.getTagsByParams({deviceID: new RegExp("^"+endlistObj.deviceID+"$", "i")}, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                endlistObj.tag = foundTags[0]._id;
                endlistObj.deviceID = foundTags[0].deviceID;

                getDigiEndListByDeviceId(endlistObj.deviceID, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    endlistObj.deviceID), null);
            }
        },
        function (foundEndList, callback) {
            if (!foundEndList) {
                endlistObj.dataType = consts.TAG_STATE_DATATYPE.DIGI_END_LIST;

                var endlistObjModel = new digiEndList(endlistObj);

                endlistObjModel.save(callback);
            } else {
                var paramsToChange = Object.keys(endlistObj);

                paramsToChange.forEach(function (param) {
                    foundEndList[param] = endlistObj[param];
                });

                foundEndList.save(callback);
            }
        }
    ], function (err, savedEndList) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedEndList);
        }
    });
}

/**
 * add digiEventLog info in database
 * @param tagState obj for status to add
 * @param callback
 */
function createDigiEventLog(eventlogObj, finalCallback) {
    utils.removeMongooseVersionField(eventlogObj);
    delete eventlogObj._id;
    
    async.waterfall([
        function (callback) {
            if (eventlogObj.deviceID) {
                tagDAO.getTagsByParams({deviceID: new RegExp("^"+eventlogObj.deviceID+"$", "i")}, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                eventlogObj.tag = foundTags[0]._id;
                eventlogObj.deviceID = foundTags[0].deviceID;
                eventlogObj.dataType = consts.TAG_STATE_DATATYPE.DIGI_EVENT_LOG;

                var eventlogObjModel = new digiEventLog(eventlogObj);

                eventlogObjModel.save(callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    eventlogObj.deviceID), null);
            }
        }
    ], function (err, savedEventLog) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedEventLog);
        }
    });
}

/**
 * add digiStatus info in database
 * @param tagState obj for status to add
 * @param callback
 */
function createDigiStatus(statusObj, finalCallback) {
    utils.removeMongooseVersionField(statusObj);
    delete statusObj._id;
    
    async.waterfall([
        function (callback) {
            if (statusObj.deviceID) {
                tagDAO.getTagsByParams({deviceID: new RegExp("^"+statusObj.deviceID+"$", "i")}, callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
            }
        },
        function (foundTags, callback) {
            if (foundTags.length > 0) {
                statusObj.tag = foundTags[0]._id;
                statusObj.deviceID = foundTags[0].deviceID;
                statusObj.dataType = consts.TAG_STATE_DATATYPE.DIGI_STATUS;

                var statusObjModel = new digiStatus(statusObj);

                statusObjModel.save(callback);
            } else {
                callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                    statusObj.deviceID), null);
            }
        }
    ], function (err, savedStatus) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedStatus);
        }
    });
}

/**
 * return gem config
 * @param deviceId of the gemConfig to search
 * @param callback
 */
function getGEMConfigByDeviceId(deviceId, callback) {

    gemConfig.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.GEM_CONFIG, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundConfig) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundConfig);
            }
    });
}

/**
 * add or update gemConfigs info in database
 * @param array of gemConfig obj to update
 * @param callback
 */
function updateGEMConfig(configArray, finalCallback) {

    if (!Array.isArray(configArray)) {
        configArray = [configArray];
    }

    async.map(configArray, function(configObj, mapCallback) {
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

                    getGEMConfigByDeviceId(configObj.deviceID, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                        configObj.deviceID), null);
                }
            },
            function (foundConfig, callback) {
                if (!foundConfig) {
                    configObj.dataType = consts.TAG_STATE_DATATYPE.GEM_CONFIG;

                    var configObjModel = new gemConfig(configObj);

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
            mapCallback(err, savedConfig);
        });
    }, function (updateConfigErr, results) {
        if (updateConfigErr) {
            finalCallback(updateConfigErr, null);
        } else {
            finalCallback(null, results);
        }
    });    
}

/**
 * return gateway software (tagState)
 * @param deviceId of the gatewaySoftware to search
 * @param callback
 */
function getGatewaySoftwareByDeviceId(deviceId, callback) {

    gatewaySoftware.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundSoftware) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundSoftware);
            }
    });
}

/**
 * add or update gatewaySoftwares info in database
 * @param array of gatewaySoftware obj to update
 * @param callback
 */
function updateGatewaySoftware(softwareArray, finalCallback) {

    if (!Array.isArray(softwareArray)) {
        softwareArray = [softwareArray];
    }

    async.map(softwareArray, function(softwareObj, mapCallback) {
        utils.removeMongooseVersionField(softwareObj);
        delete softwareObj._id;

        async.waterfall([
            function (callback) {
                if (softwareObj.deviceID) {
                    tagDAO.getTagsByParams({deviceID: new RegExp("^"+softwareObj.deviceID+"$", "i")}, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
                }
            },
            function (foundTags, callback) {
                if (foundTags.length > 0) {
                    softwareObj.tag = foundTags[0]._id;
                    softwareObj.deviceID = foundTags[0].deviceID;

                    getGatewaySoftwareByDeviceId(softwareObj.deviceID, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                        softwareObj.deviceID), null);
                }
            },
            function (foundSoftware, callback) {
                if (!foundSoftware) {
                    softwareObj.dataType = consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE;

                    var softwareObjModel = new gatewaySoftware(softwareObj);

                    softwareObjModel.save(callback);
                } else {
                    var paramsToChange = Object.keys(softwareObj);

                    paramsToChange.forEach(function (param) {
                        foundSoftware[param] = softwareObj[param];
                    });

                    foundSoftware.save(callback);
                }
            }
        ], function (err, savedSoftware) {
            mapCallback(err, savedSoftware);
        });
    }, function (updateSoftwareErr, results) {
        if (updateSoftwareErr) {
            finalCallback(updateSoftwareErr, null);
        } else {
            finalCallback(null, results);
        }
    });    
}

/**
 * return gateway network (tagState)
 * @param deviceId of the gatewayNetwork to search
 * @param callback
 */
function getGatewayNetworkByDeviceId(deviceId, callback) {

    gatewayNetwork.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundNetwork) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundNetwork);
            }
    });
}

/**
 * add or update gatewayNetworks info in database
 * @param array of gatewayNetwork obj to update
 * @param callback
 */
function updateGatewayNetwork(networkArray, finalCallback) {

    if (!Array.isArray(networkArray)) {
        networkArray = [networkArray];
    }

    async.map(networkArray, function(networkObj, mapCallback) {
        utils.removeMongooseVersionField(networkObj);
        delete networkObj._id;

        async.waterfall([
            function (callback) {
                if (networkObj.deviceID) {
                    tagDAO.getTagsByParams({deviceID: new RegExp("^"+networkObj.deviceID+"$", "i")}, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
                }
            },
            function (foundTags, callback) {
                if (foundTags.length > 0) {
                    networkObj.tag = foundTags[0]._id;
                    networkObj.deviceID = foundTags[0].deviceID;

                    getGatewayNetworkByDeviceId(networkObj.deviceID, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                        networkObj.deviceID), null);
                }
            },
            function (foundNetwork, callback) {
                if (!foundNetwork) {
                    networkObj.dataType = consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK;

                    var networkObjModel = new gatewayNetwork(networkObj);

                    networkObjModel.save(callback);
                } else {
                    var paramsToChange = Object.keys(networkObj);

                    paramsToChange.forEach(function (param) {
                        foundNetwork[param] = networkObj[param];
                    });

                    foundNetwork.save(callback);
                }
            }
        ], function (err, savedNetwork) {
            mapCallback(err, savedNetwork);
        });
    }, function (updateNetworkErr, results) {
        if (updateNetworkErr) {
            finalCallback(updateNetworkErr, null);
        } else {
            finalCallback(null, results);
        }
    });    
}

/**
 * return thermostat temperature config
 * @param deviceId of the thermostatTemperature to search
 * @param callback
 */
function getThermostatTemperatureByDeviceId(deviceId, callback) {

    thermostatTemperature.findOne(
        {dataType: consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE, deviceID: new RegExp("^"+deviceId+"$", "i")},
        function (err, foundThermostat) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundThermostat);
            }
    });
}

/**
 * add or update thermostatTemperature config in database
 * @param array of thermostatTemperature obj to update
 * @param callback
 */
function updateThermostatTemperature(thermostatArray, finalCallback) {

    if (!Array.isArray(thermostatArray)) {
        thermostatArray = [thermostatArray];
    }

    async.map(thermostatArray, function(thermostatObj, mapCallback) {
        utils.removeMongooseVersionField(thermostatObj);
        delete thermostatObj._id;

        async.waterfall([
            function (callback) {
                var validationErr = null;
                if(!utils.isNumber(thermostatObj.heatSetpoint) || !utils.isNumber(thermostatObj.coolSetpoint)) {
                    validationErr = new Error("Please specify heatSetpoint and coolSetpoint correctly.");
                    validationErr.status = 422;
                    callback(validationErr);
                } else if(parseFloat(thermostatObj.heatSetpoint) >= parseFloat(thermostatObj.coolSetpoint) || 
                    parseFloat(thermostatObj.heatSetpoint) < consts.THERMOSTAT_TEMPERATURE_LOWER_LIMIT || 
                    parseFloat(thermostatObj.coolSetpoint) > consts.THERMOSTAT_TEMPERATURE_UPPER_LIMIT) {
                    validationErr = new Error("Please specify proper heatSetpoint and coolSetpoint.");
                    validationErr.status = 422;
                    callback(validationErr);
                } else {
                    callback();
                }
            },
            function (callback) {
                if (thermostatObj.deviceID) {
                    tagDAO.getTagsByParams({deviceID: new RegExp("^"+thermostatObj.deviceID+"$", "i")}, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.DEVICE_ID_REQUIRED), null);
                }
            },
            function (foundTags, callback) {
                if (foundTags.length > 0) {
                    thermostatObj.tag = foundTags[0]._id;
                    thermostatObj.deviceID = foundTags[0].deviceID;

                    getThermostatTemperatureByDeviceId(thermostatObj.deviceID, callback);
                } else {
                    callback(new Error(consts.SERVER_ERRORS.TAG.STATE.TAG_WITH_DEVICE_ID_NOT_EXISTS + 
                        thermostatObj.deviceID), null);
                }
            },
            function (foundThermostat, callback) {
                if (!foundThermostat) {
                    thermostatObj.dataType = consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE;

                    var thermostatObjModel = new thermostatTemperature(thermostatObj);

                    thermostatObjModel.save(callback);
                } else {
                    var paramsToChange = Object.keys(thermostatObj);

                    paramsToChange.forEach(function (param) {
                        foundThermostat[param] = thermostatObj[param];
                    });

                    foundThermostat.save(callback);
                }
            }
        ], function (err, savedThermostat) {
            mapCallback(err, savedThermostat);
        });
    }, function (updateThermostatErr, results) {
        if (updateThermostatErr) {
            finalCallback(updateThermostatErr, null);
        } else {
            finalCallback(null, results);
        }
    });    
}


exports.getDigiConfigByDeviceId = getDigiConfigByDeviceId;
exports.updateDigiConfig = updateDigiConfig;
exports.updateDigiEndList = updateDigiEndList;
exports.createDigiEventLog = createDigiEventLog;
exports.createDigiStatus = createDigiStatus;
exports.updateGEMConfig = updateGEMConfig;
exports.updateGatewaySoftware = updateGatewaySoftware;
exports.updateGatewayNetwork = updateGatewayNetwork;
exports.updateThermostatTemperature = updateThermostatTemperature;

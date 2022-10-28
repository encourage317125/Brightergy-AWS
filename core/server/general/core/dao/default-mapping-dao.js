"use strict";

var mongoose = require("mongoose"),
    DefaultMapping = mongoose.model("defaultMapping"),
    consts = require("../../../libs/consts");

function createDefaultMapping(defaultMappingObj, currentUser, callback) {

    if(currentUser.role !== consts.USER_ROLES.BP) {
        var error = new Error(consts.SERVER_ERRORS.DEFAULT_MAPPING.CAN_NOT_SAVE_DEFAULT_MAPPING);
        error.status = 422;
        callback(error, null);
    } else {
        var thisDefaultMappingObjModel = new DefaultMapping(defaultMappingObj);
        thisDefaultMappingObjModel.save(function (err, savedDefaultMapping) {
            if (err) {
                callback(err, null);
            } else {
                //getFacilityById(savedFacility._id, callback);
                callback(null, savedDefaultMapping);
            }
        });
    }
}

function getDefaultMappingById(selectedDefaultMappingId, callback) {
    DefaultMapping.findById(selectedDefaultMappingId, function (err, findDefaultMapping) {
        if(err) {
            callback(err, null);
        } else {
            if(findDefaultMapping) {
                callback(null, findDefaultMapping);
            } else {
                var error = new Error(consts.SERVER_ERRORS.DEFAULT_MAPPING.DEFAULT_MAPPING_NOT_EXISTS +
                selectedDefaultMappingId);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

function updateDefaultMapping(defaultMappingObj, currentUser, callback) {

    if(currentUser.role !== consts.USER_ROLES.BP) {
        var error = new Error(consts.SERVER_ERRORS.DEFAULT_MAPPING.CAN_NOT_SAVE_DEFAULT_MAPPING);
        error.status = 422;
        callback(error, null);
    } else {
        getDefaultMappingById(defaultMappingObj._id, function (findErr, findDefaultMapping) {
            if (findErr) {
                callback(findErr, null);
            } else {

                var paramsToChange = Object.keys(defaultMappingObj);

                paramsToChange.forEach(function (param) {
                    findDefaultMapping[param] = defaultMappingObj[param];
                });

                findDefaultMapping.save(function (saveErr, savedDefaultMapping) {
                    if (saveErr) {
                        callback(saveErr, null);
                    } else {
                        callback(null, savedDefaultMapping);
                    }
                });
            }
        });
    }
}

function deleteDefaultMappingById(selectedDefaultMappingId,callback) {
    getDefaultMappingById(selectedDefaultMappingId, function (findErr, findDefaultMaping) {
        if (findErr) {
            callback(findErr);
        } else {
            DefaultMapping.remove({_id: findDefaultMaping._id}, function (deleteErr) {
                if (deleteErr) {
                    callback(deleteErr, null);
                } else {
                    callback(null, consts.OK);
                }
            });
        }
    });
}

function getDefaultMappings(limit, callback) {
    var q = DefaultMapping.find({});
    if(limit) {
        q.limit(limit);
    }

    q.lean().exec(function(err, defaultMappings) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, defaultMappings);
        }
    });
}

exports.getDefaultMappingById = getDefaultMappingById;
exports.getDefaultMappings = getDefaultMappings;
exports.deleteDefaultMappingById = deleteDefaultMappingById;
exports.createDefaultMapping = createDefaultMapping;
exports.updateDefaultMapping = updateDefaultMapping;
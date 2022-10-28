"use strict";

var mongoose = require("mongoose"),
    TagRule = mongoose.model("tagrule"),
    async = require("async"),
    _ = require("lodash"),
    //utils = require("../../../libs/utils"),
    log = require("../../../libs/log")(module),
    consts = require("../../../libs/consts");


function getRules(callback) {
    TagRule.find({})
        .lean()
        .exec(function (err, findRules) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, findRules);
            }
        });
}

function isReservedType(ruleObj) {
    if(ruleObj.type) {
        var lowerCaseType = ruleObj.type.toLowerCase();

        var lowerCaseTypes = _.map(consts.RESERVED_TAG_RULE_TYPES, function(type) {
            return type.toLowerCase();
        });
        return lowerCaseTypes.indexOf(lowerCaseType) >= 0;
    } else {
        return false;
    }
}

function validate(ruleObj, callback) {
    var rule = new TagRule(ruleObj);
    rule.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

function createRule(ruleObj, currentUser, finalCallback) {
    delete ruleObj._id;
    ruleObj.creatorRole = currentUser.role;
    ruleObj.creator = currentUser._id;
    var error;

    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.TAG.RULE.CAN_NOT_CREATE_RULE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        async.waterfall([
                function (callback) {
                    validate(ruleObj, callback);
                },
                function (validateResult, callback) {
                    if (isReservedType(ruleObj)) {
                        error = new Error(consts.SERVER_ERRORS.TAG.RULE.NOT_ALLOWED_RULE_TYPE);
                        error.status = 422;
                        callback(error, null);
                    } else {
                        callback(null, ruleObj);
                    }
                },
                function (ruleToInsert, callback) {
                    getRules(callback);
                },
                function (findRules, callback) {
                    var existingTypes = _.map(findRules, function (rule) {
                        return rule.tagType.toLowerCase();
                    });

                    if (existingTypes.indexOf(ruleObj.tagType.toLowerCase()) > -1) {
                        error = new Error(consts.SERVER_ERRORS.TAG.RULE.DUPLICATE_RULE_TYPE);
                        error.status = 422;
                        callback(error, null);
                    } else {
                        callback(null, ruleObj);
                    }
                },
                function (ruleToInsert, callback) {
                    var thisRuleObjModel = new TagRule(ruleToInsert);
                    thisRuleObjModel.save(callback);
                }
            ],
            function (err, savedRule) {
                if (err) {
                    finalCallback(err);
                } else {
                    finalCallback(null, savedRule);
                }
            });
    }
}

function getRuleById(selectedRuleId, callback) {
    TagRule.findById(selectedRuleId, function (err, findRule) {
        if (err) {
            callback(err, null);
        } else {
            if (findRule) {
                callback(null, findRule);
            } else {
                var error = new Error(consts.SERVER_ERRORS.TAG.RULE.RULE_NOT_EXISTS + selectedRuleId);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

function editRule(ruleId, ruleObj, currentUser, finalCallback) {
    delete ruleObj._id;
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.TAG.RULE.CAN_NOT_EDIT_RULE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        async.waterfall([
            function (callback) {
                validate(ruleObj, callback);
            },
            function (validateResult, callback) {
                if (isReservedType(ruleObj)) {
                    error = new Error(consts.SERVER_ERRORS.TAG.RULE.NOT_ALLOWED_RULE_TYPE);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, ruleObj);
                }
            },
            function (ruleToInsert, callback) {
                getRuleById(ruleId, callback);
            },
            function (findRule, callback) {
                getRules(function (err, findRules) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, findRule, findRules);
                    }
                });
            },
            function (findRule, findRules, callback) {
                var differentRules = _.filter(findRules, function (rule) {
                    return rule._id.toString() !== findRule._id.toString();
                });

                var existingTypes = _.map(differentRules, function (rule) {
                    return rule.tagType.toLowerCase();
                });

                if (existingTypes.indexOf(ruleObj.tagType.toLowerCase()) > -1) {
                    error = new Error(consts.SERVER_ERRORS.TAG.RULE.DUPLICATE_RULE_TYPE);
                    callback(error, null);
                } else {
                    callback(null, findRule);
                }
            },
            function (findRule, callback) {
                var paramsToChange = Object.keys(ruleObj);

                paramsToChange.forEach(function (param) {
                    findRule[param] = ruleObj[param];
                });

                findRule.save(callback);
            }
        ],
        function (err, savedRule) {
            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, savedRule);
            }
        });
    }

}

function deleteRuleById(selectedRuleId, currentUser, finalCallback) {
    log.info("selectedRuleId:" + selectedRuleId);

    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.TAG.RULE.CAN_NOT_DELETE_RULE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        async.waterfall([
            function (callback) {
                getRuleById(selectedRuleId, callback);
            },
            function (findRule, callback) {
                if (findRule.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.SERVER_ERRORS.TAG.RULE.ONLY_BP_CAN_DELETE_RULE);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, findRule);
                }
            },
            function(finRule, callback) {
                if(isReservedType(finRule)) {
                    error = new Error(consts.SERVER_ERRORS.TAG.RULE.CAN_NOT_DELETE_RESERVED_RULE);
                    error.status = 422;
                    callback(error);
                } else {
                    callback(null, finRule);
                }
            },
            function (findRule, callback) {
                TagRule.remove({_id: findRule._id}).exec(callback);
            }
        ],
        function (err) {
            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, consts.OK);
            }
        });
    }
}

exports.getRuleById = getRuleById;
exports.deleteRuleById = deleteRuleById;
exports.createRule = createRule;
exports.editRule = editRule;
exports.getRules = getRules;
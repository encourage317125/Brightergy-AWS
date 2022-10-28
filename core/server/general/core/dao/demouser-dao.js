"use strict";

var mongoose = require("mongoose"),
    Demouser = mongoose.model("demouser"),
    utils = require("../../../libs/utils"),
    async = require("async"),
    consts = require("../../../libs/consts");


/**
 * Get demousers by param
 *
 * @access  public
 * @param   array
 * @param   callback
 * @return  void
 */
function getDemousersByParams(params, callback) {
    Demouser.find(params)
        .lean()
        .exec(callback);
}

/**
 * Get demo user By email
 *
 * @param     String, findEmail
 * @return    Object, User object or error
 */
function getDemouserByEmail(findEmail, callback) {

    if(findEmail) {
        findEmail = findEmail.toLowerCase();
    }

    Demouser.findOne({email : findEmail}, function (err, foundDemouser) {
        if(err) {
            callback(err, null);
        } else {
            if(foundDemouser) {
                callback(null, foundDemouser);
            } else {
                var userErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_EMAIL);
                userErr.status = 403;
                callback(userErr, null);
            }
        }
    });
}

/**
 * Add demo user info
 *
 * @param     Object, demouserObj
 * @return    Object, User object or error
 */
function addDemoUser(demouserObj, finalCallback) {
    utils.removeMongooseVersionField(demouserObj);
    delete demouserObj._id;

    demouserObj.creationTime = new Date();

    var demouser = new Demouser(demouserObj);

    async.waterfall([
        function (callback) {
            demouser.save(callback);
        }
    ], function (err, savedDemouser) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, savedDemouser);
        }
    });
}

exports.getDemousersByParams = getDemousersByParams;
exports.getDemouserByEmail = getDemouserByEmail;
exports.addDemoUser = addDemoUser;

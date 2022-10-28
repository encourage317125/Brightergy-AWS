"use strict";

// TODO: moved to auth-service

var express = require("express"),
    router = express.Router(),
    _ = require("lodash"),
    utils = require("../../../libs/utils"),
    async = require("async"),
    consts = require("../../../libs/consts"),
    userDAO = require("../../core/dao/user-dao"),
    dashboardDAO = require("../../../bl-data-sense/core/dao/dashboard-dao"),
    passwordUtils = require("../../core/user/password-utils");

 /**
 * @api {post} /v1/users/password/:email Change Password
 * @apiGroup User
 * @apiName Change Password
 * @apiVersion 1.0.0
 * @apiDescription Check if user is exist and send reset password link to that email
 * @apiExample Example request
 *  emmanuel.ekochu@brightergy.com
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */

router.post("/:email", function(req, res, next) {

    var email = req.params.email;
    console.log("email..........");
    console.log(email);

    async.waterfall([
        function (callback) {
            userDAO.getUserByEmail(email, callback);
        },
        function (findUser, callback) {
            passwordUtils.sendSetPasswordLink(findUser, callback);
        },
        function (userWithToken, callback) {
            console.log("before save");
            userDAO.saveUser(userWithToken, callback);
        },
    ], function (err, savedUser) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(consts.OK, res, next);
        }
    });
});

 /**
 * @api {post} /v1/users/password/ Set Password
 * @apiGroup User
 * @apiName Set Password
 * @apiVersion 1.0.0
 * @apiDescription Check user with given token and set new password
 * @apiParam {String} token current user token
 * @apiParam {String} password new password
 *
 * @apiSuccess success 1
 * @apiSuccess message loginUrl
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", function(req, res, next) {

    utils.destroySession(req);
    res.clearCookie(consts.USER_COOKIE.STATUS_COOKIE_NAME, utils.getCookieOptionsDefault());

    var token = req.body.token;
    var password = req.body.password;
    var error;

    if(!token) {
        error = new Error(consts.SERVER_ERRORS.USER.INCORRECT_OR_EXPIRED_TOKEN);
        error.status = 422;
        return next(error);
    }  else if(!password) {
        error = new Error(consts.SERVER_ERRORS.USER.PASSWORD_REQUIRED);
        error.status = 422;
        return next(error);
    } else {
        async.waterfall([
            function (callback) {
                userDAO.getUserByToken(consts.USER_TOKENS.SET_PASSWORD, token, callback);
            },
            function (findUser, callback) {
                var isNewTMUser = !findUser.password && findUser.role !== consts.USER_ROLES.BP;

                findUser.password = password;
                findUser.tokens = _.reject(findUser.tokens, function(tokenObj) { 
                    return tokenObj.type === consts.USER_TOKENS.SET_PASSWORD; 
                });

                userDAO.saveUser(findUser, function(saveErr, savedUser) {
                    if(saveErr) {
                        callback(saveErr);
                    } else {
                        callback(null, savedUser, isNewTMUser);
                    }
                });
            },
            function (savedUser, isNewTMUser, callback) {
                var loginUrl = utils.getDomain(true) + consts.LOGIN_PAGE_URL;
                if (isNewTMUser) {
                    dashboardDAO.createDefaultDashboards(savedUser, function(createDashboardErr, result) {
                        if(createDashboardErr) {
                            callback(createDashboardErr);
                        } else {
                            callback(null, loginUrl);
                        }
                    });
                } else {
                    callback(null, loginUrl);
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            } else {
                return utils.successResponse(result, res, next);
            }
        });
    }

});

module.exports = router;
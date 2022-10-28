"use strict";

// TODO: moved to auth-service

var express = require("express"),
    router = express.Router(),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    userDAO = require("../../core/dao/user-dao"),
    consts = require("../../../libs/consts"),
    authUtils = require("../../core/user/auth-utils"),
    permissionsUtils = require("../../core/user/permissions-utils"),
    checkAuth = require("../../core/user/check-auth");

router.post("/users/login", function(req, res, next) {

    res.clearCookie(consts.USER_COOKIE.STATUS_COOKIE_NAME, utils.getCookieOptionsDefault());

    var origin = req.headers.origin;
    log.info("origin:" + origin);

    var email = req.body.email;
    var password = req.body.password;
    var rememberMe = req.body.rememberMe;
    var os = req.body.os;
    var redirectTo = req.body.redirect;
    log.debug("redirectTo:" + redirectTo);

    var validateErrors = [];
    if (!email) {
        validateErrors.push(consts.SERVER_ERRORS.USER.EMAIL_REQUIRED);
    }
    if (!password) {
        validateErrors.push(consts.SERVER_ERRORS.USER.PASSWORD_REQUIRED);
    }
    /*if (typeof rememberMe !== "boolean") {
        validateErrors.push("specify correct remember me");
    }*/

    if (validateErrors.length > 0) {
        return next(new Error(validateErrors.join(", ")));
    } else {
        /*
        log.info("email: %s", email);
        log.info("password: %s", password);
        log.info("rememberMe: %s", rememberMe);
        */
        log.info("rememberMe: %s", rememberMe);

        userDAO.getUserByEmail(email, function (err, findUser) {
            if (err) {
                if(err.status === 403) {
                    err.message = consts.SERVER_ERRORS.USER.INCORRECT_LOGIN_OR_PASSWORD;
                }
                return next(err);
            } else {
                findUser.checkPassword(password, function (checkPassErr, isMatch) {
                    if(checkPassErr) {
                        return next(checkPassErr);
                    } else {
                        if(isMatch) {
                            if (rememberMe === "true" && !os) {
                                log.info("one year expiration");
                                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                            }

                            var loginParams = {
                                os: os,
                                clientRedirect: redirectTo
                            };

                            authUtils.loginUser(findUser, loginParams, req, res, function(loginErr, loginResult) {
                                if(loginErr) {
                                    return next(loginErr);
                                } else {
                                    return utils.successResponse(loginResult, res, next);
                                }
                            });
                        } else {
                            var userErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_LOGIN_OR_PASSWORD);
                            userErr.status = 403;
                            return next(userErr);
                        }
                    }
                });
            }
        });
    }
});

router.post("/users/logout", function(req, res, next) {
    utils.destroySession(req);
    var fullUrl = utils.getDomain(true) + consts.LOGIN_PAGE_URL + 
        "?redirect=" + encodeURIComponent(req.get("origin"));
    return utils.successResponse(fullUrl, res, next);
});

router.get("/users/logout", function(req, res, next) {
    utils.destroySession(req);
    var fullUrl = utils.getDomain(true) + consts.LOGIN_PAGE_URL;
    return res.redirect(fullUrl);
});

router.get("/users/energycaplogin", checkAuth, function(req, res, next) {
    if (permissionsUtils.userHaveAccessToUtilities(req.user)) {
        authUtils.bypassEnergyCapLogin(
            req.user.energyCapUserName, 
            req.user.energyCapPassword, 
            req.user.energyCapDataSource,
            function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
        });
    } else {
        var permissionErr = new Error("No Permission for Utilities.");
        permissionErr.status = 403;
        return next(permissionErr);
    }
});

module.exports = router;
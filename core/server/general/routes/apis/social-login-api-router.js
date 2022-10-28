"use strict";

// TODO: moved to auth-service

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    log = require("../../../libs/log")(module),
    //config = require("../../../../config/environment"),
    consts = require("../../../libs/consts"),
    authUtils = require("../../core/user/auth-utils"),
    userDAO = require("../../core/dao/user-dao"),
    socialLoginUtils = require("../../core/oneall/social-login-utils");




/**
 * @api {post} /v1/sociallogin/mobile Perform mobile social login
 * @apiGroup Social login
 * @apiName Perfom mobile social login
 * @apiVersion 1.0.0
 * @apiDescription Perfom mobile social login
 * @apiParam {Object} body object
 * @apiExample Example request:
 *  body
 *  {
 *      "user_token": "b3ec9ea3-eb43-4dd0-9730-dca1648ebcdb"
 *  }
 * @apiSuccess success 1
 * @apiSuccess message user object with api token
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": {
 *   "user": {
 *       "_id": "54621cd2349cc84500dee9ea",
 *           "firstName": "Ilya",
 *           "lastName": "Shekhurin",
 *           "email": "ilya.shekhurin@brightergy.com",
 *           "emailUser": "ilya.shekhurin",
 *           "emailDomain": "brightergy.com",
 *           "accounts": [
 *           "546b32f580f57514008590cf"
 *       ],
 *           "accessibleTags": [],
 *           "profilePictureUrl": "/assets/img/icon_SF_large.png",
 *           "sfdcContactId": null,
 *           "defaultApp": null,
 *           "apps": [],
 *           "previousEditedDashboardId": "5461363bdfef7c4800146f4b",
 *           "lastEditedDashboardId": "54943e3669df363300bc331e",
 *           "previousEditedPresentation": "549194c200e34b15006f2db2",
 *           "lastEditedPresentation": "545e61f0649db6140038fc61",
 *           "role": "BP",
 *           "enphaseUserId": "4d6a49784e7a67790a",
 *           "socialToken": "a0c53f1a-0486-4f58-9c9e-271a8c24d0c7",
 *           "phone": null,
 *           "middleName": "",
 *           "__v": 107,
 *           "collections": [],
 *           "name": "Ilya Shekhurin",
 *           "sfdcContactURL": null,
 *           "id": "54621cd2349cc84500dee9ea"
 *   },
 *   "token": "9e9e8510-b1ea-11e4-a6da-0d1b734836b9"
 *   }
 * }
 * @apiError success 0
 * @apiError message Error code
 */

router.post("/mobile", function(req, res, next) {
    var userToken = utils.getObjectValue(req.body, "user_token");

    if(!userToken) {
        var error = new Error("Missing user_token");
        error.status = 422;
        return next(error);
    } else {
        socialLoginUtils.getUserBySocialLoginMobile(userToken, function(findErr, findUser) {
            if(findErr) {
                return next(findErr);
            } else {
                authUtils.loginUser(findUser, "iOS", req, res, function(loginErr, loginResult) {
                    if(loginErr) {
                        return next(loginErr);
                    } else {
                        return utils.successResponse(loginResult, res, next);
                    }
                });
            }
        });
    }
});

/**
 * @api {post} /v1/sociallogin Perform web social login
 * @apiGroup Social login
 * @apiName Perfom web social login
 * @apiVersion 1.0.0
 * @apiDescription Perfom web social login
 * @apiParam {Object} body object
 * @apiSuccess success 1
 * @apiSuccess redirect user to app
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", function(req, res, next) {
    res.clearCookie(consts.USER_COOKIE.STATUS_COOKIE_NAME, utils.getCookieOptionsDefault());

    var redirectTo = req.query.redirect;
    log.debug("redirectTo:" + redirectTo);

    var loginParams = {
        clientRedirect: redirectTo
    };

    var connectionToken = utils.getObjectValue(req.body, "connection_token");

    if (!connectionToken) {
        var error = new Error("Missing connection token");
        error.status = 422;
        return next(error);
    } else {
        socialLoginUtils.getUserBySocialLogin(connectionToken, req, res, function(findErr, findUser) {
            if (findErr) {
                res.cookie(
                    consts.USER_COOKIE.STATUS_COOKIE_NAME,
                    findErr.message,
                    utils.getCookieOptionsDefault()
                );
                return utils.redirectToLoginPage(res);
            } else {
                authUtils.loginUser(findUser, loginParams, req, res, function(loginErr, loginResult) {
                    if (loginErr) {
                        return next(loginErr);
                    } else {
                        res.redirect(loginResult);
                    }
                });
            }
        });
    }
});

/**
 * @api {get} /v1/sociallogin/accounts/:userId get User social accounts
 * @apiGroup Social login
 * @apiName Get user linked social accounts
 * @apiVersion 1.0.0
 * @apiDescription Perfom mobile social login
 * @apiExample
 *  userId : 54621cd2349cc84500dee9ea
 * @apiSuccess success 1
 * @apiSuccess message user object with api token
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": [
 *       {
 *           "provider": "google",
 *           "displayName": "Ilya Shekhurin",
 *           "profileUrl": "https://plus.google.com/110973111369916090366"
 *       },
 *       {
 *           "provider": "github",
 *           "displayName": "Ilya Shekhurin",
 *           "profileUrl": "https://github.com/Brightergy-IlyaShekhurin"
 *       }
 *   ]
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/accounts/:userId", function(req, res, next) {
    var userId = req.params.userId;

    userDAO.getUserByIdIfAllowed(userId, function(findUserErr, foundUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            if(foundUser.socialToken && foundUser.socialToken !== "") {
                socialLoginUtils.getAccountsAll(foundUser.socialToken, req, res, function(findErr, socialAccounts) {
                    if(findErr) {
                        return next(findErr);
                    } else {
                        return utils.successResponse(socialAccounts, res, next);
                    }
                });
            }
            else {
                return utils.successResponse([], res, next);
            }
        }
    });
});

module.exports = router;

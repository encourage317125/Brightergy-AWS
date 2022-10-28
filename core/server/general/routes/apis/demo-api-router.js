"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    config = require("../../../../config/environment"),
    userDAO = require("../../core/dao/user-dao"),
    demouserDAO = require("../../core/dao/demouser-dao"),
    // coreService = require("../../../../module"), // for dev and test
    coreService = require("core-service-old"), // for production
    async = require("async"),
    Recaptcha = require("recaptcha").Recaptcha;


/**
 * @api {post} /v1/demo DemoBox-side API to Create Demo User
 * @apiGroup DemoBox
 * @apiName Create Demo User on DemoBox
 * @apiVersion 1.0.0
 * @apiDescription Create new demo user
 * @apiParam {Object} body user data including email, role
 * @apiExample Example request
 *  body
 *  {
 *      "email" : "demouser@brightergy.com",
 *      "role" : "Admin"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created demo user data
 * @apiSuccessExample Success example
 *  {
 *  	"success": 1,
 *  	"message": {
 *  		"email": "demouser@brightergy.com",
 *  		"password": "Brightergy1",
 *  		"demoLoginUrl": "http://localhost:3000/v1/users/login"
 *  	}
 *  }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/demo", checkAuth, function(req, res, next) {

	var userData = req.body;
	var error;

	if (!userData) {
        error = new Error(consts.SERVER_ERRORS.USER.INCORRECT_REQUEST);
        error.status = 422;
        return next(error);
    }

    userDAO.createDemoUser(userData, function (err, savedUser) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(savedUser, res, next);
        }
    });

});

/**
 * @api {post} /v1/requestdemo Core-side API to Request a New Demo User
 * @apiGroup DemoBox
 * @apiName Request New Demo User
 * @apiVersion 1.0.0
 * @apiDescription Core-side API to Request a New Demo User
 * @apiParam {Object} body user data including email, role
 * @apiExample Example request
 *  body
 *  {
 *      "email" : "demouser@brightergy.com",
 *      "role" : "Admin"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created demo user credentials and loginUrl
 * @apiSuccessExample Success example
 *  {
 *      "success": 1,
 *      "message": {
 *          "email": "demouser@brightergy.com",
 *          "password": "Brightergy1",
 *          "demoLoginUrl": "http://localhost:3000/v1/users/login"
 *      }
 *  }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/requestdemo", function(req, res, next) {

    var error;

    if (!req.body) {
        error = new Error(consts.SERVER_ERRORS.USER.INCORRECT_REQUEST);
        error.status = 422;
        return next(error);
    }

    var recaptchaData = {
        remoteip:  req.connection.remoteAddress,
        challenge: req.body["recaptcha_challenge_field"],
        response:  req.body["recaptcha_response_field"]
    };
    var recaptcha = new Recaptcha(config.get("recaptcha:sitekey"), config.get("recaptcha:secretkey"), 
        recaptchaData, true);

    recaptcha.verify(function(success, errorCode) {
        if (success) {

            var demouserData = {
                email: req.body.email,
                role: req.body.role
            };

            async.waterfall([
                function (callback) {

                    if (!demouserData.email || !demouserData.role) {
                        error = new Error("Please specify email and role.");
                        error.status = 422;
                        callback(error);
                    } else {
                        demouserDAO.addDemoUser(demouserData, callback);
                    }

                }, function (savedDemouser, callback) {
                    
                    coreService.createDemoUser(demouserData, callback);

                }
            ], function (err, demoResult) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(demoResult, res, next);
                }
            });

        } else {

            error = new Error(consts.SERVER_ERRORS.GENERAL.RECAPTCHA_FAILED);
            error.status = 401;
            return next(error);

        }
    });
       
});

module.exports = router;
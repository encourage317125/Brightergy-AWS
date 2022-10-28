"use strict";

var express = require("express"),
    router = express.Router(),
    _ = require("lodash"),
    fs = require("fs"),
    checkAuth = require("../../core/user/check-auth"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    emailSender = require("../../../libs/email-sender"),
    accountDAO = require("../../core/dao/account-dao");

 /**
 * @api {post} /v1/notifications/email/newutilityprovider Create Utility Provider Email
 * @apiGroup Email
 * @apiName Create Utility Provider Email
 * @apiVersion 1.0.0
 * @apiDescription Send new utility provider email to currently logged in user.
 * @apiParam {String} text Email body text
 * @apiExample Example request
 *      text : This is utility provider mail sample
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/newutilityprovider", checkAuth, function(req, res, next) {
    var text = req.body.text;

    if (!text) {
        var error = new Error(consts.SERVER_ERRORS.ACCOUNT.UNKNOWN_UTILITY_PROVIDER);
        error.status = 422;
        return next(error);
    } else {

        accountDAO.getAccountsByUser(req.user, null, null, function (err, findAccounts) {
            if (err) {
                return next(err);
            } else {

                var accountsUrls = [];

                if(req.user.role !== consts.USER_ROLES.BP) {
                    accountsUrls.push(_.map(findAccounts, function (acc) {
                        return acc.sfdcAccountURL;
                    }));
                }

                emailSender.sendNewUtilityProviderEmail(accountsUrls, req.user.sfdcContactURL, text,
                    function(sendEmailErr, result) {
                        if(sendEmailErr) {
                            return next(sendEmailErr);
                        } else {
                            return utils.successResponse(result, res, next);
                        }
                    });
            }
        });
    }

});

 /**
 * @api {post} /v1/notifications/email/presentationlink Create Presentation Link Email
 * @apiGroup Email
 * @apiName Create Presentation Link Email
 * @apiVersion 1.0.0
 * @apiDescription Send presentation link email to currently logged in user.
 * @apiParam {Email} email Email address to send
 * @apiParam {String} message Email body message
 * @apiParam {String} link Presentation Link
 * @apiExample Example request
 *      email : emmanuel.ekochuseven@brightergy.com
 *      message : This is a new presentation mail.
 *      link : https://brighterlink.brightergy.com/management?id=5469c01f12db4314007626c0
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/presentationlink", checkAuth, function(req, res, next) {
    var email = req.body.email;
    var message = req.body.message;
    var link = req.body.link;
    var subject = req.body.subject;
    var title = req.body.presentationName;

    var validateErrors = [];
    if(!email) {
        validateErrors.push(consts.SERVER_ERRORS.USER.EMAIL_REQUIRED);
    }
    if (!message) {
        validateErrors.push(consts.SERVER_ERRORS.GENERAL.MESSAGE_REQUIRED);
    }
    if (!link) {
        validateErrors.push(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_LINK_REQUIRED);
    }
    if (!subject) {
        subject = "Brightergy Client Portal Presentation";
    }

    if (validateErrors.length > 0) {
        var error = new Error(validateErrors.join(", "));
        error.status = 422;
        return next(error);
    } else {
        // TODO: remove subject, title (unused in coreservice)
        emailSender.sendPresentationLinkEmail(email, subject, message, link, title,
            function(sendEmailErr, result) {
                if(sendEmailErr) {
                    return next(sendEmailErr);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
    }
});

 /**
 * @api {post} /v1/notifications/email/dashboardlink Send Dashboard Link Email
 * @apiGroup Email
 * @apiName Send Dashboard Link Email
 * @apiVersion 1.0.0
 * @apiDescription Send dashboard link email to currently logged in user.
 * @apiParam {Email} email Email address to send
 * @apiParam {String} message Email body message
 * @apiParam {String} link dashboard Link
 * @apiExample Example request
 *      email : emmanuel.ekochuseven@brightergy.com
 *      message : This is a new dashboard mail.
 *      link : http://localhost:3000/datasense#!/54c75bd47cd58cac01ae3264
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/dashboardlink", checkAuth, function(req, res, next) {
    var email = req.body.email;
    var message = req.body.message;
    var link = req.body.link;
    var subject = req.body.subject;
    var title = req.body.dashboardTitle;
    var pdfPath = req.body.pdfPath;

    var validateErrors = [];
    if (!email) {
        validateErrors.push(consts.SERVER_ERRORS.USER.EMAIL_REQUIRED);
    }
    if (!message) {
        message = "";
    }
    if (!link) {
        validateErrors.push(consts.SERVER_ERRORS.DASHBOARD.DASHBOARD_LINK_REQUIRED);
    }
    if (!subject) {
        subject = "Brightergy Dashboard";
    }

    if (validateErrors.length > 0) {
        var error = new Error(validateErrors.join(", "));
        error.status = 422;
        return next(error);
    } else {
        if (!(pdfPath && fs.existsSync(pdfPath))) {
            pdfPath = null;
        }

        emailSender.sendDashboardLinkEmail(email, subject, message, link, title, pdfPath,
            function (sendEmailErr, result) {
                if (sendEmailErr) {
                    return next(sendEmailErr);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
    }
});

module.exports = router;
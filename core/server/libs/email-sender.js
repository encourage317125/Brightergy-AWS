"use strict";

// TODO:: moved to core-service

var nodemailer = require("nodemailer"),
    config = require("../../config/environment"),
    _ = require("lodash"),
    log = require("./log")(module),
    utils = require("./utils"),
    consts = require("./consts"),
    smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: config.get("email:username"),
            pass: config.get("email:password")
        }
    }),
    path = require("path"),
    emailTemplates = require("email-templates"),
    templatesDir   = path.resolve(__dirname, "../..", "templates"),
    THANK_YOU = "<p> - The Brightergy Team</p>";

function sendEmail(mailOptions, content, callbackParams, callback) {

    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            console.log(err);
        } else {
            var locals = {content: content};
            template("email", locals, function(err, html, text) {
                mailOptions.from = config.get("email:username");
                mailOptions.html = utils.htmldecode(html);

                smtpTransport.sendMail(mailOptions, function(err, response) {
                    if (callback) {
                        if(err) {
                            log.error("smtp error: " + err);
                            callback(err, null);
                        } else {
                            callback(null, callbackParams);
                        }
                    } else {
                        if (err) {
                            var fullErr = utils.convertError(err);
                            log.error(fullErr);
                        }
                    }
                });
            });
        }
    });
}

function sendExceptionOccuredEmail(errStr) {
    if(config.get("email:onerrorsendemail")) {
        var mailOptions = {
            to: config.get("email:recipients:erroroccured"),
            subject: "Exception occured on Client Portal instance: " + config.get("instance"),
            text: errStr
        };

        var content = "<p>" + errStr + "</p>";
        sendEmail(mailOptions, content, null, null);
    }
}

function getSetPasswordUrl(tokens) {
    var domain = utils.getDomain(true);
    var tokenObj = _.where(tokens, { "type": consts.USER_TOKENS.SET_PASSWORD });
    var url = domain + consts.SET_PASSWORD_PAGE_URL + tokenObj[0].token;
    return url;
}

function sendSetPasswordEmail(user, callback) {
    var url = getSetPasswordUrl(user.tokens);
    var content = "<h1>Hi "+ user.name + ",</h1> <br/><br/>";
    content += "<p>Please set your new password for the Brightergy Client Portal by clicking " +
    "<a href=" + url  + ">here.</a><p>";
    content += THANK_YOU;

    var mailOptions = {
        to: user.email,
        subject: "Brightergy Client Portal: Set Password"
    };

    sendEmail(mailOptions, content, user, callback);
}

function sendPresentationLinkEmail(email, subject, message, link, title, callback) {

    var content = "<p>" + message + ", </p><br/>";
    content += "<a href=" + link  + ">Presentation link.</a>";
    content += THANK_YOU;

    var mailOptions = {
        to: email,
        subject: "Brightergy Client Portal Presentation"
    };

    sendEmail(mailOptions, content, consts.OK, callback);
}

function sendNewUtilityProviderEmail(accountsUrls, userSFDCContactURL, text, callback) {

    var content = "";
    if(accountsUrls.length > 0) {
        content = "<strong>Account:</strong> " + accountsUrls.join(", ") + "<br/>";
    }
    if(userSFDCContactURL) {
        content += "<strong>Master Manager:</strong> " + userSFDCContactURL + "<br/>";
    }
    content += "<strong>message:</strong> " + text;
    content += THANK_YOU;

    var mailOptions = {
        to: config.get("email:recipients:newutilityprovider"),
        subject: "New Utility Provider and/or Variant"
    };

    sendEmail(mailOptions, content, consts.OK, callback);
}

function sendDashboardLinkEmail(email, subject, message, link, title, pdfPath, callback) {

    var content = "<p>" + message + "</p><br/>";
    content += "<a href=" + link  + ">" + title + "</a><br/>";
    content += THANK_YOU;

    var mailOptions = {
        to: email,
        subject: subject
    };

    if(pdfPath) {
        mailOptions.attachments = [{
            filename: title + ".pdf",
            path: pdfPath
        }];
    }

    sendEmail(mailOptions, content, consts.OK, callback);
}

exports.sendExceptionOccuredEmail = sendExceptionOccuredEmail;
exports.sendSetPasswordEmail = sendSetPasswordEmail;
exports.sendPresentationLinkEmail = sendPresentationLinkEmail;
exports.sendNewUtilityProviderEmail = sendNewUtilityProviderEmail;
exports.sendDashboardLinkEmail = sendDashboardLinkEmail;

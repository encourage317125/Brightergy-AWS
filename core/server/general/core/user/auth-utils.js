"use strict";

// TODO:: moved to auth-service

var _ = require("lodash"),
    url = require("url"),
    mongoose = require("mongoose"),
    utils = require("../../../libs/utils"),
    log = require("../../../libs/log")(module),
    config = require("../../../../config/environment"),
    consts = require("../../../libs/consts"),
    uuid = require("node-uuid"),
    userDAO = require("../dao/user-dao"),
    request = require("request");

function bypassEnergyCapLogin(username, password, datasource, callback) {
    var err;
    if (!username || !password || !datasource) {
        err = new Error("Utilities: EnergyCap Username, Password and DataSource are Required.");
        err.status = 403;
        return callback(err);
    }

    var utilitiesDomain = config.get("apps:utilities");
    var logoutUrl = utils.getDomain(true) + "/v1/users/logout";

    var reqOptions = {
        url: utilitiesDomain + config.get("energycap:authapipath"),
        json: true,
        body: {
            "DataSource": datasource,
            "Password": password,
            "Username": username
        }
    };
    request.post(reqOptions, function(reqErr, res, body) {
        if (reqErr) {
            log.error(reqErr.message);
            err = new Error("Utilities: Unexpected EnergyCap Authentication Error");
            err.status = 403;
            callback(err);
        } else if (res.statusCode !== 200) {
            log.error(body.status.message);
            err = new Error(consts.SERVER_ERRORS.UTILITIES.AUTHENTICATION_FAILD);
            err.status = 403;
            callback(err);
        } else if (!body.Data[0].Token) {
            log.error("EnergyCap Login Token Not Found");
            err = new Error(consts.SERVER_ERRORS.UTILITIES.AUTHENTICATION_FAILD);
            err.status = 403;
            callback(err);
        } else {
            log.debug("EnergyCap sucessfully authenticated for login bypassing.");
            var result = {
                token: body.Data[0].Token,
                redirectUrl: utilitiesDomain + "/?token=" + body.Data[0].Token + "&logoutURL=" + logoutUrl
            };
            callback(null, result);
        }
    });

}

function webLogin(loggedinUser, loginParams, req, callback) {

    req.session.userId = loggedinUser._id;

    // the clientRedirect (from request params) has the priority
    var clientRedirect = loginParams.clientRedirect;
    log.debug("clientRedirect: " + clientRedirect);
    if (clientRedirect) {
        if (utils.isDevelopmentEnv()) {
            log.debug("redirect in development env");
            return callback(null, clientRedirect);
        }
        // test if clientRedirect belong to our domain
        var domain = config.get("session:cookiedomain") || ".brightergy.com";
        var redirectUrl = url.parse(clientRedirect);
        if (_.endsWith(redirectUrl.host, domain)) {
            return callback(null, clientRedirect);
        } else {
            log.warn("client redirect (" + clientRedirect +
                ") doesn't belong to domain " +  domain);
        }
    }

    var loginRedirectUrl = config.get("forced_login_redirect_url");
    if (loginRedirectUrl) {
        return callback(null, loginRedirectUrl);
    }

    var defaultAppUrl = null;
    var apps = utils.getDefaultApps();
    if (loggedinUser.defaultApp === consts.APPS.Utilities) {
        bypassEnergyCapLogin(
            loggedinUser.energyCapUserName, 
            loggedinUser.energyCapPassword, 
            loggedinUser.energyCapDataSource,
            function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    log.debug("Landing onto Utilities (EnergyCap) ...");
                    callback(null, result.redirectUrl);
                }
        });
    } else {
        if (loggedinUser.defaultApp) {
            defaultAppUrl = apps[loggedinUser.defaultApp];
        } else {
            defaultAppUrl = apps[consts.APPS.Analyze];
        }
        callback(null, defaultAppUrl);
    }
}

function mobileLogin(loggedinUser, req, res, callback) {
    //build session obj

    var sessionsCollection = mongoose.connection.db.collection("sessions");

    var sessionFieldObject = {
        cookie: {
            originalMaxAge: null,
            expires: null,
            secure: false,
            httpOnly: true,
            domain: utils.isDevelopmentEnv() ? null : config.get("session:cookiedomain"),
            path: "/"
        },
        userId: loggedinUser._id.toString()
    };

    var d = new Date();
    d.setMonth(d.getMonth() + 8);

    var document = {
        _id: uuid.v1(),
        session: JSON.stringify(sessionFieldObject),
        expires: d
    };

    sessionsCollection.insert(document, {w: 1}, function(insertErr, records){
        if(insertErr) {
            callback(insertErr);
        } else {

            //delete very important fields
            var userObj = loggedinUser.toObject();
            delete userObj.tokens;
            delete userObj.password;
            delete userObj.previousPasswords;

            var returnData = {
                user: userObj,
                token: records[0]._id.toString()
            };

            callback(null, returnData);
        }
    });
}

function loginUser(loggedinUser, loginParams, req, res, callback) {

    var os = loginParams.os;
    if(os) {
        mobileLogin(loggedinUser, req, res, callback);
    } else {
        webLogin(loggedinUser, loginParams, req, callback);
    }
}

function checkHeaderAuthKeyforAPIs(req) {
    var authorized = false;
    var authHeader = req.headers.authorization;

    var tagStateApiPathRegx = /^(\/v\d)?\/tags\/state/;
    if (tagStateApiPathRegx.test(req.originalUrl)) {
        switch (req.query.dataType) {
            case consts.TAG_STATE_DATATYPE.DIGI_CONFIG:
            case consts.TAG_STATE_DATATYPE.DIGI_END_LIST:
            case consts.TAG_STATE_DATATYPE.DIGI_EVENT_LOG:
            case consts.TAG_STATE_DATATYPE.DIGI_STATUS:
            case consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK:
                authorized = (authHeader === config.get("apikey:gatewayconfig"));
                break;
            case consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE:
                authorized = (authHeader === config.get("apikey:gatewaysoftware"));
                break;
            case consts.TAG_STATE_DATATYPE.GEM_CONFIG:
                authorized = (authHeader === config.get("apikey:gemconfig"));
                break;
            case consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE:
                authorized = (authHeader === config.get("apikey:thermostat"));
                break;
        }
    }

    var demoBoxCreateUserApiPathRegx = /^(\/v\d)?\/demo/;
    if (demoBoxCreateUserApiPathRegx.test(req.originalUrl)) {
        authorized = (authHeader === config.get("demobox:createdemouserapi:auth"));
    }

    return authorized;
}

function isAuthenticatedUser(req, decryptSocialToken, callback) {
    var incorrectSessionErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_SESSION);
    incorrectSessionErr.status = 403;

    function cb(err, user) {
        if(err) {
            callback(err);
        } else {
            if(decryptSocialToken && user.socialToken) {
                user.socialToken = utils.decryptField(user.socialToken, config.get("oneall:usertokencryptokey"));
            }
            callback(null, user);
        }
    }

    var authHeader = req.headers.authorization;
    if (!req.session.userId && !authHeader) {
        callback(incorrectSessionErr, null);
    } else {
        if (req.session.userId) {
            userDAO.getUserByIdIfAllowed(req.session.userId, cb);
        } else {

            if (checkHeaderAuthKeyforAPIs(req)) {

                userDAO.getBPs(1, function(err, bpUser) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (bpUser && bpUser.length > 0) {
                            callback(null, bpUser[0]);
                        } else {
                            var errNoBP = new Error("No BP user to login");
                            errNoBP.status = 403;
                            callback(errNoBP, null);
                        }
                    }
                });

            } else {
                userDAO.getUserBySessionId(authHeader, cb);
            }
        }
    }
}


module.exports.loginUser = loginUser;
module.exports._webLogin = webLogin; // for UT
module.exports.isAuthenticatedUser = isAuthenticatedUser;
module.exports.bypassEnergyCapLogin = bypassEnergyCapLogin;
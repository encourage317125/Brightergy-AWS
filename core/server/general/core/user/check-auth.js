"use strict";

// TODO:: moved to auth-service

var authUtils = require("./auth-utils");

module.exports = function(req, res, next) {
    //we don not need decrypted social token in apis, so send false param
    authUtils.isAuthenticatedUser(req, false, function(err, user) {
        if(err) {
            return next(err);
        } else {
            req.user = user;
            return next();
        }
    });
};
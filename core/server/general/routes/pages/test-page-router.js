"use strict";

var express = require("express"),
    router = express.Router(),
    authUtils = require("../../../general/core/user/auth-utils"),
    //consts = require("../../../libs/consts"),
    config = require("../../../../config/environment");
var viewConfig;

router.get("/", function(req, res, next) {
    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        viewConfig = config.getMany("env", "cdn");

        if (findUserErr) {
            return res.render("test", {config: viewConfig});
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {
            return res.render("test", {config: viewConfig});
        }
    });
});

module.exports = router;

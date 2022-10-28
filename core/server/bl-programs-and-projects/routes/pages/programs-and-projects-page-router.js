"use strict";

var express = require("express"),
    router = express.Router(),
    //consts = require("../../../libs/consts"),
    //log = require("../../../libs/log")(module),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    authUtils = require("../../../general/core/user/auth-utils"),
    utils = require("../../../libs/utils"),
    config = require("../../../../config/environment");

router.get("/", function(req, res, next) {
    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        if (findUserErr) {
            return utils.redirectToLoginPage(res);
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {
            var viewConfig = config.getMany("env", "cdn", "api");
            var currentUserPermissions = permissionsUtils.getUserPermissions(currentUser);
            res.render("programsandprojects", {
                errors: null, permissions: currentUserPermissions, currentUser: currentUser, config: viewConfig
            });
        }
    });
});

module.exports = router;

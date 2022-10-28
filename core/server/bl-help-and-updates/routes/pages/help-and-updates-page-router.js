"use strict";

var express = require("express"),
    router = express.Router(),
    //consts = require("../../../libs/consts"),
    //log = require("../../../libs/log")(module),
    // permissionsUtils = require("../../../general/core/user/permissions-utils"),
    // checkAuth = require("../../../general/core/user/check-auth"),
    // utils = require("../../../libs/utils"),
    config = require("../../../../config/environment");

router.get("/", function(req, res, next) {
    // checkAuth(req, res, next, function(findUserErr, currentUser) {
    //     if (findUserErr) {
    //         return utils.redirectToLoginPage(res);
    //         //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
    //     } else {
            var viewConfig = config.getMany("env", "cdn", "api");
            // var currentUserPermissions = permissionsUtils.getUserPermissions(currentUser);
            res.render("helpandupdates", {
                config: viewConfig
            });
    //     }
    // });
});

module.exports = router;

"use strict";

var express = require("express"),
    router = express.Router(),
    authUtils = require("../../core/user/auth-utils"),
    consts = require("../../../libs/consts"),
    config = require("../../../../config/environment"),
    utils = require("../../../libs/utils"),
    log = require("../../../libs/log")(module);

router.get("/", function(req, res, next) {
    var url = req.header("host");
    if (url && url.indexOf("api-") > -1){
        var apidocUrl = url.replace("api-", "");
        res.redirect("http://" + apidocUrl + "/documentation");
    }

    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        if (findUserErr) {
            var viewConfig = config.getMany("env", "cdn");
            return res.render("login", {config: viewConfig, errors: ""});
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {

            var defaultAppUrl = config.get("forced_login_redirect_url");
            if (!defaultAppUrl) {
                var apps = utils.getDefaultApps();

                if (currentUser.defaultApp === consts.APPS.Utilities) {
                    authUtils.bypassEnergyCapLogin(
                        currentUser.energyCapUserName,
                        currentUser.energyCapPassword,
                        currentUser.energyCapDataSource,
                        function (err, result) {
                            defaultAppUrl = null;
                            if (err) {
                                var viewConfig = config.getMany("env", "cdn");
                                res.render("login", {config: viewConfig, errors: err.message});
                            } else {
                                log.info("Redirecting to Utilities (EnergyCap) ...");
                                res.redirect(result.redirectUrl);
                            }
                    });
                } else {
                    if (currentUser.defaultApp) {
                        defaultAppUrl = apps[currentUser.defaultApp];
                    } else {
                        defaultAppUrl = apps[consts.APPS.Analyze];
                    }
                }
            }

            if (defaultAppUrl) {
                res.redirect(defaultAppUrl);
            }
        }
    });
});

module.exports = router;

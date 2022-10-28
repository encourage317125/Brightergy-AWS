"use strict";

var express = require("express"),
    router = express.Router(),
//awsAssetsUtils = require("../../../general/core/aws/assets-utils"),
//userDAO = require("../../../general/core/dao/user-dao"),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    dashboardDAO = require("../../core/dao/dashboard-dao"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module),
    authUtils = require("../../../general/core/user/auth-utils"),
    utils = require("../../../libs/utils"),
    config = require("../../../../config/environment"),
    async = require("async"),
    accountDAO = require("../../../general/core/dao/account-dao"),
    userDAO = require("../../../general/core/dao/user-dao"),
    groupDAO = require("../../../general/core/dao/group-dao"),
    enphaseUtils = require("../../../general/core/enphase/enphase-utils"),
    awsAssetsUtils = require("../../../general/core/aws/assets-utils");

router.get("/", function(req, res, next) {

    var startTime = new Date();

    authUtils.isAuthenticatedUser(req, true, function(findUserErr, currentUser) {
        if (findUserErr) {
            return utils.redirectToLoginPage(res);
        } else {
            var viewConfig = config.getMany("env", "cdn", "api");
            var currentUserPermissions = permissionsUtils.getUserPermissions(currentUser);
            var keyPrefix = config.get("aws:assets:generalassetskeyprefix");
            var tzNames = utils.getAllowedTimeZonesName();
            var offset = new Date().getTimezoneOffset() * -1;
            var tzName = utils.getTimeZoneByOffset(offset);
            var enphaseUrl = enphaseUtils.getAuthUrl();
            var otherCompanyData = {timeZoneList: tzNames, timezone:tzName, enphaseUrl:enphaseUrl};
            if(!permissionsUtils.userHaveAccessToAnalyze(currentUser)) {
                res.render("500", {
                    errors: consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP,
                    permissions: currentUserPermissions,
                    currentUser: currentUser,
                    config: viewConfig,
                    dashboards: [],
                    userTags: [],
                    accounts: [],
                    foundUsers: [],
                    apps: [],
                    admins: [],
                    assets: [],
                    groups: [],
                    availableGroups: [],
                    otherCompanyData: otherCompanyData
                });
            } else {
                async.parallel([
                    function(cb) {
                        accountDAO.getAccountsByUser(currentUser, null, null, cb);
                    },
                    function(cb) {
                        userDAO.getUsersByName(currentUser, null, null, cb);
                    },
                    function(cb) {
                        userDAO.getApplications(currentUser, cb);
                    },
                    function(cb) {
                        //userDAO.getAdmins(currentUser, null, cb);
                        cb(null, []);
                    },
                    function(cb) {
                        awsAssetsUtils.findImages(keyPrefix, null, null, cb);
                    },
                    function(cb) {
                        groupDAO.getGroupsByParams({}, cb);
                    },
                    function(cb) {
                        //groupDAO.getAvailableSources(currentUser, cb);
                        cb(null, []);
                    },
                    function(cb) {
                        dashboardDAO.getDashboardsByUser(currentUser, null, cb);
                    }
                ], function(err, results) {

                    var endTime = new Date();
                    log.info("DATASENSE ROUTER QUERIES TIME: " + (endTime - startTime) / 1000);

                    if (err) {
                        res.render("datasense", {
                            errors: err.message,
                            permissions: null,
                            currentUser: currentUser,
                            config: viewConfig,
                            dashboards: null,
                            userTags: null,
                            accounts: null,
                            foundUsers: null,
                            apps: null,
                            admins: null,
                            assets: null,
                            groups: null,
                            availableGroups: null,
                            otherCompanyData: otherCompanyData
                        });
                    } else {

                        res.render("datasense", {
                            errors: null,
                            permissions: currentUserPermissions,
                            currentUser: currentUser,
                            config: viewConfig,
                            dashboards: results[7],
                            accounts: results[0],
                            foundUsers: results[1],
                            apps: results[2],
                            admins: results[3],
                            assets: results[4],
                            groups: results[5],
                            availableGroups: results[6],
                            otherCompanyData: otherCompanyData
                        });
                    }
                });
            }
        }
    });
});
module.exports = router;

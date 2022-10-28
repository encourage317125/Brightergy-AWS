"use strict";

var express = require("express"),
    router = express.Router(),
    dashboardDAO = require("../../core/dao/dashboard-dao"),
    consts = require("../../../libs/consts"),
    utils = require("../../../libs/utils"),
    config = require("../../../../config/environment");

router.get("/", function(req, res, next) {
    var viewConfig = config.getMany("env", "cdn", "api");

    try {
        var dashboardId = req.query.id;
        var isValidId = utils.isValidObjectID(dashboardId);

        if (!dashboardId) {
            res.render("publicdatasense", {errors: consts.SERVER_ERRORS.DASHBOARD.MISSING_DAASHBOARD_ID,
                permissions: null, currentUser: null,
                dashboard: null, config: viewConfig });
        } else if (!isValidId) {
            res.render("publicdatasense", {errors: consts.SERVER_ERRORS.DASHBOARD.INCORRECT_DASHBOARD_ID,
                permissions: null, currentUser: null,
                dashboard: null, config: viewConfig });
        } else {
            dashboardDAO.getDashboardById(dashboardId, null, function (err, findDashboard) {
                if (err) {
                    res.render("publicdatasense", {errors: err.message,
                        permissions: null, currentUser: null,
                        dashboard: null, config: viewConfig });
                } else {
                    res.render("publicdatasense", {errors: null,
                        permissions: null, currentUser: null,
                        dashboard: findDashboard, config: viewConfig });
                }
            });
        }
    } catch(e) {
        res.render("publicdatasense", {errors: e.message,
            permissions: null, currentUser: null,
            dashboard: null, config: viewConfig });
    }

});

module.exports = router;

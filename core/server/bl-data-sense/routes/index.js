"use strict";

var dataSensePageRouter = require("./pages/data-sense-page-router"),
	publicdataSensePageRouter = require("./pages/public-data-sense-page-router"),
    dashboardAPIRouter = require("./apis/dashboard-api-router"),
    config = require("../../../config/environment");

function register(app) {
    //pages  routes
    app.use("/datasense", dataSensePageRouter);
    app.use("/commondashboard", publicdataSensePageRouter);

    //api routes with Version
    app.use(["/" + config.get("api:version") + "/analyze/dashboards", "/analyze/dashboards"], dashboardAPIRouter);
}

exports.register = register;
"use strict";

var presentationPageRouter = require("./pages/presentation-page-router"),
    managementPageRouter = require("./pages/management-page-router"),
    config = require("../../../config/environment"),
    presentationAPIRouter = require("./apis/presentation-api-router");

function register(app) {
    //pages  routes
    app.use("/presentation", presentationPageRouter);
    app.use("/management", managementPageRouter);

    //api routes with Version
    var presentationURL = "/present/presentations";
    app.use(["/" + config.get("api:version") + presentationURL, presentationURL], presentationAPIRouter);
}

exports.register = register;
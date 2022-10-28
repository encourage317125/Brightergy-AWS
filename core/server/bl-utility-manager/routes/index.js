"use strict";

var utilityManagerPageRouter = require("./pages/utility-manager-page-router");

function register(app) {
    //pages  routes
    app.use("/utilitymanager", utilityManagerPageRouter);
}

exports.register = register;
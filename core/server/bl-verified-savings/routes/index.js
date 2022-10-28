"use strict";

var verifiedSavingsPageRouter = require("./pages/verified-savings-page-router");

function register(app) {
    //pages  routes
    app.use("/verifiedsavings", verifiedSavingsPageRouter);
}

exports.register = register;
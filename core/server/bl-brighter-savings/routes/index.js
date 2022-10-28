"use strict";

var brighterSavingsPageRouter = require("./pages/brighter-savings-page-router");

function register(app) {
    //pages  routes
    app.use("/brightersavings", brighterSavingsPageRouter);
}

exports.register = register;
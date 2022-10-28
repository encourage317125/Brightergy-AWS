"use strict";

var helpAndUpdatesPageRouter = require("./pages/help-and-updates-page-router");

function register(app) {
    //pages  routes
    app.use("/helpandupdates", helpAndUpdatesPageRouter);
}

exports.register = register;
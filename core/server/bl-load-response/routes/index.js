"use strict";

var loadResponsePageRouter = require("./pages/load-response-page-router");

function register(app) {
    //pages  routes
    app.use("/loadresponse", loadResponsePageRouter);
}

exports.register = register;
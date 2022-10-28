"use strict";

var energyStarPageRouter = require("./pages/energy-star-portfolio-manager-page-router");

function register(app) {
    //pages  routes
    app.use("/energystar", energyStarPageRouter);
}

exports.register = register;
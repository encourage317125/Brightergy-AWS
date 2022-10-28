"use strict";

var programsAndProjectsPageRouter = require("./pages/programs-and-projects-page-router");

function register(app) {
    //pages  routes
    app.use("/programsandprojects", programsAndProjectsPageRouter);
}

exports.register = register;
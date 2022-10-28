"use strict";

var path = require("path");
var indexPageRouter = require("./pages/index-page-router");
var comingSoonPageRouter = require("./pages/coming-soon-page-router");
var errorPageRouter = require("./pages/error-page-router");
var coreUtils = require("../../core/server/libs/utils");

function register(app) {
    if (coreUtils.isDevelopmentEnv()) {
        app.get("/dev.html", function(req, res, next) {
            var devFilePath = path.join(path.dirname(require.main.filename), "../core/client/dev.html");
            res.sendFile(devFilePath);
        });
    }

    app.use("/", indexPageRouter);
    app.use("/index", indexPageRouter);
    app.use("/coming-soon", comingSoonPageRouter);
    app.use("/error", errorPageRouter);
}

exports.register = register;
"use strict";

// TODO:: moved to core-service

var winston = require("winston");
var argv = require("minimist")(process.argv.slice(2)),
    os = require("os");


var logLevel = argv.loglevel || "info";

function getLogger(module) {
    if (process.env.NODE_ENV === "test") {
        return new winston.Logger();
    }
    
    var path = module.filename.split("\\").slice(-1);
    path += " " + process.env.INSTANCE;
    var logFile = "core-" + (process.env.HOSTNAME || os.hostname()) + ".log";

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: logLevel
                //label: path
            }),

            new winston.transports.File({
                colorize: false,
                filename: logFile,
                level: "info",
                json: false
                //label: path
                // handleExceptions: true
            })
        ]
    });
}

module.exports = getLogger;

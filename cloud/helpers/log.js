"use strict";

var winston = require("winston");

function getLogger(module) {
	var path = module.filename.split("\\").slice(-1);

	var logger = new (winston.Logger)({
	  transports: [
	    new (winston.transports.Console)({
	    	colorize: true,
	      	level: "debug",
	      	label: path
	    }),
	    new (winston.transports.File)({
	      name: "error-file",
	      filename: "errors.log",
	      level: "error",
	      label: path
	    })
	  ]
	});

	return logger;
}

module.exports = getLogger;
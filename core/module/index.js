"use strict";

var request = require("request");
var _       = require("lodash");

var ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];

var _coreServiceConfig;

function _doRequest(options, callback) {
    options.method = options.method ? String(options.method).toUpperCase() : "GET";
    if (!options.urlPath) {
        callback(new Error("core-service validation: urlPath is required."));
    } else if (ALLOWED_METHODS.indexOf(options.method) === -1) {
        callback(new Error("core-service validation: method is invalid or disallowed."));
    } else {
        var reqOptions = {
            url: _coreServiceConfig.baseurl + options.urlPath,
            method: options.method,
            json: true,
            body: options.body
        };
        if (_coreServiceConfig.apikey) {
            reqOptions.headers = {
                "authorization": _coreServiceConfig.apikey
            };
        }

        request(reqOptions, function(err, res, body) {
            if (err) {
                callback(err);
            } else if (res.statusCode !== 200) {
                var errMsg = body && body.reason ? body.reason : "Unexpected core-service error";
                callback(new Error(errMsg));
            } else {
                callback(null, body);
            }
        });
    }
}

module.exports.init = function(coreSrvcConfig) {
    _coreServiceConfig = _.cloneDeep(coreSrvcConfig);
};

module.exports.createDemoUser = function(userData, callback) {
    if (!_coreServiceConfig) {
        callback(new Error("Core-service has not been initialized."));
    } else {
        var options = {
            urlPath: "/v1/demo",
            method: "POST",
            body: userData
        };

        _doRequest(options, callback);
    }
};

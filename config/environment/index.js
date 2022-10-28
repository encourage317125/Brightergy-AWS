"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var _     = require("lodash");
var nconf = require("nconf");
var path  = require("path");

var envConfigFilepath = path.join(__dirname, process.env.NODE_ENV + ".json");
var defConfigFilepath = path.join(__dirname, "default.json");

nconf
    .env({ separator: "_" })
    .file(envConfigFilepath)
    .file("defaults", defConfigFilepath);

function _convertKeysLoLowerCase(obj) {
    _.each(obj, function(value, key) {
        delete obj[key];
        key = key.toLowerCase();
        obj[key] = value;

        if (_.isObject(value) && !_.isArray(value)) {
            _convertKeysLoLowerCase(value);
        }
    });

    return obj;
}

function get(key) {
    var value = nconf.get(key.toUpperCase());
    if (_.isUndefined(value)) {
        value = nconf.get(key);
        if (_.isUndefined(value)) {
            return undefined;
        }
    }
    if (_.isNumber(value) || _.isBoolean(value) || _.isArray(value)) {
        return value;
    }
    if (_.isObject(value)) {
        return _convertKeysLoLowerCase(value);
    }
    if (value.match(/^\d$/g)) {
        return parseInt(value);
    }
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    return value;
}

function getMany() {
    var keys = Array.prototype.slice.apply(arguments);
    if (keys.length === 0) {
        return null;
    }

    var values = {};
    _.each(keys, function(key) {
        values[key] = get(key);
    });

    return values;
}

exports.get = get;
exports.getMany = getMany;

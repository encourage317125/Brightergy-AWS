"use strict";

var _              = require("lodash");
var async          = require("async");
var cacheHelper    = require("../../../libs/cache-helper");
var enphaseUtils   = require("../enphase/enphase-utils");
var tempoiqWrapper = require("../tempoiq/tempoiq-wrapper");

const ENPHASE_COMPANY = "enphase";
const WEBBOX_COMPANY = "webbox";
const WEBBOX_BLUETOOTH_COMPANY = "webboxbluetooth";
const FRONIUS_COMPANY = "fronius";
const EGAUGE_COMPANY = "egauge";
const GEM_COMPANY = "gem";

exports.getCacheInvertersLey = function(company, scopeId) {
    if (company === ENPHASE_COMPANY) {
        return company + "_" + scopeId;
    }
    return company;
};

exports.getNodes = function(company, scopeId, user, finalCallback) {
    var allowedCompanies = [ENPHASE_COMPANY, WEBBOX_COMPANY, EGAUGE_COMPANY, FRONIUS_COMPANY, GEM_COMPANY];
    if (allowedCompanies.indexOf(company) < 0) {
        return finalCallback(new Error("unknown company"));
    }

    var cacheKey = exports.getCacheInvertersLey(company, scopeId);
    var tempoiqCompaniesMap = {};
    tempoiqCompaniesMap[WEBBOX_COMPANY] = {
        device: "WebBox",
        metric: ["Pac"]
    };
    tempoiqCompaniesMap[WEBBOX_BLUETOOTH_COMPANY] = {
        device: "WebBoxBluetooth",
        metric: ["W"]
    };
    tempoiqCompaniesMap[FRONIUS_COMPANY] = {
        device: "Fronius",
        metric: ["W"]
    };
    tempoiqCompaniesMap[EGAUGE_COMPANY] = {
        device: "eGauge",
        metric: ["W"]
    };

    var tempoiqCompanies = Object.keys(tempoiqCompaniesMap);
    async.waterfall([
        function (cb) {
            cacheHelper.getCachedElementData(cacheKey, null, cb);
        },
        function(cachedData, cb) {
            if (cachedData) {
                return cb(null, cachedData, false);
            }
            if (company === ENPHASE_COMPANY) {
                enphaseUtils.getInventory(scopeId, user, function (err, devices) {
                    cb(err, devices, true);
                });
            } else if (tempoiqCompanies.indexOf(company) > -1) {
                tempoiqWrapper.getDevicesByFamily(tempoiqCompaniesMap[company].device, function (err, devices) {
                    cb(err, devices, true);
                });
            } else if (company === GEM_COMPANY) {
                cb(null, scopeId, false);
            } else {
                cb(null, null);
            }
        },
        function(loadedData, saveInCache, cb) {
            var obj = null;
            if (company === ENPHASE_COMPANY) {
                obj = {
                    nodes: _.pluck(loadedData.inverters, "sn"),
                    metrics: ["powr", "enwh"]
                };
            } else if (tempoiqCompanies.indexOf(company) > -1) {
                var lowerScope = scopeId.toLowerCase();
                var filtered = _.filter(loadedData, function (d) {
                    var key = d.key.toLowerCase();
                    var device = d.attributes.Device? d.attributes.Device.toLowerCase() : "";
                    return key.indexOf(lowerScope) > -1 || device.indexOf(lowerScope) > -1;
                });
                obj = {
                    nodes: _.pluck(filtered, "key"),
                    metrics: tempoiqCompaniesMap[company].metric
                };
            } else if (company === GEM_COMPANY) {
                obj = {
                    nodes: [],
                    metrics: ["W"]
                };
                for (var i = 0; i <= 32; i++) {
                    obj.nodes.push(scopeId + "_" + i);
                }
            }
            return cb(null, obj, loadedData, saveInCache);
        },
        function(nodes, dataToCache, saveInCache, cb) {
            if (!saveInCache) {
                return cb(null, nodes);
            }

            var ttl30mins = 1800;
            cacheHelper.setElementData(cacheKey, ttl30mins, dataToCache, function (err) {
                return cb(err, nodes);
            });
        }
    ], function(err, result) {
        finalCallback(err, result);
    });
};

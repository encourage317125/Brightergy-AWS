"use strict";

// TODO:: moved to core-service

var crypto = require("crypto");
var moment = require("moment");
var cache  = require("./cache");
var consts = require("./consts");
var utils  = require("./utils");

function getCachedElementData(elementKey, defaultCachedData, callback) {
    cache.get(elementKey, function(err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            callback(null, JSON.parse(result));
        } else {
            callback(null, defaultCachedData);
        }
    });
}

function setElementData(elementHash, ttl, data, callback) {
    cache.setex(elementHash, ttl, JSON.stringify(data), callback);
}

function setElementDataInfinite(elementHash, data, callback) {
    cache.set(elementHash, JSON.stringify(data), callback);
}

function getWildCardAppEntityCacheKey(entityId) {
    return entityId + "*";
}

function deleteSingleAppEntityCache(entityId, callback) {
    var appEntityKey = getWildCardAppEntityCacheKey(entityId);
    cache.delWildcardKey(appEntityKey, callback);
}

function deleteAppEntityWidgetCache(entityId, widgetId, callback) {
    //widget key is stored in dashboard hash field, so need find all dashboard keys and remove widgetId from hash
    //var entitydWillcard = getWildCardAppEntityCacheKey(dashboardId);
    cache.del(entityId + ":" + widgetId, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, consts.OK);
        }
    });
}

function getHashByElementParameters(params) {
    return crypto.createHash("md5")
        .update(JSON.stringify(params))
        .digest("hex");
}

function getCachedEndDate(cacheResult) {
    var cachedEndDate = null;
    if (cacheResult && cacheResult.dataPoints && cacheResult.dataPoints.length > 0) {
        var ts = cacheResult.dataPoints[cacheResult.dataPoints.length - 1].ts;
        cachedEndDate = moment.utc(ts);

        //remove last date from cached result, because we will reload that date from tempoiq
        utils.removeDuplicateTempoIQDates([cacheResult], cachedEndDate);
    }

    return cachedEndDate;
}

function pushArrayItem(key, item, callback) {
    cache.rpush(key, JSON.stringify(item), callback);
}

function getArray(key, callback) {
    cache.lrange(key, 0, -1, function(err, data) {
        if (err) {
            return callback(err);
        }

        for(var i=0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }

        return callback(null, data);
    });
}

function delSingleKey(key, callback) {
    cache.del(key, callback);
}

function delWildcardKey(key, callback) {
    cache.delWildcardKey(key + "*", callback);
}

function getCachedElementDataCompressed(elementKey, defaultCachedData, callback) {
    cache.get(elementKey, function(err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {

            utils.decodeBase64AndDecompress(result, function(decompressErr, decompressedData){
                if(decompressErr) {
                    return callback(decompressErr);
                }
                return callback(null, JSON.parse(decompressedData));
            });
        } else {
            callback(null, defaultCachedData);
        }
    });
}

function setElementDataInfiniteCompressed(elementHash, data, callback) {
    utils.compressAndEncodeBase64(JSON.stringify(data), function(compressErr, compressedData){
        if(compressErr) {
            return callback(compressErr);
        }
        cache.set(elementHash, compressedData, callback);
    });
}

exports.getCachedElementData = getCachedElementData;
exports.setElementData = setElementData;
exports.deleteSingleAppEntityCache = deleteSingleAppEntityCache;
exports.deleteAppEntityWidgetCache = deleteAppEntityWidgetCache;
exports.getHashByElementParameters = getHashByElementParameters;
exports.getCachedEndDate = getCachedEndDate;
exports.setElementDataInfinite = setElementDataInfinite;
exports.pushArrayItem = pushArrayItem;
exports.getArray = getArray;
exports.delSingleKey = delSingleKey;
exports.delWildcardKey = delWildcardKey;
exports.getCachedElementDataCompressed = getCachedElementDataCompressed;
exports.setElementDataInfiniteCompressed = setElementDataInfiniteCompressed;

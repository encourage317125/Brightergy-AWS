"use strict";

// TODO:: moved to core-service

var config = require("../../config/environment"),
    utils = require("./utils"),
    consts = require("./consts"),
    async = require("async"),
    redis = require("redis"),
    zlib = require("zlib"),
    client = redis.createClient(config.get("redis:port"), config.get("redis:host"));

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

require("redis-scanstreams")(redis);

client.on("error", function (err) {
    err.name = "RedisError";
    utils.logError(err);
});

redis.RedisClient.prototype.getWildCardKeys = function(key, callback) {
    var rediscli = this;
    var keys = [];

    var stream = rediscli.scan({
        pattern: key,
        count: 1000
    });

    stream.on("data", function(chunk) {
        keys.push(chunk);
    });

    stream.on("end", function() {
        callback(null, keys);
    });

    stream.on("error", function(err) {
        callback(null, err);
    });

};

redis.RedisClient.prototype.delMultipleKeys = function(keys, callback) {
    var rediscli = this;

    if(keys.length > 0) {
        async.each(keys, function (row, callbackDelete) {
            rediscli.del(row, callbackDelete);
        }, function (err) {
            if (err) {
                callback(null, err);
            } else {
                callback(null, consts.OK);
            }
        });
    } else {
        callback(null, consts.OK);
    }

};

redis.RedisClient.prototype.delWildcardKey = function(key, callback) {
    var rediscli = this;

    rediscli.getWildCardKeys(key, function(err, keys) {
        if(err) {
            callback(err);
        } else {
            rediscli.delMultipleKeys(keys, callback);
        }
    });

};



function _getKey(key) {
    var isCompressingEnabled = config.get("redis:compressing");
    if (isCompressingEnabled) {
        return key + config.get("redis:compressedkey");
    }
    return key;
}

function _getValue(cachedValue, callback) {
    var isCompressingEnabled = config.get("redis:compressing");
    if (cachedValue && isCompressingEnabled) {
        var compressedBuffer = new Buffer(cachedValue, "base64");
        zlib.unzip(compressedBuffer, function(err, uncompressedBuffer) {
            if (err) { return callback(err); }
            var uncompressedValue = uncompressedBuffer ? uncompressedBuffer.toString() : null;
            callback(null, uncompressedValue);
        });
    } else {
        callback(null, cachedValue);
    }
}

function _setValue(key, value, callback) {
    key = _getKey(key);
    
    var isCompressingEnabled = config.get("redis:compressing");
    if (!isCompressingEnabled) {
        callback(null, key, value);
    } else {
        zlib.gzip(value, function (err, compressedValue) {
            if (err) { return callback(err); }
            var compressedBuffer = new Buffer(compressedValue);
            callback(null, key, compressedBuffer.toString("base64"));
        });
    }
}

redis.RedisClient.prototype.originalGet = redis.RedisClient.prototype.get;
redis.RedisClient.prototype.get = function(key, callback) {
    key = _getKey(key);
    
    this.originalGet(key, function(err, value) {
        if (err) { return callback(err); }
        _getValue(value, callback);
    });
};

redis.RedisClient.prototype.originalHget = redis.RedisClient.prototype.hget;
redis.RedisClient.prototype.hget = function(key, field, callback) {
    key = _getKey(key);
    
    this.originalHget(key, field, function(err, value) {
        if (err) { return callback(err); }
        _getValue(value, callback);
    });
};

redis.RedisClient.prototype.originalHgetall = redis.RedisClient.prototype.hgetall;
redis.RedisClient.prototype.hgetall = function(key, callback) {
    key = _getKey(key);
    
    this.originalHgetall(key, function(err, value) {
        if (err) { return callback(err); }
        _getValue(value, callback);
    });
};

redis.RedisClient.prototype.originalSet = redis.RedisClient.prototype.set;
redis.RedisClient.prototype.set = function(key, value, callback) {
    var self = this;
    
    _setValue(key, value, function(err, newKey, newValue) {
        if (err) { return callback(err); }
        self.originalSet(newKey, newValue, callback);
    });
};

redis.RedisClient.prototype.originalSetex = redis.RedisClient.prototype.setex;
redis.RedisClient.prototype.setex = function(key, expired, value, callback) {
    var self = this;
    
    _setValue(key, value, function(err, newKey, newValue) {
        if (err) { return callback(err); }
        self.originalSetex(newKey, expired, newValue, callback);
    });
};

redis.RedisClient.prototype.originalHset = redis.RedisClient.prototype.hset;
redis.RedisClient.prototype.hset = function(key, field, value, callback) {
    var self = this;
    
    _setValue(key, value, function(err, newKey, newValue) {
        if (err) { return callback(err); }
        self.originalHset(newKey, field, newValue, callback);
    });
};

module.exports = client;

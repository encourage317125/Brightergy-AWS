"use strict";

var sinon  = require("sinon");
var expect = require("chai").expect;
var config = require("../../../../config/environment");
var cache  = require("../../../../server/libs/cache");

describe("cache", function() {
    var compressedKey = "_compressed_";
    var compressedValueBase64 = "H4sIAAAAAAAAAyvNS87PLShKLS5OTQlLzClNBQC5ZKeOEQAAAA==";

    before(function() {
        sinon
            .stub(config, "get")
            .withArgs("redis:compressedkey").returns(compressedKey);
        
        sinon.stub(cache, "originalGet").yields();
        sinon.stub(cache, "originalHget").yields();
        sinon.stub(cache, "originalHgetall").yields();
        sinon.stub(cache, "originalSet").yields();
        sinon.stub(cache, "originalSetex").yields();
        sinon.stub(cache, "originalHset").yields();
    });

    afterEach(function() {
        config.get.reset();
        cache.originalGet.reset();
        cache.originalHget.reset();
        cache.originalHgetall.reset();
        cache.originalSet.reset();
        cache.originalSetex.reset();
        cache.originalHset.reset();
    });

    after(function() {
        config.get.restore();
        cache.originalGet.restore();
        cache.originalHget.restore();
        cache.originalHgetall.restore();
        cache.originalSet.restore();
        cache.originalSetex.restore();
        cache.originalHset.restore();
        cache.end();
    });

    function testGetFunc(params, addedWith, expectedCalledWith, getFunc, originalGetFunc, compressingEnabled, cachedValue, done) {
        config.get.withArgs("redis:compressing").returns(compressingEnabled);
        originalGetFunc.withArgs.apply(originalGetFunc, addedWith).yields(null, cachedValue);

        var cb = function(err) {
            expect(err).null;
            expect(originalGetFunc.calledOnce).true;
            expect(originalGetFunc.calledWith.apply(originalGetFunc, expectedCalledWith)).true;
            done();
        };
        params.push(cb);
        getFunc.apply(cache, params);
    }

    function testSetFunc(params, expectedCalledWith, setFunc, originalSetFunc, compressingEnabled, done) {
        config.get.withArgs("redis:compressing").returns(compressingEnabled);
        originalSetFunc.withArgs.apply(originalSetFunc, expectedCalledWith).yields(null);

        var cb = function(err) {
            expect(err).null;
            expect(originalSetFunc.calledOnce).true;
            expect(originalSetFunc.calledWith.apply(originalSetFunc, expectedCalledWith)).true;
            done();
        };
        params.push(cb);
        setFunc.apply(cache, params);
    }

    describe("get", function() {
        it("should return undefined when key isn't into cache", function(done) {
            var params = ["non-existing-key"];
            var addedWith = ["non-existing-key"];
            var expectedCalledWith = ["non-existing-key"];
            var compressingEnabled = false;
            var cachedValue;

            testGetFunc(params, addedWith, expectedCalledWith, cache.get, cache.originalGet, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with uncompressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key"];
            var addedWith = ["key"];
            var expectedCalledWith = ["key" + compressedKey];
            var compressingEnabled = true;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.get, cache.originalGet, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with compressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key"];
            var addedWith = ["key" + compressedKey];
            var expectedCalledWith = ["key"];
            var compressingEnabled = false;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.get, cache.originalGet, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with uncompressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key"];
            var addedWith = ["key"];
            var expectedCalledWith = ["key"];
            var compressingEnabled = false;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.get, cache.originalGet, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with compressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key"];
            var addedWith = ["key" + compressedKey];
            var expectedCalledWith = ["key" + compressedKey];
            var compressingEnabled = true;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.get, cache.originalGet, compressingEnabled, cachedValue, done);
        });
    });

    describe("hget", function() {
        it("should return undefined when key isn't into cache", function(done) {
            var params = ["non-existing-key", "field"];
            var addedWith = ["non-existing-key", "field"];
            var expectedCalledWith = ["non-existing-key", "field"];
            var compressingEnabled = false;
            var cachedValue;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hget, cache.originalHget, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with uncompressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key", "field"];
            var addedWith = ["key", "field"];
            var expectedCalledWith = ["key" + compressedKey, "field"];
            var compressingEnabled = true;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.hget, cache.originalHget, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with compressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key", "field"];
            var addedWith = ["key" + compressedKey, "field"];
            var expectedCalledWith = ["key", "field"];
            var compressingEnabled = false;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hget, cache.originalHget, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with uncompressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key", "field"];
            var addedWith = ["key", "field"];
            var expectedCalledWith = ["key", "field"];
            var compressingEnabled = false;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.hget, cache.originalHget, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with compressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key", "field"];
            var addedWith = ["key" + compressedKey, "field"];
            var expectedCalledWith = ["key" + compressedKey, "field"];
            var compressingEnabled = true;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hget, cache.originalHget, compressingEnabled, cachedValue, done);
        });
    });

    describe("hgetall", function() {
        it("should return undefined when key isn't into cache", function(done) {
            var params = ["non-existing-key"];
            var addedWith = ["non-existing-key"];
            var expectedCalledWith = ["non-existing-key"];
            var compressingEnabled = false;
            var cachedValue;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hgetall, cache.originalHgetall, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with uncompressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key"];
            var addedWith = ["key"];
            var expectedCalledWith = ["key" + compressedKey];
            var compressingEnabled = true;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.hgetall, cache.originalHgetall, compressingEnabled, cachedValue, done);
        });

        it("should return undefined when key with compressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key"];
            var addedWith = ["key" + compressedKey];
            var expectedCalledWith = ["key"];
            var compressingEnabled = false;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hgetall, cache.originalHgetall, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with uncompressed value is into cache and config.compressed is disabled", function(done) {
            var params = ["key"];
            var addedWith = ["key"];
            var expectedCalledWith = ["key"];
            var compressingEnabled = false;
            var cachedValue = "value";

            testGetFunc(params, addedWith, expectedCalledWith, cache.hgetall, cache.originalHgetall, compressingEnabled, cachedValue, done);
        });

        it("should return uncompresed value when key with compressed value is into cache and config.compressed is enabled", function(done) {
            var params = ["key"];
            var addedWith = ["key" + compressedKey];
            var expectedCalledWith = ["key" + compressedKey];
            var compressingEnabled = true;
            var cachedValue = compressedValueBase64;

            testGetFunc(params, addedWith, expectedCalledWith, cache.hgetall, cache.originalHgetall, compressingEnabled, cachedValue, done);
        });
    });

    describe("set", function() {
        it("should add uncompressed value without key postfix '_compressed_' into cache when config.compressed is disabled", function(done) {
            var params = ["key", "value"];
            var expectedCalledWith = ["key", "value"];
            var compressingEnabled = false;

            testSetFunc(params, expectedCalledWith, cache.set, cache.originalSet, compressingEnabled, done);
        });

        it("should add compressed value with key postfix '_compressed_' into cache when config.compressed is enabled", function(done) {
            var params = ["key", "uncompressedValue"];
            var expectedCalledWith = ["key" + compressedKey, compressedValueBase64];
            var compressingEnabled = true;

            testSetFunc(params, expectedCalledWith, cache.set, cache.originalSet, compressingEnabled, done);
        });
    });

    describe("setex", function() {
        it("should add uncompressed value without key postfix '_compressed_' into cache when config.compressed is disabled", function(done) {
            var params = ["key", 3000, "value"];
            var expectedCalledWith = ["key", 3000, "value"];
            var compressingEnabled = false;

            testSetFunc(params, expectedCalledWith, cache.setex, cache.originalSetex, compressingEnabled, done);
        });

        it("should add compressed value with key postfix '_compressed_' into cache when config.compressed is enabled", function(done) {
            var params = ["key", 3000, "uncompressedValue"];
            var expectedCalledWith = ["key" + compressedKey, 3000, compressedValueBase64];
            var compressingEnabled = true;

            testSetFunc(params, expectedCalledWith, cache.setex, cache.originalSetex, compressingEnabled, done);
        });
    });

    describe("hset", function() {
        it("should add uncompressed value without key postfix '_compressed_' into cache when config.compressed is disabled", function(done) {
            var params = ["key", "field", "value"];
            var expectedCalledWith = ["key", "field", "value"];
            var compressingEnabled = false;

            testSetFunc(params, expectedCalledWith, cache.hset, cache.originalHset, compressingEnabled, done);
        });

        it("should add compressed value with key postfix '_compressed_' into cache when config.compressed is enabled", function(done) {
            var params = ["key", "field", "uncompressedValue"];
            var expectedCalledWith = ["key" + compressedKey, "field", compressedValueBase64];
            var compressingEnabled = true;

            testSetFunc(params, expectedCalledWith, cache.hset, cache.originalHset, compressingEnabled, done);
        });
    });
});

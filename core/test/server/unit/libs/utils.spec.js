"use strict";

const root = '../../../..';
const serverRoot = root + '/server';

var expect = require("chai").expect,
    config = require(root + "/config/environment"),
    consts = require(serverRoot + "/libs/consts"),
    _ = require("lodash"),
    sinon = require("sinon");

describe("utils tests", function() {
    require(serverRoot + "/general/models");
    var utils = require(serverRoot + "/libs/utils");

    var mockConfigs = {
        "apps:analyze": "123"
    };

    before(function () {
        sinon.stub(config, "get", function (item) {
            return mockConfigs[item];
        });
    });

    after(function () {
        config.get.restore();
    });

    it("should pass all numbers test", function() {
        expect(utils.isNumber(0)).equals(true);
        expect(utils.isNumber("0")).equals(true);
        expect(utils.isNumber("0a")).equals(false);
        expect(utils.isNumber("-1")).equals(true);
        expect(utils.isNumber("100")).equals(true);
        expect(utils.isNumber("b5")).equals(false);
        expect(utils.isNumber("0.5")).equals(true);
        expect(utils.isNumber(0.3)).equals(true);
        expect(utils.isNumber("97878967")).equals(true);

        expect(utils.isWholeNumber(0)).equals(true);
        expect(utils.isWholeNumber("0")).equals(true);
        expect(utils.isWholeNumber("0a")).equals(false);
        expect(utils.isWholeNumber("-1")).equals(true);
        expect(utils.isWholeNumber("100")).equals(true);
        expect(utils.isWholeNumber("b5")).equals(false);
        expect(utils.isWholeNumber("0.5")).equals(false);
        expect(utils.isWholeNumber(0.3)).equals(false);
        expect(utils.isWholeNumber("97878967")).equals(true);

        expect(utils.isWholePositiveNumber(0)).equals(false);
        expect(utils.isWholePositiveNumber("0")).equals(false);
        expect(utils.isWholePositiveNumber("0a")).equals(false);
        expect(utils.isWholePositiveNumber("-1")).equals(false);
        expect(utils.isWholePositiveNumber("100")).equals(true);
        expect(utils.isWholePositiveNumber("b5")).equals(false);
        expect(utils.isWholePositiveNumber("0.5")).equals(false);
        expect(utils.isWholePositiveNumber(0.3)).equals(false);
        expect(utils.isWholePositiveNumber("97878967")).equals(true);

    });

    describe("compression tests", function() {
        it("should decompress compressed string", function(done) {
            var inputString = "Hello Привет";
            utils.compressAndEncodeBase64(inputString, function(err, result) {
                utils.decodeBase64AndDecompress(result, function(err, original) {
                    expect(original).equals(inputString);
                    done();
                });
            });
        });

        it("should return error while decompressing wrong input", function(done) {
            var inputString = "trash";
            utils.decodeBase64AndDecompress(inputString, function(err, result) {
                expect(result).undefined;
                expect(err).not.equals(null);
                done();
            });
        });
    });

    it("should get some application urls", function() {
        var apps = utils.getDefaultApps();
        var keys = Object.keys(apps);
        expect(keys.length > 0).to.equals(true);
        expect(apps[consts.APPS.Analyze]).not.equals(undefined);
    });

    it("should return correct interpolated value", function() {
        var thisY = utils.getLinearInterpolatedValue(6000, 8000, 15.5, 19.2, 6378);
        expect(thisY).to.equals(16.1993);
    });
});

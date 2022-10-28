"use strict";

const root = '../../../../../..';
const serverRoot = root + '/server';

require(serverRoot + "/general/models");
require(serverRoot + "/bl-brighter-view/models");

var chai = require("chai"),
    expect = expect = chai.expect,
    sinon = require("sinon"),
    auth = require(serverRoot + "/general/core/user/auth-utils.js"),
    cache = require(serverRoot + "/libs/cache"),
    consts = require(serverRoot + "/libs/consts"),
    config = require(root + "/config/environment");

describe("auth-utils", function() {
    describe("force url tests", function() {
        var forcedLoginUrl = "ForcedLoginUrl";

        // "forced_login_redirect_url
        var mockConfigs = {
            forced_login_redirect_url: forcedLoginUrl,
            "session:cookiedomain": ".brightergy.com",
            env: "Production"
        };

        before(function () {
            sinon.stub(config, "get", function (item) {
                return mockConfigs[item];
            });
        });

        after(function () {
            config.get.restore();
            cache.end();
        });

        it("should redirect to forced_login_redirect_url if no clientRedirect and forced_login_redirect_url", function () {
            var spy = sinon.spy();
            var redirectUrl = "http://google.com";
            var loginParams = {};
            var req = {
                session: {}
            }

            auth._webLogin({}, loginParams, req, spy);
            expect(spy.calledWith(null, forcedLoginUrl)).true;
        });


        it("should redirect to any site in development mode", function () {
            mockConfigs.env = "development";
            var spy = sinon.spy();

            var redirectUrl = "http://google.com";
            var loginParams = {
                clientRedirect: redirectUrl
            };

            var req = {session: {}}

            auth._webLogin({}, loginParams, req, spy);
            expect(spy.calledWith(null, redirectUrl)).true;

            // restore mockConfigs
            mockConfigs.env = "Production";
        });


        it("should reject redirect to wrong sites in production mode", function () {

            var spy = sinon.spy();

            var redirectUrl = "http://google.com";
            var loginParams = {
                clientRedirect: redirectUrl
            };

            auth._webLogin({}, loginParams, {session: {}}, spy);

            // because doesn't belong to our domain
            expect(spy.calledWith(null, forcedLoginUrl)).true;
        })


        it("should redirect to our site in production mode", function () {
            var spy = sinon.spy();

            var redirectUrl = "http://blablabla.brightergy.com";
            var loginParams = {
                clientRedirect: redirectUrl
            };

            auth._webLogin({}, loginParams, {session: {}}, spy);

            // because doesn't belong to our domain
            expect(spy.calledWith(null, redirectUrl)).true;
        });


        it("redirect attack shouldn't be possible", function () {
            var spy = sinon.spy();

            var redirectUrl = "http://badsite.brightergy.com.techgun.com";
            var loginParams = {
                clientRedirect: redirectUrl
            };

            auth._webLogin({}, loginParams, {session: {}}, spy);

            // because doesn't belong to our domain
            expect(spy.calledWith(null, forcedLoginUrl)).true;
        });
    });

    describe("default app tests", function() {
        var mockConfigs = {
            "apps:analyze": "123",
            "apps:present": "12345"
        };

        before(function () {
            sinon.stub(config, "get", function(item) {
                return mockConfigs[item];
            });
        });

        after(function () {
            config.get.restore();
            cache.end();
        });

        it("should redirect to Analyze if no default app", function() {
            var spy = sinon.spy();

            var user = {
                defaultApp: null
            };
            var analyzeUrl = config.get("apps:analyze");
            expect(analyzeUrl).to.equals("123");

            auth._webLogin(user, {}, { session: {}}, spy);

            expect(spy.calledWith(null, analyzeUrl)).true;
        });

        it("should redirect to user default app url", function() {
            var spy = sinon.spy();

            var user = {
                defaultApp: consts.APPS.Present
            };
            var presentUrl = config.get("apps:present");

            auth._webLogin(user, {}, { session: {}}, spy);

            expect(spy.calledWith(null, presentUrl)).true;
        });
    });
});

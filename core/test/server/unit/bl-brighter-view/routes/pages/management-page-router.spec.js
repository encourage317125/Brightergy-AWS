/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts"),
        cache = require(serverRoot + "/libs/cache");

    chai.use(require('sinon-chai'));

    describe('management  page router test suite', function (done) {
        require(serverRoot + "/general/models");
        require(serverRoot + "/bl-brighter-view/models");
        require(serverRoot + "/bl-data-sense/models");

        var managementPageRouter = require(serverRoot + "/bl-brighter-view/routes/pages/management-page-router");

        var mockReq = {
            method: "GET",
            url: "/",
            params: {},
            headers: {},
            session: {},
            protocol: "https",
            get: function() {
                return "";
            },
            originalUrl: "management"
        };
        var mockRes = {
            redirect: function (viewName) {
            }
        };
        var mockNext = function () {

        }

        beforeEach(function () {
            sinon.stub(mockRes, 'redirect', function (viewName) {
                //to do nothing
            });
        });

        afterEach(function () {
            mockRes.redirect.restore();
            cache.end();
        });

        it('handle incorect session', function (done) {
            try {
                managementPageRouter(mockReq, mockRes, mockNext);
                expect(mockRes.redirect).to.have.been.calledOnce;
                done();
            } catch (e) {
                done(e);
            }
        });
    });
}());

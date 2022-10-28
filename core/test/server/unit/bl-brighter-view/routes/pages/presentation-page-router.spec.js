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

    describe('presentation  page router test suite', function (done) {
        require(serverRoot + "/general/models");
        require(serverRoot + "/bl-brighter-view/models");
        require(serverRoot + "/bl-data-sense/models");

        var presentationPageRouter = require(serverRoot + "/bl-brighter-view/routes/pages/presentation-page-router");

        var mockReq = {
            method: "GET",
            url: "/",
            params: {},
            headers: {},
            session: {},
            query: {}
        };
        var mockRes = {
            render: function (viewName) {
            }
        };
        var mockNext = function () {

        }

        beforeEach(function () {
            sinon.stub(mockRes, 'render', function (viewName) {
                //to do nothing
            });
        });

        afterEach(function () {
            mockRes.render.restore();
            cache.end();
        });

        it('render view', function (done) {
            try {
                presentationPageRouter(mockReq, mockRes, mockNext);
                expect(mockRes.render).to.have.been.calledOnce;
                done();
            } catch (e) {
                done(e);
            }
        });
    });
}());

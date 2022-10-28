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

    describe('dashboard-dao test suite', function () {
        require(serverRoot + "/general/models");
        require(serverRoot + "/bl-brighter-view/models");
        require(serverRoot + "/bl-data-sense/models");

        var DashboardModel = mongoose.model("ds_dashboard"),
            DashboardDao = require(serverRoot + '/bl-data-sense/core/dao/dashboard-dao');

        beforeEach(function () {
            sinon.stub(mongoose, 'connect');
            sinon.stub(DashboardModel, 'find');

        });

        afterEach(function () {
            mongoose.connect.restore();
            DashboardModel.find.restore();
            cache.end();
        });

        it('should call model.find when getDashboardsByUser is called once', function () {
            //_id: new mongoose.Types.ObjectId(),
            var user = {
                "_id": new mongoose.Types.ObjectId(),
                "accessibleTags": [
                ],
            };

            DashboardDao.getDashboardsByUser(user, null, function(err, r) {
                expect(DashboardModel.find).to.have.been.calledOnce;
            });
        });


    });
}());

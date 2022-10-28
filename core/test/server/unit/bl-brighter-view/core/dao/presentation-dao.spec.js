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

    describe('presentation-dao test suite', function () {
        require(serverRoot + "/general/models");
        require(serverRoot + "/bl-brighter-view/models");
        require(serverRoot + "/bl-data-sense/models");

        var PresentationModel = mongoose.model("bv_presentation"),
            PresentationDao = require(serverRoot + '/bl-brighter-view/core/dao/presentation-dao');

        beforeEach(function () {
            sinon.stub(mongoose, 'connect');
            sinon.stub(PresentationModel, 'find');

        });

        afterEach(function () {
            mongoose.connect.restore();
            PresentationModel.find.restore();
            cache.end();
        });

        it('should call model.find when getDashboardsByUser is called once', function () {
            //_id: new mongoose.Types.ObjectId(),
            var user = {
                "_id": new mongoose.Types.ObjectId(),
                "accessibleTags": [
                ]
            };

            PresentationDao.getPresentationsByUser(user, null, function(err, r) {
                expect(PresentationModel.find).to.have.been.calledOnce;
            });
        });


    });
}());

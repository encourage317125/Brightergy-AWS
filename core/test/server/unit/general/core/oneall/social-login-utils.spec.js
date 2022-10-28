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

    describe('oneall social login utils', function () {
        require(serverRoot + "/general/models");

        var socialLoginUtils =  require(serverRoot + '/general/core/oneall/social-login-utils.js');
        var userDao = require(serverRoot + '/general/core/dao/user-dao');

        beforeEach(function () {
            sinon.stub(userDao, 'getUserBySocialToken', function (encryptedUserToken, callback) {
                expect(encryptedUserToken).to.equal("f072a7e4");
                callback(null, {
                    success: 1
                });
            });
        });

        afterEach(function () {
            userDao.getUserBySocialToken.restore();
            cache.end();
        });

    });

}());

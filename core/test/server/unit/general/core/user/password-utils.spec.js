/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        passwordUtils = require(serverRoot + "/general/core/user/password-utils"),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('Reset password test', function () {

        beforeEach(function () {
            sinon.stub(mongoose, 'connect');
            sinon.stub(mongoose.Types, 'ObjectId', function (val) {
                return val;
            });
        });

        afterEach(function () {
            mongoose.connect.restore();
            mongoose.Types.ObjectId.restore();
        });

        it('should update user set password token with new one', function () {
            var user = {
                _id: '54135f90c6ab7c241e28095e',
                firstName: 'Aleksei',
                lastName: 'Pylyp',
                email: 'aleksei.pylyp@brightergy.com',
                emailUser: 'aleksei.pylyp',
                emailDomain: 'brightergy.com',
                accounts: [ '54927f9da60298b00cd95fd2' ],
                collections: [],
                accessibleTags: [],
                profilePictureUrl: '/assets/img/mm-picture.png',
                sfdcContactId: null,
                defaultApp: null,
                apps: [],
                previousPasswords: 
                    [ '$2a$10$FVga4hrUcsJsuKtDTSPD7OXFzjc00ji.uwnYBcHdMehEn/.UaIruW',
                    '$2a$10$FVga4hrUcsJsuKtDTSPD7OVgJ6cTB.rPmVzEu1i8cZ2p/.4TztYqq' ],
                previousEditedDashboardId: null,
                lastEditedDashboardId: '5457e1990c5a5d2700affe77',
                previousEditedPresentation: null,
                lastEditedPresentation: null,
                role: 'BP',
                tokens: 
                    [ { token: '40cf0610-e802-11e4-ba3e-e1bf41a555ee',
                    type: 'SetPassword' } ],
                enphaseUserId: '4d6a49784e7a67790a',
                socialToken: 'b3da9790-9db1-465f-8998-b3a1cc90d9b7',
                password: '$2a$10$FVga4hrUcsJsuKtDTSPD7OVgJ6cTB.rPmVzEu1i8cZ2p/.4TztYqq',
                phone: null,
                middleName: '',
                __v: 42,
                name: 'Aleksei Pylyp',
                sfdcContactURL: null,
                id: '54135f90c6ab7c241e28095e' 
            };

            passwordUtils.sendSetPasswordLink(user);
            expect(user.tokens.length).to.equals(1);
            expect(user.tokens[0].token).to.not.equals("40cf0610-e802-11e4-ba3e-e1bf41a555ee");
        });
    });
}());

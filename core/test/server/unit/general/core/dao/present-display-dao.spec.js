    /* jshint expr: true */
    /* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        ObjectId = mongoose.Types.ObjectId,
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('update present display devices configurations', function () {
        require(serverRoot + "/general/models");

        var presentDeviceModel = mongoose.model("presentdevice"),
            presentDeviceDao = require(serverRoot + '/general/core/dao/present-display-dao');

        beforeEach(function () {
            sinon.stub(mongoose, 'connect');
        });

        afterEach(function () {
            mongoose.connect.restore();
        });

        it('shold update configuration of device', function () {
            var user = {
                "_id": new mongoose.Types.ObjectId(),
                "accessibleTags": [
                ],
            };
            var deviceObj = {
                "_id" : new ObjectId("5421ab10885c2846dcce983e"),
                "deviceName" : "Device1 updated",
                "connectionType" : "type1",
                "ethernetState" : true,
                "ethernetDevice" : "deviceA",
                "ethernetIpType" : "ipTypeA",
                "ethernetIpAddress" : "191.18.0.0",
                "mask" : "mask string",
                "gateway" : "gateWayA",
                "dns1" : "dns1 string",
                "dns2" : "dns2 string",
                "wifiState" : true,
                "wifiIpAddress" : "182.20.3.0",
                "wifiName" : "wifiName",
                "wifiOpenState" : true,
                "enableCleanup" : true,
                "timeOfExecution" : "time of execution",
                "clearCache" : true,
                "clearOfflineData" : true,
                "clearSessions" : true,
                "clearCookies" : true,
                "clearHistory" : true,
                "clearFormData" : true,
                "clearPasswords" : false,
                "enableScheduleBrowserRestart" : false,
                "configureScheduleBrowserRestart" : null,
                "showStatusOnBrowser" : true,
                "timeIntervalToMonitorStatus" : 20000,
                "timeIntervalToReport" : 60000,
                "preventSuspension" : false,
                "durationToAttemptReconnection" : 30000,
                "enableAutomaticUpdateNewVersion" : true,
                "scheduleUpdateNewVersion" : "version",
                "remoteUpdatePath" : "http://test.com",
                "remoteApkPath" : "remote apk path",
                "userEmail" : "dev.web@brightergy.com",
                "presentationId" : new ObjectId("545f2abe649db6140038fc6a")
            };

            presentDeviceDao.getDeviceLogs(user, null, function(err, r) {
                expect(presentDeviceLogModel.find).to.have.been.calledOnce;
            });
        });
    });
}());

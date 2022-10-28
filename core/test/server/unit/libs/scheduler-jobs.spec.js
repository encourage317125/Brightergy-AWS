"use strict";

var sinon = require("sinon"),
    expect = require("chai").expect,
    serverRoot = '../../../../server',
    moment = require("moment"),
    consts = require(serverRoot + "/libs/consts"),
    cache = require(serverRoot + "/libs/cache");


describe("scheduler job tests", function() {

    require(serverRoot + "/general/models");

    var schedulerJobs = require(serverRoot + "/libs/scheduler-jobs");
    var tagScheduleDao = require(serverRoot + '/general/core/dao/tag-schedule-dao');
    var commands = require(serverRoot + '/general/core/calculation/commands');

    beforeEach(function () {
        sinon.stub(tagScheduleDao, 'getTagSchedulesByParams', function (params, callback) {
            callback(null, [{
                "_id" :"5566ed03ed0d26f41d0838cb",
                "weekDays" : [moment.utc().isoWeekday()],
                "fromHour" : moment.utc().hour(),
                "fromMinute" : moment.utc().minute(),
                "toHour" : 1,
                "toMinute" : 54,
                "utcOffset" : 0,
                "heatSetpoint" : 15,
                "coolSetpoint" : 18,
                "tag" : {
                    deviceID: "test",
                    _id: {
                        toString: function() {
                            return "test"
                        }

                    }
                },
                "isActive": true,
                "creatorRole" : "BP",
                "creator" : "5416f4a4aa6409d01d0c91dc",
                "__v" : 0
            }]);
        });

        sinon.stub(commands, 'sendThermostatCommand', function (tagId, deviceId, to, from, callback) {
            expect(deviceId).to.equals("test");
            expect(to).to.equals(15);
            expect(from).to.equals(18);
            callback(null, consts.OK);
        });


    });
    afterEach(function () {
        tagScheduleDao.getTagSchedulesByParams.restore();
        commands.sendThermostatCommand.restore();
        cache.end();
    });

    it("should send sqs command", function() {
        schedulerJobs.sendThermostatCommands();
        expect(commands.sendThermostatCommand).to.have.been.calledOnce;
    });

});



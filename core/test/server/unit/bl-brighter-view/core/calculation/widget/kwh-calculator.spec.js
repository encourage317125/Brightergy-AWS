/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = "../../../../../../../server/",
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('kwh-calculator test suite', function () {

        var kWhCalculator = require(serverRoot + '/bl-brighter-view/core/calculation/widget/kwh-calculator.js').kWhCalculator;

        var inputTempoIQRewsponse = [
            {
                "ts": "2014-05-03T06:00:00.000Z",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 10.1//watts
                    }
                }
            },
            {
                "ts": "2014-05-03T07:00:00.000Z",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 7
                    }
                }
            }
        ];

        var tempoIQParam = {
            sensor: "WR8KU002:2002126708",
            type: "Pac"
        };

        it('should be correct result from kwh-calculator', function () {
            var calc = new kWhCalculator(tempoIQParam, inputTempoIQRewsponse);
            var currentData = calc.getEnergyDataByInterval(consts.BRIGHTERVIEW_INTERVALS.Hourly);

            var keysLen = Object.keys(currentData.data).length;

            var kwh = currentData.data["2014-05-03T06:00:00.000Z"].val;

            expect(keysLen).to.equal(2);
            expect(kwh).to.equal(10.1 / 1000); //in kwh
        });


    });
}());

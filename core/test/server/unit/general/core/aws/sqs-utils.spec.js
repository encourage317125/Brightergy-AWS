'use strict';

const root = '../../../../../..';
const serverRoot = root + '/server';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    
    mongoose = require('mongoose'),
    consts = require(serverRoot + "/libs/consts"),
    AWS = require("aws-sdk"),
    config = require(root + "/config/environment");

chai.use(require('sinon-chai'));

describe('aws SQS test suite', function () {

    var sqsUtils = require(serverRoot + '/general/core/aws/sqs-utils');

    beforeEach(function () {

        sinon.stub(AWS, 'SQS', function (object) {
            return {
                createQueue: function(params, cb){
                    cb(null, {
                        QueueUrl: "test"
                    })
                },
                sendMessage: function(params, cb){
                    cb(null)
                }
            }
        });

        sinon.stub(AWS.config, 'update', function (object) {
            expect(object.accessKeyId).to.eql(config.get("aws:auth:accesskeyid"));
        });

    });

    afterEach(function() {
        AWS.SQS.restore();
        AWS.config.update.restore();

    });

    it('should return error if parameters are invalid', function (done) {

        sqsUtils.sendObject(null, null, function(err, result) {
            expect(err).not.to.equals(null);
            done();
        })
    });

    it('should send data to queue', function () {
        sqsUtils.sendObject("00:11:22:33:44", {"action": "set"}, function(err, result) {
            expect(err).to.equals(null);
            expect(result).to.equals(consts.OK);
        });

        expect(AWS.SQS.called).equals(true);
        expect(AWS.config.update.called).equals(true);
    });
});

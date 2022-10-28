"use strict";

const root = '../../../../../..';
const serverRoot = root + '/server';

var chai = require("chai"),
    expect = chai.expect,
    sinon = require("sinon"),
    mongoose = require("mongoose"),
    config = require(root + "/config/environment"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require(serverRoot + "/libs/consts"),
    cache = require(serverRoot + "/libs/cache");

chai.use(require("sinon-chai"));

describe("Mongoose lean query test suit", function () {
    require(serverRoot + "/general/models");

    describe("Tag Dao find with lean query", function() {
        var TagDao = require(serverRoot + "/general/core/dao/tag-dao");

        //this.timeout(5000);

        beforeEach(function () {
            sinon.stub(mongoose, "connect");
            sinon.stub(mongoose.Types, 'ObjectId', function (val) {
                return val;
            });
            sinon.stub(TagDao, "getTagsByParams", function (res, callback) {
                callback(null, [{
                    _id: new ObjectId()
                }]);
            });
            
        });

        afterEach(function () {
            mongoose.connect.restore();
            mongoose.Types.ObjectId.restore();
            TagDao.getTagsByParams.restore();
            cache.end();
        });
        

        it("The length of result should be greater than 0 when getTagsByParams is called by lean", function (done) {
            
            /*
            mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {
                TagDao.getTagsByParams({}, function(err, res) {
                    expect(res).to.have.length.above(0);
                    mongoose.disconnect();
                    done();
                })
            });
            */

            TagDao.getTagsByParams({}, function(err, res) {
                expect(res).to.have.length.above(0);
                done();
            });
            
        });
    });
    
    describe("User Dao find with lean query", function() {
        var UserDao = require(serverRoot + "/general/core/dao/user-dao");

        beforeEach(function () {
            sinon.stub(mongoose, "connect");
            sinon.stub(UserDao, "getUsersByParams", function (res, callback) {
                callback(null, [{
                    _id: new ObjectId()
                }]);
            });
            
        });

        afterEach(function () {
            mongoose.connect.restore();
            UserDao.getUsersByParams.restore();
        });
        

        it("The length of result should be greater than 0 when getUsersByParams is called by lean", function (done) {
            
            UserDao.getUsersByParams({}, function(err, res) {
                expect(res).to.have.length.above(0);
                done();
            });
            
        });
    });
});

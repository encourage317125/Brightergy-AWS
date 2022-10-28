/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';


    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));
    require(serverRoot + "/bl-brighter-view/models");


    describe('tag scheduler dao test', function () {

        require(serverRoot + "/general/models");

        var tagAPIRouter = require(serverRoot + "/general/routes/apis/tag-api-router"),
            tagDao = require(serverRoot + '/general/core/dao/tag-dao'),
            tagScheduleDao = require(serverRoot + '/general/core/dao/tag-schedule-dao'),
            TagScheduleModel = mongoose.model("tagschedule");

        describe('CRUD test', function () {
            beforeEach(function () {




            });
            afterEach(function () {

            });

            it('should say error when empty tags', function () {

                var tags = [];
                var scheduleObj = {"a": "b"};
                var currentUser = {
                    role: consts.USER_ROLES.BP,
                    _id: "45678"
                };
                tagScheduleDao.createTagSchedule(tags, scheduleObj, currentUser, function(err, result) {
                    expect(err.message).to.equals("Please choose tags");
                })
            });

            it('should say error when empty schedule', function () {

                var tags = ["5458ba46c0fa5a0e0045f162"];
                var scheduleObj = {};
                var currentUser = {
                    role: consts.USER_ROLES.BP,
                    _id: "45678"
                };
                tagScheduleDao.createTagSchedule(tags, scheduleObj, currentUser, function(err, result) {
                    expect(err.message).to.equals("Please specify schedule");
                })
            });

            it('should say error when create with wrong tag id', function () {

                var tags = ["5458ba46c0fa5a0e0045f162"];
                var scheduleObj = {"a": "b"};
                var currentUser = {
                    role: consts.USER_ROLES.BP,
                    _id: "45678"
                };
                tagScheduleDao.createTagSchedule(tags, scheduleObj, currentUser, function(err, result) {
                    expect(err.message).to.equals("Tag with requested ID does not exist: 5458ba46c0fa5a0e0045f162");
                })
            });

            describe("failure tests", function() {

                beforeEach(function () {

                    sinon.stub(tagDao, 'getTagByIdIfAllowed', function (id, user, callback) {
                        callback(new Error(consts.SERVER_ERRORS.TAG.TAG_DOES_NOT_EXIST + "5458ba46c0fa5a0e0045f162"));
                    });

                    sinon.stub(TagScheduleModel, 'findById', function (id) {
                        return {
                            populate: function(){
                                return {
                                    exec: function(func){
                                        var error = new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.TAG_SCHEDULE_DOES_NOT_EXIST + id);
                                        func(error);
                                    }
                                }
                            }
                        }
                    });
                });

                afterEach(function () {
                    TagScheduleModel.findById.restore();
                    tagDao.getTagByIdIfAllowed.restore();
                });

                it('should say error when edit with wrong tag schedule id', function () {

                    var tagId = "5566ed03ed0d26f41d0838cb";
                    var scheduleObj = {};
                    var currentUser = {
                        role: consts.USER_ROLES.BP,
                        _id: "45678"
                    };
                    tagScheduleDao.editTagSchedule(tagId, scheduleObj, currentUser, function (err, result) {
                        expect(err.message.indexOf("Tag schedule with requested ID does not exist") > -1).to.equals(true);
                    });
                    expect(TagScheduleModel.findById).to.have.been.calledOnce;
                });

                it('should say error when delete  with wrong tag schedule id', function () {

                    var tagId = "5566ed03ed0d26f41d0838cb";
                    var currentUser = {
                        role: consts.USER_ROLES.BP,
                        _id: "45678"
                    };
                    tagScheduleDao.deleteTagSchedule(tagId, currentUser, function (err, result) {
                        expect(err.message.indexOf("Tag schedule with requested ID does not exist") > -1).to.equals(true);
                        expect(err.message.indexOf("5566ed03ed0d26f41d0838cb") > -1).to.equals(true);
                    });
                    expect(TagScheduleModel.findById).to.have.been.calledOnce;
                });
            });

            describe("success tests", function() {

                beforeEach(function () {
                    sinon.stub(TagScheduleModel, 'findById', function (id) {
                        return {
                            populate: function(){
                                return {
                                    exec: function(func){
                                        func(null, {
                                            creatorRole: consts.USER_ROLES.BP,
                                            tag: {
                                                _id: {
                                                    toString: function() {
                                                        return "test";
                                                    }
                                                }
                                            }

                                        });
                                    }
                                }
                            }
                        }
                    });

                    sinon.stub(TagScheduleModel, 'remove', function (id) {
                        return {
                            exec: function(func){
                                func(null, {
                                    creatorRole: consts.OK,
                                    tag: {
                                        _id: {
                                            toString: function() {
                                                return "test";
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });

                    sinon.stub(tagDao, 'getTagByIdIfAllowed', function (id, user, callback) {
                        callback(null, {});
                    })
                });

                afterEach(function () {
                    TagScheduleModel.findById.restore();
                    TagScheduleModel.remove.restore();
                    tagDao.getTagByIdIfAllowed.restore();
                });

                it('should not say error when delete correct schedule id', function () {

                    var tagId = "5566ed03ed0d26f41d0838cb";
                    var currentUser = {
                        role: consts.USER_ROLES.BP,
                        _id: "45678"
                    };
                    tagScheduleDao.deleteTagSchedule(tagId, currentUser, function (err, result) {
                        expect(result).to.equals(consts.OK);
                    });
                    expect(TagScheduleModel.findById).to.have.been.calledOnce;
                    expect(TagScheduleModel.remove).to.have.been.calledOnce;
                });
            })
        });
    })

}());

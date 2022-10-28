"use strict";

var mongoose = require("mongoose"),
    TagSchedule = mongoose.model("tagschedule"),
    async = require("async"),
    consts = require("../../../libs/consts"),
    tagDAO = require("./tag-dao"),
    _ = require("lodash");

function getTagScheduleByIdIfAllowed(selectedTagScheduleId, currentUser, callback) {
    TagSchedule.findById(selectedTagScheduleId)
        .populate("tag", "_id deviceID tagType name displayName")
        .exec(function (err, foundTagSchedule) {
            if (err) {
                callback(err, null);
            } else if (foundTagSchedule) {
                //check user access to tag

                tagDAO.getTagByIdIfAllowed(foundTagSchedule.tag._id.toString(), currentUser, function(findTagErr) {
                    if(findTagErr) {
                        callback(findTagErr);
                    } else {
                        callback(null, foundTagSchedule);
                    }
                });
            } else {
                var error =
                    new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.TAG_SCHEDULE_DOES_NOT_EXIST + selectedTagScheduleId);
                error.status = 422;
                callback(error, null);
            }

        });
}

function getTagSchedulesByParams(params, callback) {
    TagSchedule.find(params)
        .lean()
        .populate("tag", "_id deviceID tagType name displayName")
        .sort({fromHour: 1, fromMinute: -1})
        .exec(callback);

}

function getTagSchedulesByTagId(tagId, currentUser, callback) {
    tagDAO.getTagByIdIfAllowed(tagId, currentUser, function(findTagErr, foundTag) {
        if(findTagErr) {
            callback(findTagErr);
        } else {
            getTagSchedulesByParams({tag: tagId}, function(err, results) {
                callback(err, results);
            });
        }
    });
}

function deleteTagScheduleByParams(params, callback) {
    TagSchedule.remove(params).exec(function(deleteErr, deleteResult) {
        if(deleteErr) {
            callback(deleteErr);
        } else {
            callback(null, consts.OK);
        }
    });
}

function processSchedule(dbSchedule, newSchedule, schedulesForRemoving, schedulesForUpdating) {
    if(dbSchedule.fromHour === newSchedule.fromHour && dbSchedule.fromMinute === newSchedule.fromMinute) {
        //fromDate is conflicted, need check week days

        var diff = _.difference(dbSchedule.weekDays, newSchedule.weekDays);
        if(diff > 0) {
            //we need just edit weekdays on existing schedule
            dbSchedule.weekDays = diff;
            schedulesForUpdating.push(dbSchedule);
        } else {
            //no intersection in weekdays, delete existing schedule
            schedulesForRemoving.push(dbSchedule._id.toString());
        }

    }
}

function getConflictedSchedules(newSchedule, foundSchedules) {
    var schedulesForRemoving = [];
    var schedulesForUpdating = [];

    _.each(foundSchedules, function(dbSchedule) {
        processSchedule(dbSchedule, newSchedule, schedulesForRemoving, schedulesForUpdating);
    });

    return {
        update: schedulesForUpdating,
        delete: schedulesForRemoving
    };
}

function deletePreviousConflictedSchedules(tagId, thisSchedule, callback) {
    var deleteParams = {
        $and: [
            {_id: {$ne: thisSchedule._id}},
            {tag: tagId},
            {weekDays: {$in: thisSchedule.weekDays}}
        ]
    };

    TagSchedule.find(deleteParams, function (getScheduleErr, foundSchedules) {
        if (getScheduleErr) {
            return callback(getScheduleErr);
        }

        var conflictedSchedules = getConflictedSchedules(thisSchedule, foundSchedules);

        deleteTagScheduleByParams({_id: {$in: conflictedSchedules.delete}}, function (deleteErr) {
            if (deleteErr) {
                return callback(deleteErr);
            }

            async.each(conflictedSchedules.update, function (dbSchedule, cb) {
                dbSchedule.save(cb);
            }, function (updateErr) {
                if (updateErr) {
                    return callback(updateErr);
                }

                return callback(null, consts.OK);
            });
        });
    });

}

function createTagSchedule(tags, tagScheduleObj, currentUser, callback) {
    var validateErr = null;

    if(_.isEmpty(tagScheduleObj)) {
        validateErr = new Error("Please specify schedule");
        validateErr.status = 422;
        return callback(validateErr);
    }

    tags = _.uniq(tags);

    //get all tags
    async.map(tags, function(tagId, cb) {
        tagDAO.getTagByIdIfAllowed(tagId, currentUser, function(err, tag) {
            if(err) {
                return cb(err);
            }

            if(tag.tagType !== consts.TAG_TYPE.Node || tag.nodeType !== consts.NODE_TYPE.Thermostat) {
                var tagsErr = new Error("You can not create schedule for " + tag.tagType + " id " + tagId);
                tagsErr.status = 422;
                return cb(tagsErr);
            } else {
                return cb(null, tag);
            }
        });
    }, function(getTagsErr, foundTags) {
        if (getTagsErr) {
            return callback(getTagsErr);
        }

        //create schedule for each tag
        async.each(foundTags, function(tag, cb) {
            var thisSchedule = _.cloneDeep(tagScheduleObj);
            delete thisSchedule._id;
            thisSchedule.tag = tag._id;
            thisSchedule.creatorRole = currentUser.role;
            thisSchedule.creator = currentUser._id;

            //save new schedule
            var thisTagRuleObjObjModel = new TagSchedule(thisSchedule);
            thisTagRuleObjObjModel.save(function(saveErr, savedSchedule) {
                if(saveErr) {
                    return cb(saveErr);
                }

                //remove conflicts
                deletePreviousConflictedSchedules(tag._id, savedSchedule, function(deleteErr) {
                    if (deleteErr) {
                        return cb(deleteErr);
                    }

                    return cb(null, savedSchedule);
                });
            });


        }, function(processErr) {
            if(processErr) {
                return callback(processErr);
            }

            //return all schedules for requested tags
            getTagSchedulesByParams({tag: {$in: tags}}, function(err, results) {
                return callback(err, results);
            });
        });
    });
}

function editTagSchedule(tagScheduleId, tagScheduleObj, currentUser, callback) {
    delete tagScheduleObj._id;
    delete tagScheduleObj.tag;

    getTagScheduleByIdIfAllowed(tagScheduleId, currentUser, function (findErr, foundTagSchedule) {
        if (findErr) {
            callback(findErr, null);
        } else if (foundTagSchedule.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
            var error = new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.ONLY_BP_CAN_SAVE_TAG_SCHEDULE);
            error.status = 422;
            callback(error, null);
        } else {
            var paramsToChange = Object.keys(tagScheduleObj);

            paramsToChange.forEach(function (param) {
                foundTagSchedule[param] = tagScheduleObj[param];
            });

            //save new schedule
            foundTagSchedule.save(function (saveErr, savedTagSchedule) {
                if (saveErr) {
                    return callback(saveErr, null);
                }

                //remove conflicts
                deletePreviousConflictedSchedules(foundTagSchedule.tag._id, savedTagSchedule, function (deleteErr) {
                    if (deleteErr) {
                        return callback(deleteErr);
                    }

                    //return all schedules for requested tag
                    getTagSchedulesByParams({tag: savedTagSchedule.tag._id}, function (err, results) {
                        return callback(err, results);
                    });
                });

            });
        }
    });
}

function deleteTagSchedule(tagScheduleId, currentUser, callback) {
    getTagScheduleByIdIfAllowed(tagScheduleId, currentUser, function (findErr, foundTagSchedule) {
        if (findErr) {
            callback(findErr, null);
        } else if (foundTagSchedule.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
            var error = new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.ONLY_BP_CAN_DELETE_TAG_SCHEDULE);
            error.status = 422;
            callback(error, null);
        } else {
            deleteTagScheduleByParams({_id:  tagScheduleId}, callback);
        }
    });
}

exports.getTagScheduleByIdIfAllowed = getTagScheduleByIdIfAllowed;
exports.getTagSchedulesByTagId = getTagSchedulesByTagId;
exports.deleteTagSchedule = deleteTagSchedule;
exports.createTagSchedule = createTagSchedule;
exports.editTagSchedule = editTagSchedule;
exports.deleteTagSchedule = deleteTagSchedule;
exports.getTagSchedulesByParams = getTagSchedulesByParams;

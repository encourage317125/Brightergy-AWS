"use strict";

var mongoose = require("mongoose"),
    Group = mongoose.model("group"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    ObjectId = mongoose.Types.ObjectId,
    _ = require("lodash"),
    tagDAO = require("./tag-dao"),
    consts = require("../../../libs/consts");

function getGroupById(groupId, callback) {

    Group.findById(groupId, function (err, foundGroup) {
        if (err) {
            callback(err, null);
        } else {
            if (foundGroup) {
                callback(null, foundGroup);
            } else {
                var error = new Error(consts.SERVER_ERRORS.GROUP.GROUP_DOES_NOT_EXIST + groupId);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

function getGroupsByParams(params, callback) {
    Group.find(params)
        .lean()
        .exec(function (err, foundGroups) {
            if(err) {
                callback(err, null);
            } else {
                var retGroups = [], childSources = [];

                async.each(foundGroups, function(group, groupCallback){
                    async.waterfall([
                        function (childRetCallback) {
                            async.each(group.children, function(children, childCallback) {
                                async.waterfall([
                                    function (cCallback){
                                        if (children.sourceType === "Group") {
                                            getGroupById(children.id, function (findErr, findResult) {
                                                if(findResult) {
                                                    childSources.push({
                                                        id: findResult._id.toString(),
                                                        name: findResult.name, sourceType: "Group"
                                                    });
                                                }
                                                cCallback(null, childSources);
                                            });
                                        } else {
                                            tagDAO.getTagByIdIfAllowed(children.id, function (findErr, findResult) {
                                                if(findResult) {
                                                    childSources.push({
                                                        id: findResult._id.toString(), name: findResult.name,
                                                        sourceType: findResult.tagType.toString()
                                                    });
                                                }
                                                cCallback(null, childSources);                                    
                                            });
                                        }                                                
                                    }
                                ], function (cErr, cResult) {
                                    cResult.sort(function(a,b){
                                        if ((a.sourceType !== "Group") && (b.sourceType === "Group")) {return 1;}
                                    });
                                    childCallback(null, cResult);
                                });
                            }, function(childErr, childResult){
                                group.children = childSources;
                                retGroups.push(group);
                                childSources = [];
                                childRetCallback(null, retGroups);
                            });                            
                        }
                    ], function (childerr, retChilds) {
                        groupCallback(null, retGroups);
                    });
                }, function(groupErr, groupResult){
                    retGroups.sort();
                    callback(null, retGroups);
                });
            }
        });
}

function getAvailableSources(currentUser, finalCallback) {
	async.waterfall([
		function (callback) {
		    Group.find({}, function (groupErr, foundGroups) {
		    	if (groupErr) {
		    		callback(groupErr, null);
		    	} else {
		    		callback(null, foundGroups);
		    	}
		    });
		},
		function (Groups, callback) {
			Tag.find({}, function (tagErr, foundTags){
				if (tagErr) {
					callback(tagErr, null);
				} else {
					var retObj = _.union(Groups, foundTags);
					callback(null, retObj);
				}
			});
		},
	], function (err, foundSources) {
		if (err) {
			finalCallback(err, null);
		} else {
			finalCallback(null, foundSources);
		}
	});
}

function createGroup(groupObj, currentUser, finalCallback) {
	delete groupObj._id;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.GROUP.CAN_NOT_CREATE_GROUP);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                groupObj.creatorRole = currentUser.role;
                groupObj.creator = currentUser._id;
                groupObj.usersWithAccess = [];

                if(currentUser.role !== consts.USER_ROLES.BP) {
                    groupObj.usersWithAccess.push({id: currentUser._id.toString()});
                }

                var thisGroupObjModel = new Group(groupObj);
                thisGroupObjModel.save(function(err, savedGroup) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null,savedGroup);
                    }
                });
            }
        ], function (createGroupError, savedGroup) {
            if (createGroupError) {
                finalCallback(createGroupError, null);
            } else {
                finalCallback(null, savedGroup);
            }
        });
    }
}

function editGroup(groupId, groupObj, currentUser, callback) {
    delete groupObj._id;
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.GROUP.CAN_NOT_EDIT_GROUP);
        error.status = 422;
        callback(error, null);
    } else {
        getGroupById(groupId, function (findErr, foundGroup) {
            if (findErr) {
                callback(findErr, null);
            } else {
                if (foundGroup.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.SERVER_ERRORS.GROUP.ONLY_BP_CAN_SAVE_GROUP);
                    error.status = 422;
                    callback(error, null);
                } else {

                    var paramsToChange = Object.keys(groupObj);

                    paramsToChange.forEach(function (param) {
                        foundGroup[param] = groupObj[param];
                    });

                    foundGroup.save(function (saveErr, savedGroup) {
                        if (saveErr) {
                            callback(saveErr, null);
                        } else {
                            callback(null, savedGroup);
                        }
                    });
                }
            }
        });
    }
}

function deleteGroupById(idArray, currentUser, finalCallback) {
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.GROUP.CAN_NOT_DELETE_GROUP);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                getGroupsByParams({_id: {$in: idArray}}, callback);
            },
            function (foundGroups, callback) {
                var incorrect = _.filter(foundGroups, function(group) {
                    return group.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP;
                });
                if(incorrect.length > 0) {
                    error = new Error(consts.SERVER_ERRORS.GROUP.ONLY_BP_CAN_DELETE_GROUP);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, foundGroups);
                }
            },
            function (foundGroups, callback) {
            	async.each(foundGroups, function(foundGroup, groupCallback) {
                    var childGroup = {"id":foundGroup._id};
                    Group.update({}, {$pull: {children: childGroup}}, {multi: true}).exec(groupCallback);
                }, function(error, result) {
	                var removeIds = _.map(foundGroups, function(foundGroup) {
	                    return foundGroup._id.toString();
	                });
	                Group.remove({_id:  {$in: removeIds}}).exec(callback);
                });
            }
        ], function (err, finalResult) {
            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, idArray);
            }
        });
    }
}

function addSource(groupId, sourceId, sourceType, currentUser, finalCallback) {
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.GROUP.CAN_NOT_EDIT_GROUP);
        error.status = 422;
        finalCallback(error, null);
    } else {
        var childObj = {id: new ObjectId(sourceId), sourceType: sourceType};
        Group.update({_id: new ObjectId(groupId)}, {$push:{children: childObj}})
        .exec(function (err, updatedGroup) {
            if (err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, updatedGroup);
            }
        });
    }    
}

function removeSource(groupId, sourceId, sourceType, currentUser, finalCallback) {
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.GROUP.CAN_NOT_EDIT_GROUP);
        error.status = 422;
        finalCallback(error, null);
    } else {
        var childObj = {id: new ObjectId(sourceId), sourceType: sourceType};
        Group.update({_id: new ObjectId(groupId)}, {$pull:{children: childObj}})
        .exec(function (err, updatedGroup) {
            if (err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, updatedGroup);
            }
        });
    }
}
exports.getGroupById = getGroupById;
exports.createGroup = createGroup;
exports.editGroup = editGroup;
exports.deleteGroupById = deleteGroupById;
exports.getGroupsByParams = getGroupsByParams;
exports.getAvailableSources = getAvailableSources;
exports.addSource = addSource;
exports.removeSource = removeSource;
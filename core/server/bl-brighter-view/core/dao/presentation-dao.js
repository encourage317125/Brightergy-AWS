"use strict";

var mongoose = require("mongoose"),
    moment = require("moment"),
    _ = require("lodash"),
    Presentation = mongoose.model("bv_presentation"),
    Tag = mongoose.model("tag"),
    User = mongoose.model("user"),
    userDAO = require("../../../general/core/dao/user-dao"),
    tagDAO = require("../../../general/core/dao/tag-dao"),
    widgetDAO = require("./widget-dao"),
    Widget = mongoose.model("bv_widget"),
    ObjectId = mongoose.Types.ObjectId,
    log = require("../../../libs/log")(module),
    consts = require("../../../libs/consts"),
    utils = require("../../../libs/utils"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
    async = require("async"),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    cacheHelper = require("../../../libs/cache-helper");

// --------------------------------------------------------------------------------------------------

/**
 * Get Presentation by Id
 *
 * @param    String, Presentation Id
 * @param    Object, USER object
 * @return   Object, Presentation object
 */
function getPresentationById(selectedPresentationId, user, finalCallback) {
    if(user && !permissionsUtils.userHaveAccessToPresent(user)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        finalCallback(error);
    } else {
        async.waterfall([
            function(callback) {
                Presentation.findById(selectedPresentationId).exec(callback);
            },
            function(findPresentation, callback) {
                if(!findPresentation) {
                    var error =
                        new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_NOT_EXISTS + selectedPresentationId);
                    error.status = 422;
                    callback(error);
                } else {
                    callback(null, findPresentation);
                }
            },
            function(findPresentation, callback) {
                permissionsUtils.userHaveAccessToPresentation(user, findPresentation,
                    function(accessErr, accessResult) {
                        if(accessErr) {
                            callback(accessErr);
                        } else {
                            callback(null, findPresentation, accessResult);
                        }

                    });
            },
            function(findPresentation, accessResult, callback) {
                if(accessResult) {
                    callback(null, findPresentation);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_NOT_ACCESSIBLE);
                    error.status = 422;
                    callback(error);
                }
            }
        ], function (err, result) {
            if(err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, result);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Save Presentation
 * 
 * @param     Object, User Object
 * @param     Object, Presentation Object
 * @param     Boolean, true if it's with tag, or false
 * @return    Object, Presentation object
 */
function savePresentation(currentUser, presentationObj, withTag, callback) {

    if(!permissionsUtils.userHaveAccessToPresent(currentUser)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {

        if (!withTag) {
            delete presentationObj.tagBindings; //don't update tags
        }

        getPresentationById(presentationObj._id, currentUser, function (findErr, findPresentation) {
            if (findErr) {
                callback(findErr, null);
            } else {
                //utils.cloneFieldsToMongooseModel(presentationObj, findPresentation);
                /*var cloneKeys = [
                    "name",
                    "parameters", 
                    "description",
                    "creator",
                    "creatorName",
                    "creatorRole",
                    "reimbursementRate",
                    "isTemplate",
                    "IsNewPresentation",
                    "titleView",
                    "lastUpdatedView",
                    "generatingSinceView",
                    "systemSizeView",
                    "systemSize",
                    "webBox",
                    "createdDate",
                    "Longitude",
                    "Logo",
                    "Latitude",
                    "tagBindings"
                ];
                
                for (var k in cloneKeys) {
                    var key = cloneKeys[k];
                    if (presentationObj[key] !== undefined) {
                        findPresentation[key] = presentationObj[key];
                    }
                }
                
                findPresentation.save(function (saveErr, savedPresentation) {
                    if (saveErr) {
                        callback(saveErr, null);
                    } else {
                        callback(null, savedPresentation);
                    }
                });*/

                var paramsToChange = Object.keys(presentationObj);

                paramsToChange.forEach(function (param) {
                    findPresentation[param] = presentationObj[param];
                });

                findPresentation.save(function (saveErr, savedPresentation) {
                    if (saveErr) {
                        callback(saveErr, null);
                    } else {
                        cacheHelper.deleteSingleAppEntityCache(savedPresentation._id.toString(),
                            function(cacheErr, cacheResult) {
                            if(cacheErr) {
                                callback(cacheErr);
                            } else {
                                callback(null, savedPresentation);
                            }

                        });
                        //callback(null, savedPresentation);
                    }
                });

            }
        });
    }

}

// --------------------------------------------------------------------------------------------------

/**
 * Set presentation fields
 *
 * @param     Object, Presentation object
 * @param     String, Presentation name
 * @param     Object, User object
 * @return    Object, Presentation object
 */
function setPresentationFields(presentation, name, user, callback) {
    presentation.creatorName = user.name;
    presentation.name = name;
    presentation.isTemplate = false;
    presentation.awsAssetsKeyPrefix = null;
    presentation.creatorRole = user.role;
    presentation.creator = user._id;

    callback(null, presentation);
}

// --------------------------------------------------------------------------------------------------

/**
 * Clone presentation
 *
 * @param     Object, Presentation object
 * @return    Object, Presentation object
 */
function clonePresentation(sourcePresentation) {
    var presentation = new Presentation(sourcePresentation);
    presentation._id = mongoose.Types.ObjectId();
    presentation.name = presentation.name + " - CLONE";
    presentation.tagBindings = [];

    return presentation;
}

// --------------------------------------------------------------------------------------------------

/**
 * Get template by Id
 *
 * @param    String, template Id
 * @return   Object, Presentation object
 */
function getTemplate(templateId, callback) {
    Presentation.findOne({isTemplate : true, _id: templateId})
        .lean()
        .exec(function (err, findPresentation) {
            if(err) {
                callback(err, null);
            } else {

                if(findPresentation) {
                    callback(null, findPresentation);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.PRESENTATION.TEMPLATE_NOT_EXISTS);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get new presentation default object
 * 
 * @param     Object, User Object
 * @param     String, Presentation name
 * @param     String, template presentation Id
 * @return    Object, Presentation object
 */
function getNewPresentationDefaultObj(user, name, templateId, callback) {
    if(templateId) {
        getTemplate(templateId, function(findTemplateErr, template) {
            if(findTemplateErr) {
                callback(findTemplateErr);
            } else {
                var presentation = clonePresentation(template);
                //cloneWidgets(template._id, presentation, callback);
                setPresentationFields(presentation, name, user, callback);
            }
        });
    } else {
        var presentation = new Presentation();
        presentation.parameters.startDate = moment.utc().set("minutes", 0).set("seconds", 0);
        setPresentationFields(presentation, name, user, callback);
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Clone widget
 *
 * @param    String, Parent presentation Id
 * @param    String, Target presentation Id
 * @param    Object, User object
 * @return   Array, array of widgets
 */
function cloneWidgets(parentPresentationId, targetPresentation, user, callback) {
    widgetDAO.getWidgetsByPresentationId(parentPresentationId, user, function(findWidgetErr, findWidgets) {
        if(findWidgetErr) {
            callback(findWidgetErr, null);
        } else {
            var clonnedWidgets = [];
            for(var i = 0; i < findWidgets.length; i++) {
                delete findWidgets[i]._id;
                var clonnedWidget = new Widget(findWidgets[i]);

                clonnedWidget._id =  mongoose.Types.ObjectId();
                clonnedWidget.presentation = targetPresentation._id;

                clonnedWidgets.push(clonnedWidget);
            }

            widgetDAO.batchInsert(clonnedWidgets, function(saveWidgetsErr, savedWidgets) {
                if(saveWidgetsErr) {
                    callback(saveWidgetsErr, null);
                } else {
                    callback(null, savedWidgets);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Add Tags to Presentation schema and appEntity to Tag schema when it's empty
 *
 * @param    Object, User object
 * @param    Object, Presentation object
 * @param    Array, Tags object array
 * @return   Object, presentation object
 */
function addTags(currentUser, presentation, tags, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    presentation.tagBindings = tags;

    async.parallel([
            function(cb) {
                tagBindingUtils.bindTags(consts.APP_ENTITY_TYPE.PRESENTATION,
                    presentation._id, {tagBindings : tags}, cb);
            },
            function(cb) {
                savePresentation(currentUser, presentation, true, cb);
            }
        ],
        function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[1]);
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentation by params
 *
 * @param    Object, Presentation params
 * @return   Array, array of presentation object
 */
function getPresentationsByParams(params, callback) {
    Presentation.find(params)
        .lean()
        .exec(function (err, findPresentations) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, findPresentations);
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 * Create presentation assets folder on S3
 *
 * @access  public
 * @param   string
 * @return  array
 */
function createPresentationFolder(savedPresentation, callback) {
    var awsAssetsKeyPrefix = utils.generateRandomString(16);
    getPresentationsByParams({awsAssetsKeyPrefix : awsAssetsKeyPrefix}, function (searchErr, searchResult) {
        if(searchErr) {
            callback(searchErr);
        } else {
            if(searchResult.length > 0) {
                awsAssetsKeyPrefix += utils.generateRandomString(4);
            }

            savedPresentation.awsAssetsKeyPrefix = awsAssetsKeyPrefix;
            savedPresentation.save(function (savePresentationErr, updatedPresentation) {
                if (savePresentationErr) {
                    callback(savePresentationErr, null);
                } else {
                    callback(null, updatedPresentation);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Clone presentation and widgets into DB
 * 
 * @param     String, Presentation Id
 * @param     Object, User object
 * @return    String, Presentation Id
 */
function clone(presentationId, user, callback) {
    getPresentationById(presentationId, user, function(findPresentationErr, findPresentation) {
        if(findPresentationErr) {
            callback(findPresentationErr);
        } else {
            var clonedPresentation = clonePresentation(findPresentation);

            createPresentationFolder(clonedPresentation, function (saveErr, savedPresentation) {
                if (saveErr) {
                    callback(saveErr, null);
                } else {
                    addTags(user, savedPresentation, findPresentation.tagBindings, function(tagErr, tagPresentation) {
                        if(tagErr) {
                            callback(tagErr, null);
                        }
                        else {
                            cloneWidgets(findPresentation._id, tagPresentation, user,
                                function(saveWidgetsErr, savedWidgets) {
                                if(saveWidgetsErr) {
                                    callback(saveWidgetsErr, null);
                                } else {
                                    callback(null, tagPresentation);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Save last edited presentation id of User
 *
 * @param    Object, Presentation object
 * @param    Object, USER object
 * @return   Object, Presentation object
 */
function saveLastEditedPresentationId(presentation, user, callback) {
    if(user.lastEditedPresentation !== presentation._id.toString() ) {
        user.previousEditedPresentation = user.lastEditedPresentation;
    }
    user.lastEditedPresentation = presentation._id;

    userDAO.saveUser(user, callback);
}

// -------------------------------------------------------------------------------------

/**
 * save LastEditedPresentation and Create AWS assets folder
 *
 * @access  public
 * @param   object
 * @param   object
 * @callback
 */
function saveLastEditedPresentationAndCreateFolder(savedPresentation, user, callback) {
    saveLastEditedPresentationId(savedPresentation, user, function(saveUserErr, savedUser) {
        if(saveUserErr) {
            callback(saveUserErr, null);
        } else {
            createPresentationFolder(savedPresentation, function(createErr, folderPresentation) {
                callback(null, folderPresentation._id);
            });
            
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Create new presentation
 * 
 * @param    Object, User object
 * @param    String, Presentation name
 * @param    String, temlate presentation Id
 * @return   Object, presentation object
 */
function createPresentation(user, name, templateId, bpLock, callback) {
    if(!permissionsUtils.userHaveAccessToPresent(user)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {
        getNewPresentationDefaultObj(user, name, templateId, function (presentationErr, presentation) {
            if (presentationErr) {
                callback(presentationErr, null);
            } else {
                if (templateId) {
                    presentation.creator = user._id;
                    presentation.creatorRole = user.role;
                }
                presentation.bpLock = bpLock;
                presentation.save(function (saveErr, savedPresentation) {
                    if (saveErr) {
                        callback(saveErr, null);
                    } else {

                        if (templateId) {
                            cloneWidgets(templateId, savedPresentation, user, function (saveWidgetErr, savedWidgets) {
                                if (saveWidgetErr) {
                                    callback(saveWidgetErr, null);
                                } else {
                                    saveLastEditedPresentationAndCreateFolder(savedPresentation, user, callback);
                                }
                            });
                        } else {
                            saveLastEditedPresentationAndCreateFolder(savedPresentation, user, callback);
                        }
                    }
                });
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Add Tag to Presentation schema and appEntity to Tag schema
 * 
 * @param    Object, User object
 * @param    Object, Presentation object
 * @param    Object, Tag object
 * @return   Object, presentation object
 */
function addTag(currentUser, presentation, tag, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    if (utils.childExistsInParent(tag, presentation.tagBindings)) {
        callback(null, presentation);
    } else {
        if (!presentation.tagBindings) {
            presentation.tagBindings = [];
        }
        presentation.tagBindings.push(tag);
        async.parallel([
            function(cb) {
                tagBindingUtils.bindTags(consts.APP_ENTITY_TYPE.PRESENTATION,
                    presentation._id, {tagBindings : tag}, cb);
            },
            function(cb) {
                savePresentation(currentUser, presentation, true, cb);
            }
        ],
        function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[1]);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove Tag from Presentation Schema and appEntity from Tag Schema
 * 
 * @param    Object, User object
 * @param    Object, Presentation object
 * @param    String, Tag Id
 * @return   Object, presentation object
 */
function removeTag(currentUser, presentation, tagId, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var i = 0;
    presentation.tagBindings.forEach(function(iteratorObj) {
        if (iteratorObj.id.toString() === tagId.toString()) {
            presentation.tagBindings.splice(i, 1);
        }
        i++;
    });
    async.parallel([
        function(cb) {
            tagBindingUtils.unbindTags(consts.APP_ENTITY_TYPE.PRESENTATION,
                presentation._id.toString(), [{"id": tagId}], cb);
        },
        function(cb) {
            savePresentation(currentUser, presentation, true, cb);
        }
    ],
    function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove Tags all from Presentation Schema and appEntity from Tag Schema
 * 
 * @param    Object, User object
 * @param    Object, Presentation object
 * @return   Object, presentation object
 */
function removeTagsAll(currentUser, presentation, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var tags = presentation.tagBindings;

    presentation.tagBindings = [];

    async.parallel([
        function(cb) {
            tagBindingUtils.unbindTags(consts.APP_ENTITY_TYPE.PRESENTATION, presentation._id.toString(), tags, cb);
        },
        function(cb) {
            savePresentation(currentUser, presentation, true, cb);
        }
    ],
    function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove Presentation from all Tag Schema
 * 
 * @param    Object, Presentation object
 * @return   Object, Presentation object
 */
function removePresentationFromAllTags(presentation, finalCallback) {
    async.each(presentation.tagBindings, function(tagBinding, callback) {
        Tag.update(
            {_id: new ObjectId(tagBinding.id)},
            {$pull: {appEntities: {id: presentation._id, appName: consts.APP_ENTITY_TYPE.PRESENTATION}}})
            .exec(callback);
    }, function(updateError, updateResult) {
        if (updateError) {
            finalCallback(updateError, null);
        } else {
            finalCallback(null, updateResult);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Delete Presentation
 * 
 * @param    String, Presentation Id
 * @param    Object, USER object
 * @return   Object, OK or error
 */
function deletePresentationById(selectedPresentationId, currentUser, callback) {
    log.info("delete presentation:"+ selectedPresentationId);
    getPresentationById(selectedPresentationId, currentUser, function(findErr, findPresentation) {
        if(findErr) {
            callback(findErr, null);
        } else {

            var bpRoleCheck = findPresentation.creatorRole === consts.USER_ROLES.BP &&
                currentUser.role !== consts.USER_ROLES.BP;
            var adminRoleCheck = findPresentation.creatorRole === consts.USER_ROLES.Admin &&
                currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin;
            var tmRoleCheck = findPresentation.creator.toString() !== currentUser._id.toString() &&
                currentUser.role === consts.USER_ROLES.TM;

            if(bpRoleCheck || adminRoleCheck || tmRoleCheck) {
                var error = new Error(consts.SERVER_ERRORS.PRESENTATION.CAN_NOT_DELETE_PRESENTATION);
                error.status = 422;
                callback(error, null);
            } else {
                removePresentationFromAllTags(findPresentation, function(err, result) {
                    if(err) {
                        callback(err);
                    } else {
                        Presentation.remove({_id: findPresentation._id}).exec();
                        Widget.remove({presentation: findPresentation._id}).exec();
                        User.update({ lastEditedPresentation: findPresentation._id },
                            { lastEditedPresentation: null }, { multi: true }).exec();
                        User.update({ previousEditedPresentation: findPresentation._id },
                            { previousEditedPresentation: null }, { multi: true }).exec();
                        //callback(null, consts.OK);

                        cacheHelper.deleteSingleAppEntityCache(findPresentation._id.toString(),
                            function(cacheErr, cacheResult) {
                            if(cacheErr) {
                                callback(cacheErr);
                            } else {
                                callback(null, consts.OK);
                            }

                        });
                    }
                });
            }
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get last edited presentation id of User
 * 
 * @param    Object, USER object
 * @return   Object, Presentation object
 */
function getLastEditedPresentationId(user, callback) {
    var lastEditedPresentationId = user.lastEditedPresentation;
    if(!lastEditedPresentationId) {
        lastEditedPresentationId = user.previousEditedPresentation;
    }

    console.log("lastEditedPresentationId: "+ lastEditedPresentationId);

    if(!lastEditedPresentationId) {
        createPresentation(user, "new Presentation", null, false, callback);
    } else {
        callback(null, lastEditedPresentationId);
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Get templates
 * 
 * @param    
 * @return   Array, array of presentation object
 */
function getPresentationTemplates(callback) {
    Presentation.find({isTemplate : true})
        .lean()
        .exec(function (err, findPresentations) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, findPresentations);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Populate params of presentation
 *
 * @param    Object, Presentation object
 * @return   Object, Presentation object
 */
function addPresentationParams(presentation, currentUser, callback) {

    widgetDAO.getWidgetsByPresentationId(presentation._id, currentUser, function(findWidgetErr, findWidgets) {
        if(findWidgetErr) {
            callback(findWidgetErr, null);
        } else {
            var obj = presentation.toObject();
            obj.widgetsCount = findWidgets.length;
            var maxStartDate = 0;
            var minStartDate = 9999;
            var maxDuration = 0;

            for(var i=0; i < findWidgets.length; i++) {
                if(findWidgets[i].parameters.startDate) {
                    var args = findWidgets[i].parameters.startDate.split(":");
                    var thisTime = parseInt(args[0]) * 60 + parseInt(args[1]);//in seconds
                    if(thisTime > maxStartDate) {
                        maxStartDate = thisTime;
                        if(findWidgets[i].parameters.duration > maxDuration) {
                            maxDuration = findWidgets[i].parameters.duration;
                        }
                        maxDuration = findWidgets[i].parameters.duration;
                    }
                    if(thisTime < minStartDate) {
                        minStartDate = thisTime;
                    }
                }
            }

            if(findWidgets.length > 0) {
                obj.duration = maxStartDate + maxDuration - minStartDate;
            } else {
                obj.duration = 0;
            }

            callback(null, obj);

        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentations by user
 * 
 * @param    Object, User object
 * @return   Array, array of presentation object
 */
function getPresentationsByUser(currentUser, callback) {
    var params = {$and: []};
    permissionsUtils.getAppObjectByUser(currentUser, Presentation, consts.APP_ENTITY_TYPE.PRESENTATION, params,
        function(err, presentations, findUserTags, findObjectTags) {
        if(err) {
            callback(err, null);
        } else {
            async.map(presentations, function(presentation, callback) {
                addPresentationParams(presentation, currentUser, callback);
            }, function (populateErr, populatedPresentations) {
                if (populateErr) {
                    callback(populateErr, null);
                } else {
                    callback(null, populatedPresentations);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Validate Populate model
 * 
 * @param    Object, Presentation object
 * @return   Object, OK or error
 */
function validate(presentationObj, callback) {
    var presentation = new Presentation(presentationObj);
    presentation.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentation by params
 *
 * @param    Object, Presentation params
 * @return   Array, array of presentation object
 */
function getDiffTags(sourceTags, findTags, finalCallback) {

    var sourceTagIds = _.map(_.pluck(sourceTags, "_id"), function(tagId) {
        return tagId.toString();
    });
    var findTagIds = _.map(_.pluck(findTags, "_id"),function(tagId) {
        return tagId.toString();
    });

    var diffTagIds;

    diffTagIds = _.difference(findTagIds, sourceTagIds);
    async.parallel([
            function (cb) {
                tagDAO.findTagsRecursive(diffTagIds, [], function(err, fullDiffTagObjects) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, fullDiffTagObjects);
                    }
                });
            },
            function (cb) {
                tagDAO.getTagsByParams({_id: {$in: diffTagIds }}, function(err, diffTagObjects) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null,diffTagObjects);
                    }
                });
            }
        ],
        function (err, results) {

            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, results);
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentation editors
 * 
 * @param    String, Presentation Id
 * @param    Object, User object
 * @return   Object, OK or error
 */
function getEditors(presentationId, currentUser, finalCallback) {
    async.waterfall([
        function (callback) {
            tagDAO.getTagsByEntityIds(consts.APP_ENTITY_TYPE.PRESENTATION, [presentationId],
                null, null, function (findErr, presentaionTags) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, presentaionTags);
                }
            });
        },
        function (presentaionTags, callback) {
            var params = {
                $and: [
                    { role: { $ne: consts.USER_ROLES.BP }}
                ]
            };
            if (currentUser.role !== consts.USER_ROLES.BP) {
                params.$and.push({accounts: { $in: currentUser.accounts}});
            }

            userDAO.getUsersByParams(params, function (findErr, findUsers) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, presentaionTags, findUsers);
                }
            });
        },
        function (presentaionTags, findUsers, callback) {

            var presentationEditors = [];

            async.each(findUsers, function(argUser, eachCallback) {
                async.waterfall([
                    function (waterfallCallback) {
                        tagDAO.getTagsByEntityIds("User", [argUser._id.toString()],
                            null, null, function (findErr, userTags) {
                            if (findErr) {
                                waterfallCallback(findErr);
                            } else {
                                waterfallCallback(null, userTags);
                            }
                        });
                    },
                    function (userTags, waterfallCallback) {
                        getDiffTags(userTags[argUser._id.toString()],
                            presentaionTags[presentationId], waterfallCallback);
                    }
                ], function(err, results) {
                    if (err) { 
                        eachCallback(err);
                    } else {
                        if (!results[0].length) {
                            presentationEditors.push(argUser);
                        }
                        eachCallback(null, "success");
                    }
                });
            }, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, presentationEditors);
                }
            });
        }
    ], function (err, result) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, result);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Add presentation editor by pushing presentation tags to user's accessible tags
 * 
 * @param    {string} Presentation Id
 * @param    {string} User Id to be presentation editor
 * @param    {object} Current(logged in) user object
 * @return   {object} Updated user object
 */
function addEditor(presentationId, userId, currentUser, finalCallback) {
    if (currentUser.role !== consts.USER_ROLES.BP) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.ONLY_BP_CAN_ADD_PRESENTATION_EDITOR);
        error.status = 422;
        finalCallback(error, null);
    }

    async.waterfall([
        function (callback) {
            tagDAO.getTagsByEntityIds("User", [userId], null, null, function (findErr, userTags) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, userTags);
                }
            });
        },
        function (userTags, callback) {
            tagDAO.getTagsByEntityIds(consts.APP_ENTITY_TYPE.PRESENTATION, [presentationId],
                null, null, function (findErr, presentaionTags) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, userTags, presentaionTags);
                }
            });
        },
        function (userTags, presentaionTags, callback) {
            getDiffTags(userTags[userId], presentaionTags[presentationId], callback);
        },
        function (diffTags, callback) {
            var diffTagObjects = _.map(diffTags[1], function(diffTag) {
                return {
                    "id": diffTag._id,
                    "tagType": diffTag.tagType
                };
            });

            var fullDiffTagObjects = _.map(diffTags[0], function(diffTag) {
                return {
                    "id": diffTag._id,
                    "tagType": diffTag.tagType
                };
            });
            
            tagBindingUtils.bindTags("User", userId, {"accessibleTags": fullDiffTagObjects}, function(err, result) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, diffTagObjects);
                }
            });
        },
        function (diffTagObjects, callback) {
            User.update(
                {_id: new ObjectId(userId)},
                {$addToSet: {accessibleTags: {$each: diffTagObjects}}}).exec(function(err,updated) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, updated);
                    }
                });
        },
        function (updated, callback) {
            userDAO.getUserByIdIfAllowed(userId, callback);
        }
    ], function (err, result) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, result);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentation by params
 *
 * @param    Object, Presentation params
 * @return   Array, array of presentation object
 */
function getCommonTags(sourceTags, findTags, finalCallback) {

    var sourceTagIds = _.map(_.pluck(sourceTags, "_id"), function(tagId) {
        return tagId.toString();
    });
    var findTagIds = _.map(_.pluck(findTags, "_id"),function(tagId) {
        return tagId.toString();
    });

    var commonTagIds;

    commonTagIds = (_.filter(sourceTagIds, function(tagId) {
        return findTagIds.indexOf(tagId) > -1;}).length === findTagIds.length) ? findTagIds : [];

    async.parallel([
            function (cb) {
                tagDAO.findTagsRecursive(commonTagIds, [], function(err, fullCommonTagObjects) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, fullCommonTagObjects);
                    }
                });
            },
            function (cb) {
                tagDAO.getTagsByParams({_id: {$in: commonTagIds }}, function(err, commonTagObjects) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null,commonTagObjects);
                    }
                });
            }
        ],
        function (err, results) {
            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, results);
            }
        });

}

// --------------------------------------------------------------------------------------------------

/**
 * Remove presentation editor by pulling presentation tags from user's accessible tags
 * 
 * @param    {string} Presentation Id
 * @param    {string} Presentation editor Id
 * @param    {object} Current(logged in) user object
 * @return   {object} Updated user object
 */
function removeEditor(presentationId, userId, currentUser, finalCallback) {
    if (currentUser.role !== consts.USER_ROLES.BP) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.ONLY_BP_CAN_REMOVE_PRESENTATION_EDITOR);
        error.status = 422;
        finalCallback(error, null);
    }

    async.waterfall([
        function (callback) {
            tagDAO.getTagsByEntityIds("User", [userId], null, null, function (findErr, userTags) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, userTags);
                }
            });
        },
        function (userTags, callback) {
            tagDAO.getTagsByEntityIds(consts.APP_ENTITY_TYPE.PRESENTATION, [presentationId],
                null, null, function (findErr, presentaionTags) {
                if (findErr) {
                    callback(findErr);
                } else {
                    callback(null, userTags, presentaionTags);
                }
            });
        },
        function (userTags, presentaionTags, callback) {
            getCommonTags(userTags[userId], presentaionTags[presentationId], callback);
        },
        function (commonTags, callback) {
            var commonTagObjects = _.map(commonTags[1], function(commonTag) {
                return {
                    "id": commonTag._id,
                    "tagType": commonTag.tagType
                };
            });

            var fullCommonTagObjects = _.map(commonTags[0], function(commonTag) {
                return {
                    "id": commonTag._id,
                    "tagType": commonTag.tagType
                };
            });
            
            tagBindingUtils.unbindTags("User", userId, fullCommonTagObjects, function(err, result) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, commonTagObjects);
                }
            });
        },
        function (commonTagObjects, callback) {
            User.update(
                {_id: new ObjectId(userId)},
                {$pullAll: {accessibleTags: commonTagObjects}}).exec(function(err,updated) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, updated);
                    }
                });
        },
        function (updated, callback) {
            userDAO.getUserByIdIfAllowed(userId, callback);
        }
    ], function (err, result) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, result);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get Tags of Presentation with full hierarchy
 * 
 * @param     Object, Presentation object
 * @return    Array, array of tags object with full hierarchy 
 */
function getPresentationTagsFullHierarchy(findPresentation, finalCallback) {
    if(findPresentation.tagBindings && findPresentation.tagBindings.length>0) {
        var entityIds = [findPresentation._id.toString()];
        tagDAO.getTagsFullHierarchyByEntityIds(consts.APP_ENTITY_TYPE.PRESENTATION, entityIds,
            null, null, function (tagsErr, tagsFullHierarchy) {
            if(tagsErr) {
                finalCallback(tagsErr);
            } else {
                finalCallback(null, tagsFullHierarchy);
            }
        });
    }
    else {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_TAGS_NOT_REGISTERED);
        error.status = 422;
        finalCallback(error);
    }
}
// -------------------------------------------------------------------------------------

exports.clone = clone;
exports.getEditors = getEditors;
exports.addEditor = addEditor;
exports.removeEditor = removeEditor;

exports.validate = validate;
exports.createPresentation = createPresentation;
exports.addTag = addTag;
exports.addTags = addTags;
exports.removeTag = removeTag;
exports.removeTagsAll = removeTagsAll;
exports.getPresentationsByUser = getPresentationsByUser;
exports.getLastEditedPresentationId = getLastEditedPresentationId;
exports.getPresentationTemplates = getPresentationTemplates;
exports.savePresentation = savePresentation;
exports.deletePresentationById = deletePresentationById;
exports.getPresentationById = getPresentationById;
exports.getPresentationsByParams = getPresentationsByParams;
exports.getPresentationTagsFullHierarchy = getPresentationTagsFullHierarchy;
exports.createPresentationFolder = createPresentationFolder;

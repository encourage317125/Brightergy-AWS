"use strict";

// TODO:: moved to auth-service

var consts = require("../../../libs/consts"),
//utils = require("../../../libs/utils"),
//dataSourceUtils = require("../../../libs/data-source-utils"),
mongoose = require("mongoose"),
    async = require("async"),
    ObjectId = mongoose.Types.ObjectId,
//moment = require("moment"),
    tagDAO = require("../dao/tag-dao"),
    _ = require("lodash");

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getUserPermissions(user) {

    var permissions = {
        uploadGeneralAssets: false,
        uploadPresentationAssets: true,
        uploadAccountAssets: false
    };

    if(user.role === consts.USER_ROLES.BP) {
        permissions.uploadGeneralAssets = true;
        permissions.uploadAccountAssets = true;
    } else if(user.role === consts.USER_ROLES.Admin) {
        permissions.uploadAccountAssets = true;
    } else if(user.role === consts.USER_ROLES.TM) {
        permissions.uploadAccountAssets = false;
    } else {
        var error = new Error(consts.SERVER_ERRORS.USER.NOT_ALLOWED_USER_ROLE);
        error.status = 422;
        throw error;
    }

    return permissions;
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsRecursive(tagItem, ids) {
    var id = tagItem._id.toString();
    var childCollectionName = null;
    var tagType = tagItem.tagType;

    switch (tagType) {
        case consts.TAG_TYPE.Facility:
        case consts.TAG_TYPE.Scope:
        case consts.TAG_TYPE.Node:
            ids.push(id);
            childCollectionName = "childTags";
            break;
        case consts.TAG_TYPE.Metric:
            ids.push(id);
            break;
    }

    if(childCollectionName) {
        var children = tagItem[childCollectionName];

        for(var i=0; i < children.length; i++) {
            getTagsRecursive(children[i], ids);
        }
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions get user tags Id with child Id
 *
 * @access  private
 * @param   array
 * @return  array
 */
function getUserTagsId(tags) {
    var ids = [];

    for(var i=0; i < tags.length; i++) {
        getTagsRecursive(tags[i], ids);
    }

    return _.uniq(ids);
}

// --------------------------------------------------------------------------------------------------

function getDashboardTagsId(obj) {
    var ids = [];
    for( var i=0; i < obj.segments.length; i++) {
        for(var j=0; j < obj.segments[i].tagBindings.length; j++) {
            ids.push(obj.segments[i].tagBindings[j].id.toString());
        }
    }
    return ids;
}

function getPresentationTagsId(obj) {
    var ids = [];
    for( var i=0; i < obj.tagBindings.length; i++) {
        ids.push(obj.tagBindings[i].id.toString());
    }
    return ids;
}

function getAppEntityTagsId(obj, objectType) {
    switch (objectType) {
        case consts.APP_ENTITY_TYPE.DASHBOARD:
            return getDashboardTagsId(obj);
        case consts.APP_ENTITY_TYPE.PRESENTATION:
            return getPresentationTagsId(obj);
        default:
            return [];
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Function returns flag, that dashboard accessible for user or not
 *
 * @access  private
 * @param   {object} user
 * @param   {object} dashboard
 * @param   {string} userId
 * @return  {boolean}
 */
function isAccessibleDashboard(user, userId, dashboard) {
    var isCreator = dashboard.creator.toString() === userId;
    if(!dashboard.isPrivate) {
        // it is public dashboard

        //check default dashboard
        if(!dashboard.default) {
            return true;
        } else {
            return user.role === consts.USER_ROLES.BP || isCreator;
        }

    } else {
        return isCreator;
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function userHaveAccessToAppObject(user, objectType, appObject, finalCallback) {
    if (!user) {
        finalCallback(null, true);
    } else if (objectType === consts.APP_ENTITY_TYPE.DASHBOARD && 
        appObject.isPrivate && appObject.creator.toString() !== user._id.toString() && 
        !isAccessibleDashboard(user, user._id.toString(), appObject)) {
            finalCallback(null, false);
    } else if (user.role === consts.USER_ROLES.BP) {
        //bp have access to all not private app objects
        finalCallback(null, true);
    } else {

        var userId = user._id.toString();

        async.waterfall([
            function (callback) {
                tagDAO.getTagsFullHierarchyByEntityIds("User", [userId], null, null, callback);
            },
            function (userTags, callback) {
                var userTagsId = getUserTagsId(userTags[userId]);
                var appEntityTagsIds = getAppEntityTagsId(appObject, objectType);
                var diff = _.difference(appEntityTagsIds, userTagsId);
                callback(null, diff.length === 0);

            }
        ], function (err, result) {
            if (err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, result);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function userHaveAccessToPresentation(user, presentation, callback) {
    userHaveAccessToAppObject(user, consts.APP_ENTITY_TYPE.PRESENTATION, presentation, callback);
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function userHaveAccessToDashboard(user, dashboard, callback) {
    userHaveAccessToAppObject(user, consts.APP_ENTITY_TYPE.DASHBOARD, dashboard, callback);
}

// --------------------------------------------------------------------------------------------------

/**
 * check if user has access to Present app
 *
 * @access  public
 * @param   Object
 * @return  boolean
 */
function userHaveAccessToPresent(user) {
    if(user.role === consts.USER_ROLES.BP) {
        //bp have access to all applications
        return true;
    } else {
        return user.apps.indexOf(consts.APPS.Present) >= 0;
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * check if user has access to Analyze app
 *
 * @access  public
 * @param   Object
 * @return  boolean
 */
function userHaveAccessToAnalyze(user) {
    if(user.role === consts.USER_ROLES.BP) {
        //bp have access to all applications
        return true;
    } else {
        return user.apps.indexOf(consts.APPS.Analyze) >= 0;
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * check if user has access to Utilities app
 *
 * @access  public
 * @param   Object
 * @return  boolean
 */
function userHaveAccessToUtilities(user) {
    if(user.role === consts.USER_ROLES.BP) {
        //bp have access to all applications
        return true;
    } else {
        return user.apps.indexOf(consts.APPS.Utilities) >= 0;
    }
}
// --------------------------------------------------------------------------------------------------

/**
 * check if user has access to Utilities app
 *
 * @access  public
 * @param   Object
 * @return  boolean
 */
function userHaveAccessToControl(user) {
    if(user.role === consts.USER_ROLES.BP) {
        //bp have access to all applications
        return true;
    } else {
        return user.apps.indexOf(consts.APPS.Control) >= 0;
    }
}

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function filterAppObjectsByUser(currentUser, foundObjects, objectType) {
    var accessibleObjects = [];

    var userId = currentUser._id.toString();

    for (var i = 0; i < foundObjects.length; i++) {
        var obj = foundObjects[i];

        if(objectType !== consts.APP_ENTITY_TYPE.DASHBOARD || isAccessibleDashboard(currentUser, userId, obj)) {
            /*if(currentUser.role === consts.USER_ROLES.BP) {
                accessibleObjects.push(obj);
            } else {
                var appEntityTagsIds = getAppEntityTagsId(obj, objectType);
                var diff = _.difference(appEntityTagsIds, foundUserTags);
                if(diff.length === 0) {
                    accessibleObjects.push(obj);
                }
            }*/
            accessibleObjects.push(obj);

        }
    }

    return accessibleObjects;


}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions get app objects by user
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getAppObjectByUser(currentUser, Model, objectType, params, finalCallback) {

    var isUserNotBP = currentUser.role !== consts.USER_ROLES.BP;

    async.waterfall([
        function (callback) {
            if(isUserNotBP) {
                var userIdPlain = currentUser._id.toString();
                tagDAO.getTagsFullHierarchyByEntityIds("User", [userIdPlain], null, null,
                    function (err, findUserTags) {
                        if (err) {
                            callback(err);
                        } else {
                            //get ald id from user tags
                            var userTagsIds = getUserTagsId(findUserTags[userIdPlain]);
                            callback(null, userTagsIds);
                        }
                    });
            } else {
                callback(null, {});
            }
        },
        function(foundUserTags, callback) {
            if(isUserNotBP) {

                var agregationOptions = [];
                var emptyTagsObject = null;

                //http://stackoverflow.com/questions/28718615/find-documents-by-in-in-embedded-arrays
                switch (objectType) {
                    //find object Id by user accessible tags
                    case consts.APP_ENTITY_TYPE.DASHBOARD:
                        agregationOptions = [
                            { "$unwind": "$segments"},
                            { "$unwind": "$segments.tagBindings" },
                            { "$group": {
                                "_id": "$_id",
                                "tagBindings" : { "$addToSet": "$segments.tagBindings.id" }
                            }
                            },
                            { "$project": {
                                "isValid": {
                                    "$setIsSubset": [
                                        "$tagBindings",
                                        _.map(foundUserTags, function(tag) {
                                            return new ObjectId(tag);
                                        })
                                    ]}
                            }
                            },
                            { "$match": { "isValid": true } }
                        ];

                        emptyTagsObject = {"segments": { $size: 0  }};
                        break;
                    case consts.APP_ENTITY_TYPE.PRESENTATION:
                        agregationOptions = [
                            { "$unwind": "$tagBindings"},
                            { "$group": {
                                "_id": "$_id",
                                "tagBindings" : { "$addToSet": "$tagBindings.id" }
                            }
                            },
                            { "$project": {
                                "isValid": {
                                    "$setIsSubset": [
                                        "$tagBindings",
                                        _.map(foundUserTags, function(tag) {
                                            return new ObjectId(tag);
                                        })
                                    ]}
                            }
                            },
                            { "$match": { "isValid": true } }
                        ];

                        emptyTagsObject = {"tagBindings": { $size: 0  }};
                        break;
                }

                //aggregation framework
                Model.aggregate(agregationOptions, function(aggregateErr, aggregateResult) {
                    if(aggregateErr) {
                        callback(aggregateErr);
                    } else {
                        params.$and.push(
                            {
                                $or: [
                                    {_id: {$in: _.pluck(aggregateResult, "_id")}},//get Id from result
                                    emptyTagsObject //return objects with empty tags
                                ]
                            }
                        );
                        callback(null, params);
                    }
                });

            } else {
                //user is BP, get all objects
                params = params.$and.length > 0 ? params: {};
                callback(null, params);
            }

        },
        function(objectQueryParams, callback) {
            Model.find(objectQueryParams, callback);
        },
        function(foundObjects, callback) {
            var accessibleObjects = filterAppObjectsByUser(currentUser, foundObjects, objectType);
            callback(null, accessibleObjects);
        }
    ], function (err, accessibleObjects) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, accessibleObjects);
        }
    });
}

// --------------------------------------------------------------------------------------------------

exports.userHaveAccessToPresent = userHaveAccessToPresent;
exports.userHaveAccessToAnalyze = userHaveAccessToAnalyze;
exports.userHaveAccessToUtilities = userHaveAccessToUtilities;
exports.getUserPermissions = getUserPermissions;
exports.userHaveAccessToDashboard = userHaveAccessToDashboard;
exports.userHaveAccessToPresentation = userHaveAccessToPresentation;
exports.getAppObjectByUser = getAppObjectByUser;
exports.userHaveAccessToControl = userHaveAccessToControl;
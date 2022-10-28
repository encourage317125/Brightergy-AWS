"use strict";

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
//DataSource = mongoose.model("datasource"),
    async = require("async"),
    _ = require("lodash"),
    ObjectId = mongoose.Types.ObjectId,
    utils = require("../../../libs/utils"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
//dashboardDAO = require("../../../bl-data-sense/core/dao/dashboard-dao"),
//presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    userDAO = require("./user-dao"),
//log = require("../../../libs/log")(module),
    consts = require("../../../libs/consts"),
    tagRuleDAO = require("./tag-rule-dao"),
    nodeUtil = require("util"),
    locationService = require("location-service"),
    config = require("../../../../config/environment"),
    log = require("../../../libs/log")(module),
    cacheHelper = require("../../../libs/cache-helper"),
    BP_TAGS_CACHE_KEY = "bp_tags",
    facilityExcludeFields = ["manufacturer", "device", "deviceID", "accessMethod", "destination", "interval",
        "webAddress", "latitude", "longitude", "weatherStation", "endDate", "enphaseUserId", "timezone",
        "dateTimeFormat", "username", "password", "sensorTarget", "rate", "metric", "metricType", "metricID",
        "formula", "summaryMethod", "nodeType", "potentialPower", "deviceSoftware", "datacoreMetricID",
        "externalId"],
    scopeExcludeFields = ["city", "country", "postalCode", "state", "street", "address", "taxID", "nonProfit",
        "utilityProvider", "utilityAccounts", "billingInterval", "rate", "metric", "metricType", "metricID",
        "formula", "summaryMethod", "nodeType", "potentialPower", "datacoreMetricID", "externalId",
        "constEmissionFactor"],
    nodeExcludeFields = ["city", "country", "postalCode", "state", "street", "address", "taxID", "nonProfit",
        "utilityProvider", "utilityAccounts", "billingInterval", "accessMethod", "destination", "webAddress",
        "timezone", "dateTimeFormat", "username", "password", "rate", "metric", "metricType", "metricID",
        "formula", "summaryMethod", "deviceSoftware", "datacoreMetricID", "externalId", "constEmissionFactor"],
    metricExcludeFields = ["city", "country", "postalCode", "state", "street", "address", "taxID", "nonProfit",
        "utilityProvider", "utilityAccounts", "billingInterval", "manufacturer", "device", "accessMethod",
        "destination", "interval", "webAddress", "latitude", "longitude", "weatherStation", "endDate",
        "enphaseUserId", "timezone", "dateTimeFormat", "username", "password", "sensorTarget", "nodeType",
        "potentialPower", "deviceSoftware", "constEmissionFactor"],
    // fields of BPD tags - name, displayName, Manufacturer, deviceID, timezone, dateTimeFormat
    bpdExcludeFields = ["city", "country", "postalCode", "state", "street", "address", "taxID", "nonProfit",
        "utilityProvider", "utilityAccounts", "billingInterval", "rate", "metric", "metricType", "metricID",
        "formula", "summaryMethod", "nodeType", "potentialPower", "accessMethod", "destination",
        "interval", "webAddress", "latitude", "longitude", "weatherStation", "endDate", "enphaseUserId",
        "username", "password", "sensorTarget", "deviceSoftware", "datacoreMetricID", "externalId",
        "region", "continent", "constEmissionFactor"];

//init location service
var locationServiceConfig = {
    "authorizationToken": config.get("services:location:auth"),
    "timezoneUrl": config.get("services:location:url")
};

locationService.init(locationServiceConfig, log);

function setTagTimeZone(tag, callback) {
    var defaultTZ = "America/Chicago";
    if(tag.tagType !== consts.TAG_TYPE.Scope) {
        callback(null);
    } else if(!tag.latitude || !tag.longitude) {
        tag.timezone = defaultTZ;
        callback(null);
    } else {
        //locationService.init(locationServiceConfig, log);
        locationService.getTimezone(tag.latitude, tag.longitude).then(function(result){
            tag.timezone = result.timezone || defaultTZ;
            callback(null);
        }).catch(function(e) {
            callback(e);
        });
    }
}

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByParams(params, callback) {
    Tag.find(params)
        .lean()
        .exec(callback);
}

function getTagsCount(params, callback) {
    Tag.count(params)
        .lean()
        .exec(callback);
}

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   object
 * @param   callback
 * @return  void
 */
function getTagsByParamsPaginated(params, pager, callback) {
    if (!pager) {
        pager = { offset: null, limit: null };
    }
    Tag.find(params)
        .sort("name")
        .skip(pager.offset)
        .limit(pager.limit)
        .lean()
        .exec(callback);
}

function getTagsMongooseByParams(params, callback) {
    Tag.find(params)
        .exec(callback);
}

function copyFieldsFromParentsToMetric(metricTag, allParents) {
    //copy nodeType from Node to metrics
    if(metricTag.tagType === consts.TAG_TYPE.Metric) {

        var nodes = _.filter(allParents, function(p) {
            return p.tagType === consts.TAG_TYPE.Node;
        });

        var scopes = _.filter(allParents, function(p) {
            return p.tagType === consts.TAG_TYPE.Scope;
        });

        var facilities = _.filter(allParents, function(p) {
            return p.tagType === consts.TAG_TYPE.Facility;
        });

        if(nodes.length > 0) {
            var nearestNode = nodes[nodes.length -1];
            metricTag.nodeType = nearestNode.nodeType;
            metricTag.deviceID = nearestNode.deviceID;
            metricTag.manufacturer = nearestNode.manufacturer;
            metricTag.device = nearestNode.device;
        }

        if(scopes.length > 0) {
            var nearestScope = scopes[scopes.length -1];
            metricTag.timezone = nearestScope.timezone;
            metricTag.dateTimeFormat = nearestScope.dateTimeFormat;
            metricTag.latitude = nearestScope.latitude;
            metricTag.longitude = nearestScope.longitude;
        }

        if(facilities.length > 0) {
            var nearestFacility = facilities[0];
            metricTag.installCity = nearestFacility.installCity;
            metricTag.installCountry = nearestFacility.installCountry;
            metricTag.installPostalCode = nearestFacility.installPostalCode;
            metricTag.installState = nearestFacility.installState;
            metricTag.installStreet = nearestFacility.installStreet;
            metricTag.installAddress = nearestFacility.installAddress;

            metricTag.region = nearestFacility.region;
            metricTag.city = nearestFacility.city;
            metricTag.country = nearestFacility.country;
            metricTag.postalCode = nearestFacility.postalCode;
            metricTag.state = nearestFacility.state;
            metricTag.street = nearestFacility.street;
            metricTag.address = nearestFacility.address;
        }
    }
}

/**
 * Recursive function for getting all tags by visiting every node in abstract tag tree (abstract means db relation)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */

function findTagsRecursive(tagIds, destinationArray, callback) {
    getTagsByParams({_id: { $in: tagIds}}, function(findErr, findObjects) {
        if(findErr) {
            callback(findErr);
        } else {

            var thisChildrenIds = [];
            /*findObjects = _.map(findObjects, function(obj) {
             return obj.toObject();
             });*/

            //destinationArray = _.union(findObjects, destinationArray);
            destinationArray.push.apply(destinationArray, findObjects);

            for (var i = 0; i < findObjects.length; i++) {
                //var childTags = filterValidTagTypes(findObjects[i].children);

                //var childTagIds = _.pluck(findObjects[i].children, "id");

                //childTagIds = getChildMapsWithId(childTagIds);
                //thisChildrenIds = _.union(thisChildrenIds, childTagIds);
                //[].push.apply(topLevelDataSourceIds, topLevelObjectDataSourceIds);//add page into existingSeries

                for(var j=0; j < findObjects[i].children.length; j++) {
                    thisChildrenIds.push(findObjects[i].children[j].id);
                }
            }
            //console.log("children:" + thisChildrenIds)
            //thisChildrenIds = _.uniq(thisChildrenIds);
            if(thisChildrenIds.length > 0) {
                findTagsRecursive(thisChildrenIds, destinationArray, callback);
            } else {
                callback(null, destinationArray);
            }

        }
    });
}

/**
 * Get all tags by entityId and filtered tagType
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByEntityIds(objectType, entityIds, tagType, findNameMask, finalCallback) {
    var result = {};

    async.map(entityIds, function(entityId, entityIdsCallback) {
        var objectBindPair = tagBindingUtils.getQueryObjectBindPair(objectType, entityId);

        if (!objectBindPair) {
            entityIdsCallback(new Error("An error occurred while attempting to retrieve tag binding pair"), null);
        }

        async.waterfall([
            function(callback) {
                if (consts.APP_ENTITY_TYPES.indexOf(objectType) > -1) {
                    Tag.find({appEntities: objectBindPair}, callback);
                } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) > -1) {
                    Tag.find({usersWithAccess: objectBindPair}, callback);
                } else {
                    finalCallback(consts.SERVER_ERRORS.TAG.INVALID_ENTITY_TYPE, null);
                }
            },
            function(currentTags, callback) {
                var re = null;
                if(findNameMask) {
                    re = new RegExp(findNameMask, "i");
                }

                var thisTags = [];
                for(var i=0; i < currentTags.length; i++) {
                    var nameCheck = findNameMask? re.test(currentTags[i].name) : true;

                    if (nameCheck) {
                        thisTags.push(currentTags[i]);
                    }
                }
                result[entityId] = thisTags;
                callback(null, result);
            }
        ], function(entityIdError, tagResults) {
            if (entityIdError) {
                entityIdsCallback(entityIdError, null);
            } else {
                entityIdsCallback(null, tagResults);
            }
        });
    }, function(entityIdsError, finalResults) {
        if (entityIdsError) {
            finalCallback(entityIdsError, null);
        } else {
            // Convert finalResult to Object from Array
            if(Array.isArray(finalResults)) {
                finalResults = finalResults[0];
            }

            var finalData = {};

            if(tagType) {
                for (var prop in finalResults) {
                    if(finalResults[prop]) {
                        var thisTags = [];
                        for (var i = 0; i < finalResults[prop].length; i++) {
                            if (finalResults[prop][i].tagType === tagType) {
                                thisTags.push(finalResults[prop][i]);
                            }
                        }
                        finalData[prop] = thisTags;
                    }
                }
            } else {
                finalData = finalResults;
            }

            //finalCallback(null, result);
            finalCallback(null, finalData);
        }
    });
}

/**
 * Recurisve function for building tag tree from plain array
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function buildTagsRecuriveTraversal(tagsObj, parent) {
    parent.childTags = [];

    for (var i = parent.children.length - 1; i >= 0; i--) {
        var childId = parent.children[i].id.toString();
        var child = tagsObj[childId];

        if(child) {

            var parentTag = _.clone(parent);

            delete parentTag["childTags"];
            delete parentTag["children"];
            delete parentTag["parents"];
            delete parentTag["parentTag"];
            child.parentTag = parentTag;

            buildTagsRecuriveTraversal(tagsObj, child);
            parent.childTags.push(child);
        } else {
            var msg = nodeUtil.format("Alarm! Achtung! Inconsistent db! " +
            "Parent tag  %s has child tag %s that is removed from db. Fix DB immediately!", parent.name, childId);
            var error = new Error(msg);
            error.name ="InconsistentDB";

            utils.logError(error);
        }
    }

    return true;
}

function excludeUnusedFields(tag) {
    var i = 0;
    switch (tag.tagType) {
        case consts.TAG_TYPE.Facility:
            for (i = 0; i < facilityExcludeFields.length; i++) {
                tag[facilityExcludeFields[i]] = undefined;
            }
            break;
        case consts.TAG_TYPE.Scope:
            for (i = 0; i < scopeExcludeFields.length; i++) {
                tag[scopeExcludeFields[i]] = undefined;
            }
            break;
        case consts.TAG_TYPE.Node:
            for (i = 0; i < nodeExcludeFields.length; i++) {
                tag[nodeExcludeFields[i]] = undefined;
            }
            break;
        case consts.TAG_TYPE.Metric:
            for (i = 0; i < metricExcludeFields.length; i++) {
                tag[metricExcludeFields[i]] = undefined;
            }
            break;
        case consts.TAG_TYPE.BPD:
            for (i = 0; i < bpdExcludeFields.length; i++) {
                tag[bpdExcludeFields[i]] = undefined;
            }
            break;
    }
}

/**
 * Build full tag tree from plain tags array
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function buildTagsTree(plainTagsArray, rootTagNodeIds) {
    var fullTreeHierarchy = [];

    var tagsObj = {};
    var thisId = null;
    var i = 0;

    for(i=0; i < plainTagsArray.length; i++) {
        thisId = plainTagsArray[i]._id.toString();
        excludeUnusedFields(plainTagsArray[i]);
        tagsObj[thisId] = plainTagsArray[i];
    }
    //plainTagsArray = null;

    rootTagNodeIds = _.map(rootTagNodeIds, function (id) {
        return id.toString();
    });

    for(var id in tagsObj) {
        if(tagsObj[id] && rootTagNodeIds.indexOf(id)> -1) {
            buildTagsRecuriveTraversal(tagsObj, tagsObj[id]);
            fullTreeHierarchy.push(tagsObj[id]);
        }
    }
    tagsObj = null;

    function compare(a,b) {
        return a.name.localeCompare(b.name);
    }

    fullTreeHierarchy.sort(compare);

    return fullTreeHierarchy;
}

/**
 * Get all tags with full-hierarchy for specified entity such as User , Dashbard, Presentation
 *
 * @access  public
 * @param   string
 * @param   string
 * @param   array
 * @param   string
 * @param   callback
 * @return  void
 */
function getTagsFullHierarchyByEntityIds(objectType, entityIds, tagType, findNameMask, 
                                        returntagsTree, pager, finalCallback) {
    if(!finalCallback) {
        finalCallback = pager;
        pager = {limit: null, offset: null};

        if(!finalCallback) {
            finalCallback = returntagsTree;
            returntagsTree = true;
        }
    }

    getTagsByEntityIds(objectType, entityIds, tagType, findNameMask, function(err, resultTags) {
        if (err) {
            finalCallback(err);
        } else {
            async.map(entityIds, function(entityId, entityIdsCallback) {
                var topLevelTagIds;
                var start = pager.offset ? parseInt(pager.offset) : 0;
                if (pager.limit) {
                    var end = start + parseInt(pager.limit);
                    topLevelTagIds = _.chain(resultTags[entityId]).sortBy("name")
                                        .slice(start, end).pluck("_id").value();
                } else {
                    topLevelTagIds = _.chain(resultTags[entityId]).sortBy("name").slice(start).pluck("_id").value();
                }
                
                findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                    if (err) {
                        entityIdsCallback(err);
                    } else if (returntagsTree) {
                        var tagTreeCollection = buildTagsTree(plainTagsArray, topLevelTagIds);
                        var tagFullHierarchy = {
                            entityId: entityId,
                            fullTagHierarchy: tagTreeCollection,
                            plainTagsArray: plainTagsArray
                        };
                        entityIdsCallback(null, tagFullHierarchy);
                    } else {
                        //do not build tree, return array with all tags
                        entityIdsCallback(null, {
                            entityId: entityId,
                            fullTagHierarchy: plainTagsArray
                        });
                    }
                });

            }, function(err, results) {
                if (err) {
                    finalCallback(err);
                } else {
                    var tagFullHierarchy = {};
                    results.forEach(function(result) {
                        tagFullHierarchy[result.entityId] = result.fullTagHierarchy;
                    });
                    finalCallback(null, tagFullHierarchy);
                }
            });
        }
    });
}

function isTagAcessibleByUser(tagId, user, finalCallback) {
    if(!user) {
        finalCallback(null, true);
    } else if(user.role === consts.USER_ROLES.BP) {
        finalCallback(null, true);
    } else {
        //find user tags and find that tagId
        var userId = user._id.toString();
        getTagsFullHierarchyByEntityIds(consts.USER_WITH_ACCESS_TYPE.USER, [userId], null, null, false,
            function (tagsErr, tagsFullHierarchy) {
                if(tagsErr) {
                    finalCallback(tagsErr);
                } else {
                    var accessibleTagsId = _.map(tagsFullHierarchy[userId], function(item) {
                        return item._id.toString();
                    });

                    finalCallback(null, accessibleTagsId.indexOf(tagId.toString()) > -1); 
                        // tagId.toString conversion to fix the bug - always returned false due to type difference, 
                        // thus failing create, edit delete tag operation by users (admin and tm)
                }
            });
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
function getTagByIdIfAllowed(selectedTagId, currentUser, callback) {
    if (!callback) {
        //current user is optional, so callback will be undefined and real callback will be currentUser object
        callback = currentUser;
        currentUser = null;
    }

    var notFoundErr = new Error(consts.SERVER_ERRORS.TAG.TAG_DOES_NOT_EXIST + selectedTagId);
    notFoundErr.status = 422;

    Tag.findById(selectedTagId, function (err, foundTag) {
        if (err) {
            callback(err, null);
        } else if (!foundTag) {
            callback(notFoundErr);
        }
        else {
            isTagAcessibleByUser(selectedTagId, currentUser, function (accessErr, accessResult) {
                if (accessErr) {
                    callback(accessErr);
                } else if (!accessResult) {
                    callback(notFoundErr);
                } else {
                    callback(null, foundTag);
                }

            });
        }
    });
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
function getTagsByFilter(filter, currentUser, callback) {

    var params = {
        $and: []
    };
    for(var key in filter) {
        if(key && filter[key]) {
            var val = filter[key];
            var obj = {};
            obj[key] = {$regex: new RegExp(val, "i")};
            params.$and.push(obj);
        }
    }

    if (currentUser.role !== consts.USER_ROLES.BP) {
        params.$and.push({usersWithAccess: {
            $elemMatch: {
                id: mongoose.Types.ObjectId(currentUser._id)
            }
        }});
    }

    getTagsByParams(params, function(err, topLevelTags) {
        if (err) {
            return callback(err);
        }
        var topLevelTagIds = _.pluck(topLevelTags, "_id");
        findTagsRecursive(topLevelTagIds, [], function(err, plainTags) {
            if(err) {
                return callback(err);
            }
            var tagTreeCollection = buildTagsTree(plainTags, topLevelTagIds);
            callback(null, tagTreeCollection);
        });
    });
}

/**
 * Descriptions here
 *
 * @access  public
 * @param   object
  * @return  string
 */

function makeDatacoreMetricID(tagObj) {
    var datacoreMetricID = null;
    if (tagObj.tagType === consts.TAG_TYPE.Metric) {
        switch (tagObj.name) {
            case consts.METRIC_NAMES.Watts:
                datacoreMetricID = "W";
                break;
            case consts.METRIC_NAMES.kW:
                datacoreMetricID = "kW";
                break;
            case consts.METRIC_NAMES.Wh:
                datacoreMetricID = "Wh";
                break;
            case consts.METRIC_NAMES.kWh:
                datacoreMetricID = "kWh";
                break;
            case consts.METRIC_NAMES.Reimbursement:
                datacoreMetricID = "R";
                break;
            case consts.METRIC_NAMES.WattsMin:
                datacoreMetricID = "MinW";
                break;
            case consts.METRIC_NAMES.WattsMax:
                datacoreMetricID = "MaxW";
                break;
            case consts.METRIC_NAMES.Temperature:
                datacoreMetricID = "Temp";
                break;
            default:
                datacoreMetricID = tagObj.metricID;
        }
    }
    return datacoreMetricID;
}

/**
 * Descriptions here
 *
 * @access  public
 * @param   object
 * @param   callback
 * @return  void
 */

function createExternalID(tagObj, callback) {
    var nodeId = tagObj.parents[0].id;
    var externalNodeId = "", externalScopeId = "";
    Tag.findById(nodeId, function(nodeErr, foundNode) {
        if (nodeErr) {
            callback(nodeErr, null);
        } else {
            externalNodeId = foundNode.deviceID;
            var scopeId = foundNode.parents[0].id;
            Tag.findById(scopeId, function(scopeErr, foundScope) {
                if (scopeErr) {
                    callback(scopeErr);
                } else {
                    externalScopeId = foundScope.deviceID;
                    callback(null, externalScopeId + "-" + externalNodeId + "-" + tagObj.datacoreMetricID);
                }
            });
        }
    });
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
function editTag(tagId, tagObj, currentUser, callback) {
    delete tagObj._id;
    //delete dataSourceObj.tags;
    var error;

    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_EDIT_TAG);
        error.status = 422;
        callback(error, null);
    } else {


        async.waterfall([
            function(cb) {
                getTagByIdIfAllowed(tagId, currentUser, cb);
            },
            function(foundTag, cb) {
                var paramsToChange = Object.keys(tagObj);

                paramsToChange.forEach(function (param) {
                    foundTag[param] = tagObj[param];
                });

                setTagTimeZone(foundTag, function (tzErr) {
                    if (tzErr) {
                        cb(tzErr);
                    } else {
                        foundTag.save(cb);
                    }
                });
            },
            function(savedTag, updated, cb) {
                //find metrics by parent
                var condition = {$and: [
                    {tagType: consts.TAG_TYPE.Metric},
                    {parents: {$elemMatch: {id: savedTag._id}}}
                ]};

                getTagsMongooseByParams(condition, function(foundErr, foundMetrics) {
                    cb(foundErr, savedTag, foundMetrics);
                });
            },
            function(parent, metrics, cb) {
                //update metrics
                _.each(metrics, function(m) {
                    copyFieldsFromParentsToMetric(m, [parent]);
                });

                async.each(metrics, function(metric, next) {
                    metric.save(next);
                }, function(err) {
                    if(err) {
                        cb(err);
                    } else {
                        cb(null, parent);
                    }
                });
            }
        ], function(finalErr, finalRes) {
            cacheHelper.delWildcardKey(BP_TAGS_CACHE_KEY, function(deletecacheErr) {
               if(deletecacheErr) {
                   return callback(deletecacheErr);
               } else {
                   callback(finalErr, finalRes);
               }
            });
        });
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
function isAllowedTagTypeRelationship(childType, parentType, finalCallback) {
    async.waterfall([
        function (callback) {
            tagRuleDAO.getRules(callback);
        },
        function (tagRules, callback) {
            var childrenTagRules = _.filter(tagRules, function (tagRule) {
                return tagRule.tagType  === childType;
            });
            var parentTagRules = _.filter(tagRules, function (tagRule) {
                return tagRule.tagType  === parentType;
            });

            if(childrenTagRules.length > 0) {
                var allowedParentTagTypes = _.map(childrenTagRules[0].allowedParentTagTypes, function (allowedTag) {
                    return allowedTag.toLowerCase();
                });
                if (allowedParentTagTypes.indexOf(parentType.toLowerCase()) <= -1) {
                    callback(null, false);
                }
            }
            if(parentTagRules.length > 0) {
                var allowedChildrenTagTypes = _.map(parentTagRules[0].allowedChildrenTagTypes, function (allowedTag) {
                    return allowedTag.toLowerCase();
                });
                if (allowedChildrenTagTypes.indexOf(childType.toLowerCase()) <= -1) {
                    callback(null, false);
                }
            }
            callback(null, true);
        }
    ], function(error, result) {
        if (error) {
            finalCallback(error, null);
        }
        else {
            finalCallback(null, result);
        }
    });
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
function isValidTagType(tagType) {
    return consts.TAG_TYPES.indexOf(tagType) >= 0;
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
function createTag(tagObj,  currentUser, finalCallback) {
    delete tagObj._id;
    //delete dataSourceObj.tags;
    //console.log(tagObj);

    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CREATE_TAG);
        error.status = 422;
        return finalCallback(error, null);
    } else {
        // Making sure the tag to be created has a valid tagType
        if ((!tagObj.tagType) || (!isValidTagType(tagObj.tagType))) {
            return finalCallback(consts.SERVER_ERRORS.TAG.INVALID_TAG_TYPE, null);
        }

        var parentType = null;
        var parentId = null;

        // Checking the tagObj"s parent tagType
        if (!tagObj.parents || tagObj.parents.length < 1) {
            parentType = consts.NO_PARENT_TAG_TYPE;
        } else {
            parentType = tagObj.parents[0].tagType;
            parentId = tagObj.parents[0].id;
        }

        async.waterfall([
            function (callback) {
                isAllowedTagTypeRelationship(tagObj.tagType, parentType, callback);
            },
            function (isAllowedTagTypeRelationship, callback) {
                if (!isAllowedTagTypeRelationship) {
                    return callback(consts.SERVER_ERRORS.TAG.NOT_ALLOWED_TAG_TYPES_RELATIONSHIP, null);
                }
                callback(null, isAllowedTagTypeRelationship);
            },
            function (isAllowedTagTypeRelationship, callback) {
                if (parentId) {
                    getTagByIdIfAllowed(parentId, currentUser, callback);
                } else {
                    callback(null, null);
                }
            },
            function (parentTag, callback) {
                if (parentTag) {
                    //copy aall parents from parent tag to child
                    var parents = parentTag.parents;
                    if(parents.length > 0) {
                        //parent has own parents
                        tagObj.parents = _.union(tagObj.parents, parents);
                    }
                }

                //find all parents for extracting values
                var allParentsId = _.map(tagObj.parents, function(p) {
                    return p.id.toString();
                });
                if(allParentsId.length === 0 ) {
                    callback(null, parentTag, []);
                } else {
                    getTagsByParams({_id: {$in: allParentsId}}, function(getTagsErr, allParents) {
                        callback(getTagsErr, parentTag, allParents);
                    });
                }
            },
            function(parentTag, allParents, callback) {
                setTagTimeZone(tagObj, function(err) {
                    callback(err, parentTag, allParents);
                });
            },
            function (parentTag, allParents, callback) {
                tagObj.creatorRole = currentUser.role;
                tagObj.creator = currentUser._id;
                tagObj.usersWithAccess = [];
                tagObj.creationTime = new Date();

                if (currentUser.role !== consts.USER_ROLES.BP) {
                    tagObj.usersWithAccess.push({id: currentUser._id.toString()});
                }

                copyFieldsFromParentsToMetric(tagObj, allParents);

                var thisTagObjModel = new Tag(tagObj);
                thisTagObjModel.save(function (err, savedTag) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null, savedTag, parentTag);
                    }
                });
            },
            function (savedTag, parentTag, callback) {
                if (parentTag) {
                    var childObj = {tagType: savedTag.tagType, id: savedTag._id.toString()};

                    // Taking care of the 2-way binding
                    parentTag.children.push(childObj);

                    editTag(parentTag._id, parentTag, currentUser, function (editErr, editResponse) {
                        if (editErr) {
                            callback(editErr, null);
                        } else {
                            callback(null, savedTag);
                        }
                    });
                } else {
                    callback(null, savedTag);
                }
            }, function (savedTag, callback) {
                if(currentUser.role !== consts.USER_ROLES.BP) {
                    var tagObjectUser = {id: savedTag._id.toString(), tagType: savedTag.tagType};

                    // The current user, who is also the creator of the new tag,
                    // was added to the "usersWithAccess" array field of this tag.
                    // We now need to take care of adding the new tag to this user"s "accessibleTags" array field.
                    userDAO.addTagToAccessibleArray(currentUser, tagObjectUser, function (updateErr, updatedUser) {
                        if (updateErr) {
                            callback(updateErr, null);
                        } else {
                            callback(null, savedTag);
                        }
                    });
                } else {
                    callback(null, savedTag);
                }
            }
        ], function (createTagError, savedTag) {
            if (createTagError) {
                finalCallback(createTagError, null);
            } else {
                cacheHelper.delWildcardKey(BP_TAGS_CACHE_KEY, function(deletecacheErr) {
                    if(deletecacheErr) {
                        return finalCallback(deletecacheErr);
                    } else {
                        finalCallback(null, savedTag);
                    }
                });
            }
        });
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
function isDeletable(idArray, currentUser, finalCallback) {
    var allResults = [];
    async.each(idArray, function(id, isDeletableCallback) {
        async.waterfall([
            function (callback) {
                getTagByIdIfAllowed(id, currentUser, callback);
            },
            function (foundTag, callback) {
                var answer = {
                    id: id,
                    isDeletable: false,
                    name: foundTag.name
                };

                if (foundTag.appEntities.length > 0) {
                    // A tag isn't deletable if it has app entities using it.
                    answer.isDeletable = false;
                    callback(null, [answer]);
                } else {
                    answer.isDeletable = true;
                            
                    if(foundTag.children.length > 0) {
                        allResults.push(answer);
                        // check children can be deleted
                        var childIdArray = _.pluck(foundTag.children, "id");
                        isDeletable(childIdArray, currentUser, callback);
                    }
                    else {
                        // Can be deleted
                        // Make sure to delete reference from any app entitty and/or parent
                        callback(null, [answer]);
                    }
                }
            }
        ], function (error, result) {
            if (error) {
                isDeletableCallback(error, null);
            } else {
                if(Array.isArray(result)) {
                    allResults = allResults.concat(result);
                }
                else {
                    allResults.push(result);
                }
                isDeletableCallback(null, allResults);
            }
        });
    }, function(finalErr) {
        if (finalErr) {
            finalCallback(finalErr, null);
        } else {
            allResults = _.uniq(allResults);
            finalCallback(null, allResults);
        }
    });
}

/**
 * Delete tags in Ids array
 *
 * @access  public
 * @param   array of tagId
 * @param   user object
 * @param   callback
 * @return  void
 */
function deleteTagById(idArray, currentUser, finalCallback) {
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_DELETE_TAG);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                getTagsByParams({_id: {$in: idArray}}, callback);
            },
            function (foundTags, callback) {
                var incorrect = _.filter(foundTags, function(tag) {
                    return tag.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP;
                });
                if(incorrect.length > 0) {
                    error = new Error(consts.SERVER_ERRORS.TAG.ONLY_BP_CAN_DELETE_TAG);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, foundTags);
                }
            },
            /*
            function (foundTags, currentUser, callback) {
                var tagIds = _.map(foundTags, function(tag) {
                    return tag._id.toString();
                });

                isDeletable(tagIds, currentUser, function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        var usedIds = [];
                        for(var prop in results) {
                            if(results[prop]) {
                                var item = results[prop];
                                if(!item.isDeletable) {
                                    usedIds.push(prop);
                                }
                            }
                            if(usedIds.length > 0) {
                                error = new Error(consts.TAG_IS_BEING_USED + ": " + usedIds);
                                error.status = 422;
                                callback(error, null);
                            } else {
                                callback(null, tagIds);
                            }
                        }
                        if(usedIds.length > 0) {
                            callback(new Error(consts.TAG_IS_BEING_USED + ": " + usedIds), null);
                        } else {
                            callback(null, tagIds);
                        }
                    }
                });
            },
            function (tagIds, callback) {
                async.each(tagIds, function(currId, tagsCallback) {
                    async.waterfall([
                        function(tagCallback) {
                            getTagById(currId, tagCallback);
                        },
            */
            function (foundTags, callback) {
                async.each(foundTags, function(foundTag, tagsCallback) {
                    async.waterfall([
                        function(tagCallback) {
                            tagCallback(null, foundTag);
                        },
                        function(currTag, tagCallback) {
                            if (currTag.usersWithAccess.length > 0) {
                                var tagObject = {id: currTag._id.toString(), tagType: currTag.tagType};
                                userDAO.removeTagFromAllUsersWithAccess(tagObject,
                                    _.pluck(currTag.usersWithAccess, "id"),
                                    function (updateErr, updateResult) {
                                        if (updateErr) {
                                            tagCallback(updateErr, null);
                                        } else {
                                            //tagCallback(null, updateResult);
                                            tagCallback(null, currTag);
                                        }
                                    }
                                );
                            } else {
                                tagCallback(null, currTag);
                            }
                        },
                        function (currTag, tagCallback){
                            if (currTag.children.length > 0) {
                                async.each(currTag.children, function(childTag, childCallback)
                                {
                                    var paretTag = {"id" : currTag._id, "tagType" : currTag.tagType};
                                    Tag.update(
                                        {_id: childTag.id},
                                        {$pull: {parents: paretTag}}).exec(childCallback);
                                }, function(updateError, updateResult) {
                                    if (updateError) {
                                        tagCallback(updateError, null);
                                    } else {
                                        tagCallback(null, currTag);
                                    }
                                });
                            } else {
                                tagCallback(null, currTag);
                            }
                        },
                        function(currTag, tagCallback) {
                            if (currTag.parents.length > 0) {
                                async.each(currTag.parents, function(parentTag, parentCallback) {
                                    var tagObject = {id: currTag._id.toString(), tagType: currTag.tagType};
                                    Tag.update({_id: parentTag.id},
                                        {$pull: {children: tagObject}}).exec(parentCallback);
                                }, function(updateError, updateResult) {
                                    if (updateError) {
                                        tagCallback(updateError, null);
                                    } else {
                                        tagCallback(null, currTag);
                                    }
                                });
                            } else {
                                tagCallback(null, currTag);
                            }
                        }
                    ], function(updatesError, updatesResult) {
                        if (updatesError) {
                            tagsCallback(updatesError, null);
                        } else {
                            tagsCallback(null, updatesResult);
                        }
                    });
                }, function(error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        var removeIds = _.map(foundTags, function(foundTag) {
                            return foundTag._id.toString();
                        });
                        Tag.remove({_id:  {$in: removeIds}}).exec(callback);
                    }
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

/**
 * Delete tags in ID array with children
 *
 * @access  public
 * @param   array of tagId
 * @param   user object
 * @param   callback
 * @return  void
 */
function deleteTagsWithChildren(idArray, currentUser, finalCallback) {
    var deletedIdArray = [];
    async.each(idArray, function(tagId, tagCallback) {
        async.waterfall([
            function(callback) {
                getTagByIdIfAllowed(tagId, currentUser, callback);
            },
            function(foundTag, callback) {
                if(foundTag.children && foundTag.children.length>0) {
                    var childrenIds = _.map(foundTag.children, function(child) {
                        return child.id.toString();
                    });
                    deleteTagsWithChildren(childrenIds, currentUser, callback);
                }
                else {
                    callback(null, []);
                }
            },
            function(removedIds, callback) {
                if(removedIds && removedIds.length>0) {
                    deletedIdArray = deletedIdArray.concat(removedIds);
                    deletedIdArray = _.uniq(deletedIdArray);
                }
                deleteTagById([tagId], currentUser, callback);
            }
        ], function(deleteError, deleteResult) {
            if (deleteError) {
                tagCallback(deleteError, null);
            } else {
                deletedIdArray = deletedIdArray.concat(deleteResult);
                deletedIdArray = _.uniq(deletedIdArray);
                tagCallback(null, deletedIdArray);
            }
        });
    }, function(finalErr, finalResult) {
        if (finalErr) {
            finalCallback(finalErr, null);
        } else {
            cacheHelper.delWildcardKey(BP_TAGS_CACHE_KEY, function(deletecacheErr) {
                if(deletecacheErr) {
                    return finalCallback(deletecacheErr);
                } else {
                    finalCallback(null, deletedIdArray);
                }
            });
        }
    });
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
function validate(tagObj, callback) {
    var tag = new Tag(tagObj);
    tag.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

/**
 * Func will add sensors to parent data logger object
 *
 * @access  private
 * @param   parentDataLoggers
 * @param   allTags
 * @return  {array}
 */
function getChildMapsWithId(ids) {
    var mapIds = _.map(ids, function (id) {
        return id.toString();
    });

    return mapIds;
}

/**
 * Get all tags with full-hierarchy for specified entity such as User , Dashbard, Presentation
 *
 * @access  public
 * @param   string
 * @param   string
 * @param   array
 * @param   string
 * @param   callback
 * @return  void
 */
function getTagsFullHierarchyByEntity(entity, entityType, tagType, findNameMask, finalCallback) {
    var tagBindingArray = [];
    var tmpTags = [];
    var tmpSegment = {};

    if (consts.APP_ENTITY_TYPE.DASHBOARD === entityType || consts.APP_ENTITY_TYPE.ANALYZE_WIDGET === entityType) {

        entity.segments.forEach(function(segment) {
            tmpSegment = {};
            tmpSegment.name = segment.name;
            tmpSegment.id = segment.id;
            tmpSegment.tags = _.pluck(segment.tagBindings, "id");
            //tmpSegment.tags = _.map(tmpSegment.tags, function(tag) {return tag.toString();});
            tagBindingArray.push(tmpSegment);

        });

    } else if (consts.APP_ENTITY_TYPE.PRESENTATION === entityType) {

        tmpTags =  _.pluck(entity.tagBindings, "id");
        //tmpTags = _.map(tmpTags, function(tag) {return tag.toString();});
        tagBindingArray.push({name: entityType, tags: tmpTags});

    } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(entityType) > -1) {

        tmpTags =  _.pluck(entity.accessibleTags, "id");
        //tmpTags = _.map(tmpTags, function(tag) {return tag.toString();});
        tagBindingArray.push({name: entityType, tags: tmpTags});

    } else {

        finalCallback(consts.SERVER_ERRORS.TAG.INVALID_ENTITY_TYPE, null);

    }

    async.map(tagBindingArray, function(tagBinding, tagBindingCallback) {
        async.waterfall([
            /*function(tagCallback) {
             getTagsByTagIds(tagBinding.tags, tagType, findNameMask, tagCallback);
             },*/
            function(tagCallback) {
                var topLevelTagIds = tagBinding.tags;
                findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                    if(err) {
                        tagCallback(err);
                    } else {
                        var tagTreeCollection = buildTagsTree(plainTagsArray, topLevelTagIds);
                        tagCallback(null, tagTreeCollection);
                    }
                });
            }
        ], function(err, tagTreeArray) {
            if (err) {
                tagBindingCallback(err, null);
            } else {
                var formatedTagBinding = {
                    name: tagBinding.name,
                    id: tagBinding.id,
                    tags: tagTreeArray
                };
                tagBindingCallback(null, formatedTagBinding);
            }
        });
    }, function(err, resultTagBindings) {
        if (err) {
            finalCallback(err,null);
        } else {
            finalCallback(null,resultTagBindings);
        }
    });
}

function getAllRootTagsCount(user, filter, finalCallback) {
    if(user.role === consts.USER_ROLES.BP) {
        var params = {
            tagType: consts.TAG_TYPE.Facility 
        };
        if (filter) {
            var regex = new RegExp(filter, "i");
            params.$or = [
                {
                    name: { $regex: regex }
                },
                {
                    displayName: { $regex: regex }
                }
            ];
        }
        getTagsCount(params, finalCallback);
    } else {
        var userId = user._id.toString();
        getTagsByEntityIds(consts.USER_WITH_ACCESS_TYPE.USER, [userId], consts.TAG_TYPE.Facility, filter,
            function(err, resultTags) {
                if(err) {
                    finalCallback(err);
                } else {
                    finalCallback(null, resultTags[userId].length);
                }
            });
    }
}

/**
 * Get all tags with full-hierarchy
 *
 * @access  public
 * @param   object
 * @param   callback
 * @return  void
 */
function getAllTagsFullHierarchy(pager, filter, finalCallback) {
    if(!finalCallback) {
        finalCallback = pager;
        pager = {limit: null, offset: null};
    }

    var cacheKey = BP_TAGS_CACHE_KEY + JSON.stringify(pager) + filter;
    cacheHelper.getCachedElementDataCompressed(cacheKey, null, function(cacheErr, cachedData) {
        if(cacheErr) {
            return finalCallback(cacheErr);
        }

        if(cachedData) {
            return finalCallback(null, cachedData);
        }

        //cache is empty
        async.waterfall([
            function (callback) {
                var params = {
                    tagType: consts.TAG_TYPE.Facility
                };
                if (filter) {
                    var regex = new RegExp(filter, "i");
                    params.$or = [
                        {
                            name: { $regex: regex }
                        },
                        {
                            displayName: { $regex: regex }
                        }
                    ];
                }
                getTagsByParamsPaginated(params, pager, callback);
            },
            function (foundTags, tagCallback) {
                var rootTagIds =  _.pluck(foundTags, "_id");
                findTagsRecursive(rootTagIds, [], function(err, plainTagsArray) {
                    if(err) {
                        tagCallback(err);
                    } else {
                        var tagTreeCollection = buildTagsTree(plainTagsArray, rootTagIds);
                        tagCallback(null, tagTreeCollection);
                    }
                });
            }
        ], function(err, tagTreeArray) {
            if (err) {
                finalCallback(err, null);
            } else {
                cacheHelper.setElementDataInfiniteCompressed(cacheKey, tagTreeArray, function(saveCacheErr) {
                    if(saveCacheErr) {
                        return finalCallback(saveCacheErr);
                    }

                    finalCallback(null, tagTreeArray);
                });

            }
        });
    });


}

/**
 * Visiting tag tree following preorder traversal algorithm (top-to-bottom)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function findTagsRecuriveTraversalA(tag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray) {
    if (tag.tagType === tagType) {
        plainTagsArray.push(tag);
    } else if (("childTags" in tag) && (tag.childTags.length)) {
        tag.childTags.forEach(function(childTag) {
            if ((childTag.tagType === tagType) && (! _.contains(plainTagIdsArray, childTag._id.toString()))) {
                plainTagsArray.push(childTag);
                plainTagIdsArray.push(childTag._id.toString());
            } else {
                findTagsRecuriveTraversalA(childTag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray);
            }
        });
    }
    return;
}

/**
 * Visiting tag tree following preorder traversal algorithm (bottom-to-top)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function findTagsRecuriveTraversalB(tag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray, finalCallback) {
    async.eachSeries(tag.parents, function(parent, callback){
        getTagByIdIfAllowed(parent.id.toString(), function(err, parentTag) {
            if ((parentTag.tagType === tagType) && (! _.contains(plainTagIdsArray, parentTag._id.toString()))) {
                plainTagsArray.push(parentTag);
                plainTagIdsArray.push(parentTag._id.toString());
                callback(null);
            } else {
                findTagsRecuriveTraversalB(parentTag, tagType, isTopToBottom,
                    plainTagsArray, plainTagIdsArray, finalCallback);
            }
        });
    }, function(err) {
        finalCallback(null, plainTagsArray);
    });
}

/**
 * Get plain tags array by calling recursive traversal function for specified tag tree
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getPlainTagsArray(tag, tagType, finalCallback) {
    var plainTagIdsArray = [];

    if(consts.TAG_TYPES.indexOf(tag.tagType) <= consts.TAG_TYPES.indexOf(tagType)) {
        var plainTagsArray = [];

        findTagsRecuriveTraversalA(tag, tagType, true, plainTagsArray, plainTagIdsArray);
        finalCallback(null, plainTagsArray);
    } else {
        findTagsRecuriveTraversalB(tag, tagType, false, [], plainTagIdsArray, finalCallback);
    }
}

/**
 * Filtering tags by tag type
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function filterTagsByType(tags, tagType, finalCallback) {
    if (! isValidTagType(tagType)) {
        finalCallback(consts.SERVER_ERRORS.TAG.INVALID_TAG_TYPE, null);
    }

    async.map(tags, function(tag, tagCallback) {
        getPlainTagsArray(tag, tagType, tagCallback);
    }, function(err, filteredTags) {
        if (err) {
            finalCallback(err);
        } else {
            filteredTags = _.uniq(_.flatten(filteredTags), function(obj) { return obj._id.toString(); });
            finalCallback(null, filteredTags);
        }
    });
}

/**
 * Func will add sensors to parent data logger object
 *
 * @access  private
 * @param   parentDataLoggers
 * @param   allTags
 * @return  {array}
 */
function getDataLoggersBySensors(parentDataLoggers, allTags) {

    var allDataLoggers = [];

    for(var i=0; i < parentDataLoggers.length; i++) {
        var dataLogger = parentDataLoggers[i];

        dataLogger.childTags = [];

        var childTagIds = _.pluck(dataLogger.children, "id");
        childTagIds = getChildMapsWithId(childTagIds);

        for(var j=0; j < allTags.length; j++) {
            if(allTags[j].tagType === consts.TAG_TYPE.Node && _.contains(childTagIds, allTags[j]._id.toString())) {
                dataLogger.childTags.push(allTags[j]);
            }
        }

        allDataLoggers.push(dataLogger);
    }

    return allDataLoggers;
}

/**
 * Func will add metrics to sensors and sensors to parent data logger object
 *
 * @access  private
 * @param   foundSensors
 * @param   foundDataLoggers
 * @param   allTags
 * @return {array}
 */
function getDataLoggersByMetrics(foundSensors, foundDataLoggers, allTags) {
    var allDataLoggers = [];

    for(var i=0; i < foundDataLoggers.length; i++) {
        var dataLogger = foundDataLoggers[i];
        dataLogger.childTags = [];

        var childTagIds = _.pluck(dataLogger.children, "id");
        childTagIds = getChildMapsWithId(childTagIds);

        for(var j=0; j < foundSensors.length; j++) {
            var sensor = foundSensors[j];
            if(sensor.tagType === consts.TAG_TYPE.Node && _.contains(childTagIds, sensor._id.toString())) {
                sensor.childTags = [];

                var sensorchildTagIds = _.pluck(sensor.children, "id");
                sensorchildTagIds = getChildMapsWithId(sensorchildTagIds);

                for(var k =0;k < allTags.length; k++) {
                    if(allTags[k].tagType === consts.TAG_TYPE.Metric &&
                        _.contains(sensorchildTagIds, allTags[k]._id.toString())) {
                        sensor.childTags.push(allTags[k]);
                    }
                }

                dataLogger.childTags.push(sensor);
            }
        }

        allDataLoggers.push(dataLogger);
    }

    return allDataLoggers;
}

/**
 * Filtering tags by tag type (will be deprecated soon. this is un-scalable proc)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function filterTagsByTypeA(tags, fromType, toType, finalCallback) {
    if (!isValidTagType(fromType) || !isValidTagType(toType)) {
        finalCallback(consts.SERVER_ERRORS.TAG.INVALID_TAG_TYPE, null);
    } else {

        var tagParams = [];

        if (fromType === consts.TAG_TYPE.Facility) {
            var allDataLoggers = [];
            var allDataLoggersId = [];

            tags.forEach(function(tag) {
                tag.childTags.forEach(function(childTag) {
                    if (! _.contains(allDataLoggersId,childTag._id.toString())) {
                        allDataLoggers.push(childTag);
                        allDataLoggersId.push(childTag._id);
                    }
                });
            });

            finalCallback(null, allDataLoggers);
        }

        tags.forEach(function(tag) {
            if(tag.tagType === fromType) {
                tagParams.push(tag.parents[0].id);
            }
        });

        tagParams = _.uniq(tagParams, function (obj) {
            return obj.id.toString();
        });

        //find parents
        getTagsByParams({_id: {$in: tagParams }}, function(err, foundParents){
            if(err) {
                finalCallback(err);
            } else {
                if (fromType === consts.TAG_TYPE.Node) {
                    var allDataLoggers = getDataLoggersBySensors(foundParents, tags);
                    finalCallback(null, allDataLoggers);
                } else if(fromType === consts.TAG_TYPE.Metric) {

                    //need find data loggers
                    var secondLevelParentId = [];
                    foundParents.forEach(function(tag) {
                        secondLevelParentId.push(tag.parents[0].id);

                    });

                    getTagsByParams({_id: {$in: secondLevelParentId }}, function(secondLevelErr, foundTopLevelParents){
                        if(secondLevelErr) {
                            finalCallback(secondLevelErr);
                        } else {
                            var allDataLoggers = getDataLoggersByMetrics(foundParents, foundTopLevelParents, tags);
                            finalCallback(null, allDataLoggers);
                        }
                    });
                }
            }
        });
    }
}

/**
 * Recursive function for getting all tags by visiting every node in abstract tag tree (abstract means db relation)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getMetricsFromTags(objectType, entityId, tagType, findNameMask, finalCallback) {
    getTagsByEntityIds(objectType, [entityId], tagType, findNameMask, function(err, results) {
        if (err) {
            finalCallback(err);
        }
        else {
            var topLevelTagIds = _.pluck(results[entityId], "_id");
            findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                if(err) {
                    finalCallback(err);
                } else {
                    var metrics = _.filter(plainTagsArray, function(tag) {
                        return tag.tagType === consts.TAG_TYPE.Metric;
                    });
                    var uniqMetrics = _.uniq(metrics, "name");
                    finalCallback(null, uniqMetrics);
                }
            });
        }

    });
}

/**
 * Get all tags by entityId and filtered tagType
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByTagIds(tagIds, tagType, findNameMask, finalCallback) {
    async.waterfall([
        function(callback) {
            Tag.find({_id: {$in: tagIds}}).lean().exec(callback);
        },
        function(currentTags, callback) {
            var re = null;
            if(findNameMask) {
                re = new RegExp(findNameMask, "i");
            }

            var thisTags = [];
            for(var i=0; i < currentTags.length; i++) {
                var nameCheck = findNameMask? re.test(currentTags[i].name) : true;

                if (nameCheck && (thisTags.tagType === tagType || tagType === null)) {
                    thisTags.push(currentTags[i]);
                }
            }
            callback(null, thisTags);
        }
    ], function(error, tagResults) {
        if (error) {
            finalCallback(error, null);
        } else {
            finalCallback(null, tagResults);
        }
    });
}

function deleteChildbyId(tagId, childrenId, callback) {
    Tag.find({_id: new ObjectId(childrenId)})
        .lean()
        .exec(function(err, result) {
            if (err) {
                callback(err, null);
            } else {
                if (result.length === 0) {
                    Tag.update(
                        {_id: new ObjectId(tagId)},
                        {$pull: {children: {id: childrenId}}}).exec(callback);
                } else {
                    callback(null, result);
                }
            }
        });
}

/**
 *
 * @access  private
 * @param   tag Object
 * @return  accessibleUsers Array
 */
function getPopulatedUsersWithAccess(tag, callback) {
    if (typeof tag === "undefined" || tag === null) {
        var error = new Error("Empty Tag");
        error.status = 422;
        callback(error);
    } else if (typeof tag.parents === "undefined" || tag.parents === null || tag.parents.length === 0) {
        var callbackParam = tag.toObject().usersWithAccess;
        callback(null, callbackParam);
    } else {
        var mergedUsers = tag.toObject().usersWithAccess;
        async.each(tag.parents, function(parentObj, cb) {
            getTagByIdIfAllowed(parentObj.id, function(err, parentTag) {
                if (err) {
                    cb(err);
                } else {
                    getPopulatedUsersWithAccess(parentTag, function(err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            if (typeof mergedUsers === "undefined" || mergedUsers === null) {
                                mergedUsers = result;
                            } else {
                                mergedUsers = _.union(mergedUsers, result);
                            }
                            cb(null);
                        }
                    });
                }
            });
        }, function(err) {
            if (err) {
                callback(err);
            } else {
                if (typeof mergedUsers !== "undefined" && mergedUsers !== null) {
                    mergedUsers = _.uniq(mergedUsers, function(user) {return user.id.toString();});
                    mergedUsers = _.without(mergedUsers, null, undefined);
                }
                callback(null, mergedUsers);
            }
        });
    }
}

/**
 *
 * @access  private
 * @param   tag Object
 * @param   callback
 * @return  void
 */
function populateAccessibleUsersForTag(tag, callback) {
    getPopulatedUsersWithAccess(tag, function(err, users) {
        if (err) {
            callback(err);
        } else {
            if (typeof users === "undefined" || users === null || users.length === 0) {
                callback(new Error("Got Null Collection for usersWithAccess"));
            } else {
                async.map(users, function(user, cb) {
                    var userId = user.id || user._id;
                    userDAO.getUserByIdIfAllowed(userId, function(err, foundUser) {
                        if (err) {
                            cb(null, null);
                        } else {
                            cb(null, foundUser);
                        }
                    });
                }, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
            }
        }
    });
}

/**
 *
 * @access  private
 * @param   tag Object
 * @return  accessibleUsers Array
 */
function getPopulatedUsersWithAccess(tag, callback) {
    if (typeof tag === "undefined" || tag === null) {
        var error = new Error("Empty Tag");
        error.status = 422;
        callback(error);
    } else if (typeof tag.parents === "undefined" || tag.parents === null || tag.parents.length === 0) {
        var callbackParam = tag.toObject().usersWithAccess;
        callback(null, callbackParam);
    } else {
        var mergedUsers = tag.toObject().usersWithAccess;
        async.each(tag.parents, function(parentObj, cb) {
            getTagByIdIfAllowed(parentObj.id, function(err, parentTag) {
                if (err) {
                    cb(err);
                } else {
                    getPopulatedUsersWithAccess(parentTag, function(err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            if (typeof mergedUsers === "undefined" || mergedUsers === null) {
                                mergedUsers = result;
                            } else {
                                mergedUsers = _.union(mergedUsers, result);
                            }
                            cb(null);
                        }
                    });
                }
            });
        }, function(err) {
            if (err) {
                callback(err);
            } else {
                if (typeof mergedUsers !== "undefined" && mergedUsers !== null) {
                    mergedUsers = _.uniq(mergedUsers, function(user) {return user.id.toString();});
                    mergedUsers = _.without(mergedUsers, null, undefined);
                }
                callback(null, mergedUsers);
            }
        });
    }
}

/**
 *
 * @access  private
 * @param   tag Object
 * @param   callback
 * @return  void
 */
function populateAccessibleUsersForTag(tag, callback) {
    getPopulatedUsersWithAccess(tag, function(err, users) {
        if (err) {
            callback(err);
        } else {
            if (typeof users === "undefined" || users === null || users.length === 0) {
                callback(new Error("Got Null Collection for usersWithAccess"));
            } else {
                async.map(users, function(user, cb) {
                    var userId = user.id || user._id;
                    userDAO.getUserByIdIfAllowed(userId, function(err, foundUser) {
                        if (err) {
                            cb(null, null);
                        } else {
                            cb(null, foundUser);
                        }
                    });
                }, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
            }
        }
    });
}

function clone(sourceTag, user, allowedMetrics, finalCallback) {
    var rootTagIds =  [sourceTag._id.toString()];
    findTagsRecursive(rootTagIds, [], function(err, plainTagsArray) {
        if(err) {
            finalCallback(err);
        } else {
            //clear someIds and restore ids
            var tagsObj = {};
            var i = 0, j= 0, k=0;
            var thisId = null;
            var newId = null;

            var result = [];

            //save ids
            for(i=0; i < plainTagsArray.length; i++) {
                thisId = plainTagsArray[i]._id.toString();
                newId = new ObjectId();

                //set new Id
                plainTagsArray[i]._id = newId;

                //clear relationship Id
                plainTagsArray[i].appEntities = [];
                plainTagsArray[i].usersWithAccess = [];

                plainTagsArray[i].creator = user._id;
                plainTagsArray[i].creatorRole = user.role;

                //add if it is not metric or if it is metric with allowed name
                if(plainTagsArray[i].tagType !== consts.TAG_TYPE.Metric || allowedMetrics.length ===0 ||
                    (plainTagsArray[i].tagType === consts.TAG_TYPE.Metric && allowedMetrics.length > 0 &&
                    allowedMetrics.indexOf(plainTagsArray[i].name) > 0)) {

                    tagsObj[thisId] = newId.toString();
                    result.push(plainTagsArray[i]);
                }
            }


            //replace child/parent id
            for(i=0; i < result.length; i++) {
                for(j=result[i].parents.length -1; j >= 0; j--) {
                    if(tagsObj[result[i].parents[j].id]) {
                        result[i].parents[j].id = tagsObj[result[i].parents[j].id.toString()];
                    } else {
                        result[i].parents.splice(j, 1);
                    }
                }

                for(k=result[i].children.length -1 ; k >= 0; k--) {
                    if(tagsObj[result[i].children[k].id]) {
                        result[i].children[k].id = tagsObj[result[i].children[k].id.toString()];
                    } else {
                        result[i].children.splice(k, 1);
                    }
                }
            }

            tagsObj = null;
            plainTagsArray = null;
            finalCallback(null, result);
        }
    });
}

function isUniqueTag(deviceId, callback) {
    getTagsByParams({$and: [{deviceID: deviceId}, {fake: false}]}, function(err, foundTags) {
        if(err) {
            return callback(err);
        }

        return callback(null, foundTags.length === 0);
    });
}

exports.getTagByIdIfAllowed = getTagByIdIfAllowed;
exports.getTagsByTagIds = getTagsByTagIds;
exports.getTagsByEntityIds = getTagsByEntityIds;

exports.getTagsFullHierarchyByEntityIds = getTagsFullHierarchyByEntityIds;
exports.getTagsFullHierarchyByEntity = getTagsFullHierarchyByEntity;
exports.getAllTagsFullHierarchy = getAllTagsFullHierarchy;
exports.findTagsRecursive = findTagsRecursive;

exports.validate = validate;
exports.deleteTagById = deleteTagById;
exports.createTag = createTag;
exports.editTag = editTag;
exports.isDeletable = isDeletable;
exports.getTagsByParams = getTagsByParams;
exports.filterTagsByType = filterTagsByType;
exports.populateAccessibleUsersForTag = populateAccessibleUsersForTag;
exports.makeDatacoreMetricID = makeDatacoreMetricID;
exports.createExternalID = createExternalID; 

exports.deleteChildbyId = deleteChildbyId;
exports.deleteTagsWithChildren = deleteTagsWithChildren;

//will be deprecated soon
exports.filterTagsByTypeA = filterTagsByTypeA;
exports.getMetricsFromTags = getMetricsFromTags;
//exports.getDataLoggersBySensors = getDataLoggersBySensors;
//exports.getDataLoggersByMetrics = getDataLoggersByMetrics;
exports.buildTagsTree = buildTagsTree;
exports.clone = clone;
exports.isUniqueTag = isUniqueTag;
exports.setTagTimeZone = setTagTimeZone;
exports.copyFieldsFromParentsToMetric = copyFieldsFromParentsToMetric;
exports.getAllRootTagsCount = getAllRootTagsCount;
exports.getTagsByFilter = getTagsByFilter;

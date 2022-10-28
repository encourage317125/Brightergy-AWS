"use strict";

var mongoose = require("mongoose"),
    consts = require("./consts"),
    async = require("async"),
    _ = require("lodash"),
    ObjectId = mongoose.Types.ObjectId,
    log = require("./log")(module),
    Tag = mongoose.model("tag")/*,
    Dashboard = mongoose.model("ds_dashboard")*/;

// --------------------------------------------------------------------------------------------------

/**
 * Get bind pair
 * 
 * @param    {string} objectType
 * @param    {string} objectId
 * @return   {object}
 */
function getObjectBindPair(objectType, objectId) {

    var objectBindPair = null;

    if(consts.ENTITY_TYPES.indexOf(objectType) > -1) {
        //var fieldName = consts.TAG_ENTITIES_FIELD_NAMES[objectType];

        if (consts.APP_ENTITY_TYPES.indexOf(objectType) > -1) {
            objectBindPair = {id: new ObjectId(objectId), appName: objectType};
        } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) > -1) {
            objectBindPair = {id: new ObjectId(objectId)};
        }
    }
    return objectBindPair;
}

// --------------------------------------------------------------------------------------------------

/**
 * Get tags query for updating object
 * 
 * @param    {string} objectType
 * @param    {string} objectId
 * @return   {object}
 */
function getTagQueryFromObjectTypeAndId(objectType, objectId) {
    var query = {};

    if(consts.ENTITY_TYPES.indexOf(objectType) > -1) {
        var fieldName = consts.TAG_ENTITIES_FIELD_NAMES[objectType];
        var objectBindPair = getObjectBindPair(objectType, objectId);

        if (objectBindPair) {
            // Preparing mongodb query in a more generalized manner
            var name = fieldName,
                value = objectBindPair;
            query[name] = value;
        }
    }
    return query;   // when getting returned value, check if not empty first
}

// --------------------------------------------------------------------------------------------------

/**
 * Get bind pair for find queries
 *
 * @param    {string} objectType
 * @param    {string} objectId
 * @return   {object}
 */
function getQueryObjectBindPair(objectType, objectId) {

    var objectBindPair = null;

    if (consts.APP_ENTITY_TYPES.indexOf(objectType) > -1) {
        objectBindPair = {$elemMatch: {id: new ObjectId(objectId), appName: objectType}};
    } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) > -1) {
        objectBindPair = {$elemMatch: {id: new ObjectId(objectId)}};
    }
    return objectBindPair;
}

// --------------------------------------------------------------------------------------------------

/**
 * Add new tags to object
 * 
 * @param    {string} objectType
 * @param    {string} objectId
 * @param    {array} tagBindingsArray
 * @param    {function} finalCallback
 * @return   {void}
 */
function bindTags(objectType, objectId, tagBindingsArray, finalCallback) {

    if(consts.ENTITY_TYPES.indexOf(objectType) > -1) {
        var uniqueTagBindingsArray = [];

        // Treating cases where a single object was sent rather than an array
        if (!tagBindingsArray.length) {
            tagBindingsArray = [tagBindingsArray];
        }
        var objectBindPairQuery = getTagQueryFromObjectTypeAndId(objectType, objectId);

        var objectBindPair = getQueryObjectBindPair(objectType, objectId);

        if (objectBindPairQuery === {} || !objectBindPair) {
            finalCallback(new Error("An error occurred while attempting to retrieve tag binding pair"), null);
        } else {

            switch (objectType) {
                case "Dashboard":
                case "Widget":
                    uniqueTagBindingsArray = _.uniq(_.flatten(tagBindingsArray,
                        consts.TAG_BINDING_FIELD_NAME), "id");
                    break;
                case "Presentation":
                    uniqueTagBindingsArray = _.uniq(_.flatten(tagBindingsArray,
                        consts.APP_ENTITIES_TAG_FIELD_NAMES[objectType]), "id");
                    break;
                case "User":
                    uniqueTagBindingsArray = _.uniq(_.flatten(tagBindingsArray,
                        consts.ALL_ENTITIES_TAG_FIELD_NAMES[objectType]), "id");
                    break;
                default:
                    break;
            }

            async.each(uniqueTagBindingsArray, function (tagBindingPair, tagBindingsCallback) {

                var keys = Object.keys(tagBindingPair);
                var keyToUse = keys[0];
                if(keys.indexOf(consts.TAG_BINDING_FIELD_NAME) > -1) {
                    keyToUse = consts.TAG_BINDING_FIELD_NAME;
                }
                var accessTags = tagBindingPair[keyToUse];

                async.each(accessTags, function(tagToAccess, tagItemCallback){
                    async.waterfall([
                        function (callback) {
                            if (consts.APP_ENTITY_TYPES.indexOf(objectType) > -1) {
                                Tag.findOne(
                                    {$and: [{_id: tagToAccess.id}, {appEntities: objectBindPair}]},
                                    function (error, foundTag) {
                                        callback(error, foundTag);
                                    });
                            } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) > -1) {
                                Tag.findOne(
                                    {$and: [{_id: tagToAccess.id}, {usersWithAccess: objectBindPair}]},
                                    function (error, foundTag) {
                                        callback(error, foundTag);
                                    });
                            } else {
                                callback(consts.SERVER_ERRORS.TAG.INVALID_ENTITY_TYPE, null);
                            }
                        },
                        function (isEntityBoundToTagAlready, callback) {
                            if (isEntityBoundToTagAlready) {
                                callback(null, consts.OK);
                            } else {
                                Tag.update({_id: tagToAccess.id},
                                    {$push: objectBindPairQuery}, callback);
                            }
                        }
                    ], function (updateError) {
                        tagItemCallback(updateError);

                    });
                }, function(err) {
                    tagBindingsCallback(err);
                });

            }, function (tagBindingsError, tagBindingsResult) {
                if (tagBindingsError) {
                    finalCallback(tagBindingsError, null);
                } else {
                    finalCallback(null, tagBindingsResult);
                }
            });
        }
    } else {
        finalCallback("Invalid Entity type to bind tags to.", null);
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Get presentation editors
 * 
 * @param    {string} objectType
 * @param    {string} objectId
 * @param    {array} tagBindingsArray
 * @param    {function} finalCallback
 */
function getSafeToUnbindTagBindingsArray(objectType, objectId, tagBindingsArray, finalCallback) {
    /*if(consts.ENTITY_TYPES.indexOf(objectType) > -1) {
        var fieldName = consts.ALL_ENTITIES_TAG_FIELD_NAMES[objectType];
        var usesCountInTagBindingsArrayReceived = _.pairs(_.countBy(_.flatten(tagBindingsArray, 
            consts.TAG_BINDING_FIELD_NAME), "id"));

        //var fullTagBindings = [];
        var onlyTagBindingsArrayQuery = {};

        var name = fieldName,
            value = 1;
        onlyTagBindingsArrayQuery[name] = value;

        async.waterfall([
            function(callback) {
                switch(objectType) {
                    case "Dashboard":
                        var Dashboard = mongoose.model("ds_dashboard");
                        Dashboard.findOne({ _id: new ObjectId(objectId) }, onlyTagBindingsArrayQuery, callback);
                        break;
                    case "Presentation":
                        break;
                    case "User":
                        break;
                  default:
                      break;
                }
            },
            function(fullTagBindings, callback) {
                var usesCountInEntityFullTagBindingsArray = _.pairs(_.countBy(_.flatten(fullTagBindings.segments,
                    consts.TAG_BINDING_FIELD_NAME), "id"));

                var formattedUsesCountInEntityFullTagBindings = _.map(usesCountInEntityFullTagBindingsArray, 
                    function(obj) {
                        obj = _.object([obj]);
                        var k = _.first(_.keys(obj));
                        var v = _.first(_.values(obj));

                        return {id: ObjectId.createFromHexString(k), count: v};
                    });

                var safeToUnbindTagBindingsArray = [];

                for (var i = 0; i < usesCountInTagBindingsArrayReceived.length; i++) {
                    var partialTagBindsIdAndCount = _.object([usesCountInTagBindingsArrayReceived[i]]);

                    var key = _.first(_.keys(partialTagBindsIdAndCount));
                    var count = partialTagBindsIdAndCount[key];

                    var totalCountOfTagUsesInEntity = -1;

                    for (var j = 0; j < _.size(formattedUsesCountInEntityFullTagBindings); j++) {
                        totalCountOfTagUsesInEntity = -1;

                        if (formattedUsesCountInEntityFullTagBindings[j].id === key) {
                            totalCountOfTagUsesInEntity = formattedUsesCountInEntityFullTagBindings[j].count;

                            formattedUsesCountInEntityFullTagBindings[j].count = totalCountOfTagUsesInEntity - count;

                            if (formattedUsesCountInEntityFullTagBindings[j].count < 1) {
                                safeToUnbindTagBindingsArray.push(formattedUsesCountInEntityFullTagBindings[j].id);
                            }
                            break;
                        }
                    }
                }
                callback(null, safeToUnbindTagBindingsArray);
            }
        ], function(error, safeToUnbindTagBindingsArray) {
            if (error) {
                finalCallback(error, null);
            } else {
                finalCallback(null, safeToUnbindTagBindingsArray);
            }
        });
    }*/

    var results = [];
    for(var i=0; i < tagBindingsArray.length;i++) {
        for(var j=0; j < tagBindingsArray[i][consts.TAG_BINDING_FIELD_NAME].length; j++) {
            results.push(tagBindingsArray[i][consts.TAG_BINDING_FIELD_NAME][j]);
        }
    }

    finalCallback(null, results);
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove tags from object
 *
 * @param    {string} objectType
 * @param    {string} objectId
 * @param    {array} tagBindingsArray
 * @param    {function} finalCallback
 * @return   {void}
 */
function unbindTags(objectType, objectId, tagBindingsArray, finalCallback) {

    // Treating cases where a single object was sent rather than an array
    if (!tagBindingsArray.length) {
        tagBindingsArray = [tagBindingsArray];
    }

    //var safeToUnbindTagBindingsArray = [];

    async.waterfall([
        function(callback) {
            if (objectType === "Dashboard") {
                getSafeToUnbindTagBindingsArray(objectType, objectId, tagBindingsArray, callback);
            } else {
                callback(null, _.flatten(tagBindingsArray, "id"));
            }
        },
        function(safeToUnbindTagBindingsArray, callback) {
            //var objectBindPair = getObjectBindPair(objectType, objectId);

            var objectBindPairQuery = getTagQueryFromObjectTypeAndId(objectType, objectId);

            if (objectBindPairQuery === {}) {
                finalCallback(new Error(consts.SERVER_ERRORS.TAG.ERROR_IN_OBJECT_BINDING_PAIR), null);
            }

            log.silly("safeToUnbindTagBindingsArray: " + JSON.stringify(safeToUnbindTagBindingsArray));
            if (safeToUnbindTagBindingsArray) {
                async.eachSeries(safeToUnbindTagBindingsArray, function (tagBindingId, unbindingsCallback) {
                    var id = tagBindingId;
                    if (tagBindingId.id) {
                        id = tagBindingId.id;
                    }
                    Tag.update(
                        {_id: new ObjectId(id)},
                        { $pull: objectBindPairQuery },
                        unbindingsCallback
                    );
                },
                function (unbindError, unbindResult) {
                    if (unbindError) {
                        callback(unbindError, null);
                    } else {
                        callback(null, unbindResult);
                    }
                });
            } else {
                callback(new Error("An Error occurred while unbind entity from tag"), null);
            }
        }
    ], function(error, result) {
        if (error) {
            finalCallback(error, null);
        } else {
            finalCallback(null, consts.OK);
        }
    });
}

// --------------------------------------------------------------------------------------------------

function addCalculatedMetricTags(tag) {
    var tagsArray = [tag];


    var allowedMetricNames = [consts.METRIC_NAMES.Watts, consts.METRIC_NAMES.kW,
        consts.METRIC_NAMES.Wh, consts.METRIC_NAMES.kWh];
    if(tag.tagType === consts.TAG_TYPE.Metric && allowedMetricNames.indexOf(tag.name) > -1) {
        var metricsNamesToCalculate = _.filter(allowedMetricNames, function(item) {
            return item !== tag.name;
        });
        metricsNamesToCalculate.push(consts.METRIC_NAMES.Reimbursement);

        for(var i=0; i < metricsNamesToCalculate.length; i++) {

            var calculatedMetric = _.cloneDeep(tag);
            calculatedMetric.metricType = consts.METRIC_TYPE.Calculated;
            calculatedMetric.name = metricsNamesToCalculate[i];

            if(calculatedMetric.name === consts.METRIC_NAMES.Reimbursement) {
                calculatedMetric.rate = 0.1;
            }

            tagsArray.push(calculatedMetric);
        }
    }

    return tagsArray;
}


exports.bindTags = bindTags;
exports.unbindTags = unbindTags;
exports.getObjectBindPair = getObjectBindPair;
exports.getQueryObjectBindPair = getQueryObjectBindPair;
exports.addCalculatedMetricTags = addCalculatedMetricTags;

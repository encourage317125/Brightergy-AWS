"use strict";

var express = require("express"),
    router = express.Router(),
    async = require("async"),
    _ = require("lodash"),
    moment = require("moment"),
    tagUtils = require("../../../libs/tag-binding-utils"),
    // log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    tagDAO = require("../../core/dao/tag-dao"),
    checkAuth = require("../../core/user/check-auth"),
    consts = require("../../../libs/consts"),
    tempoiq = require("../../core/tempoiq/tempoiq-wrapper"),
    tagScheduleDao = require("../../core/dao/tag-schedule-dao"),
    commands = require("../../core/calculation/commands"),
    awsAssetsUtils = require("../../core/aws/assets-utils"),
    tagStateDAO = require("../../core/dao/tag-state-dao"),
    validationUtil = require("../../../libs/validation-util");

/**
 * @api {get} /v1/tags/state?dataType=:dataType&... Get tagState
 * @apiGroup Tag States
 * @apiName Get tagState
 * @apiVersion 1.0.0
 * @apiDescription Get tagState by tagId according to dataType
 * @apiParam {String} dataType Type of tagState data (e.g. presentDeviceConfig, presentDeviceStatus)
 * @apiParam {String} tagId _id of tag
 * @apiParam {String} deviceId deviceID
 * @apiParam {Number} limit Limit number of result entities to this number
 * @apiParam {Number} offset Number of result entities to skip from the beginning after sorting
 * @apiParam {String} sort The results are sorted by this field in ascending order
 * @apiParam {String} sortDesc The results are sorted by this field in descending order
 * @apiExample Example request
 *   Either tagId or deviceId can be used to get tagStates.
 *   Followings are query string parameters.
 *
 *   Example request using tagId
 *     dataType=presentDeviceStatus
 *     tagId=55521cf9a25a0c541b38d90b
 *     limit=2
 *     offset=1
 *     sortDesc=timestamp
 *   Example request using deviceId
 *     dataType=presentDeviceStatus
 *     deviceId=c4:4e:ac:07:ac:cf
 *     limit=2
 *     offset=1
 *     sortDesc=timestamp
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *   Success example for the example request
 *     {
 *         "success": 1,
 *         "message": [{
 *             "_id": "55dabe26c40ad49f432a20c9",
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceStatus",
 *             "__v": 0,
 *             "version": "v2",
 *             "totalUpTime": 500000,
 *             "wsTrigger": 20,
 *             "memUsage": 1024,
 *             "wifiStatus": "disabled",
 *             "ethernetStatus": "enabled",
 *             "count": 2,
 *             "timestamp": "2014-04-22T00:00:00.000Z"
 *         }, {
 *             "_id": "55dabe13c40ad49f432a20c8",
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceStatus",
 *             "__v": 0,
 *             "version": "v1",
 *             "totalUpTime": 300000,
 *             "wsTrigger": 10,
 *             "memUsage": 1024,
 *             "wifiStatus": "disabled",
 *             "ethernetStatus": "enabled",
 *             "count": 1,
 *             "timestamp": "2014-04-21T00:00:00.000Z"
 *         }]
 *     }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/state", checkAuth, function(req, res, next) {
    var tagId = req.query.tagId,
        deviceId = req.query.deviceId,
        dataType = req.query.dataType,
        operators = {
            limit: req.query.limit,
            offset: req.query.offset,
            sort: req.query.sort,
            sortDesc: req.query.sortDesc
        };

    function validateParams() {
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }
        
    tagStateDAO.getTagStates(tagId, deviceId, dataType, operators, function(err, result){
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * @api {get} /v1/tags Search Tags
 * @apiGroup Tags
 * @apiName Search Tags
 * @apiVersion 1.0.0
 * @apiDescription Search tags by filter
 * @apiExample Example request
 *  filter : manufacturer=Enphase&tagType=Scope
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }]
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/", checkAuth, function(req, res, next) {
    var filter = req.query;

    var validateErrors = [];
    if (_.isEmpty(filter)) {
        validateErrors.push(consts.SERVER_ERRORS.GENERAL.FILTER_REQUIRED);
    }
    if (validateErrors.length > 0) {
        var error = new Error(validateErrors.join(", "));
        error.status = 422;
        return next(error);
    }

    tagDAO.getTagsByFilter(filter, req.user, function (err, result) {
        if (err) {
            return next(err);
        }
        return utils.successResponse(result, res, next);
    });
});

 /**
 * @api {get} /v1/tags/:tagId Get Tag by Id
 * @apiGroup Tags
 * @apiName Get Tag by Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the tag data by Tag Id
 * @apiExample Example request
 *  tagId : 5458a2acb0091419007e03df
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:tagId", checkAuth, function(req, res, next) {
    var tagId = req.params.tagId;
    function validateParams() {
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }
    tagDAO.getTagByIdIfAllowed(tagId, req.user, function(findErr, foundTag) {
        if (findErr) {
            return next(findErr);
        } else {
            utils.decryptTagPassword(foundTag);
            return utils.successResponse(foundTag, res, next);
        }
    });
});

 /**
 * @api {get} /v1/tags/:tagId/deletable Check tag deletable
 * @apiGroup Tags
 * @apiName Check tag deletable
 * @apiVersion 1.0.0
 * @apiDescription Check if the tag is deletable
 * @apiExample Example request
 *  tagId : 5458a8a95409c90e00884ce0
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "543824bd7174d62c1acad50f":{
 *              "isDeletable":false
 *          }
 *      }
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:tagId/deletable", checkAuth, function(req, res, next) {
    var idArray = [req.params.tagId];

    function validateParams() {
        if (!validationUtil.isValidObjectId(req.params.tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagDAO.isDeletable(idArray, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            var isDeletable = true;
            _.each(result, function(row, i) {
                isDeletable = isDeletable && row.isDeletable;
            });

            var returnObj = {};
            returnObj[req.params.tagId] = {
                isDeletable: isDeletable,
                children: result
            };

            return utils.successResponse(returnObj, res, next);
        }
    });
});

// --------------------------------------------------------------------------------------------------

/**
 * @api {get} /tags/source/users/:tagId Get Accessible Users for Tag
 * @apiGroup Tags
 * @apiName Get Accessible Users for Tag
 * @apiVersion 1.0.0
 * @apiDescription Returns accessible Users Array for Tag
 * @apiSuccess success 1
 * @apiSuccess message Users Array
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/source/users/:tagId", checkAuth, function(req, res, next) {
    var tagId = req.params.tagId;

    function validateParams() {
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagDAO.getTagByIdIfAllowed(tagId, req.user, function (findErr, foundTag) {
        if (findErr) {
            return next(findErr);
        } else {
            tagDAO.populateAccessibleUsersForTag(foundTag, function (error, users) {
                if (error) {
                    return next(error);
                } else {
                    return utils.successResponse(users, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/tags Create Tag
 * @apiGroup Tags
 * @apiName Create Tag
 * @apiVersion 1.0.0
 * @apiDescription Create new tag and add it to user accessibleTags field <br/>
 * Following fields can't be updated: <br/>
 *      usersWithAccess <br/>
 *      appEntities <br/>
 *      creator <br/>
 *      creatorRole <br/>
 *      tagType <br/>
 * @apiParam {Object} body Tag data
 * @apiExample Example request
 *  body
 *  {
 *      "tagType" : "Facility",
 *      "name" : "Liberty Lofts",
 *      "creatorRole" : "BP",
 *      "creator" : "54135f90c6ab7c241e28095e",
 *      "__v" : 0,
 *      "usersWithAccess" : [ 
 *          {
 *              "id" : "54135f90c6ab7c241e28095e"
 *          }, 
 *          {
 *              "id" : "5429d0ba89c1849502287d5c"
 *          }
 *      ],
 *      "appEntities" : [],
 *      "children" : [ 
 *          {
 *              "id" : "5458a84f5409c90e00884cdf",
 *              "tagType" : "Scope"
 *          }
 *      ],
 *      "parents" : [],
 *      "formula" : null,
 *      "metricID" : null,
 *      "metricType" : null,
 *      "metric" : null,
 *      "sensorTarget" : null,
 *      "enphaseUserId" : null,
 *      "endDate" : null,
 *      "weatherStation" : null,
 *      "longitude" : null,
 *      "latitude" : null,
 *      "username": "tester",
 *      "password": "123456",
 *      "webAddress" : null,
 *      "interval" : null,
 *      "destination" : null,
 *      "accessMethod" : null,
 *      "deviceID" : null,
 *      "device" : null,
 *      "manufacturer" : null,
 *      "utilityAccounts" : [],
 *      "utilityProvider" : "",
 *      "nonProfit" : null,
 *      "taxID" : null,
 *      "street" : "",
 *      "state" : "",
 *      "postalCode" : "",
 *      "country" : "",
 *      "city" : ""
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Tag Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */

 function createTag(tagObj, user, rawPassword, callback) {
     var tagsToCreate = tagUtils.addCalculatedMetricTags(tagObj);

     async.map(tagsToCreate, function(tagObj, cb) {
         if (tagObj.tagType === consts.TAG_TYPE.Metric) {
            tagObj.datacoreMetricID = tagDAO.makeDatacoreMetricID(tagObj);
            
            tagDAO.createExternalID(tagObj, function(externalErr, externalResult){
                 if (externalErr){
                     return callback(externalErr);
                 } else {
                     tagObj.externalId = externalResult;
                     tagDAO.createTag(tagObj, user, cb);
                 }
             });
         } else {
             tagDAO.createTag(tagObj, user, cb);
         }
     }, function(err, result) {
         if (err) {
             return callback(err);
         } else {
             if(rawPassword !== ""){
                 //after created, shows raw password.
                 result[0].password = rawPassword;
             }
             return callback(null, result);
             //res.send(new utils.serverAnswer(true, result));
         }
     });
 }

router.post("/", checkAuth, function(req, res, next) {
    var tagObj = req.body;
    var rawPassword = "";
    utils.encryptTagPassword(tagObj);
    utils.removeMongooseVersionField(tagObj);

    utils.removeMultipleFields(tagObj,
        [
            "usersWithAccess",
            "appEntities",
            "endDate",
            "commissioningDate"
        ]
    );

    var handler = function(err, result) {
        if(err) {
            return next(err);
        }

        return utils.successResponse(result, res, next);
    };

    if(tagObj && tagObj.deviceID) {
        tagDAO.isUniqueTag(tagObj.deviceID, function(err, isUniq) {
            if(err) {
                return next(err);
            } else if(!isUniq) {
                var uniqErr = new Error(consts.SERVER_ERRORS.TAG.NOT_UNIQUE_DEVICE_ID);
                uniqErr.status = 422;
                return next(uniqErr);
            } else {
                createTag(tagObj, req.user, rawPassword, handler);
            }
        });
    } else {
        createTag(tagObj, req.user, rawPassword, handler);
    }
});

 /**
 * @api {put} /v1/tags/:tagId Edit Tag
 * @apiGroup Tags
 * @apiName Edit Tag
 * @apiVersion 1.0.0
 * @apiDescription Edit tag data <br/>
 * Following fields can't be updated: <br/>
 *      usersWithAccess <br/>
 *      appEntities <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body Tag data object. API can accepts only changed fields. However, id is mandatory
 * @apiExample Example request
 *  tagId : 5458a2acb0091419007e03df
 *  body
 *  {
 *      "_id" : "5458a2acb0091419007e03df",
 *      "tagType" : "Facility",
 *      "name" : "Liberty Lofts test"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {    
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:tagId", checkAuth, function(req, res, next) {
    var tagId = req.params.tagId;
    var tagObj = req.body;

    function validateParams() {
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        if(_.isEmpty(tagObj)) {
            return new Error(consts.SERVER_ERRORS.TAG.EMPTY_TAG);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    utils.encryptTagPassword(tagObj);
    utils.removeMongooseVersionField(tagObj);

    utils.removeMultipleFields(tagObj,
        [
            "usersWithAccess",
            "appEntities",
            "endDate",
            "commissioningDate",
            "deviceID",
            "metricID"
        ]
    );

    tagDAO.editTag(tagId, tagObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

 /**
 * @api {delete} /v1/tags/:tagId Delete Tag with children
 * @apiGroup Tags
 * @apiName Delete Tag
 * @apiVersion 1.0.0
 * @apiDescription Delete tag by Id with children
 * @apiExample Example request
 *  tagId : 5458af3ffe540a120074c20a
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:tagId", checkAuth, function(req, res, next) {
    var idArray = [req.params.tagId];

    function validateParams() {
        if (!validationUtil.isValidObjectId(req.params.tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagDAO.isDeletable(idArray, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            var isDeletable = true;
            _.each(result, function(row, tagId) {
                isDeletable = isDeletable && row.isDeletable;
            });

            if(isDeletable) {
                tagDAO.deleteTagsWithChildren(idArray, req.user, function (err, answer) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(answer, res, next);
                    }
                });
            }
            else {
                return next(new Error(consts.SERVER_ERRORS.TAG.TAG_IS_BEING_USED));
            }
        }
    });
});

 /**
 * @api {post} /v1/tags/data/:metricId Save Tag Data
 * @apiGroup Tags
 * @apiName Save Tag Data
 * @apiVersion 1.0.0
 * @apiDescription Save Metric data into tempoiqDB
 * @apiExample Example request
 *  metricId : 5461194d7c895516004561ad
 *  body
 *  {
 *      "sourceData": [
 *          {Metric: "W", DateTime: "2010-01-02 06:00:00", MetricValue: "11000"},
 *          {Metric: "W", DateTime: "2010-01-04 06:00:00", MetricValue: "200.15"}
 *      ]
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *   "success":1,
 *   "message":{
 *       "dataPoints":{
 *           "egauge8795:Solar Inverter Aplus":{
 *               "W":[
 *                   {"t":"2010-01-02T04:00:00.000Z","v":"11000.1"},
 *                   {"t":"2010-01-04T04:00:00.000Z","v":"11000.2"}
 *               ]
 *           }
 *       },
 *       "result":{}
 *   }
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/data/:metricId", checkAuth, function(req, res, next) {
    var tagData = req.body,
        metricId = req.params.metricId,
        sourceData = [];

    if(tagData.sourceData !== undefined) {
        sourceData = tagData.sourceData;
    }

    function validateParams() {
        if (!validationUtil.isValidObjectId(metricId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagDAO.getTagByIdIfAllowed(metricId, req.user, function(findMetricErr, metricTag) {
        if(findMetricErr) {
            return next(findMetricErr);
        }
        else {
            if(metricTag.parents.length > 0 && metricTag.parents[0].tagType === consts.TAG_TYPE.Node) {

                tagDAO.getTagByIdIfAllowed(metricTag.parents[0].id, req.user, function(findSensorErr, sensorTag) {
                        if(findSensorErr) {
                            return next(findSensorErr);
                        }
                        else {
                            var deviceId = utils.encodeSeriesKey(sensorTag.deviceID);
                            var dataPoints = {};

                            _.each(sourceData, function(source) {
                                tempoiq.addDataPoints(dataPoints, deviceId,
                                    source.Metric, moment(source.DateTime), source.MetricValue);
                            });

                            tempoiq.writeDataPoints(dataPoints, function(finalErr, finalResult) {
                                if(finalErr) {
                                    return next(finalErr);
                                }
                                else {
                                    return utils.successResponse(finalResult, res, next);
                                }
                            });
                        }
                    });
            }
            else {
                var error = new Error(consts.SERVER_ERRORS.TAG.NOT_FOUND_SENSOR_IN_PARENTS);
                error.status = 422;
                return next(error);
            }
        }
    });
});

/**
 * @api {get} /v1/tags/:tagId/schedule Get schedules for tag
 * @apiGroup Tags
 * @apiName Get tag schedules for tag
 * @apiVersion 1.0.0
 * @apiDescription Get tag schedules for tag
 * @apiExample Example request
 *  tagId : 5461194d7c895516004561ad
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": [
 *       {
 *           "_id": "559e3ec3ce6e9bf8159694d5",
 *           "fromHour": 1,
 *           "fromMinute": 23,
 *           "toHour": 1,
 *           "toMinute": 50,
 *           "heatSetpoint": 15,
 *           "coolSetpoint": 18,
 *           "tag": {
 *               "_id": "5458ba38c0fa5a0e0045f161",
 *               "tagType": "Node",
 *               "name": "Barretts Elementary: Inverter C",
 *               "displayName": "Mercury",
 *               "deviceID": "WR8KU002:2002126708"
 *           },
 *           "creatorRole": "BP",
 *           "creator": "5416f4a4aa6409d01d0c91dc",
 *           "weekDays": [
 *               2
 *           ],
 *           "__v": 0
 *       }
 *   ]
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:tagId/schedule", checkAuth, function(req, res, next) {
    var tagId = req.params.tagId;

    function validateParams() {
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagScheduleDao.getTagSchedulesByTagId(tagId, req.user, function(err, tagsSchedules) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(tagsSchedules, res, next);
        }
    });
});

/**
 * @api {post} /v1/tags/schedule Create tag schedule
 * @apiGroup Tags
 * @apiName Create tag schedule
 * @apiVersion 1.0.0
 * @apiDescription Create tag schedule
 * @apiParam {Object} tag schedule body
 * @apiExample Example request
 *  body
 *{
 *	"tags": ["566e91d085fcd2e006a76f22"],
 *	"schedule": {
 *		"weekDays": [2],
 *		"fromHour": 1,
 *		"fromMinute": 23,
 *		"toHour": 1,
 *		"toMinute": 44,
 *		"heatSetpoint": 15,
 *		"coolSetpoint": 18
 *	}
 *}
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *{
 *	"success": 1,
 *	"message": [{
 *		"_id": "566e91d085fcd2e006a76f22",
 *		"fromHour": 1,
 *		"fromMinute": 23,
 *		"toHour": 1,
 *		"toMinute": 44,
 *		"heatSetpoint": 15,
 *		"coolSetpoint": 18,
 *		"tag": {
 *			"_id": "55521d53a25a0c541b38d909",
 *			"name": "Pearl Thermostat",
 *			"displayName": "Pearl Thermostat",
 *			"tagType": "Node",
 *			"deviceID": "00:0d:6f:00:02:f7:46:86"
 *		},
 *		"creatorRole": "BP",
 *		"creator": "54621cd2349cc84500dee9ea",
 *		"isActive": true,
 *		"weekDays": [2],
 *		"__v": 0
 *	}]
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/schedule", checkAuth, function(req, res, next) {
    var tags = req.body.tags || [];
    var tagScheduleBody = req.body.schedule;

    function validateParams() {
        if(!validationUtil.isValidObjectIdArray(tags)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        if (_.isEmpty(tagScheduleBody)) {
            return new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.EMPTY_SCHEDULE);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagScheduleDao.createTagSchedule(tags, tagScheduleBody, req.user, function(err, tagsSchedule) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(tagsSchedule, res, next);
        }
    });
});

/**
 * @api {put} /v1/tags/:tagId/schedule/:scheduleId Edit tag schedule
 * @apiGroup Tags
 * @apiName Edit tag schedule
 * @apiVersion 1.0.0
 * @apiDescription Edit tag schedule
 * @apiParam {Object} tag schedule body
 * @apiExample Example request
 *  tagId : 5458ba38c0fa5a0e0045f161
 *  scheduleId: 559e3ec3ce6e9bf8159694d5
 *{
 *   "weekDays": [
 *       4
 *   ],
 *   "fromHour": 19,
 *   "fromMinute": 56,
 *   "toHour": 20,
 *   "toMinute": 10
 *}
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "_id": "5630fce3d59650c023cebe3f",
 *       "fromHour": 19,
 *       "fromMinute": 56,
 *       "toHour": 20,
 *       "toMinute": 10,
 *       "heatSetpoint": 15,
 *       "coolSetpoint": 18,
 *       "tag": {
 *           "_id": "54f851821688f21600d74b4a",
 *           "name": "Lighting Panel AP-4-HN",
 *           "tagType": "Node",
 *           "displayName": "Node",
 *           "deviceID": "egauge17981:AP-4-HN"
 *       },
 *       "creatorRole": "BP",
 *       "creator": "54621cd2349cc84500dee9ea",
 *       "__v": 1,
 *       "isActive": true,
 *       "weekDays": [4]
 *   }
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:tagId/schedule/:scheduleId", checkAuth, function(req, res, next) {
    var scheduleId = req.params.scheduleId;
    var tagScheduleBody = req.body;
    var tagId = req.params.tagId;

    function validateParams() {
        if (!validationUtil.isValidObjectId(scheduleId)) {
            return new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.INCORRECT_SCHEDULE_ID);
        }
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        if(_.isEmpty(tagScheduleBody)) {
            return new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.EMPTY_SCHEDULE);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagScheduleDao.editTagSchedule(scheduleId, tagScheduleBody, req.user, function(err, tagsSchedule) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(tagsSchedule, res, next);
        }
    });
});

/**
 * @api {delete} /v1/tags/:tagId/schedule/:scheduleId Delete tag schedules for tag
 * @apiGroup Tags
 * @apiName Delete tag schedules for tag
 * @apiVersion 1.0.0
 * @apiDescription Delete tag schedules for tag
 * @apiExample Example request
 *  scheduleId : 5566d90a49569c441f9a9fbb
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": "OK"
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:tagId/schedule/:scheduleId", checkAuth, function(req, res, next) {
    var scheduleId = req.params.scheduleId;
    var tagId = req.params.tagId;

    function validateParams() {
        if (!validationUtil.isValidObjectId(scheduleId)) {
            return new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.INCORRECT_SCHEDULE_ID);
        }
        if (!validationUtil.isValidObjectId(tagId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagScheduleDao.deleteTagSchedule(scheduleId, req.user, function(err, deleteResult) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(deleteResult, res, next);
        }
    });
});

/**
 * @api {post} /v1/tags/image Upload Facility Image
 * @apiGroup Tags
 * @apiName Upload Facility Image
 * @apiVersion 1.0.0
 * @apiDescription Upload Facility Image to AWS
 * @apiParam {File} imageFile image file data
 * @apiSampleRequest /v1/tags/image
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *   {
 *       "success": 1,
 *       "message": {
 *           "ETag": "\"fafa5efeaf3cbe3b23b2748d13e629a1\"",
 *           "VersionId": "FuDLr3qLPkn_n5Br1kOu5bsAhN1rsmfH",
 *           "sourceCDNURL": "https://cdn.brightergy.com/FacilityAssets/image/_-WHtVLwM2EaMcMd.jpg",
 *           "id": "assets_1440404187884",
 *           "Key": "FacilityAssets/image/_-WHtVLwM2EaMcMd.jpg",
 *           "title": "Tulips.jpg",
 *           "fileName": "_-WHtVLwM2EaMcMd.jpg",
 *           "thumbnailURL": "https://cdn.brightergy.com/FacilityAssets/image/_-WHtVLwM2EaMcMd.jpg"
 *       }
 *   }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/image", checkAuth, function(req, res, next) {
    
    if (req.user.role === consts.USER_ROLES.BP || req.user.role === consts.USER_ROLES.Admin) {
        
        var keyPrefix = "image";
        var imageFile = req.files.imageFile;

        if(Array.isArray(imageFile)) {
            imageFile = imageFile[0];
        }

        awsAssetsUtils.uploadFacilityImageFile(keyPrefix, imageFile, true, function (uploadErr, uploadedFile) {
            if(uploadErr) {
                return next(uploadErr);
            } else {
                // log.info("api success uploadedFile - " + JSON.stringify(uploadedFile));
                return utils.successResponse(uploadedFile, res, next);
            }
        });

    } else {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_UPLOAD_FILE);
        error.status = 422;
        return next(error);
    }

});


/**
 * @api {post} /v1/tags/firmware Upload Device Software
 * @apiGroup Tags
 * @apiName Upload Device Software
 * @apiVersion 1.0.0
 * @apiDescription Upload Device Software to AWS
 * @apiParam {File} softwareFile device software file data
 * @apiSampleRequest /v1/tags/firmware
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *   {
 *       "success": 1,
 *       "message": {
 *           "ETag": "\"8969288f4245120e7c3870287cce0ff3\"",
 *           "bucketName": "device-softwares",
 *           "s3URL": "s3://device-softwares/brighterlink_2.0.zip",
 *           "httpURL": "https://device-softwares.s3-us-west-2.amazonaws.com/brighterlink_2.0.zip",
 *           "id": "firmware_1440404484330",
 *           "Key": "brighterlink_2.0.zip",
 *           "title": "brighterlink_2.0.zip"
 *       }
 *   }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/firmware", checkAuth, function(req, res, next) {
    
    if (req.user.role === consts.USER_ROLES.BP) {
        
        var softwareFile = req.files.softwareFile;

        if(Array.isArray(softwareFile)) {
            softwareFile = softwareFile[0];
        }

        awsAssetsUtils.uploadDeviceSoftwareFile(softwareFile, function (uploadErr, uploadedFile) {
            if(uploadErr) {
                return next(uploadErr);
            } else {
                // log.info("api success uploadedFile - " + JSON.stringify(uploadedFile));
                return utils.successResponse(uploadedFile, res, next);
            }
        });

    } else {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_UPLOAD_FILE);
        error.status = 422;
        return next(error);
    }

});

/**
 * @api {post} /v1/tags/state?dataType=:dataType Create or Update tagState
 * @apiGroup Tag States
 * @apiName Create or Update tagState
 * @apiVersion 1.0.0
 * @apiDescription Create or Update tagState according to dataType parameter
 * @apiParam {String} dataType type of tagState data (e.g. presentDeviceConfig, presentDeviceStatus)
 * @apiParam {Object} body tagState data according to dataType parameter
 * @apiSampleRequest /v1/tags/state?dataType=presentDeviceConfig
 * @apiExample Example request
 *   Possible dataType values
 *     presentDeviceConfig
 *     presentDeviceStatus
 *     presentDeviceLogcatLink
 *   Example request for dataType=presentDeviceConfig
 *     body
 *     {
 *        "deviceID": "c4:4e:ac:07:ac:cf",
 *        "initialized": true,
 *        "presentationID": "54919e9300e34b15006f2dc6",
 *        "userEmail": "dev.mobile2@brightergy.com",
 *        "userPassword": "Brightergy1",
 *        "generalSetting": {
 *            "URL": "http://brightergy.force.com/brighterview2?id=a3zC0000000TOpm&start_min=0&start_sec=0",
 *            "startDsrOnBoot": true,
 *            "deviceName": "BrighterLink Present Display"
 *        },
 *        "networkSetting":  {
 *            "connectionType": "ethernet",
 *            "ethernetState": true,
 *            "ethernetDevice": "eth0",
 *            "ethernetIpType": "DHCP",
 *            "ip": "192.168.1.100",
 *            "mask": "255.255.255.0",
 *            "gateway": "192.168.1.1",
 *            "dns1": "8.8.8.8",
 *            "dns2": "8.8.4.4",
 *            "wifiState": true,
 *            "wifiOpenState": false,
 *            "wifiName": "SDZJ_1",
 *            "wifiSecurity": "WPA2 PSK", 
 *            "wifiPassword": "bpd",
 *            "wifiIpType": "Static",      
 *            "wifiIp": "192.168.1.100",
 *            "wifiGateway": "192.168.1.1",
 *            "wifiDns1": "8.8.8.8",
 *            "wifiDns2": "8.8.4.4"
 *        },
 *        "browserSetting": {
 *            "scheduleCleanup": {
 *                "enableCleanup": false,
 *                "timeOfExecution": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                },
 *                "clearCache": false,
 *                "clearOfflineData": false,
 *                "clearSessions": false,
 *                "clearCookies": false,
 *                "clearHistory": false,
 *                "clearFormData": false,
 *                "clearPasswords": false
 *            },
 *            "scheduleBrowserRestart": {
 *                "enableScheduleBrowserRestart": false,
 *                "configureScheduleBrowserRestart": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                }
 *            },
 *            "showStatusOnBrowser": false
 *        },
 *        "deviceStatusReporter": {
 *            "timeIntervalToMonitorStatus": 10,
 *            "timeIntervalToReport": 10,
 *            "preventSuspension": false,
 *            "ftpCredentials": {
 *                "ftpHost": "solest.brightergy.com",
 *                "ftpUsername": "solest.brightergy.com|jonathan.hockman",
 *                "ftpPassword": "hasam7Na"
 *            },
 *            "durationToAttempReconnection": 60
 *        },
 *        "password": "0000",
 *        "remoteConfigureSetting": {
 *            "automaticUpdate": {
 *                "enableAutomaticUpdate": false,
 *                "periodicalCheck": {
 *                    "type": "minutes",
 *                    "interval": 10
 *                }
 *            },
 *            "remoteConfigurePath": "/BrighterView/Remote Configuration/"
 *        },
 *        "remoteUpdateNewVersion": {
 *            "automaticUpdate": {
 *                "enableAutomaticUpdateNewVersion": false,
 *                "scheduleUpdateNewVersion": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                }
 *            },
 *            "remoteUpdatePath": "/BrighterView/Remote Update/"
 *        },
 *        "importExport": {
 *            "importPath": "/Brightergy/DSR",
 *            "exportPath": "/Brightergy/DSR"
 *        }
 *     }
 *   Example request for dataType=presentDeviceStatus
 *     body
 *     {
 *         "deviceID": "c4:4e:ac:07:ac:cf",
 *         "statusArray": [{
 *             "timestamp" : "2014-04-22T00:00:00.000Z",
 *             "count" : 1,
 *             "ethernetStatus" : "enabled",
 *             "wifiStatus" : "disabled",
 *             "memUsage" : 1024,
 *             "wsTrigger" : 10,
 *             "totalUpTime" : 300000,
 *             "version" : "v1"
 *         }, {
 *             "timestamp" : "2014-04-22T00:00:10.000Z",
 *             "count" : 2,
 *             "ethernetStatus" : "enabled",
 *             "wifiStatus" : "disabled",
 *             "memUsage" : 2048,
 *             "wsTrigger" : 20,
 *             "totalUpTime" : 300000,
 *             "version" : "v1"
 *         }]
 *     }
 *   Example request for dataType=presentDeviceLogcatLink
 *     body
 *     {
 *         "deviceID": "c4:4e:ac:07:ac:cf",
 *         "link": "https://device-files.s3-us-west-2.amazonaws.com/abcde.dat",
 *         "uploadTime" : "2015-08-25T00:00:00.000Z"
 *     }
 *   Example request for dataType=digiConfig
 *     body
 *     {
 *         "deviceID": "00:13:a2:00:40:c0:97:f1",
 *         "PANID":"Oxff",
 *         "NJ_TIME":"60",
 *         "DATA_REPORT_INTERVAL":"120"
 *     }
 *   Example request for dataType=digiEndList
 *     body
 *     {
 *        "deviceID": "00:13:a2:00:40:c0:97:f1",
 *        "GEM": [
 *            {
 *                "mac_address": "00:13:a2:00:40:c0:97:f1"
 *            },
 *            {
 *                "mac_address": "00:13:a2:00:40:c0:97:f2"
 *            }
 *        ],
 *        "Thermostat": [
 *            {
 *                "mac_address": "00:0d:6f:00:02:f7:46:86"
 *            },
 *            {
 *                "mac_address": "00:0d:6f:00:02:f7:46:87"
 *            }
 *        ]
 *     }
 *   Example request for dataType=digiEventLog
 *     body
 *     {
 *         "deviceID": "00:13:a2:00:40:c0:97:f1",
 *         "logUrl": "s3://example-bucket/digi.log",
 *         "uploadTime" : "2015-09-28T00:00:00.000Z"
 *     }
 *   Example request for dataType=digiStatus
 *     body
 *     {
 *         "deviceID": "00:13:a2:00:40:c0:97:f1",
 *         "dateTime": "2015-09-14T12:37:45.990426Z",
 *         "devices": [{
 *             "mac_address": "00:0d:6f:00:02:f7:46:86",
 *             "device_type": "Thermostat"
 *         }, {
 *             "mac_address": "00:13:a2:00:40:30:e8:33",
 *             "device_type": "GEM"
 *         }],
 *         "internetConnectivity": "Yes",
 *         "gemDataReportingStatus": "real time",
 *         "gemLastReportTime": "2015-09-14T12:36:17.640507Z",
 *         "thermostatDataReportingStatus": "real time",
 *         "thermostatLastReportTime": "2015-09-14T12:37:45.174566Z"
 *     }
 *   Example request for dataType=gemConfig
 *     body
 *     [{
 *         "deviceID": "00:13:a2:00:40:30:e8:33",
 *         "ctChannelsType": "B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,90,
 *         90,90,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3",
 *         "primaryPacketFormat": 9,
 *         "packetSendInterval": 2,
 *         "realtimeReporting": true
 *     }]
 *   Example request for dataType=gatewaySoftware
 *     body
 *     [{
 *         "deviceID": "00:13:a2:00:40:c0:97:f1",
 *         "status": "success",
 *         "softwareVersion": "1.0.5",
 *         "upgradeTime": "2015-10-08T00:00:00.000Z"
 *     }]
 *   Example request for dataType=gatewayNetwork
 *     body
 *     [{
 *         "deviceID": "00:13:a2:00:40:c0:97:f1",
 *         "networkState": "open"
 *     }]
 *   Example request for dataType=thermostatTemperature
 *     body
 *     [{
 *         "deviceID": "00:0d:6f:00:02:f7:46:86",
 *         "status": "success",
 *         "heatSetpoint": 10,
 *         "coolSetpoint": 15,
 *         "ts": "2015-10-14T00:00:00.000Z",
 *         "errorCode": 0,
 *         "description": null
 *     }]
 * @apiSuccess success 1
 * @apiSuccess message Created or Updated tagState object
 * @apiSuccessExample Success example
 *   Success example for dataType=presentDeviceConfig
 *     {
 *         "success": 1,
 *         "message": {
 *             "_id": "55dabdf3c40ad49f432a20c7",
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceConfig",
 *             "__v": 0,
 *             "importExport": {
 *                 "importPath": "/Brightergy/DSR",
 *                 "exportPath": "/Brightergy/DSR"
 *             },
 *             "remoteUpdateNewVersion": {
 *                 "automaticUpdate": {
 *                     "enableAutomaticUpdateNewVersion": false,
 *                     "scheduleUpdateNewVersion": {
 *                         "type": "hourly",
 *                         "interval": 5,
 *                         "time": "8:00",
 *                         "dayOfWeek": "Sunday",
 *                         "dayOfMonth": 1
 *                     }
 *                 },
 *                 "remoteUpdatePath": "/BrighterView/Remote Update/"
 *             },
 *             "remoteConfigureSetting": {
 *                 "automaticUpdate": {
 *                     "enableAutomaticUpdate": false,
 *                     "periodicalCheck": {
 *                         "type": "minutes",
 *                         "interval": 10
 *                     }
 *                 }
 *             },
 *             "password": "0000",
 *             "deviceStatusReporter": {
 *                 "timeIntervalToMonitorStatus": 10,
 *                 "timeIntervalToReport": 10,
 *                 "preventSuspension": false,
 *                 "durationToAttempReconnection": 60
 *             },
 *             "browserSetting": {
 *                 "scheduleCleanup": {
 *                     "enableCleanup": false,
 *                     "timeOfExecution": {
 *                         "type": "hourly",
 *                         "interval": 5,
 *                         "time": "8:00",
 *                         "dayOfWeek": "Sunday",
 *                         "dayOfMonth": 1
 *                     }
 *                 },
 *                 "scheduleBrowserRestart": {
 *                     "enableScheduleBrowserRestart": false,
 *                     "configureScheduleBrowserRestart": {
 *                         "type": "hourly",
 *                         "interval": 5,
 *                         "time": "8:00",
 *                         "dayOfWeek": "Sunday",
 *                         "dayOfMonth": 1
 *                     }
 *                 },
 *                 "showStatusOnBrowser": false
 *             },
 *             "networkSetting":  {
 *                 "connectionType": "ethernet",
 *                 "ethernetState": true,
 *                 "ethernetDevice": "eth0",
 *                 "ethernetIpType": "DHCP",
 *                 "ip": "192.168.1.100",
 *                 "mask": "255.255.255.0",
 *                 "gateway": "192.168.1.1",
 *                 "dns1": "8.8.8.8",
 *                 "dns2": "8.8.4.4",
 *                 "wifiState": true,
 *                 "wifiOpenState": false,
 *                 "wifiName": "SDZJ_1",
 *                 "wifiSecurity": "WPA2 PSK", 
 *                 "wifiPassword": "bpd",
 *                 "wifiIpType": "Static",      
 *                 "wifiIp": "192.168.1.100",
 *                 "wifiGateway": "192.168.1.1",
 *                 "wifiDns1": "8.8.8.8",
 *                 "wifiDns2": "8.8.4.4"
 *             },
 *             "generalSetting": {
 *                 "URL": "http://brightergy.force.com/brighterview2?id=a3zC0000000TOpm&start_min=0&start_sec=0",
 *                 "startDsrOnBoot": true,
 *                 "deviceName": "BrighterLink Present Display"
 *             },
 *             "initialized": true,
 *             "presentationID": "54919e9300e34b15006f2dc6",
 *             "userEmail": "dev.mobile2@brightergy.com",
 *             "userPassword": "Brightergy1"
 *         }
 *     }
 *   Success example for dataType=presentDeviceStatus
 *     {
 *         "success": 1,
 *         "message": [{
 *             "__v": 0,
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceStatus",
 *             "_id": "55e574e37a0a40a33b406ba2",
 *             "version": "v1",
 *             "totalUpTime": 300000,
 *             "wsTrigger": 10,
 *             "memUsage": 1024,
 *             "wifiStatus": "disabled",
 *             "ethernetStatus": "enabled",
 *             "count": 1,
 *             "timestamp": "2014-04-22T00:00:00.000Z"
 *         }, {
 *             "__v": 0,
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceStatus",
 *             "_id": "55e574e37a0a40a33b406ba3",
 *             "version": "v1",
 *             "totalUpTime": 300000,
 *             "wsTrigger": 20,
 *             "memUsage": 2048,
 *             "wifiStatus": "disabled",
 *             "ethernetStatus": "enabled",
 *             "count": 2,
 *             "timestamp": "2014-04-22T00:00:10.000Z"
 *         }]
 *     }
 *   Success example for dataType=presentDeviceLogcatLink
 *     {
 *         "success": 1,
 *         "message": {
 *             "__v": 0,
 *             "deviceID": "c4:4e:ac:07:ac:cf",
 *             "tag": "55521cf9a25a0c541b38d90b",
 *             "dataType": "presentDeviceLogcatLink",
 *             "_id": "55dc2e5bea479d96075d6b67",
 *             "uploadTime": "2015-08-25T00:00:00.000Z",
 *             "link": "https://device-files.s3-us-west-2.amazonaws.com/abcde.dat"
 *         }
 *     }
 *   Success example for dataType=digiConfig
 *     {
 *         "success": 1,
 *         "message": {
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "digiConfig",
 *             "_id": "5601b76b5e6993471bfd0559",
 *             "DATA_REPORT_INTERVAL": 120,
 *             "NJ_TIME": 60,
 *             "PANID": "Oxff"
 *         }
 *     }
 *   Success example for dataType=digiEndList
 *     {
 *         "success": 1,
 *         "message": {
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "digiEndList",
 *             "_id": "56042f39caa6a3bb2718c204",
 *             "Thermostat": [{
 *                 "mac_address": "00:0d:6f:00:02:f7:46:86"
 *             }, {
 *                 "mac_address": "00:0d:6f:00:02:f7:46:87"
 *             }],
 *             "GEM": [{
 *                 "mac_address": "00:13:a2:00:40:c0:97:f1"
 *             }, {
 *                 "mac_address": "00:13:a2:00:40:c0:97:f2"
 *             }]
 *         }
 *     }
 *   Success example for dataType=digiEventLog
 *     {
 *         "success": 1,
 *         "message": {
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "logUrl": "s3://example-bucket/digi.log",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "digiEventLog",
 *             "_id": "56096cfe2fd6d8d906b52d72",
 *             "uploadTime": "2015-09-28T00:00:00.000Z"
 *         }
 *     }
 *   Success example for dataType=digiStatus
 *     {
 *         "success": 1,
 *         "message": {
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "digiStatus",
 *             "_id": "560ac1f3ff52bdd40dc76597",
 *             "thermostatLastReportTime": "2015-09-14T12:37:45.174566Z",
 *             "thermostatDataReportingStatus": "real time",
 *             "gemLastReportTime": "2015-09-14T12:36:17.640507Z",
 *             "gemDataReportingStatus": "real time",
 *             "internetConnectivity": "Yes",
 *             "devices": [{
 *                 "mac_address": "00:0d:6f:00:02:f7:46:86",
 *                 "device_type": "Thermostat"
 *             }, {
 *                 "mac_address": "00:13:a2:00:40:30:e8:33",
 *                 "device_type": "GEM"
 *             }],
 *             "dateTime": "2015-09-14T12:37:45.990426Z"
 *         }
 *     }
 *   Success example for dataType=gemConfig
 *     {
 *         "success": 1,
 *         "message": [{
 *             "_id": "56140553379e00a70a461a4b",
 *             "deviceID": "00:13:a2:00:40:30:e8:33",
 *             "ctChannelsType": "B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,
 *             B4,90,90,90,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3",
 *             "primaryPacketFormat": 9,
 *             "packetSendInterval": 2,
 *             "realtimeReporting": true,
 *             "tag": "55633fb725db5c501fd1afc5",
 *             "dataType": "gemConfig",
 *             "__v": 0
 *         }]
 *     }
 *   Success example for dataType=gatewaySoftware
 *     {
 *         "success": 1,
 *         "message": [{
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "status": "success",
 *             "softwareVersion": "1.0.5",
 *             "upgradeTime": "2015-10-08T00:00:00.000Z",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "gatewaySoftware",
 *             "_id": "5615e69f5cab0ae2137aec8b"
 *         }]
 *     }
 *   Success example for dataType=gatewayNetwork
 *     {
 *         "success": 1,
 *         "message": [{
 *             "__v": 0,
 *             "deviceID": "00:13:a2:00:40:c0:97:f1",
 *             "networkState": "open",
 *             "tag": "55521cf9a25a0c541b38d908",
 *             "dataType": "gatewayNetwork",
 *             "_id": "561c0230e314ec0d081663ee"
 *         }]
 *     }
 *   Success example for dataType=thermostatTemperature
 *     {
 *         "success": 1,
 *         "message": [{
 *             "__v": 0,
 *             "deviceID": "00:0d:6f:00:02:f7:46:86",
 *             "status": "success",
 *             "heatSetpoint": 10,
 *             "coolSetpoint": 15,
 *             "ts": "2015-10-14T00:00:00.000Z",
 *             "errorCode": 0,
 *             "tag": "55521d53a25a0c541b38d909",
 *             "dataType": "thermostatTemperature",
 *             "_id": "561ea765640436311db64903",
 *             "description": null
 *         }]
 *     }
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/state", checkAuth, function(req, res, next) {

    var stateObj = req.body;
    var dataType = req.query.dataType;

    function validateParams() {
        if (_.isEmpty(dataType)) {
            return new Error(consts.SERVER_ERRORS.TAG.STATE.EMPTY_DATATYPE);
        }
        if (_.isEmpty(stateObj)) {
            return new Error(consts.SERVER_ERRORS.TAG.STATE.EMPTY_STATE);
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    tagStateDAO.postTagState(dataType, stateObj, function(err, result){
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * @api {post} /v1/tags/notifications?dataType=:dataType Send Command to Devices
 * @apiGroup Tag States
 * @apiName Send Command to Devices
 * @apiVersion 1.0.0
 * @apiDescription Send command/notification to devices according to dataType parameter
 * @apiParam {String} tagId _id of tag corresponding to the device
 * @apiParam {String} dataType type of tagState data (e.g. presentDeviceConfig, presentDeviceStatus)
 * @apiParam {Object} body Command object according to dataType parameter
 * @apiSampleRequest /v1/tags/notifications?dataType=presentDeviceConfig
 * @apiExample Example request
 *   Example request for dataType=presentDeviceConfig
 *     tags ["55521cf9a25a0c541b38d90b"],
 *     command:
 *     {
 *        "initialized": true,
 *        "presentationID": "54919e9300e34b15006f2dc6",
 *        "userEmail": "dev.mobile2@brightergy.com",
 *        "userPassword": "Brightergy1",
 *        "generalSetting": {
 *            "URL": "http://brightergy.force.com/brighterview2?id=a3zC0000000TOpm&start_min=0&start_sec=0",
 *            "startDsrOnBoot": true,
 *            "deviceName": "BrighterLink Present Display"
 *        },
 *        "networkSetting":  {
 *            "connectionType": "ethernet",
 *            "ethernetState": true,
 *            "ethernetDevice": "eth0",
 *            "ethernetIpType": "DHCP",
 *            "ip": "192.168.1.100",
 *            "mask": "255.255.255.0",
 *            "gateway": "192.168.1.1",
 *            "dns1": "8.8.8.8",
 *            "dns2": "8.8.4.4",
 *            "wifiState": true,
 *            "wifiOpenState": false,
 *            "wifiName": "SDZJ_1",
 *            "wifiSecurity": "WPA2 PSK", 
 *            "wifiPassword": "bpd",
 *            "wifiIpType": "Static",      
 *            "wifiIp": "192.168.1.100",
 *            "wifiGateway": "192.168.1.1",
 *            "wifiDns1": "8.8.8.8",
 *            "wifiDns2": "8.8.4.4"
 *        },
 *        "browserSetting": {
 *            "scheduleCleanup": {
 *                "enableCleanup": false,
 *                "timeOfExecution": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                },
 *                "clearCache": false,
 *                "clearOfflineData": false,
 *                "clearSessions": false,
 *                "clearCookies": false,
 *                "clearHistory": false,
 *                "clearFormData": false,
 *                "clearPasswords": false
 *            },
 *            "scheduleBrowserRestart": {
 *                "enableScheduleBrowserRestart": false,
 *                "configureScheduleBrowserRestart": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                }
 *            },
 *            "showStatusOnBrowser": false
 *        },
 *        "deviceStatusReporter": {
 *            "timeIntervalToMonitorStatus": 10,
 *            "timeIntervalToReport": 10,
 *            "preventSuspension": false,
 *            "ftpCredentials": {
 *                "ftpHost": "solest.brightergy.com",
 *                "ftpUsername": "solest.brightergy.com|jonathan.hockman",
 *                "ftpPassword": "hasam7Na"
 *            },
 *            "durationToAttempReconnection": 60
 *        },
 *        "password": "0000",
 *        "remoteConfigureSetting": {
 *            "automaticUpdate": {
 *                "enableAutomaticUpdate": false,
 *                "periodicalCheck": {
 *                    "type": "minutes",
 *                    "interval": 10
 *                }
 *            },
 *            "remoteConfigurePath": "/BrighterView/Remote Configuration/"
 *        },
 *        "remoteUpdateNewVersion": {
 *            "automaticUpdate": {
 *                "enableAutomaticUpdateNewVersion": false,
 *                "scheduleUpdateNewVersion": {
 *                    "type": "hourly",
 *                    "interval": 5,
 *                    "time": "8:00",
 *                    "dayOfWeek": "Sunday",
 *                    "dayOfMonth": 1
 *                }
 *            },
 *            "remoteUpdatePath": "/BrighterView/Remote Update/"
 *        },
 *        "importExport": {
 *            "importPath": "/Brightergy/DSR",
 *            "exportPath": "/Brightergy/DSR"
 *        }
 *     }
 *   Example request for dataType=presentDeviceStatus
 *     tags ["55521cf9a25a0c541b38d90b"],
 *     command:  is not needed for presentDeviceStatus
 *   Example request for dataType=digiConfig
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:
 *     {
 *        "PANID":"Oxff",
 *        "NJ_TIME":"60",
 *        "DATA_REPORT_INTERVAL":"120"
 *     }
 *   Example request for dataType=digiEndList
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:
 *     {
 *        "GEM": [
 *            {
 *                "mac_address": "00:13:a2:00:40:c0:97:f1"
 *            },
 *            {
 *                "mac_address": "00:13:a2:00:40:c0:97:f2"
 *            }
 *        ],
 *        "Thermostat": [
 *            {
 *                "mac_address": "00:0d:6f:00:02:f7:46:86"
 *            },
 *            {
 *                "mac_address": "00:0d:6f:00:02:f7:46:87"
 *            }
 *        ]
 *     }
 *   Example request for dataType=digiReboot
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:is not needed.
 *   Example request for dataType=digiStatusReport
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command: is not needed.
 *   Example request for dataType=digiEventLogReport
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command: is not needed.
 *   Example request for dataType=gemConfig
 *     tags ["55633fb725db5c501fd1afc5"],
 *     command:
 *     {
 *         "ctChannelsType": "B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,B4,90,
 *         90,90,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3,D3",
 *         "primaryPacketFormat": 9,
 *         "packetSendInterval": 2,
 *         "realtimeReporting": true
 *     }
 *   Example request for dataType=gatewaySoftware
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:
 *     {
 *         "softwareUrl": "https://assets.brightergy.com/CustomAssets/gatewaysoftware/software1.0.5.zip"
 *     }
 *   Example request for dataType=gatewayNetwork
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:
 *     {
 *         "networkState": "open",
 *         "interval": 300
 *     }
 *   Example request for dataType=thermostatTemperature
 *     tags ["55521cf9a25a0c541b38d908"],
 *     command:
 *     {
 *         "heatSetpoint": "24",
 *         "coolSetpoint": "27"
 *     }
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *   {
 *      "success": 1,
 *      "message": "OK"
 *   }
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/notifications", checkAuth, function(req, res, next) {
    var tagsId = req.body.tags;
    var dataType = req.query.dataType;
    var commandObj = req.body.command;

    function validateParams() {
        if(!validationUtil.isValidObjectIdArray(tagsId)) {
            return new Error(consts.SERVER_ERRORS.TAG.INCORRECT_TAG_ID);
        }
        if (_.isEmpty(dataType)) {
            return new Error(consts.SERVER_ERRORS.TAG.STATE.EMPTY_DATATYPE);
        }
        if (_.isEmpty(commandObj)) {
            return new Error("Empty command");
        }
        return null;
    }

    var validateErr = validateParams();
    if (validateErr) {
        validateErr.status = 422;
        return next(validateErr);
    }

    //get all tags
    async.map(tagsId, function(tagId, cb) {
        tagDAO.getTagByIdIfAllowed(tagId, req.user, cb);
    }, function(getTagsErr, foundTags) {
        if(getTagsErr) {
            return next(getTagsErr);
        }

        async.map(foundTags, function(tag, cb) {
            //process one tag

            var err = null;
            if ((dataType === consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG ||
                dataType === consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS) &&
                tag.tagType !== consts.TAG_TYPE.BPD) {
                err = new Error("You can not send this type of notification to " + tag.tagType);
                err.status = 422;
                return cb(err);
            } else if ((dataType === consts.TAG_STATE_DATATYPE.GEM_CONFIG ||
                dataType === consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE ||
                dataType === consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK) &&
                tag.tagType !== consts.TAG_TYPE.Scope) {
                err = new Error("You can not send this type of notification to " + tag.tagType);
                err.status = 422;
                return cb(err);
            } else if (dataType === consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE &&
                tag.tagType !== consts.TAG_TYPE.Node) {
                err = new Error("You can not send this type of notification to " + tag.tagType);
                err.status = 422;
                return cb(err);
            } else if (!tag.deviceID) {
                err = new Error("Please specify deviceID in tag");
                err.status = 422;
                return cb(err);
            } else {
                if (dataType === consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_CONFIG) {

                    commands.sendBPDConfigUpdateCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.PRESENT_DEVICE_STATUS) {

                    commands.sendBPDStatusRequestCommand(tag.deviceID, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.DIGI_CONFIG) {

                    commands.sendDigiConfigCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.DIGI_END_LIST) {

                    commands.sendDigiEndListCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.DIGI_REBOOT) {

                    commands.sendDigiRebootCommand(tag.deviceID, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.DIGI_STATUS_REPORT) {

                    commands.sendDigiStatusReportCommand(tag.deviceID, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.DIGI_EVENT_LOG_REPORT) {

                    commands.sendDigiEventLogReportCommand(tag.deviceID, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.GEM_CONFIG) {

                    commands.sendGEMConfigCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.GATEWAY_SOFTWARE) {

                    commands.sendGatewaySoftwareCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.GATEWAY_NETWORK) {

                    commands.sendGatewayNetworkCommand(tag.deviceID, commandObj, cb);

                }
                else if (dataType === consts.TAG_STATE_DATATYPE.THERMOSTAT_TEMPERATURE) {
                    commands.sendThermostatCommand(tag._id.toString(), tag.deviceID, commandObj.heatSetpoint,
                        commandObj.coolSetpoint, cb);

                }
                else {
                    var errRequiredParam = new Error(consts.SERVER_ERRORS.TAG.STATE.VALID_DATATYPE_REQUIRED);
                    errRequiredParam.status = 422;
                    return cb(errRequiredParam);
                }
            }
        }, function(processErr, processResults) {
            if(processErr) {
                return next(processErr);
            } else {
                return utils.successResponse(processResults[0], res, next);
            }
        });
    });
});


module.exports = router;

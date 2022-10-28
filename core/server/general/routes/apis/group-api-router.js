"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    groupDAO = require("../../core/dao/group-dao"),
    checkAuth = require("../../core/user/check-auth");

 /**
 * @api {get} /v1/groups/available Get Available Group Sources
 * @apiGroup Groups
 * @apiName Get Available Groups and Sources
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All Groups and Tags
 * @apiExample Example request
 * -
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "54d497f46a983219102e62ce",
 *          "name" : "GroupB",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 1,
 *          "information":"groupB description updated",
 *          "usersWithAccess" : [],
 *          "children" : [
 *          {"id":"5458a8a95409c90e00884ce0","sourceType":"Node"},
 *          {"id":"5458a84f5409c90e00884cdf","sourceType":"Scope"},
 *          {"id":"5458a8bc5409c90e00884ce1","sourceType":"Metric"},
 *          {"id":"54ddb1049f5501540ad9d711","sourceType":"Group"},
 *          {"sourceType":"Group","id":"54ddb1259f5501540ad9d713"}],
 *      },
 *      {
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
router.get("/available", checkAuth, function(req, res, next) {
    groupDAO.getAvailableSources(req.user, function(findErr, findObjects) {
        if (findErr) {
            return next(findErr);
        } else {
            return utils.successResponse(findObjects, res, next);
        }
    });
});

 /**
 * @api {get} /v1/groups/ Get All Groups
 * @apiGroup Groups
 * @apiName Get All Groups
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All Groups
 * @apiExample Example request
 * -
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "54d497f46a983219102e62ce",
 *          "name" : "GroupB",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 1,
 *          "information":"groupB description updated",
 *          "usersWithAccess" : [],
 *          "children" : [
 *          {"id":"5458a8a95409c90e00884ce0","sourceType":"Node"},
 *          {"id":"5458a84f5409c90e00884cdf","sourceType":"Scope"},
 *          {"id":"5458a8bc5409c90e00884ce1","sourceType":"Metric"},
 *          {"id":"54ddb1049f5501540ad9d711","sourceType":"Group"},
 *          {"sourceType":"Group","id":"54ddb1259f5501540ad9d713"}],
 *      },
 *      {
 *          "_id" : "54ddb1049f5501540ad9d711",
 *          "name" : "GroupA",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 1,
 *          "information":"groupA description updated",
 *          "usersWithAccess" : [],
 *          "children" : [
 *          {"id":"5458a2acb0091419007e03df","name":"Liberty Lofts","sourceType":"Facility"},
 *          {"id":"5458c7bec0fa5a0e0045f195","name":"Number of Events","sourceType":"Metric"},
 *          {"id":"5458c56fc0fa5a0e0045f17c","name":"Voltage","sourceType":"Metric"}],
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/", checkAuth, function(req, res, next) {
    groupDAO.getGroupsByParams({}, function(findErr, findObjects) {
        if (findErr) {
            return next(findErr);
        } else {
            return utils.successResponse(findObjects, res, next);
        }
    });
});

 /**
 * @api {get} /v1/groups/:groupId Get Group
 * @apiGroup Groups
 * @apiName Get Group
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the Group by Id
 * @apiExample Example request
 *  groupId : 54d497f46a983219102e62ce
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "54d497f46a983219102e62ce",
 *          "name" : "GroupB",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 1,
 *          "information":"groupB description updated",
 *          "usersWithAccess" : [],
 *          "children" : [
 *          {"id":"5458a8a95409c90e00884ce0","sourceType":"Node"},
 *          {"id":"5458a84f5409c90e00884cdf","sourceType":"Scope"},
 *          {"id":"5458a8bc5409c90e00884ce1","sourceType":"Metric"},
 *          {"id":"54ddb1049f5501540ad9d711","sourceType":"Group"},
 *          {"sourceType":"Group","id":"54ddb1259f5501540ad9d713"}],
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:groupId", checkAuth, function(req, res, next) {
    var idArray = [req.params.groupId];

    groupDAO.getGroupsByParams({_id: { $in: idArray}}, function(findErr, findObjects) {
        if (findErr) {
            return next(findErr);
        } else {
            return utils.successResponse(findObjects[0], res, next);
        }
    });
});

 /**
 * @api {post} /v1/groups Create Group
 * @apiGroup Groups
 * @apiName Create Group
 * @apiVersion 1.0.0
 * @apiDescription Create new group with associated sources
 * @apiParam {Object} body Group data
 * @apiExample Example request
 *  body
 *  {
 *      "name": "GroupEnergy",
 *      "information": "This is description for GroupEnergy",
 *      "creatorRole" : "BP",
 *      "children" : [ 
 *          {
 *              "id" : "54ddb1049f5501540ad9d711",
 *              "sourceType" : "Group"
 *          },
 *          {
 *              "id" : "54ddb1159f5501540ad9d712",
 *              "sourceType" : "Group"
 *          }
 *      ]
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Tag Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "54e300f8113759722faeecf9",
 *          "name" : "GroupEnergy",
 *          "information" : "This is description for GroupEnergy",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 0,
 *          "usersWithAccess" : [],
 *          "children" : [ 
 *              {
 *                  "id" : "54ddb1049f5501540ad9d711",
 *                  "sourceType" : "Group"
 *              },
 *              {
 *                  "id" : "54ddb1159f5501540ad9d712",
 *                  "sourceType" : "Group"
 *              }
 *          ]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", checkAuth, function(req, res, next) {
    var groupObj = req.body;

    utils.removeMongooseVersionField(groupObj);

    groupDAO.createGroup(groupObj, req.user, function (err, result){
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * API: Add Group Source
 */
router.post("/source", checkAuth, function(req, res, next) {
    var groupId = req.body.groupId;
    var sourceId = req.body.sourceId;
    var sourceType = req.body.sourceType;

    groupDAO.addSource(groupId, sourceId, sourceType, req.user, function (err, result){
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * API: Remove Group Source
 */
router.delete("/source", checkAuth, function(req, res, next) {
    var groupId = req.body.groupId;
    var sourceId = req.body.sourceId;
    var sourceType = req.body.sourceType;
    groupDAO.removeSource(groupId, sourceId, sourceType, req.user, function (err, result){
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

 /**
 * @api {put} /v1/groups/:groupId Edit Group
 * @apiGroup Groups
 * @apiName Edit Group
 * @apiVersion 1.0.0
 * @apiDescription Update group with associated sources
 * @apiParam {Object} body Group data
 * @apiExample Example request
 *  groupId : 54d497f46a983219102e62ce
 *  body
 *  {
 *      "name": "GroupB",
 *      "information": "This is updated description for GroupEnergy",
 *      "creatorRole" : "BP",
 *      "children" : [ 
 *          {
 *              "id" : "54d496f26a983219102e62cd",
 *              "sourceType" : "Group"
 *          }
 *      ]
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated Group Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "54d497f46a983219102e62ce",
 *          "name" : "GroupEnergy",
 *          "information" : "This is updated description for GroupEnergy",
 *          "creatorRole" : "BP",
 *          "creator" : "54135f90c6ab7c241e28095e",
 *          "__v" : 0,
 *          "usersWithAccess" : [],
 *          "children" : [ 
 *              {
 *                  "id" : "54d496f26a983219102e62cd",
 *                  "sourceType" : "Group"
 *              }
 *          ]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:groupId", checkAuth, function(req, res, next) {
    var groupId = req.params.groupId;
    var groupObj = req.body;

    utils.removeMongooseVersionField(groupObj);

    groupDAO.editGroup(groupId, groupObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

 /**
 * @api {delete} /v1/groups/:groupId Delete Group
 * @apiGroup Groups
 * @apiName Delete Group
 * @apiVersion 1.0.0
 * @apiDescription Delete group and remove itself from associated groups
 * @apiExample Example request
 *  groupId : 54d497f46a983219102e62ce
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Tag Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [
 *          "54d497f46a983219102e62ce"
 *      ]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:groupId", checkAuth, function(req, res, next) {
    var idArray = [req.params.groupId];

    groupDAO.deleteGroupById(idArray, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

module.exports = router;
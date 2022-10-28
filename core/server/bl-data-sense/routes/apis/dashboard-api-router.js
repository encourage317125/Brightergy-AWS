"use strict";

var express = require("express"),
    router = express.Router(),
    _ = require("lodash"),
    utils = require("../../../libs/utils"),
    widgetDAO = require("../../core/dao/widget-dao"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../../general/core/user/check-auth"),
    authUtils = require("../../../general/core/user/auth-utils"),
    exportHelper = require("../../core/helpers/export"),
    dataSenseWidgetBodyParser = require("../../core/calculation/widget/widget-body-parser"),
    dashboardDAO = require("../../core/dao/dashboard-dao"),
    async = require("async");

 /**
 * @api {post} /v1/analyze/dashboards Create Dashboard
 * @apiGroup Dashboard
 * @apiName Create Dashboard
 * @apiVersion 1.0.0
 * @apiDescription Create dashboard. <br/>
 * Following fields can't be inserted: <br/>
 *      segments <br/>
 *      awsAssetsKeyPrefix <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body Dashboard data
 * @apiExample Example request
 *  body
 *  { 
 *      "title" : "Water Bill",
 *      "collections" : [ "bills" ],
 *      "startDate" : "2014-10-01T15:00:15.493Z",
 *      "endDate" : "2014-11-01T16:00:15.493Z",
 *      "layout" : { "selectedStyle" : 2, "widgets" : { "column0" : [], "column1" : [] } } 
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Dashboard object
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": {
 *       "_id": "54b4f41679fc46d01f9f50fe",
 *       "title": "Water Bill",
 *       "startDate": "2014-10-01T15:00:15.493Z",
 *       "endDate": "2015-01-13T10:31:50.055Z",
 *       "creator": "2014-11-01T16:00:15.493Z",
 *       "creatorRole": "BP",
 *       "__v": 1,
 *       "isViewerTime": false,
 *       "default": false,
 *       "segments": [],
 *       "subDay": null,
 *       "isPrivate": false,
 *       "isRealTimeDateRange": false,
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "awsAssetsKeyPrefix": "UnOBGdnAqhCd",
 *       "widgets": [],
 *       "collections": [
 *           "bills"
 *       ],
 *       "layout": {
 *           "selectedStyle": 2,
 *           "widgets": {
 *               "column0": [],
 *               "column1": []
 *           },
 *           "includePrimary": false
 *       }
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", checkAuth, function(req, res, next) {
    var dashboardObj = req.body;

    utils.removeMongooseVersionField(dashboardObj);
    utils.removeMultipleFields(dashboardObj,
        [
            "segments",
            "awsAssetsKeyPrefix"
        ]
    );

    dashboardDAO.createDashboard(dashboardObj, req.user, function(err, result) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

 /**
 * @api {put} /v1/analyze/dashboards/:dashboardId Update Dashboard
 * @apiGroup Dashboard
 * @apiName Update Dashboard
 * @apiVersion 1.0.0
 * @apiDescription Edit dashboard. API can accept only changed fields. However, id is mandatory. <br/>
 * Following fields can't be updated: <br/>
 *      segments <br/>
 *      awsAssetsKeyPrefix <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body Dashboard data
 * @apiExample Example request
 *  dashboardId : 54b4f41679fc46d01f9f50fe
 *  body
 *  { 
 *      "title" : "Plant Overview Test"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Dashboard object
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": {
 *       "_id": "54b4f41679fc46d01f9f50fe",
 *       "title": "Plant Overview Test",
 *       "startDate": "2014-12-13T10:31:50.055Z",
 *       "endDate": "2015-01-13T10:31:50.055Z",
 *       "creator": "54621cd2349cc84500dee9ea",
 *       "creatorRole": "BP",
 *       "__v": 1,
 *       "isViewerTime": false,
 *       "default": false,
 *       "segments": [],
 *       "subDay": null,
 *       "isPrivate": false,
 *       "isRealTimeDateRange": false,
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "awsAssetsKeyPrefix": "UnOBGdnAqhCd",
 *       "widgets": [],
 *       "collections": [
 *           "my test"
 *       ],
 *       "layout": {
 *           "selectedStyle": 2,
 *           "widgets": {
 *               "column0": [],
 *               "column1": []
 *           },
 *           "includePrimary": false
 *       }
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:dashboardId", checkAuth, function(req, res, next) {
    var dashboardObj = req.body;
    var dashboardId = req.params.dashboardId;

    utils.removeMongooseVersionField(dashboardObj);

    utils.removeMultipleFields(dashboardObj,
        [
            "segments",
            "awsAssetsKeyPrefix"
        ]
    );

    dashboardDAO.editDashboard(dashboardObj, dashboardId, req.user, function(err, result) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/*
 * private 
 * filter collections from dashboard list
 */
function filterCollections(dashboards, callback) {
    var collections = [];
    _.each(dashboards, function(dashboard) {
        var collection = dashboard.collections[0];
        if(collection) {
            if(collections.indexOf(collection) === -1) {
                collections.push(collection);
            }
        }
    });

    callback(collections);
}

 /**
 * @api {get} /v1/analyze/dashboards/collections Get Analyze collections all
 * @apiGroup Dashboard
 * @apiName Get Analyze collections all
 * @apiVersion 1.0.0
 * @apiDescription Retrieves analyze collections all
 *
 * @apiSuccess success 1
 * @apiSuccess message collections array
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "collections":[
 *              "PV Solar Power Plant",
 *              "Liberty Lofts - Energy Profile",
 *              "Temp",
 *              "Default Dashboards"
 *          ]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/collections", checkAuth, function(req, res, next) {
    if(req.user.role === consts.USER_ROLES.BP) {
        dashboardDAO.getDashboardsAll(function(findErr, dashboards) {
            if(findErr) {
                return next(findErr);
            }
            else {
                filterCollections(dashboards, function(collections) {
                    return utils.successResponse({"collections": collections}, res, next);
                });
            }
        });
    }
    else {
        dashboardDAO.getDashboardsByParams({"default": false}, function(findErr, dashboards) {
            if(findErr) {
                return next(findErr);
            }
            else {
                filterCollections(dashboards, function(collections) {
                    return utils.successResponse({"collections": collections}, res, next);
                });
            }
        });
    }
});

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId Get Dashboard By Id
 * @apiGroup Dashboard
 * @apiName Get dashboard by Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the dashboard data by Id
 * @apiExample Example request
 *  dashboardId : 5461363bdfef7c4800146f4b
 *
 * @apiSuccess success 1
 * @apiSuccess message dashboard data
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id": "5413612ad37f4ab56f1fb175",
 *          "title": "Yakov First Dashboard",
 *          "startDate": "2014-07-09T00:00:00.000Z",
 *          "endDate": "2014-08-13T00:00:00.000Z",
 *          "creator": "54135cb4cde72bc019ff39bd",
 *          "creatorRole": "BP",
 *          "__v": 99,
 *          "segments": [{
 *              "tags" : [{
 *                  "_id" : "543824bd7174d62c1acad50f",
 *                  "tagType" : "Facility",
 *                  "name" : "Barretts Elementary",
 *                  "creatorRole" : "BP",
 *                  "creator" : "54133e8fd361774c1696f265",
 *                  "__v" : 0,
 *                  "usersWithAccess" : [{
 *                      "id" : "54133e8fd361774c1696f265"
 *                  }, 
 *                  {
 *                      "id" : "54135ec74f09ccc06d5be3d6"
 *                  }, 
 *                  {
 *                      "id" : "5429d0ba89c1849502287d5c"
 *                  }],
 *                  "appEntities" : [{
 *                      "id" : "5413af68b1c838ea73500109",
 *                      "appName" : "Presentation"
 *                  }],
 *                  "children" : [{
 *                      "id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope"
 *                  }, 
 *                  {
 *                      "id" : "543824be7174d62c1acad517",
 *                      "tagType" : "Scope"
 *                  }],
 *                  "parents" : [],
 *                  "formula" : null,
 *                  "metricID" : null,
 *                  "metricType" : null,
 *                  "metric" : null,
 *                  "sensorTarget" : null,
 *                  "enphaseUserId" : null,
 *                  "endDate" : null,
 *                  "weatherStation" : null,
 *                  "longitude" : null,
 *                  "latitude" : null,
 *                  "webAddress" : null,
 *                  "interval" : null,
 *                  "destination" : null,
 *                  "accessMethod" : null,
 *                  "deviceID" : null,
 *                  "device" : null,
 *                  "manufacturer" : null,
 *                  "utilityAccounts" : ["6655"],
 *                  "utilityProvider" : "Ameren",
 *                  "nonProfit" : true,
 *                  "taxID" : "78",
 *                  "street" : "",
 *                  "state" : "",
 *                  "postalCode" : "",
 *                  "country" : "",
 *                  "city" : "",
 *                  "childTags" : [{
 *                      "_id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope",
 *                      "name" : "Sunny WebBox",
 *                      "creatorRole" : "BP",
 *                      "creator" : "54133e8fd361774c1696f265",
 *                      "__v" : 0,
 *                      "usersWithAccess" : [{
 *                          "id" : "54133e8fd361774c1696f265"
 *                      }],
 *                      "appEntities" : [{
 *                          "id" : "5429d13f89c1849502287d5d",
 *                          "appName" : "Presentation"
 *                      }],
 *                      "children" : [{
 *                          "id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor"
 *                      }],
 *                      "parents" : [{
 *                          "id" : "543824bd7174d62c1acad50f",
 *                          "tagType" : "Facility"
 *                      }],
 *                      "formula" : null,
 *                      "metricID" : null,
 *                      "metricType" : null,
 *                      "metric" : null,
 *                      "sensorTarget" : null,
 *                      "enphaseUserId" : null,
 *                      "endDate" : null,
 *                      "weatherStation" : "--Use NOAA--",
 *                      "longitude" : -36.5678,
 *                      "latitude" : 94.1234,
 *                      "webAddress" : "http://google.com",
 *                      "interval" : "Daily",
 *                      "destination" : "127.0.0.1",
 *                      "accessMethod" : "Push to FTP",
 *                      "deviceID" : "wb150115159",
 *                      "device" : "Sunny WebBox",
 *                      "manufacturer" : "manufacturerA",
 *                      "utilityAccounts" : [],
 *                      "utilityProvider" : null,
 *                      "nonProfit" : null,
 *                      "taxID" : null,
 *                      "street" : null,
 *                      "state" : null,
 *                      "postalCode" : null,
 *                      "country" : null,
 *                      "city" : null,
 *                      "childTags" : [{
 *                          "_id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor",
 *                          "name" : "Inverter A",
 *                          "creatorRole" : "BP",
 *                          "creator" : "54133e8fd361774c1696f265",
 *                          "__v" : 0,
 *                          "usersWithAccess" : [{
 *                              "id" : "54133e8fd361774c1696f265"
 *                          }],
 *                          "appEntities" : [],
 *                          "children" : [{
 *                              "id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric"
 *                          }],
 *                          "parents" : [{
 *                              "id" : "543824bd7174d62c1acad510",
 *                              "tagType" : "Scope"
 *                          }],
 *                          "formula" : null,
 *                          "metricID" : null,
 *                          "metricType" : null,
 *                          "metric" : null,
 *                          "sensorTarget" : "sss",
 *                          "enphaseUserId" : null,
 *                          "endDate" : null,
 *                          "weatherStation" : "--Use NOAA--",
 *                          "longitude" : -36.5678,
 *                          "latitude" : 94.1234,
 *                          "webAddress" : null,
 *                          "interval" : "Daily",
 *                          "destination" : null,
 *                          "accessMethod" : null,
 *                          "deviceID" : "WR7KU009:2002112282",
 *                          "device" : "Sunny WebBox",
 *                          "manufacturer" : "manufacturerA",
 *                          "utilityAccounts" : [],
 *                          "utilityProvider" : null,
 *                          "nonProfit" : null,
 *                          "taxID" : null,
 *                          "street" : null,
 *                          "state" : null,
 *                          "postalCode" : null,
 *                          "country" : null,
 *                          "city" : null,
 *                          "childTags" : [{
 *                              "_id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric",
 *                              "name" : "Watts (Power)",
 *                              "creatorRole" : "BP",
 *                              "creator" : "54133e8fd361774c1696f265",
 *                              "__v" : 0,
 *                              "usersWithAccess" : [{
 *                                  "id" : "54133e8fd361774c1696f265"
 *                              }],
 *                              "appEntities" : [],
 *                              "children" : [],
 *                              "parents" : [{
 *                                  "id" : "543824be7174d62c1acad511",
 *                                  "tagType" : "Sensor"
 *                              }],
 *                              "formula" : null,
 *                              "metricID" : "Pac",
 *                              "metricType" : "Datafeed",
 *                              "metric" : "Standard",
 *                              "sensorTarget" : null,
 *                              "enphaseUserId" : null,
 *                              "endDate" : null,
 *                              "weatherStation" : null,
 *                              "longitude" : null,
 *                              "latitude" : null,
 *                              "webAddress" : null,
 *                              "interval" : null,
 *                              "destination" : null,
 *                              "accessMethod" : null,
 *                              "deviceID" : null,
 *                              "device" : null,
 *                              "manufacturer" : null,
 *                              "utilityAccounts" : [],
 *                              "utilityProvider" : null,
 *                              "nonProfit" : null,
 *                              "taxID" : null,
 *                              "street" : null,
 *                              "state" : null,
 *                              "postalCode" : null,
 *                              "country" : null,
 *                              "city" : null
 *                          }]
 *                      }],
 *                  }],
 *              }],
 *              "name" : "Untitled Segment"
 *          }],
 *          "compareEndDate": "2013-08-13T00:00:00.000Z",
 *          "compareStartDate": "2013-07-09T00:00:00.000Z",
 *          "widgets": [{
 *              "widget": {
 *                  "_id": "5413692b8dee97ac707b38dc",
 *                  "type": "Bar",
 *                  "title": "Bar Sample",
 *                  "metric": null,
 *                  "creatorRole": "BP",
 *                  "__v": 0,
 *                  "compareMetric": null,
 *                  "greenhouseKilograms": false,
 *                  "co2Kilograms": false,
 *                  "equivType": null,
 *                  "orientation": null,
 *                  "showUpTo": null,
 *                  "imageUrl": null,
 *                  "drillDown": null,
 *                  "displayedColumns": [],
 *                  "rowsPerTable": null,
 *                  "pivotDimension": "hour",
 *                  "groupDimension": "month",
 *                  "titleShow": true
 *              }
 *          }],
 *          "gDriveAssetsFolderId": "0BwW4a4uizniHZHVXWGhJX3lEcDA",
 *          "collections": ["Yakov First Collection"],
 *          "layout": {
 *              "selectedStyle": 2,
 *              "widgets": []
 *          }
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId", function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var isViewer = req.query.isViewer;

    authUtils.isAuthenticatedUser(req, false, function (findUserErr, currentUser) {
        if (findUserErr) {
            if (isViewer) {
                dashboardDAO.getDashboardById(dashboardId, null, function (findErr, foundDashboard) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        return utils.successResponse(foundDashboard, res, next);
                    }
                });
            } else {
                return next(findUserErr);
            }
        } else {
            dashboardDAO.getDashboardById(dashboardId, currentUser, function (findErr, findDashboards) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(findDashboards, res, next);
                }
            });
        }
    });
});

/**
 * @api {get} /v1/analyze/dashboards?searchKey=:searchKey Get All Dashboards
 * @apiGroup Dashboard
 * @apiName GetDashboardList
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the dashboard data of currently logged in user. 
 *  when searchKey is specified instead of all_data, it retrieves the list 
 *  of the dashboards matching the collection title.
 * @apiExample Example request
 *  searchKey : PV Solar Power Plant
 *
 * @apiSuccess success 1
 * @apiSuccess message list of dashboards
 *
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id": "5413612ad37f4ab56f1fb175",
 *          "title": "Yakov First Dashboard",
 *          "startDate": "2014-07-09T00:00:00.000Z",
 *          "endDate": "2014-08-13T00:00:00.000Z",
 *          "creator": "54135cb4cde72bc019ff39bd",
 *          "creatorRole": "BP",
 *          "__v": 99,
 *          "segments": [{
 *              "tags" : [{
 *                  "_id" : "543824bd7174d62c1acad50f",
 *                  "tagType" : "Facility",
 *                  "name" : "Barretts Elementary",
 *                  "creatorRole" : "BP",
 *                  "creator" : "54133e8fd361774c1696f265",
 *                  "__v" : 0,
 *                  "usersWithAccess" : [{
 *                      "id" : "54133e8fd361774c1696f265"
 *                  }],
 *                  "appEntities" : [{
 *                      "id" : "5413af68b1c838ea73500109",
 *                      "appName" : "Presentation"
 *                  }],
 *                  "children" : [{
 *                      "id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope"
 *                  }, 
 *                  {
 *                      "id" : "543824be7174d62c1acad517",
 *                      "tagType" : "Scope"
 *                  }],
 *                  "parents" : [],
 *                  "formula" : null,
 *                  "metricID" : null,
 *                  "metricType" : null,
 *                  "metric" : null,
 *                  "sensorTarget" : null,
 *                  "enphaseUserId" : null,
 *                  "endDate" : null,
 *                  "weatherStation" : null,
 *                  "longitude" : null,
 *                  "latitude" : null,
 *                  "webAddress" : null,
 *                  "interval" : null,
 *                  "destination" : null,
 *                  "accessMethod" : null,
 *                  "deviceID" : null,
 *                  "device" : null,
 *                  "manufacturer" : null,
 *                  "utilityAccounts" : ["6655"],
 *                  "utilityProvider" : "Ameren",
 *                  "nonProfit" : true,
 *                  "taxID" : "78",
 *                  "street" : "",
 *                  "state" : "",
 *                  "postalCode" : "",
 *                  "country" : "",
 *                  "city" : "",
 *                  "childTags" : [{
 *                      "_id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope",
 *                      "name" : "Sunny WebBox",
 *                      "creatorRole" : "BP",
 *                      "creator" : "54133e8fd361774c1696f265",
 *                      "__v" : 0,
 *                      "usersWithAccess" : [{
 *                          "id" : "54133e8fd361774c1696f265"
 *                      }],
 *                      "appEntities" : [{
 *                          "id" : "5429d13f89c1849502287d5d",
 *                          "appName" : "Presentation"
 *                      }],
 *                      "children" : [{
 *                          "id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor"
 *                      }],
 *                      "parents" : [{
 *                          "id" : "543824bd7174d62c1acad50f",
 *                          "tagType" : "Facility"
 *                      }],
 *                      "formula" : null,
 *                      "metricID" : null,
 *                      "metricType" : null,
 *                      "metric" : null,
 *                      "sensorTarget" : null,
 *                      "enphaseUserId" : null,
 *                      "endDate" : null,
 *                      "weatherStation" : "--Use NOAA--",
 *                      "longitude" : -36.5678,
 *                      "latitude" : 94.1234,
 *                      "webAddress" : "http://google.com",
 *                      "interval" : "Daily",
 *                      "destination" : "127.0.0.1",
 *                      "accessMethod" : "Push to FTP",
 *                      "deviceID" : "wb150115159",
 *                      "device" : "Sunny WebBox",
 *                      "manufacturer" : "manufacturerA",
 *                      "utilityAccounts" : [],
 *                      "utilityProvider" : null,
 *                      "nonProfit" : null,
 *                      "taxID" : null,
 *                      "street" : null,
 *                      "state" : null,
 *                      "postalCode" : null,
 *                      "country" : null,
 *                      "city" : null,
 *                      "childTags" : [{
 *                          "_id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor",
 *                          "name" : "Inverter A",
 *                          "creatorRole" : "BP",
 *                          "creator" : "54133e8fd361774c1696f265",
 *                          "__v" : 0,
 *                          "usersWithAccess" : [{
 *                              "id" : "54133e8fd361774c1696f265"
 *                          }],
 *                          "appEntities" : [],
 *                          "children" : [{
 *                              "id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric"
 *                          }],
 *                          "parents" : [{
 *                              "id" : "543824bd7174d62c1acad510",
 *                              "tagType" : "Scope"
 *                          }],
 *                          "formula" : null,
 *                          "metricID" : null,
 *                          "metricType" : null,
 *                          "metric" : null,
 *                          "sensorTarget" : "sss",
 *                          "enphaseUserId" : null,
 *                          "endDate" : null,
 *                          "weatherStation" : "--Use NOAA--",
 *                          "longitude" : -36.5678,
 *                          "latitude" : 94.1234,
 *                          "webAddress" : null,
 *                          "interval" : "Daily",
 *                          "destination" : null,
 *                          "accessMethod" : null,
 *                          "deviceID" : "WR7KU009:2002112282",
 *                          "device" : "Sunny WebBox",
 *                          "manufacturer" : "manufacturerA",
 *                          "utilityAccounts" : [],
 *                          "utilityProvider" : null,
 *                          "nonProfit" : null,
 *                          "taxID" : null,
 *                          "street" : null,
 *                          "state" : null,
 *                          "postalCode" : null,
 *                          "country" : null,
 *                          "city" : null,
 *                          "childTags" : [{
 *                              "_id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric",
 *                              "name" : "Watts (Power)",
 *                              "creatorRole" : "BP",
 *                              "creator" : "54133e8fd361774c1696f265",
 *                              "__v" : 0,
 *                              "usersWithAccess" : [{
 *                                  "id" : "54133e8fd361774c1696f265"
 *                              }],
 *                              "appEntities" : [],
 *                              "children" : [],
 *                              "parents" : [{
 *                                  "id" : "543824be7174d62c1acad511",
 *                                  "tagType" : "Sensor"
 *                              }],
 *                              "formula" : null,
 *                              "metricID" : "Pac",
 *                              "metricType" : "Datafeed",
 *                              "metric" : "Standard",
 *                              "sensorTarget" : null,
 *                              "enphaseUserId" : null,
 *                              "endDate" : null,
 *                              "weatherStation" : null,
 *                              "longitude" : null,
 *                              "latitude" : null,
 *                              "webAddress" : null,
 *                              "interval" : null,
 *                              "destination" : null,
 *                              "accessMethod" : null,
 *                              "deviceID" : null,
 *                              "device" : null,
 *                              "manufacturer" : null,
 *                              "utilityAccounts" : [],
 *                              "utilityProvider" : null,
 *                              "nonProfit" : null,
 *                              "taxID" : null,
 *                              "street" : null,
 *                              "state" : null,
 *                              "postalCode" : null,
 *                              "country" : null,
 *                              "city" : null
 *                          }]
 *                      }],
 *                  }],
 *              }],
 *              "name" : "Untitled Segment"
 *          }],
 *          "compareEndDate": "2013-08-13T00:00:00.000Z",
 *          "compareStartDate": "2013-07-09T00:00:00.000Z",
 *          "widgets": [{
 *              "widget": "5413692b8dee97ac707b38dc"
 *          }, {
 *              "widget": "541b137fa90e8de146a10c0d"
 *          }],
 *          "gDriveAssetsFolderId": "0BwW4a4uizniHZHVXWGhJX3lEcDA",
 *          "collections": ["Yakov First Collection"],
 *          "layout": {
 *              "selectedStyle": 2,
 *              "widgets": []
 *          }
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error Code
 *
 * @apiErrorExample Error example
 * {
 *      "success": 0,
 *      "message": "INCORRECT_SESSION"
 * }
 */
router.get("/?", function(req, res, next) {
    var searchKey = req.query.searchKey;
    var isViewer = req.query.isViewer;

    if(searchKey === consts.ALL) {
        searchKey = null;
    }
    
    authUtils.isAuthenticatedUser(req, false, function (findUserErr, currentUser) {
        if (findUserErr) {
            if (isViewer) {
                dashboardDAO.getDashboardsByParams({}, function (findErr, findDashboards) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        var retDashboards = dashboardDAO.getDashboardsByCollection(findDashboards);
                        console.log(retDashboards);
                        return utils.successResponse(retDashboards, res, next);
                    }
                });
            } else {
                return next(findUserErr);
            }
        } else {
            dashboardDAO.getDashboardsByUser(currentUser, searchKey, function (findErr, findDashboards) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(findDashboards, res, next);
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId/metrics Get Dashboard Metrics
 * @apiGroup Dashboard
 * @apiName Get metrics data of Dashboard
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the available metrics in Dashboard
 * @apiExample
 *  dashboardId : 5461fef951d2f91500187460
 *
 * @apiSuccess success 1
 * @apiSuccess message Metrics object
 *
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": {
 *       "Timeline": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Bar": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Pie": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Image": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Table": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Communication Monitoring": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Energy Consumed": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Energy Produced": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate System Information": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Weather": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Location": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           },
 *           {
 *               "_id": "5458bbf0c0fa5a0e0045f163",
 *               "name": "Target Voltage"
 *           },
 *           {
 *               "_id": "5458bc02c0fa5a0e0045f164",
 *               "name": "Direct Voltage to Ground"
 *           },
 *           {
 *               "_id": "5458bc29c0fa5a0e0045f165",
 *               "name": "Voltage"
 *           },
 *           {
 *               "_id": "5458bc53c0fa5a0e0045f166",
 *               "name": "Line Voltage L1-N"
 *           },
 *           {
 *               "_id": "5458bc61c0fa5a0e0045f167",
 *               "name": "Line Voltage L2-N"
 *           },
 *           {
 *               "_id": "5458bc73c0fa5a0e0045f168",
 *               "name": "Line Voltage L1-L2"
 *           },
 *           {
 *               "_id": "5458bc81c0fa5a0e0045f169",
 *               "name": "Temperature"
 *           },
 *           {
 *               "_id": "5458bca4c0fa5a0e0045f16a",
 *               "name": "# of Grid Connections"
 *           },
 *           {
 *               "_id": "5458bccbc0fa5a0e0045f16b",
 *               "name": "Maximum Voltage"
 *           },
 *           {
 *               "_id": "5458bce6c0fa5a0e0045f16c",
 *               "name": "Max Temperature at IGBT Module"
 *           },
 *           {
 *               "_id": "5458bd23c0fa5a0e0045f16d",
 *               "name": "Current"
 *           },
 *           {
 *               "_id": "5458bd52c0fa5a0e0045f16f",
 *               "name": "Input Terminal Voltage"
 *           },
 *           {
 *               "_id": "5458bd5fc0fa5a0e0045f170",
 *               "name": "Grid Current Phase"
 *           },
 *           {
 *               "_id": "5458bd70c0fa5a0e0045f171",
 *               "name": "Total Feed-In Time"
 *           },
 *           {
 *               "_id": "5458bd7ac0fa5a0e0045f172",
 *               "name": "Operating Time"
 *           },
 *           {
 *               "_id": "5458bd8cc0fa5a0e0045f173",
 *               "name": "Frequency"
 *           },
 *           {
 *               "_id": "5458bdabc0fa5a0e0045f174",
 *               "name": "Number of Events"
 *           },
 *           {
 *               "_id": "5458bdb6c0fa5a0e0045f175",
 *               "name": "Total Yield"
 *           },
 *           {
 *               "_id": "5458bdc7c0fa5a0e0045f176",
 *               "name": "CO2 Saved"
 *           },
 *           {
 *               "_id": "545906ddded7ea0f0079840c",
 *               "name": "Power (kW)"
 *           },
 *           {
 *               "_id": "545906e4ded7ea0f0079840d",
 *               "name": "Energy (Wh)"
 *           },
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           },
 *           {
 *               "_id": "54877ec86b894714006169f7",
 *               "name": "Relative Humidity"
 *           },
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           },
 *           {
 *               "_id": "54a2d23ad3d5a09700834086",
 *               "name": "Pressure"
 *           },
 *           {
 *               "_id": "54a2d274779c0be200c841ed",
 *               "name": "Apparent Power"
 *           }
 *       ],
 *       "Boilerplate Current Power": [
 *           {
 *               "_id": "5458a8bc5409c90e00884ce1",
 *               "name": "Power (W)"
 *           }
 *       ],
 *       "Boilerplate CO2 Avoided": [
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           }
 *       ],
 *       "Equivalencies": [
 *           {
 *               "_id": "545906edded7ea0f0079840e",
 *               "name": "Energy (kWh)"
 *           }
 *       ],
 *       "Boilerplate Reimbursement": [
 *           {
 *               "_id": "549dbcfe2aec371500d9737e",
 *               "name": "Reimbursement"
 *           }
 *       ]
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/metrics", function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var isViewer = req.query.isViewer;

    authUtils.isAuthenticatedUser(req, false, function (findUserErr, currentUser) {
        if (findUserErr) {
            if (isViewer) {
                dashboardDAO.getAvailableMetrics(dashboardId, null, function (findErr, findMetrics) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        return utils.successResponse(findMetrics, res, next);
                    }
                });                
            } else {
                return next(findUserErr);
            }
        } else {
            dashboardDAO.getAvailableMetrics(dashboardId, currentUser, function (findErr, findMetrics) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(findMetrics, res, next);
                }
            });
        }
    });
});

 /**
 * @api {delete} /v1/analyze/dashboards/:dashboardId Delete Dashbaord
 * @apiGroup Dashboard
 * @apiName Delete dashboard
 * @apiVersion 1.0.0
 * @apiDescription Remove dashboard by Id
 * @apiExample Example request
 *  dashboardId : 54638f77dfcbe62000a7ee0c
 *
 * @apiSuccess success 1
 * @apiSuccess message success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:dashboardId", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;

    dashboardDAO.deleteDashboardById(dashboardId, req.user, function (deleteErr, deleteResult) {
        if (deleteErr) {
            return next(deleteErr);
        } else {
            return utils.successResponse(deleteResult, res, next);
        }
    });
});

 /**
 * @api {post} /v1/analyze/dashboards/:dashboardId/tags/segments Create Analyze Segment
 * @apiGroup Dashboard
 * @apiName Create Segment
 * @apiVersion 1.0.0
 * @apiDescription Create new segment to dashboard
 * @apiParam {Object} body Segments object
 * @apiExample Example request:
 *  dashboardId : "5461363bdfef7c4800146f4b"
 *  body
 *  [{
 *      "name" : "test segment",
 *      "tagBindings" :[{
 *          "tagType":"Scope",
 *          "id":"543824c07174d62c1acad525"
 *      }]
 *  }]
 *
 * @apiSuccess success 1
 * @apiSuccess message Saved Dashboard Data
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id": "5413612ad37f4ab56f1fb175",
 *          "title": "Yakov First Dashboard",
 *          "startDate": "2014-07-09T00:00:00.000Z",
 *          "endDate": "2014-08-13T00:00:00.000Z",
 *          "creator": "54135cb4cde72bc019ff39bd",
 *          "creatorRole": "BP",
 *          "__v": 99,
 *          "segments": [{
 *              "tags" : [{
 *                  "_id" : "543824bd7174d62c1acad50f",
 *                  "tagType" : "Facility",
 *                  "name" : "Barretts Elementary",
 *                  "creatorRole" : "BP",
 *                  "creator" : "54133e8fd361774c1696f265",
 *                  "__v" : 0,
 *                  "usersWithAccess" : [{
 *                      "id" : "54133e8fd361774c1696f265"
 *                  }, 
 *                  {
 *                      "id" : "54135ec74f09ccc06d5be3d6"
 *                  }],
 *                  "appEntities" : [{
 *                      "id" : "5413af68b1c838ea73500109",
 *                      "appName" : "Presentation"
 *                  }],
 *                  "children" : [{
 *                      "id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope"
 *                  }, 
 *                  {
 *                      "id" : "543824be7174d62c1acad517",
 *                      "tagType" : "Scope"
 *                  }],
 *                  "parents" : [],
 *                  "formula" : null,
 *                  "metricID" : null,
 *                  "metricType" : null,
 *                  "metric" : null,
 *                  "sensorTarget" : null,
 *                  "enphaseUserId" : null,
 *                  "endDate" : null,
 *                  "weatherStation" : null,
 *                  "longitude" : null,
 *                  "latitude" : null,
 *                  "webAddress" : null,
 *                  "interval" : null,
 *                  "destination" : null,
 *                  "accessMethod" : null,
 *                  "deviceID" : null,
 *                  "device" : null,
 *                  "manufacturer" : null,
 *                  "utilityAccounts" : ["6655"],
 *                  "utilityProvider" : "Ameren",
 *                  "nonProfit" : true,
 *                  "taxID" : "78",
 *                  "street" : "",
 *                  "state" : "",
 *                  "postalCode" : "",
 *                  "country" : "",
 *                  "city" : "",
 *                  "childTags" : [{
 *                      "_id" : "543824bd7174d62c1acad510",
 *                      "tagType" : "Scope",
 *                      "name" : "Sunny WebBox",
 *                      "creatorRole" : "BP",
 *                      "creator" : "54133e8fd361774c1696f265",
 *                      "__v" : 0,
 *                      "usersWithAccess" : [{
 *                          "id" : "54133e8fd361774c1696f265"
 *                      }],
 *                      "appEntities" : [{
 *                          "id" : "5429d13f89c1849502287d5d",
 *                          "appName" : "Presentation"
 *                      }],
 *                      "children" : [{
 *                          "id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor"
 *                      }],
 *                      "parents" : [{
 *                          "id" : "543824bd7174d62c1acad50f",
 *                          "tagType" : "Facility"
 *                      }],
 *                      "formula" : null,
 *                      "metricID" : null,
 *                      "metricType" : null,
 *                      "metric" : null,
 *                      "sensorTarget" : null,
 *                      "enphaseUserId" : null,
 *                      "endDate" : null,
 *                      "weatherStation" : "--Use NOAA--",
 *                      "longitude" : -36.5678,
 *                      "latitude" : 94.1234,
 *                      "webAddress" : "http://google.com",
 *                      "interval" : "Daily",
 *                      "destination" : "127.0.0.1",
 *                      "accessMethod" : "Push to FTP",
 *                      "deviceID" : "wb150115159",
 *                      "device" : "Sunny WebBox",
 *                      "manufacturer" : "manufacturerA",
 *                      "utilityAccounts" : [],
 *                      "utilityProvider" : null,
 *                      "nonProfit" : null,
 *                      "taxID" : null,
 *                      "street" : null,
 *                      "state" : null,
 *                      "postalCode" : null,
 *                      "country" : null,
 *                      "city" : null,
 *                      "childTags" : [{
 *                          "_id" : "543824be7174d62c1acad511",
 *                          "tagType" : "Sensor",
 *                          "name" : "Inverter A",
 *                          "creatorRole" : "BP",
 *                          "creator" : "54133e8fd361774c1696f265",
 *                          "__v" : 0,
 *                          "usersWithAccess" : [{
 *                              "id" : "54133e8fd361774c1696f265"
 *                          }],
 *                          "appEntities" : [],
 *                          "children" : [{
 *                              "id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric"
 *                          }],
 *                          "parents" : [{
 *                              "id" : "543824bd7174d62c1acad510",
 *                              "tagType" : "Scope"
 *                          }],
 *                          "formula" : null,
 *                          "metricID" : null,
 *                          "metricType" : null,
 *                          "metric" : null,
 *                          "sensorTarget" : "sss",
 *                          "enphaseUserId" : null,
 *                          "endDate" : null,
 *                          "weatherStation" : "--Use NOAA--",
 *                          "longitude" : -36.5678,
 *                          "latitude" : 94.1234,
 *                          "webAddress" : null,
 *                          "interval" : "Daily",
 *                          "destination" : null,
 *                          "accessMethod" : null,
 *                          "deviceID" : "WR7KU009:2002112282",
 *                          "device" : "Sunny WebBox",
 *                          "manufacturer" : "manufacturerA",
 *                          "utilityAccounts" : [],
 *                          "utilityProvider" : null,
 *                          "nonProfit" : null,
 *                          "taxID" : null,
 *                          "street" : null,
 *                          "state" : null,
 *                          "postalCode" : null,
 *                          "country" : null,
 *                          "city" : null,
 *                          "childTags" : [{
 *                              "_id" : "543824be7174d62c1acad512",
 *                              "tagType" : "Metric",
 *                              "name" : "Watts (Power)",
 *                              "creatorRole" : "BP",
 *                              "creator" : "54133e8fd361774c1696f265",
 *                              "__v" : 0,
 *                              "usersWithAccess" : [{
 *                                  "id" : "54133e8fd361774c1696f265"
 *                              }],
 *                              "appEntities" : [],
 *                              "children" : [],
 *                              "parents" : [{
 *                                  "id" : "543824be7174d62c1acad511",
 *                                  "tagType" : "Sensor"
 *                              }],
 *                              "formula" : null,
 *                              "metricID" : "Pac",
 *                              "metricType" : "Datafeed",
 *                              "metric" : "Standard",
 *                              "sensorTarget" : null,
 *                              "enphaseUserId" : null,
 *                              "endDate" : null,
 *                              "weatherStation" : null,
 *                              "longitude" : null,
 *                              "latitude" : null,
 *                              "webAddress" : null,
 *                              "interval" : null,
 *                              "destination" : null,
 *                              "accessMethod" : null,
 *                              "deviceID" : null,
 *                              "device" : null,
 *                              "manufacturer" : null,
 *                              "utilityAccounts" : [],
 *                              "utilityProvider" : null,
 *                              "nonProfit" : null,
 *                              "taxID" : null,
 *                              "street" : null,
 *                              "state" : null,
 *                              "postalCode" : null,
 *                              "country" : null,
 *                              "city" : null
 *                          }]
 *                      }],
 *                  }],
 *              }],
 *              "name" : "Untitled Segment"
 *          }],
 *          "compareEndDate": "2013-08-13T00:00:00.000Z",
 *          "compareStartDate": "2013-07-09T00:00:00.000Z",
 *          "widgets": [{
 *              "widget": {
 *                  "_id": "5413692b8dee97ac707b38dc",
 *                  "type": "Bar",
 *                  "title": "Bar Sample",
 *                  "metric": null,
 *                  "creatorRole": "BP",
 *                  "__v": 0,
 *                  "compareMetric": null,
 *                  "greenhouseKilograms": false,
 *                  "co2Kilograms": false,
 *                  "equivType": null,
 *                  "orientation": null,
 *                  "showUpTo": null,
 *                  "imageUrl": null,
 *                  "drillDown": null,
 *                  "displayedColumns": [],
 *                  "rowsPerTable": null,
 *                  "pivotDimension": "hour",
 *                  "groupDimension": "month",
 *                  "titleShow": true
 *              }
 *          }, {
 *              "widget": {
 *                  "_id": "541b137fa90e8de146a10c0d",
 *                  "type": "Pie",
 *                  "title": "001test PieWidget",
 *                  "metric": null,
 *                  "creatorRole": "BP",
 *                  "__v": 0,
 *                  "compareMetric": null,
 *                  "greenhouseKilograms": false,
 *                  "co2Kilograms": false,
 *                  "equivType": null,
 *                  "orientation": null,
 *                  "showUpTo": null,
 *                  "imageUrl": null,
 *                  "drillDown": null,
 *                  "displayedColumns": [],
 *                  "rowsPerTable": null,
 *                  "pivotDimension": null,
 *                  "groupDimension": "day",
 *                  "titleShow": true
 *              }
 *          }],
 *          "gDriveAssetsFolderId": "0BwW4a4uizniHZHVXWGhJX3lEcDA",
 *          "collections": ["Yakov First Collection"],
 *          "layout": {
 *              "selectedStyle": 2,
 *              "widgets": []
 *          }
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:dashboardId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function (findErr, foundDashboard) {
        if (findErr) {
            return next(findErr);
        } else {
            dashboardDAO.createSegments(req.user, foundDashboard, req.body,
                function (error, savedDashboard) {
                    if (error) {
                        return next(error);
                    } else {
                        return utils.successResponse(savedDashboard, res, next);
                    }
                });
        }
    });
});

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId/tags/segments Get Analyze Segments list
 * @apiGroup Dashboard
 * @apiName Get Segments list
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the segments data of dashboard
 * @apiExample Example request
 *  dashboardId : 5461ff1251d2f91500187462
 *
 * @apiSuccess success 1
 * @apiSuccess message Segments list
 *
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "name":"Untitled Segment",
 *          "id":"543824bd7174d62c1acad53f",
 *          "tags":[{
 *              "_id":"543824bf7174d62c1acad51f",
 *              "tagType":"Sensor",
 *              "name":"Sensor_script_0",
 *              "creatorRole":"BP",
 *              "creator":"54133e8fd361774c1696f265",
 *              "__v":0,
 *              "usersWithAccess":[{"id":"54133e8fd361774c1696f265"}],
 *              "appEntities":[{
 *                  "id":"5425d6a19c676a3d08cb477d",
 *                  "appName":"Dashboard"
 *              }],
 *              "children":[{
 *                  "id":"543824bf7174d62c1acad520",
 *                  "tagType":"Metric"
 *              }],
 *              "parents":[{
 *                  "id":"543824bf7174d62c1acad51e",
 *                  "tagType":"Scope"
 *              }],
 *              "formula":null,
 *              "metricID":null,
 *              "metricType":null,
 *              "metric":null,
 *              "sensorTarget":"sss",
 *              "enphaseUserId":null,
 *              "endDate":null,
 *              "weatherStation":"--Use NOAA--",
 *              "longitude":-36.5678,
 *              "latitude":94.1234,
 *              "webAddress":null,
 *              "interval":"Daily",
 *              "destination":null,
 *              "accessMethod":null,
 *              "deviceID":"WR7KU010:2002106325",
 *              "device":"Envoy",
 *              "manufacturer":"Enphase",
 *              "utilityAccounts":[],
 *              "utilityProvider":null,
 *              "nonProfit":null,
 *              "taxID":null,
 *              "street":null,
 *              "state":null,
 *              "postalCode":null,
 *              "country":null,
 *              "city":null,
 *              "childTags":[{
 *                  "_id":"543824bf7174d62c1acad520",
 *                  "tagType":"Metric",
 *                  "name":"Watts (Power)",
 *                  "creatorRole":"BP",
 *                  "creator":"54133e8fd361774c1696f265",
 *                  "__v":0,
 *                  "usersWithAccess":[{
 *                      "id":"54133e8fd361774c1696f265"
 *                  }],
 *                  "appEntities":[],
 *                  "children":[],
 *                  "parents":[{
 *                      "id":"543824bf7174d62c1acad51f",
 *                      "tagType":"Sensor"
 *                  }],
 *                  "formula":null,
 *                  "metricID":"Pac",
 *                  "metricType":"Datafeed",
 *                  "metric":"Standard",
 *                  "sensorTarget":null,
 *                  "enphaseUserId":null,
 *                  "endDate":null,
 *                  "weatherStation":null,
 *                  "longitude":null,
 *                  "latitude":null,
 *                  "webAddress":null,
 *                  "interval":null,
 *                  "destination":null,
 *                  "accessMethod":null,
 *                  "deviceID":null,
 *                  "device":null,
 *                  "manufacturer":null,
 *                  "utilityAccounts":[],
 *                  "utilityProvider":null,
 *                  "nonProfit":null,
 *                  "taxID":null,
 *                  "street":null,
 *                  "state":null,
 *                  "postalCode":null,
 *                  "country":null,
 *                  "city":null,
 *                  "childTags":[]
 *              }]
 *          },{
 *              "_id":"543824be7174d62c1acad517",
 *              "tagType":"Scope",
 *              "name":"Enphase Scope",
 *              "creatorRole":"BP",
 *              "creator":"54133e8fd361774c1696f265",
 *              "__v":0,
 *              "usersWithAccess":[{"id":"54133e8fd361774c1696f265"}],
 *              "appEntities":[{
 *                  "id":"5429d13f89c1849502287d5d",
 *                  "appName":"Presentation"
 *              },{
 *                  "id":"5413612ad37f4ab56f1fb175",
 *                  "appName":"Dashboard"
 *              }],
 *              "children":[{
 *                  "id":"543824be7174d62c1acad518",
 *                  "tagType":"Sensor"
 *              }],
 *              "parents":[{
 *                  "id":"543824bd7174d62c1acad50f",
 *                  "tagType":"Facility"
 *              }],
 *              "formula":null,
 *              "metricID":null,
 *              "metricType":null,
 *              "metric":null,
 *              "sensorTarget":null,
 *              "enphaseUserId":"4d7a59344d446b790a",
 *              "endDate":null,
 *              "weatherStation":"--Use NOAA--",
 *              "longitude":90,
 *              "latitude":78,
 *              "webAddress":null,
 *              "interval":"Hourly",
 *              "destination":"rtf",
 *              "accessMethod":"Push to FTP",
 *              "deviceID":"121315008457",
 *              "device":"Envoy",
 *              "manufacturer":"Enphase",
 *              "utilityAccounts":[],
 *              "utilityProvider":null,
 *              "nonProfit":null,
 *              "taxID":null,
 *              "street":null,
 *              "state":null,
 *              "postalCode":null,
 *              "country":null,
 *              "city":null,
 *              "childTags":[{
 *                  "_id":"543824be7174d62c1acad51a",
 *                  "tagType":"Sensor",
 *                  "name":"Enphase Sensor",
 *                  "creatorRole":"BP",
 *                  "creator":"54133e8fd361774c1696f265",
 *                  "__v":0,
 *                  "usersWithAccess":[{
 *                      "id":"54133e8fd361774c1696f265"
 *                  }],
 *                  "appEntities":[],
 *                  "children":[],
 *                  "parents":[{
 *                      "id":"543824be7174d62c1acad517",
 *                      "tagType":"Scope"
 *                  }],
 *                  "formula":null,
 *                  "metricID":null,
 *                  "metricType":null,
 *                  "metric":null,
 *                  "sensorTarget":"rft",
 *                  "enphaseUserId":null,
 *                  "endDate":null,
 *                  "weatherStation":"--Use NOAA--",
 *                  "longitude":90,
 *                  "latitude":78,
 *                  "webAddress":null,
 *                  "interval":"Hourly",
 *                  "destination":null,
 *                  "accessMethod":null,
 *                  "deviceID":"121315008457",
 *                  "device":"Envoy",
 *                  "manufacturer":"Enphase",
 *                  "utilityAccounts":[],
 *                  "utilityProvider":null,
 *                  "nonProfit":null,
 *                  "taxID":null,
 *                  "street":null,
 *                  "state":null,
 *                  "postalCode":null,
 *                  "country":null,
 *                  "city":null,
 *                  "childTags":[]
 *              }]
 *          }]
 *      }]
 *  }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/tags/segments", function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var isViewer = req.query.isViewer;

    authUtils.isAuthenticatedUser(req, false, function (findUserErr, currentUser) {
        if (findUserErr) {
            if (isViewer) {
                dashboardDAO.getDashboardById(dashboardId, null, function (findErr, foundDashboard) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        return utils.successResponse(foundDashboard.segments, res, next);
                    }
                });
            } else {
                return next(findUserErr);
            }
        } else {
            dashboardDAO.getDashboardById(dashboardId, currentUser, function (findErr, foundDashboard) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(foundDashboard.segments, res, next);
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/analyze/:dashboardId/tags/segments/:segmentId Get Analyze Segment by Id
 * @apiGroup Dashboard
 * @apiName Get Segment by Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the segment by segment Id
 * @apiExample Example request
 *  dashboardId : 5461ff1251d2f91500187462
 *  segmentId : 54683f86f48ee7140096618c
 *
 * @apiSuccess success 1
 * @apiSuccess message segment data
 *
 * @apiSuccessExample Success exmple
 * {
 *      "success": 1,
 *      "message": {
 *          "name": "aleksei Segment",
 *          "id": "543824bd7174d62c1acad54f",
 *          "tags": [{
 *              "_id": "543824be7174d62c1acad517",
 *              "tagType": "Scope",
 *              "name": "Enphase Scope",
 *              "creatorRole": "BP",
 *              "creator": "54133e8fd361774c1696f265",
 *              "__v": 0,
 *              "usersWithAccess": [{
 *                  "id": "54133e8fd361774c1696f265"
 *              }],
 *              "appEntities": [{
 *                  "id": "5429d13f89c1849502287d5d",
 *                  "appName": "Presentation"
 *              }],
 *              "children": [{
 *                  "id": "543824be7174d62c1acad518",
 *                  "tagType": "Sensor"
 *              }],
 *              "parents": [{
 *                  "id": "543824bd7174d62c1acad50f",
 *                  "tagType": "Facility"
 *              }],
 *              "formula": null,
 *              "metricID": null,
 *              "metricType": null,
 *              "metric": null,
 *              "sensorTarget": null,
 *              "enphaseUserId": "4d7a59344d446b790a",
 *              "endDate": null,
 *              "weatherStation": "--Use NOAA--",
 *              "longitude": 90,
 *              "latitude": 78,
 *              "webAddress": null,
 *              "interval": "Hourly",
 *              "destination": "rtf",
 *              "accessMethod": "Push to FTP",
 *              "deviceID": "121315008457",
 *              "device": "Envoy",
 *              "manufacturer": "Enphase",
 *              "utilityAccounts": [],
 *              "utilityProvider": null,
 *              "nonProfit": null,
 *              "taxID": null,
 *              "street": null,
 *              "state": null,
 *              "postalCode": null,
 *              "country": null,
 *              "city": null,
 *              "childTags": [{
 *                  "_id": "543824be7174d62c1acad51a",
 *                  "tagType": "Sensor",
 *                  "name": "Enphase Sensor",
 *                  "creatorRole": "BP",
 *                  "creator": "54133e8fd361774c1696f265",
 *                  "__v": 0,
 *                  "usersWithAccess": [{
 *                      "id": "54133e8fd361774c1696f265"
 *                  }],
 *                  "appEntities": [],
 *                  "children": [],
 *                  "parents": [{
 *                      "id": "543824be7174d62c1acad517",
 *                      "tagType": "Scope"
 *                  }],
 *                  "formula": null,
 *                  "metricID": null,
 *                  "metricType": null,
 *                  "metric": null,
 *                  "sensorTarget": "rft",
 *                  "enphaseUserId": null,
 *                  "endDate": null,
 *                  "weatherStation": "--Use NOAA--",
 *                  "longitude": 90,
 *                  "latitude": 78,
 *                  "webAddress": null,
 *                  "interval": "Hourly",
 *                  "destination": null,
 *                  "accessMethod": null,
 *                  "deviceID": "121315008457",
 *                  "device": "Envoy",
 *                  "manufacturer": "Enphase",
 *                  "utilityAccounts": [],
 *                  "utilityProvider": null,
 *                  "nonProfit": null,
 *                  "taxID": null,
 *                  "street": null,
 *                  "state": null,
 *                  "postalCode": null,
 *                  "country": null,
 *                  "city": null,
 *                  "childTags": []
 *              }, {
 *                  "_id": "543824be7174d62c1acad519",
 *                  "tagType": "Sensor",
 *                  "name": "Enphase Sensor",
 *                  "creatorRole": "BP",
 *                  "creator": "54133e8fd361774c1696f265",
 *                  "__v": 0,
 *                  "usersWithAccess": [{
 *                      "id": "54133e8fd361774c1696f265"
 *                  }],
 *                  "appEntities": [],
 *                  "children": [],
 *                  "parents": [{
 *                      "id": "543824be7174d62c1acad517",
 *                      "tagType": "Scope"
 *                  }],
 *                  "formula": null,
 *                  "metricID": null,
 *                  "metricType": null,
 *                  "metric": null,
 *                  "sensorTarget": "rft",
 *                  "enphaseUserId": null,
 *                  "endDate": null,
 *                  "weatherStation": "--Use NOAA--",
 *                  "longitude": 90,
 *                  "latitude": 78,
 *                  "webAddress": null,
 *                  "interval": "Hourly",
 *                  "destination": null,
 *                  "accessMethod": null,
 *                  "deviceID": "121315008457",
 *                  "device": "Envoy",
 *                  "manufacturer": "Enphase",
 *                  "utilityAccounts": [],
 *                  "utilityProvider": null,
 *                  "nonProfit": null,
 *                  "taxID": null,
 *                  "street": null,
 *                  "state": null,
 *                  "postalCode": null,
 *                  "country": null,
 *                  "city": null
 *              }]
 *          }]
 *      }
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/tags/segments/:segmentId", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var segmentId = req.params.segmentId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function (findErr, foundDashboard) {
        if (findErr){
            return next(findErr);
        } else {
            var filteredSegment = _.filter(foundDashboard.segments,
                function(segment) { return segment.id.toString() === segmentId;});
            return utils.successResponse(filteredSegment, res, next);
        }
    });
});

 /**
 * @api {put} /v1/analyze/dashboards/:dashboardId/tags/segments Update Analyze Segment
 * @apiGroup Dashboard
 * @apiName Update Segment
 * @apiVersion 1.0.0
 * @apiDescription Edit segment data
 * @apiParam {Object} body Object data of segments. array of segments is possible
 * @apiExample Example request:
 *  dashboardId : 5461363bdfef7c4800146f4b
 *  body
 *  [{
 *          "tagBindings" : [ 
 *              {
 *                  "tagType" : "Facility",
 *                  "id" : "5458afc6fe540a120074c20f"
 *              }
 *          ],
 *          "name" : "Liberty Lofts - Solar Power Plant",
 *          "id" : "54637850dfcbe62000a7eddf"
 *  }]
 *
 * @apiSuccess success 1
 * @apiSuccess message segment data
 *
 * @apiSuccessExample Success exmple
 * {
 *      "success": 1,
 *      "message": {dashboard object}
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:dashboardId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function (findErr, foundDashboard) {
        if (findErr) {
            return next(findErr);
        } else {
            dashboardDAO.updateSegments(req.user, foundDashboard, req.body,
                function (error, savedDashboard) {
                    if (error) {
                        return next(error);
                    } else {
                        return utils.successResponse(savedDashboard, res, next);
                    }
                });
        }
    });
});


 /**
 * @api {delete} /v1/analyze/dashboards/:dashboardId/tags/segments Remove Analyze Segments
 * @apiGroup Dashboard
 * @apiName Remove Segments from dashboard
 * @apiVersion 1.0.0
 * @apiDescription Remove segments from dashboard.
 * @apiParam {Object} body Array of Segment Ids
 * @apiExample Example request:
 *  dashboardId : 5461fee651d2f9150018745f
 *  body
 *  ["5463a3c83593691900188dc2", "5463a3e53593691900188dc3"]
 *
 * @apiSuccess success 1
 * @apiSuccess message updated dashboard data
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:dashboardId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function (findErr, foundDashboard) {
        if (findErr) {
            return next(findErr);
        } else {
            var segments = req.body;
            var filteredSegment = _.filter(foundDashboard.segments,
                function(segment) { return segments.indexOf(segment.id.toString()) !== -1; });
            dashboardDAO.removeSegments(req.user, foundDashboard, filteredSegment,
                function (error, savedDashboard) {
                    if (error) {
                        return next(error);
                    } else {
                        return utils.successResponse(savedDashboard, res, next);
                    }
                });
        }
    });
});

/**
 * @api {delete} /v1/analyze/dashboards/:dashboardId/tags/segments/:segmentId Remove Single Segment
 * @apiGroup Dashboard
 * @apiName Remove Segment from dashboard
 * @apiVersion 0.0.1
 * @apiDescription Remove single segment from dashboard
 * @apiExample Example request:
 *  dashboardId : 5461ff1251d2f91500187462
 *  segmentId : 546c9eb080f57514008590fe
 *
 * @apiSuccess success 1
 * @apiSuccess message updated dashboard data
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:dashboardId/tags/segments/:segmentId", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var segmentId = req.params.segmentId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function (findErr, foundDashboard) {
        if (findErr) {
            return next(findErr);
        } else {
            var filteredSegment = _.filter(foundDashboard.segments,
                function(segment) { return segment.id.toString() === segmentId; });
            dashboardDAO.removeSegments(req.user, foundDashboard, filteredSegment,
                function (error, savedDashboard) {
                    if (error) {
                        return next(error);
                    } else {
                        return utils.successResponse(savedDashboard, res, next);
                    }
                });
        }
    });
});

/**
 * @api {post} /v1/analyze/dashboards/:dashboardId/widgets Create Widget
 * @apiGroup Dashboard
 * @apiName Create Analyze Widget
 * @apiVersion 1.0.0
 * @apiDescription Create Analyze widget <br/>
 * Following fields can't be inserted: <br/>
 *      segments <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body WidgetObject
 * @apiExample Example request:
 *  {
 *      "type" : "Pie",
 *      "title" : "Test Pie",
 *      "metric" : "545906edded7ea0f0079840e",
 *      "compareMetric" : null,
 *      "groupDimension" : "--Custom--",
 *      "customGroupDimension" : {
 *          "groupBySegment" : true,
 *          "definedGroups" : [
 *              {
 *                  "segmentId" : "54cb1e77d52879320ab88a03",
 *                  "expandedNodes" : [],
 *                  "isExpanded" : false,
 *                  "treedata" : [],
 *                  "tagBindings" : [
 *                      {
 *                          "tagType" : "Node",
 *                          "id" : "5458b22379e7b60e00b1133a"
 *                      }
 *                  ],
 *                  "name" : "Custom Group A"
 *              }
 *          ]
 *      }
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message widget object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "_id": "54637911dfcbe62000a7ede0",
 *       "type": "Equivalencies",
 *       "title": "Cars Removed",
 *       "creator": "54135f90c6ab7c241e28095e",
 *       "creatorRole": "BP",
 *       "__v": 1,
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "endDate": null,
 *       "startDate": null,
 *       "singlePointAggregation": [],
 *       "compareAsBar": false,
 *       "compareMetric": null,
 *       "metric": {
 *           "_id": "545906edded7ea0f0079840e",
 *           "tagType": "Metric",
 *           "name": "Energy (kWh)",
 *           "creatorRole": "BP",
 *           "creator": "54135f90c6ab7c241e28095e",
 *           "__v": 4,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54135f90c6ab7c241e28095e"
 *               }
 *           ],
 *           "appEntities": [
 *               {
 *                   "appName": "Dashboard",
 *                   "id": "54a2bc6560f7f44000e5959d"
 *               }
 *           ],
 *           "children": [],
 *           "parents": [
 *               {
 *                   "id": "5458b22379e7b60e00b1133a",
 *                   "tagType": "Node"
 *               }
 *           ],
 *           "summaryMethod": "Total",
 *           "formula": null,
 *           "metricID": "Pac",
 *           "metricType": "Calculated",
 *           "metric": "Standard",
 *           "rate": null,
 *           "sensorTarget": null,
 *           "timezone": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [],
 *           "utilityProvider": null,
 *           "nonProfit": null,
 *           "taxID": null,
 *           "address": null,
 *           "street": null,
 *           "state": null,
 *           "postalCode": null,
 *           "country": null,
 *           "city": null
 *       },
 *       "showAllTime": false,
 *       "greenhousePounds": false,
 *       "co2Pounds": false,
 *       "greenhouseKilograms": false,
 *       "co2Kilograms": false,
 *       "equivType": "Cars Removed",
 *       "orientation": "vertical",
 *       "showUpTo": null,
 *       "imageUrl": null,
 *       "drillDown": null,
 *       "displayedColumns": [],
 *       "rowsPerTable": null,
 *       "lastConnected": null,
 *       "boilerplateLocation": null,
 *       "boilerplateCommissioning": null,
 *       "boilerplateSystemPower": null,
 *       "boilerplateType": null,
 *       "pivotDimension": null,
 *       "groupDimension" : "--Custom--",
 *       "customGroupDimension" : {
 *           "groupBySegment" : true,
 *           "definedGroups" : [
 *               {
 *                   "segmentId" : "54cb1e77d52879320ab88a03",
 *                   "_id" : "54e343abfbd0138d08c87b0a",
 *                   "expandedNodes" : [],
 *                   "isExpanded" : false,
 *                   "treedata" : [],
 *                   "tagBindings" : [
 *                       {
 *                           "tagType" : "Node",
 *                           "id" : "5458b22379e7b60e00b1133a"
 *                       }
 *                   ],
 *                   "name" : "Custom Group A"
 *               }
 *           ]
 *       },
 *       "collapsed": false,
 *       "titleShow": false
 *   }
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:dashboardId/widgets", checkAuth, function(req, res, next) {
    var widgetObj = req.body;
    var dashboardId = req.params.dashboardId;

    utils.removeMongooseVersionField(widgetObj);
    utils.removeMultipleFields(widgetObj,
        [
            "segments"
        ]
    );

    widgetDAO.createWidget(dashboardId, widgetObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

/**
 * @api {put} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId Update Widget
 * @apiGroup Dashboard
 * @apiName Update Analyze Widget
 * @apiVersion 1.0.0
 * @apiDescription Update analyze widget. API can accept only changed fields. However, widget id is required. <br/>
 * Following fields can't be inserted: <br/>
 *      segments <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body WidgetObject
 * @apiExample Example request:
 *  {
 *      "_id" : "54637911dfcbe62000a7ede0",
 *      "title" : "Cars Removed1",
 *      "endDate": "2014-11-02T00:00:00.000Z",
 *      "startDate": "2014-11-01T00:00:00.000Z",
 *      "groupDimension" : "--Custom--",
 *      "customGroupDimension" : {
 *          "groupBySegment" : true,
 *          "definedGroups" : [
 *              {
 *                  "segmentId" : "54cb1e77d52879320ab88a03",
 *                  "expandedNodes" : [],
 *                  "isExpanded" : false,
 *                  "treedata" : [],
 *                  "tagBindings" : [
 *                      {
 *                          "tagType" : "Node",
 *                          "id" : "5458b22379e7b60e00b1133a"
 *                      }
 *                  ],
 *                  "name" : "Custom Group A1"
 *              }
 *          ]
 *      }
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message widget object
 * @apiSuccessExample Success example
 *
 * {
 *     "success": 1,
 *     "message": {
 *         "_id": "54637911dfcbe62000a7ede0",
 *         "type": "Equivalencies",
 *         "title": "Cars Removed1",
 *         "creator": "54135f90c6ab7c241e28095e",
 *         "creatorRole": "BP",
 *         "__v": 1,
 *         "compareEndDate": null,
 *         "compareStartDate": null,
 *         "endDate": "2014-11-02T00:00:00.000Z",
 *         "startDate": "2014-11-01T00:00:00.000Z",
 *         "singlePointAggregation": [],
 *         "compareAsBar": false,
 *         "compareMetric": null,
 *         "metric": {
 *             "_id": "545906edded7ea0f0079840e",
 *             "tagType": "Metric",
 *             "name": "Energy (kWh)",
 *             "creatorRole": "BP",
 *             "creator": "54135f90c6ab7c241e28095e",
 *             "__v": 4,
 *             "usersWithAccess": [
 *                 {
 *                     "id": "54135f90c6ab7c241e28095e"
 *                 }
 *             ],
 *             "appEntities": [
 *                 {
 *                     "appName": "Dashboard",
 *                     "id": "54a2bc6560f7f44000e5959d"
 *                 }
 *             ],
 *             "children": [],
 *             "parents": [
 *                 {
 *                     "id": "5458b22379e7b60e00b1133a",
 *                     "tagType": "Node"
 *                 }
 *             ],
 *             "summaryMethod": "Total",
 *             "formula": null,
 *             "metricID": "Pac",
 *             "metricType": "Calculated",
 *             "metric": "Standard",
 *             "rate": null,
 *             "sensorTarget": null,
 *             "timezone": null,
 *             "enphaseUserId": null,
 *             "endDate": null,
 *             "weatherStation": null,
 *             "longitude": null,
 *             "latitude": null,
 *             "webAddress": null,
 *             "interval": null,
 *             "destination": null,
 *             "accessMethod": null,
 *             "deviceID": null,
 *             "device": null,
 *             "manufacturer": null,
 *             "utilityAccounts": [],
 *             "utilityProvider": null,
 *             "nonProfit": null,
 *             "taxID": null,
 *             "address": null,
 *             "street": null,
 *             "state": null,
 *             "postalCode": null,
 *             "country": null,
 *             "city": null
 *         },
 *         "showAllTime": false,
 *         "greenhousePounds": false,
 *         "co2Pounds": false,
 *         "greenhouseKilograms": false,
 *         "co2Kilograms": false,
 *         "equivType": "Cars Removed",
 *         "orientation": "vertical",
 *         "showUpTo": null,
 *         "imageUrl": null,
 *         "drillDown": null,
 *         "displayedColumns": [],
 *         "rowsPerTable": null,
 *         "lastConnected": null,
 *         "boilerplateLocation": null,
 *         "boilerplateCommissioning": null,
 *         "boilerplateSystemPower": null,
 *         "boilerplateType": null,
 *         "pivotDimension": null,
 *         "groupDimension" : "--Custom--",
 *         "customGroupDimension" : {
 *             "groupBySegment" : true,
 *             "definedGroups" : [
 *                 {
 *                     "segmentId" : "54cb1e77d52879320ab88a03",
 *                     "_id" : "54e343abfbd0138d08c87b0a",
 *                     "expandedNodes" : [],
 *                     "isExpanded" : false,
 *                     "treedata" : [],
 *                     "tagBindings" : [
 *                         {
 *                             "tagType" : "Node",
 *                             "id" : "5458b22379e7b60e00b1133a"
 *                         }
 *                     ],
 *                     "name" : "Custom Group A1"
 *                 }
 *             ]
 *         },
 *         "collapsed": false,
 *         "titleShow": false
 *     }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:dashboardId/widgets/:widgetId", checkAuth, function(req, res, next) {
    var widgetObj = req.body;
    var widgetId = req.params.widgetId;
    var dashboardId = req.params.dashboardId;

    utils.removeMongooseVersionField(widgetObj);
    utils.removeMultipleFields(widgetObj,
        [
            "segments"
        ]
    );

    widgetDAO.updateWidget(dashboardId, widgetObj, widgetId, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId Get Analyze Widget
 * @apiGroup Dashboard
 * @apiName Get Analyze Widget By widget Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the analyze widget by Id
 * @apiExample Example request
 *  widgetId : 54637d58dfcbe62000a7ede2
 *
 * @apiSuccess success 1
 * @apiSuccess message Widget Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id":"541b1350a90e8de146a10c0c",
 *          "type":"Timeline",
 *          "title":"001test PieWidget",
 *          "metric":{Tag Object},
 *          "creatorRole":"BP",
 *          "__v":0,
 *          "compareMetric":null,
 *          "greenhousePounds":false,
 *          "co2Pounds":false,
 *          "greenhouseKilograms":false,
 *          "co2Kilograms":false,
 *          "equivType":null,
 *          "orientation":null,
 *          "showUpTo":null,
 *          "imageUrl":null,
 *          "drillDown":null,
 *          "displayedColumns":[],
 *          "rowsPerTable":null,
 *          "pivotDimension":null,
 *          "groupDimension" : "--Custom--",
 *          "customGroupDimension" : {
 *              "groupBySegment" : true,
 *              "definedGroups" : [
 *                  {
 *                      "segmentId" : "54cb1e77d52879320ab88a03",
 *                      "_id" : "54e343abfbd0138d08c87b0a",
 *                      "expandedNodes" : [],
 *                      "isExpanded" : false,
 *                      "treedata" : [],
 *                      "tagBindings" : [
 *                          {
 *                              "tagType" : "Node",
 *                              "id" : "5458b22379e7b60e00b1133a"
 *                          }
 *                      ],
 *                      "name" : "Custom Group A"
 *                  }
 *              ]
 *          },
 *          "titleShow":true
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/widgets/:widgetId", function(req, res, next) {
    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        var widgetId = req.params.widgetId;
        widgetDAO.getWidgetById(widgetId, currentUser, function (err, answer) {
            if (err) {
                return next(err);
            } else {
                return utils.successResponse(answer, res, next);
                //res.send(new utils.serverAnswer(true, answer));
            }
        });
    });
});

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId/widgets Get Widgets
 * @apiGroup Dashboard
 * @apiName Get Analyze widgets
 * @apiVersion 1.0.0
 * @apiDescription Get Analyze Widgets Graph Datas
 * @apiExample Example request
 *  dashboardId : 5461fee651d2f9150018745f
 *
 * @apiSuccess success 1
 * @apiSuccess message Widget Objects
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": [
 *       {
 *           "54a181e52f23471700ad36b5": {
 *               "primaryDateRange": [
 *                   {
 *                       "Barretts": [
 *                           {
 *                               "primaryMetric": {
 *                                   "data": [
 *                                       {
 *                                           "date": "2014-12-14T07:00:00.000Z",
 *                                           "label": "7:00am, December 14, 2014",
 *                                           "value": 0.035355294333333336
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:00:00.000Z",
 *                                           "label": "8:00am, December 14, 2014",
 *                                           "value": 0.82955170075
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:00:00.000Z",
 *                                           "label": "9:00am, December 14, 2014",
 *                                           "value": 2.82181741975
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:00:00.000Z",
 *                                           "label": "10:00am, December 14, 2014",
 *                                           "value": 10.63946701175
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:00:00.000Z",
 *                                           "label": "11:00am, December 14, 2014",
 *                                           "value": 12.885142976000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:00:00.000Z",
 *                                           "label": "12:00pm, December 14, 2014",
 *                                           "value": 12.653024191499998
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:00:00.000Z",
 *                                           "label": "1:00pm, December 14, 2014",
 *                                           "value": 10.8597185925
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:00:00.000Z",
 *                                           "label": "2:00pm, December 14, 2014",
 *                                           "value": 7.63117252825
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:00:00.000Z",
 *                                           "label": "3:00pm, December 14, 2014",
 *                                           "value": 2.38960019925
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:00:00.000Z",
 *                                           "label": "4:00pm, December 14, 2014",
 *                                           "value": 0.256675404
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T17:00:00.000Z",
 *                                           "label": "5:00pm, December 14, 2014",
 *                                           "value": 0
 *                                       }
 *                                   ],
 *                                   "singlePointAggregation": [
 *                                       {
 *                                           "title": "Average example",
 *                                           "value": 5.545593210734848,
 *                                           "function": "Average"
 *                                       }
 *                                   ]
 *                               }
 *                           },
 *                           {
 *                               "compareMetric": {
 *                                   "data": [
 *                                       {
 *                                           "date": "2014-12-14T07:15:41.000Z",
 *                                           "label": "7:15am, December 14, 2014",
 *                                           "value": 0
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T07:30:41.000Z",
 *                                           "label": "7:30am, December 14, 2014",
 *                                           "value": 0.0050714720000000005
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T07:45:41.000Z",
 *                                           "label": "7:45am, December 14, 2014",
 *                                           "value": 0.100994411
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:00:41.000Z",
 *                                           "label": "8:00am, December 14, 2014",
 *                                           "value": 0.333690421
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:15:42.000Z",
 *                                           "label": "8:15am, December 14, 2014",
 *                                           "value": 0.718482923
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:30:42.000Z",
 *                                           "label": "8:30am, December 14, 2014",
 *                                           "value": 0.965657895
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:45:42.000Z",
 *                                           "label": "8:45am, December 14, 2014",
 *                                           "value": 1.3003755639999999
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:00:42.000Z",
 *                                           "label": "9:00am, December 14, 2014",
 *                                           "value": 1.815084459
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:15:43.000Z",
 *                                           "label": "9:15am, December 14, 2014",
 *                                           "value": 2.460345521
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:30:43.000Z",
 *                                           "label": "9:30am, December 14, 2014",
 *                                           "value": 2.960433628
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:45:43.000Z",
 *                                           "label": "9:45am, December 14, 2014",
 *                                           "value": 4.051406071
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:00:43.000Z",
 *                                           "label": "10:00am, December 14, 2014",
 *                                           "value": 10.142638432
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:15:42.000Z",
 *                                           "label": "10:15am, December 14, 2014",
 *                                           "value": 8.41999597
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:30:42.000Z",
 *                                           "label": "10:30am, December 14, 2014",
 *                                           "value": 11.730888512
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:45:42.000Z",
 *                                           "label": "10:45am, December 14, 2014",
 *                                           "value": 12.264345132999999
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:00:43.000Z",
 *                                           "label": "11:00am, December 14, 2014",
 *                                           "value": 12.628809577000002
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:15:44.000Z",
 *                                           "label": "11:15am, December 14, 2014",
 *                                           "value": 12.869318348
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:30:44.000Z",
 *                                           "label": "11:30am, December 14, 2014",
 *                                           "value": 12.988208675
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:45:44.000Z",
 *                                           "label": "11:45am, December 14, 2014",
 *                                           "value": 13.054235304
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:00:44.000Z",
 *                                           "label": "12:00pm, December 14, 2014",
 *                                           "value": 12.959375000000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:15:44.000Z",
 *                                           "label": "12:15pm, December 14, 2014",
 *                                           "value": 12.83659292
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:30:44.000Z",
 *                                           "label": "12:30pm, December 14, 2014",
 *                                           "value": 12.616718289000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:45:44.000Z",
 *                                           "label": "12:45pm, December 14, 2014",
 *                                           "value": 12.199410557
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:00:44.000Z",
 *                                           "label": "1:00pm, December 14, 2014",
 *                                           "value": 11.712823009000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:15:44.000Z",
 *                                           "label": "1:15pm, December 14, 2014",
 *                                           "value": 11.237452414
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:30:44.000Z",
 *                                           "label": "1:30pm, December 14, 2014",
 *                                           "value": 10.608511615
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:45:44.000Z",
 *                                           "label": "1:45pm, December 14, 2014",
 *                                           "value": 9.880087332
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:00:44.000Z",
 *                                           "label": "2:00pm, December 14, 2014",
 *                                           "value": 9.046362595
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:15:44.000Z",
 *                                           "label": "2:15pm, December 14, 2014",
 *                                           "value": 8.118497668
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:30:44.000Z",
 *                                           "label": "2:30pm, December 14, 2014",
 *                                           "value": 7.243792793000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:45:44.000Z",
 *                                           "label": "2:45pm, December 14, 2014",
 *                                           "value": 6.116037057000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:00:44.000Z",
 *                                           "label": "3:00pm, December 14, 2014",
 *                                           "value": 4.760526786
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:15:44.000Z",
 *                                           "label": "3:15pm, December 14, 2014",
 *                                           "value": 2.765839621
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:30:44.000Z",
 *                                           "label": "3:30pm, December 14, 2014",
 *                                           "value": 1.142946903
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:45:44.000Z",
 *                                           "label": "3:45pm, December 14, 2014",
 *                                           "value": 0.8890874870000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:00:44.000Z",
 *                                           "label": "4:00pm, December 14, 2014",
 *                                           "value": 0.605746919
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:15:44.000Z",
 *                                           "label": "4:15pm, December 14, 2014",
 *                                           "value": 0.32342423600000003
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:30:44.000Z",
 *                                           "label": "4:30pm, December 14, 2014",
 *                                           "value": 0.096825104
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:45:44.000Z",
 *                                           "label": "4:45pm, December 14, 2014",
 *                                           "value": 0.000705357
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T17:00:44.000Z",
 *                                           "label": "5:00pm, December 14, 2014",
 *                                           "value": 0
 *                                       }
 *                                   ],
 *                                   "singlePointAggregation": [
 *                                       {
 *                                           "title": "Average example",
 *                                           "value": 6.099268649449999,
 *                                           "function": "Average"
 *                                       }
 *                                   ]
 *                               }
 *                           }
 *                       ]
 *                   }
 *               ],
 *               "compareDateRange": [
 *                   {
 *                       "Barretts": [
 *                           {
 *                               "primaryMetric": {
 *                                   "data": [],
 *                                   "singlePointAggregation": []
 *                               }
 *                           },
 *                           {
 *                               "compareMetric": {
 *                                   "data": [],
 *                                   "singlePointAggregation": []
 *                               }
 *                           }
 *                       ]
 *                   }
 *               ]
 *           }
 *       }
 *   ]
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/widgets", function(req, res, next) {
    return dataSenseWidgetBodyParser.parse(req, res, next, true);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId/tags/segments Create Analyze Widget Segment
 * @apiGroup Dashboard
 * @apiName Create Analyze Widget Segment
 * @apiVersion 1.0.0
 * @apiDescription Create new segment to widget
 * @apiParam {Object} body Segments object
 * @apiExample Example request:
 *  dashboardId : "5457e1990c5a5d2700affe77"
 *  widgetId : "5458ae05fe540a120074c205"
 *  body
 *  [{
 *      "name" : "test segment",
 *      "tagBindings" :[{
 *          "tagType":"Scope",
 *          "id":"543824c07174d62c1acad525"
 *      }]
 *  }]
 *
 * @apiSuccess success 1
 * @apiSuccess message Saved Dashboard Data
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "_id": "5458ae05fe540a120074c205",
 *       "type": "Timeline",
 *       "title": "Timeline widget 1",
 *       "creator": "54135f90c6ab7c241e28095e",
 *       "creatorRole": "BP",
 *       "__v": 7,
 *       "segments": [
 *           {
 *               "tagBindings": [
 *                   {
 *                       "tagType": "Scope",
 *                       "id": "543824c07174d62c1acad525"
 *                   }
 *               ],
 *               "name": "test segment",
 *               "id": "54ca5f234aa35750070558fd"
 *           }
 *       ],
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "endDate": null,
 *       "startDate": null,
 *       "singlePointAggregation": [
 *           {
 *               "function": "Min",
 *               "title": "Min_title"
 *           },
 *           {
 *               "function": "Total"
 *           }
 *       ],
 *       "compareAsBar": false,
 *       "compareMetric": null,
 *       "metric": {
 *           "_id": "545906ddded7ea0f0079840c",
 *           "tagType": "Metric",
 *           "name": "Power (kW)",
 *           "creatorRole": "BP",
 *           "creator": "54135f90c6ab7c241e28095e",
 *           "__v": 0,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54135f90c6ab7c241e28095e"
 *               }
 *           ],
 *           "appEntities": [],
 *           "children": [],
 *           "parents": [
 *               {
 *                   "id": "5458b22379e7b60e00b1133a",
 *                   "tagType": "Node"
 *               }
 *           ],
 *           "summaryMethod": "Average",
 *           "formula": null,
 *           "metricID": "Pac",
 *           "metricType": "Datafeed",
 *           "metric": "Standard",
 *           "rate": null,
 *           "sensorTarget": null,
 *           "timezone": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [],
 *           "utilityProvider": null,
 *           "nonProfit": null,
 *           "taxID": null,
 *           "address": null,
 *           "street": null,
 *           "state": null,
 *           "postalCode": null,
 *           "country": null,
 *           "city": null
 *       },
 *       "compareLabel": null,
 *       "label": null,
 *       "summaryMethod": null,
 *       "showAllTime": false,
 *       "greenhousePounds": false,
 *       "co2Pounds": false,
 *       "greenhouseKilograms": false,
 *       "co2Kilograms": false,
 *       "equivType": null,
 *       "orientation": null,
 *       "showUpTo": null,
 *       "imageUrl": null,
 *       "drillDown": null,
 *       "displayedColumns": [],
 *       "rowsPerTable": null,
 *       "lastConnected": null,
 *       "boilerplateLocation": null,
 *       "boilerplateCommissioning": null,
 *       "boilerplateSystemPower": null,
 *       "boilerplateType": null,
 *       "pivotDimension": null,
 *       "groupDimension": null,
 *       "collapsed": false,
 *       "titleShow": true
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:dashboardId/widgets/:widgetId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var widgetId = req.params.widgetId;

    async.waterfall([
        function (cb) {
            dashboardDAO.getDashboardById(dashboardId, req.user, cb);
        }, function (dashboard, cb) {
            widgetDAO.getWidgetById(widgetId, req.use, function (err, widget) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, dashboard, widget);
                }
            });
        }, function (dashboard, widget, cb) {
            widgetDAO.createSegments(req.use, dashboard, widget, req.body, cb);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * @api {put} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId/tags/segments Update Analyze Widget Segment
 * @apiGroup Dashboard
 * @apiName Update Analyze Widget Segment
 * @apiVersion 1.0.0
 * @apiDescription Edit segment data
 * @apiParam {Object} body Object data of segments. array of segments is possible
 * @apiExample Example request:
 *  dashboardId : 5457e1990c5a5d2700affe77
 *  dashboardId : 5458ae05fe540a120074c205
 *  body
 *  [{
 *      "name" : "test segment 123",
 *      "id": "54ca5f234aa35750070558fd",
 *      "tagBindings" :[{
 *          "tagType":"Scope",
 *          "id":"543824c07174d62c1acad525"
 *      }]
 *  }]
 *
 * @apiSuccess success 1
 * @apiSuccess message widget data
 *
 * @apiSuccessExample Success exmple
 *{
 *   "success": 1,
 *   "message": {
 *       "_id": "5458ae05fe540a120074c205",
 *       "type": "Timeline",
 *       "title": "Timeline widget 1",
 *       "creator": "54135f90c6ab7c241e28095e",
 *       "creatorRole": "BP",
 *       "__v": 8,
 *       "segments": [
 *           {
 *               "tagBindings": [
 *                   {
 *                       "tagType": "Scope",
 *                       "id": "543824c07174d62c1acad525"
 *                   }
 *               ],
 *               "name": "test segment 123",
 *               "id": "54ca5f234aa35750070558fd"
 *           }
 *       ],
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "endDate": null,
 *       "startDate": null,
 *       "singlePointAggregation": [
 *           {
 *               "function": "Min",
 *               "title": "Min_title"
 *           },
 *           {
 *               "function": "Total"
 *           }
 *       ],
 *       "compareAsBar": false,
 *       "compareMetric": null,
 *       "metric": {
 *           "_id": "545906ddded7ea0f0079840c",
 *           "tagType": "Metric",
 *           "name": "Power (kW)",
 *           "creatorRole": "BP",
 *           "creator": "54135f90c6ab7c241e28095e",
 *           "__v": 0,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54135f90c6ab7c241e28095e"
 *               }
 *           ],
 *           "appEntities": [],
 *           "children": [],
 *           "parents": [
 *               {
 *                   "id": "5458b22379e7b60e00b1133a",
 *                   "tagType": "Node"
 *               }
 *           ],
 *           "summaryMethod": "Average",
 *           "formula": null,
 *           "metricID": "Pac",
 *           "metricType": "Datafeed",
 *           "metric": "Standard",
 *           "rate": null,
 *           "sensorTarget": null,
 *           "timezone": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [],
 *           "utilityProvider": null,
 *           "nonProfit": null,
 *           "taxID": null,
 *           "address": null,
 *           "street": null,
 *           "state": null,
 *           "postalCode": null,
 *           "country": null,
 *           "city": null
 *       },
 *       "compareLabel": null,
 *       "label": null,
 *       "summaryMethod": null,
 *       "showAllTime": false,
 *       "greenhousePounds": false,
 *       "co2Pounds": false,
 *       "greenhouseKilograms": false,
 *       "co2Kilograms": false,
 *       "equivType": null,
 *       "orientation": null,
 *       "showUpTo": null,
 *       "imageUrl": null,
 *       "drillDown": null,
 *       "displayedColumns": [],
 *       "rowsPerTable": null,
 *       "lastConnected": null,
 *       "boilerplateLocation": null,
 *       "boilerplateCommissioning": null,
 *       "boilerplateSystemPower": null,
 *       "boilerplateType": null,
 *       "pivotDimension": null,
 *       "groupDimension": null,
 *       "collapsed": false,
 *       "titleShow": true
 *   }
 *}
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:dashboardId/widgets/:widgetId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var widgetId = req.params.widgetId;

    async.waterfall([
        function (cb) {
            dashboardDAO.getDashboardById(dashboardId, req.user, cb);
        }, function (dashboard, cb) {
            widgetDAO.getWidgetById(widgetId, req.user, function (err, widget) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, dashboard, widget);
                }
            });
        }, function (dashboard, widget, cb) {
            widgetDAO.updateSegments(req.user, dashboard, widget, req.body, cb);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * @api {delete} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId/tags/segments Remove Analyze Widget Segments
 * @apiGroup Dashboard
 * @apiName Remove Segments from widget
 * @apiVersion 1.0.0
 * @apiDescription Remove segments from widget.
 * @apiParam {Object} body Array of Segment Ids
 * @apiExample Example request:
 *  dashboardId : 5457e1990c5a5d2700affe77
 *  widgetId : 5458ae05fe540a120074c205
 *  body
 *  ["54ca5f234aa35750070558fd"]
 *
 * @apiSuccess success 1
 * @apiSuccess message updated widget data
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "_id": "5458ae05fe540a120074c205",
 *       "type": "Timeline",
 *       "title": "Timeline widget 1",
 *       "creator": "54135f90c6ab7c241e28095e",
 *       "creatorRole": "BP",
 *       "__v": 9,
 *       "segments": [],
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "endDate": null,
 *       "startDate": null,
 *       "singlePointAggregation": [
 *           {
 *               "function": "Min",
 *               "title": "Min_title"
 *           },
 *           {
 *               "function": "Total"
 *           }
 *       ],
 *       "compareAsBar": false,
 *       "compareMetric": null,
 *       "metric": {
 *           "_id": "545906ddded7ea0f0079840c",
 *           "tagType": "Metric",
 *           "name": "Power (kW)",
 *           "creatorRole": "BP",
 *           "creator": "54135f90c6ab7c241e28095e",
 *           "__v": 0,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54135f90c6ab7c241e28095e"
 *               }
 *           ],
 *           "appEntities": [],
 *           "children": [],
 *           "parents": [
 *               {
 *                   "id": "5458b22379e7b60e00b1133a",
 *                   "tagType": "Node"
 *               }
 *           ],
 *           "summaryMethod": "Average",
 *           "formula": null,
 *           "metricID": "Pac",
 *           "metricType": "Datafeed",
 *           "metric": "Standard",
 *           "rate": null,
 *           "sensorTarget": null,
 *           "timezone": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [],
 *           "utilityProvider": null,
 *           "nonProfit": null,
 *           "taxID": null,
 *           "address": null,
 *           "street": null,
 *           "state": null,
 *           "postalCode": null,
 *           "country": null,
 *           "city": null
 *       },
 *       "compareLabel": null,
 *       "label": null,
 *       "summaryMethod": null,
 *       "showAllTime": false,
 *       "greenhousePounds": false,
 *       "co2Pounds": false,
 *       "greenhouseKilograms": false,
 *       "co2Kilograms": false,
 *       "equivType": null,
 *       "orientation": null,
 *       "showUpTo": null,
 *       "imageUrl": null,
 *       "drillDown": null,
 *       "displayedColumns": [],
 *       "rowsPerTable": null,
 *       "lastConnected": null,
 *       "boilerplateLocation": null,
 *       "boilerplateCommissioning": null,
 *       "boilerplateSystemPower": null,
 *       "boilerplateType": null,
 *       "pivotDimension": null,
 *       "groupDimension": null,
 *       "collapsed": false,
 *       "titleShow": true
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:dashboardId/widgets/:widgetId/tags/segments", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var widgetId = req.params.widgetId;

    async.waterfall([
        function (cb) {
            dashboardDAO.getDashboardById(dashboardId, req.user, cb);
        }, function (dashboard, cb) {
            widgetDAO.getWidgetById(widgetId, req.user, function (err, widget) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, dashboard, widget);
                }
            });
        }, function (dashboard, widget, cb) {
            var segments = req.body;
            var filteredSegment = _.filter(widget.segments,
                function(segment) { return segments.indexOf(segment.id.toString()) !== -1; });
            widgetDAO.removeSegments(req.user, dashboard, widget, filteredSegment,cb);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

/**
 * @api {delete} /v1/analyze/dashboards/:dashboardId/tags/segments/:segmentId Remove Single Segment from widget
 * @apiGroup Dashboard
 * @apiName Remove Segment from widget
 * @apiVersion 0.0.1
 * @apiDescription Remove single segment from widget
 * @apiExample Example request:
 *  dashboardId : 5457e1990c5a5d2700affe77
 *  dashboardId : 5458ae05fe540a120074c205
 *  segmentId : 54ca5f234aa35750070558fd
 *
 * @apiSuccess success 1
 * @apiSuccess message updated widget data
 * @apiSuccessExample Success example
 * *{
 *   "success": 1,
 *   "message": {
 *       "_id": "5458ae05fe540a120074c205",
 *       "type": "Timeline",
 *       "title": "Timeline widget 1",
 *       "creator": "54135f90c6ab7c241e28095e",
 *       "creatorRole": "BP",
 *       "__v": 9,
 *       "segments": [],
 *       "compareEndDate": null,
 *       "compareStartDate": null,
 *       "endDate": null,
 *       "startDate": null,
 *       "singlePointAggregation": [
 *           {
 *               "function": "Min",
 *               "title": "Min_title"
 *           },
 *           {
 *               "function": "Total"
 *           }
 *       ],
 *       "compareAsBar": false,
 *       "compareMetric": null,
 *       "metric": {
 *           "_id": "545906ddded7ea0f0079840c",
 *           "tagType": "Metric",
 *           "name": "Power (kW)",
 *           "creatorRole": "BP",
 *           "creator": "54135f90c6ab7c241e28095e",
 *           "__v": 0,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54135f90c6ab7c241e28095e"
 *               }
 *           ],
 *           "appEntities": [],
 *           "children": [],
 *           "parents": [
 *               {
 *                   "id": "5458b22379e7b60e00b1133a",
 *                   "tagType": "Node"
 *               }
 *           ],
 *           "summaryMethod": "Average",
 *           "formula": null,
 *           "metricID": "Pac",
 *           "metricType": "Datafeed",
 *           "metric": "Standard",
 *           "rate": null,
 *           "sensorTarget": null,
 *           "timezone": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [],
 *           "utilityProvider": null,
 *           "nonProfit": null,
 *           "taxID": null,
 *           "address": null,
 *           "street": null,
 *           "state": null,
 *           "postalCode": null,
 *           "country": null,
 *           "city": null
 *       },
 *       "compareLabel": null,
 *       "label": null,
 *       "summaryMethod": null,
 *       "showAllTime": false,
 *       "greenhousePounds": false,
 *       "co2Pounds": false,
 *       "greenhouseKilograms": false,
 *       "co2Kilograms": false,
 *       "equivType": null,
 *       "orientation": null,
 *       "showUpTo": null,
 *       "imageUrl": null,
 *       "drillDown": null,
 *       "displayedColumns": [],
 *       "rowsPerTable": null,
 *       "lastConnected": null,
 *       "boilerplateLocation": null,
 *       "boilerplateCommissioning": null,
 *       "boilerplateSystemPower": null,
 *       "boilerplateType": null,
 *       "pivotDimension": null,
 *       "groupDimension": null,
 *       "collapsed": false,
 *       "titleShow": true
 *   }
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:dashboardId/widgets/:widgetId/tags/segments/:segmentId", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var widgetId = req.params.widgetId;
    var segmentId = req.params.segmentId;

    async.waterfall([
        function (cb) {
            dashboardDAO.getDashboardById(dashboardId, req.user, cb);
        }, function (dashboard, cb) {
            widgetDAO.getWidgetById(widgetId, req.user, function (err, widget) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, dashboard, widget);
                }
            });
        }, function (dashboard, widget, cb) {
            var filteredSegment = _.filter(widget.segments,
                function(segment) { return segment.id.toString() === segmentId; });
            widgetDAO.removeSegments(req.user, dashboard, widget, filteredSegment,cb);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

//-------------------------------------------------------------------------------------------------

 /**
 * @api {get} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId/widgetdata Get Widget data
 * @apiGroup Dashboard
 * @apiName Get Analyze widget data
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the single analyze widget data
 * @apiExample Example request
 *  dashboardId : 5461ff0951d2f91500187461
 *  widgetId : 54a181e52f23471700ad36b5
 *
 * @apiSuccess success 1
 * @apiSuccess message widget object
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": [
 *       {
 *           "54a181e52f23471700ad36b5": {
 *               "primaryDateRange": [
 *                   {
 *                       "Barretts": [
 *                           {
 *                               "primaryMetric": {
 *                                   "data": [
 *                                       {
 *                                           "date": "2014-12-14T07:00:00.000Z",
 *                                           "label": "7:00am, December 14, 2014",
 *                                           "value": 0.035355294333333336
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:00:00.000Z",
 *                                           "label": "8:00am, December 14, 2014",
 *                                           "value": 0.82955170075
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:00:00.000Z",
 *                                           "label": "9:00am, December 14, 2014",
 *                                           "value": 2.82181741975
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:00:00.000Z",
 *                                           "label": "10:00am, December 14, 2014",
 *                                           "value": 10.63946701175
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:00:00.000Z",
 *                                           "label": "11:00am, December 14, 2014",
 *                                           "value": 12.885142976000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:00:00.000Z",
 *                                           "label": "12:00pm, December 14, 2014",
 *                                           "value": 12.653024191499998
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:00:00.000Z",
 *                                           "label": "1:00pm, December 14, 2014",
 *                                           "value": 10.8597185925
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:00:00.000Z",
 *                                           "label": "2:00pm, December 14, 2014",
 *                                           "value": 7.63117252825
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:00:00.000Z",
 *                                           "label": "3:00pm, December 14, 2014",
 *                                           "value": 2.38960019925
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:00:00.000Z",
 *                                           "label": "4:00pm, December 14, 2014",
 *                                           "value": 0.256675404
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T17:00:00.000Z",
 *                                           "label": "5:00pm, December 14, 2014",
 *                                           "value": 0
 *                                       }
 *                                   ],
 *                                   "singlePointAggregation": [
 *                                       {
 *                                           "title": "Average example",
 *                                           "value": 5.545593210734848,
 *                                           "function": "Average"
 *                                       }
 *                                   ]
 *                               }
 *                           },
 *                           {
 *                               "compareMetric": {
 *                                   "data": [
 *                                       {
 *                                           "date": "2014-12-14T07:15:41.000Z",
 *                                           "label": "7:15am, December 14, 2014",
 *                                           "value": 0
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T07:30:41.000Z",
 *                                           "label": "7:30am, December 14, 2014",
 *                                           "value": 0.0050714720000000005
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T07:45:41.000Z",
 *                                           "label": "7:45am, December 14, 2014",
 *                                           "value": 0.100994411
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:00:41.000Z",
 *                                           "label": "8:00am, December 14, 2014",
 *                                           "value": 0.333690421
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:15:42.000Z",
 *                                           "label": "8:15am, December 14, 2014",
 *                                           "value": 0.718482923
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:30:42.000Z",
 *                                           "label": "8:30am, December 14, 2014",
 *                                           "value": 0.965657895
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T08:45:42.000Z",
 *                                           "label": "8:45am, December 14, 2014",
 *                                           "value": 1.3003755639999999
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:00:42.000Z",
 *                                           "label": "9:00am, December 14, 2014",
 *                                           "value": 1.815084459
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:15:43.000Z",
 *                                           "label": "9:15am, December 14, 2014",
 *                                           "value": 2.460345521
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:30:43.000Z",
 *                                           "label": "9:30am, December 14, 2014",
 *                                           "value": 2.960433628
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T09:45:43.000Z",
 *                                           "label": "9:45am, December 14, 2014",
 *                                           "value": 4.051406071
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:00:43.000Z",
 *                                           "label": "10:00am, December 14, 2014",
 *                                           "value": 10.142638432
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:15:42.000Z",
 *                                           "label": "10:15am, December 14, 2014",
 *                                           "value": 8.41999597
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:30:42.000Z",
 *                                           "label": "10:30am, December 14, 2014",
 *                                           "value": 11.730888512
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T10:45:42.000Z",
 *                                           "label": "10:45am, December 14, 2014",
 *                                           "value": 12.264345132999999
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:00:43.000Z",
 *                                           "label": "11:00am, December 14, 2014",
 *                                           "value": 12.628809577000002
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:15:44.000Z",
 *                                           "label": "11:15am, December 14, 2014",
 *                                           "value": 12.869318348
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:30:44.000Z",
 *                                           "label": "11:30am, December 14, 2014",
 *                                           "value": 12.988208675
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T11:45:44.000Z",
 *                                           "label": "11:45am, December 14, 2014",
 *                                           "value": 13.054235304
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:00:44.000Z",
 *                                           "label": "12:00pm, December 14, 2014",
 *                                           "value": 12.959375000000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:15:44.000Z",
 *                                           "label": "12:15pm, December 14, 2014",
 *                                           "value": 12.83659292
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:30:44.000Z",
 *                                           "label": "12:30pm, December 14, 2014",
 *                                           "value": 12.616718289000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T12:45:44.000Z",
 *                                           "label": "12:45pm, December 14, 2014",
 *                                           "value": 12.199410557
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:00:44.000Z",
 *                                           "label": "1:00pm, December 14, 2014",
 *                                           "value": 11.712823009000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:15:44.000Z",
 *                                           "label": "1:15pm, December 14, 2014",
 *                                           "value": 11.237452414
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:30:44.000Z",
 *                                           "label": "1:30pm, December 14, 2014",
 *                                           "value": 10.608511615
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T13:45:44.000Z",
 *                                           "label": "1:45pm, December 14, 2014",
 *                                           "value": 9.880087332
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:00:44.000Z",
 *                                           "label": "2:00pm, December 14, 2014",
 *                                           "value": 9.046362595
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:15:44.000Z",
 *                                           "label": "2:15pm, December 14, 2014",
 *                                           "value": 8.118497668
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:30:44.000Z",
 *                                           "label": "2:30pm, December 14, 2014",
 *                                           "value": 7.243792793000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T14:45:44.000Z",
 *                                           "label": "2:45pm, December 14, 2014",
 *                                           "value": 6.116037057000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:00:44.000Z",
 *                                           "label": "3:00pm, December 14, 2014",
 *                                           "value": 4.760526786
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:15:44.000Z",
 *                                           "label": "3:15pm, December 14, 2014",
 *                                           "value": 2.765839621
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:30:44.000Z",
 *                                           "label": "3:30pm, December 14, 2014",
 *                                           "value": 1.142946903
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T15:45:44.000Z",
 *                                           "label": "3:45pm, December 14, 2014",
 *                                           "value": 0.8890874870000001
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:00:44.000Z",
 *                                           "label": "4:00pm, December 14, 2014",
 *                                           "value": 0.605746919
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:15:44.000Z",
 *                                           "label": "4:15pm, December 14, 2014",
 *                                           "value": 0.32342423600000003
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:30:44.000Z",
 *                                           "label": "4:30pm, December 14, 2014",
 *                                           "value": 0.096825104
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T16:45:44.000Z",
 *                                           "label": "4:45pm, December 14, 2014",
 *                                           "value": 0.000705357
 *                                       },
 *                                       {
 *                                           "date": "2014-12-14T17:00:44.000Z",
 *                                           "label": "5:00pm, December 14, 2014",
 *                                           "value": 0
 *                                       }
 *                                   ],
 *                                   "singlePointAggregation": [
 *                                       {
 *                                           "title": "Average example",
 *                                           "value": 6.099268649449999,
 *                                           "function": "Average"
 *                                       }
 *                                   ]
 *                               }
 *                           }
 *                       ]
 *                   }
 *               ],
 *               "compareDateRange": [
 *                   {
 *                       "Barretts": [
 *                           {
 *                               "primaryMetric": {
 *                                   "data": [],
 *                                   "singlePointAggregation": []
 *                               }
 *                           },
 *                           {
 *                               "compareMetric": {
 *                                   "data": [],
 *                                   "singlePointAggregation": []
 *                               }
 *                           }
 *                       ]
 *                   }
 *               ]
 *           }
 *       }
 *   ]
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:dashboardId/widgets/:widgetId/widgetdata", function(req, res, next) {
    return dataSenseWidgetBodyParser.parse(req, res, next, false);
});

 /**
 * @api {delete} /v1/analyze/dashboards/:dashboardId/widgets/:widgetId Delete Widget
 * @apiGroup Dashboard
 * @apiName Delete analyze widget
 * @apiVersion 1.0.0
 * @apiDescription Remove the anyalyze widget from dashboard
 * @apiExample Example request
 *  dashboardId : 5461ff1251d2f91500187462
 *  widgetId : 54683fa4f48ee7140096618d
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *  {
 *      "success": 1,
 *      "message": "OK"
 *  }
 *
 * @apiError success 0
 * @apiError message error code
 */
router.delete("/:dashboardId/widgets/:widgetId", checkAuth, function(req, res, next) {
    var widgetId = req.params.widgetId;
    var dashboardId = req.params.dashboardId;
    widgetDAO.deleteWidgetById(dashboardId, widgetId, req.user, function (err, answer) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(answer, res, next);
            //res.send(new utils.serverAnswer(true, answer));
        }
    });
});

/**
 * @api {post} /v1/analyze/dashboards/export/widget/:widgetId Export Widget
 * @apiGroup Analyze Widget
 * @apiName Export analyze widget
 * @apiVersion 1.0.0
 * @apiDescription Export analyze widget in csv/pdf format
 * @apiExample Example request
 *  widgetId : 54683fa4f48ee7140096618d
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *  {
 *      "success": 1,
 *      "message": "exportedResourceUrl: http://example.com/url"
 *  }
 *
 * @apiError success 0
 * @apiError message error code
 */
router.post("/export/widget/:widgetId", checkAuth, function(req, res, next) {
    var widgetId = req.params.widgetId;
    var exportFormat = req.body.exportFormat;
    var exportFile = req.body.exportFile;
    var exportData = req.body.exportData;

    exportHelper.checkExportDir(function(checkErr) {
        if(checkErr) {
            return next(checkErr);
        }
        else {
            exportHelper.exportWidget(widgetId, exportFormat, exportFile, exportData, function(err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

/**
 * @api {post} /v1/analyze/dashboards/export/:dashboardId Export Dashboard
 * @apiGroup Analyze Dashboard
 * @apiName Export analyze dashboard
 * @apiVersion 1.0.0
 * @apiDescription Export analyze dashboard into pdf format
 * @apiExample Example request
 *  dashboardId : 54683fa4f48ee7140096618d
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 *  {
 *      "success": 1,
 *      "message": "exportedResourceUrl: http://example.com/url"
 *  }
 *
 * @apiError success 0
 * @apiError message error code
 */
router.post("/export/:dashboardId", checkAuth, function(req, res, next) {
    var dashboardId = req.params.dashboardId;
    var exportData = req.body.exportData;
    var exportFile = req.body.exportFile;

    exportHelper.checkExportDir(function(checkErr) {
        if(checkErr) {
            return next(checkErr);
        }
        else {
            exportHelper.exportDashboard(dashboardId, exportFile, exportData, function(err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

module.exports = router;
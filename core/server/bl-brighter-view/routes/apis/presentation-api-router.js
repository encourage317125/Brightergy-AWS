"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    presentationDAO = require("../../core/dao/presentation-dao"),
    tagDAO = require("../../../general/core/dao/tag-dao"),
    widgetDAO = require("../../core/dao/widget-dao"),
    availableWidgetDAO = require("../../core/dao/available-widget-dao"),
    checkAuth = require("../../../general/core/user/check-auth"),
    authUtils = require("../../../general/core/user/auth-utils"),
    consts = require("../../../libs/consts"),
    brighterViewWidgetBodyParser = require("../../core/calculation/widget/widget-body-parser"),
    timeline = require("../../core/timeline");

 /**
 * @api {post} /v1/present/presentations Create Presentation
 * @apiGroup Presentation
 * @apiName Create Presentation
 * @apiVersion 1.0.0
 * @apiDescription Create/Retrieves the new presentation. Create new presentation
 *                 with default presentation values. However, Name and TemplateId should be specified.
 * @apiParam {String} name Name of presentation
 * @apiParam {String} templateId Template Id of presentation(this can be null). Not used for now
 * @apiExample Example request
 *  name : Test Present
 *  templateId : not used for now
 *
 * @apiSuccess success 1
 * @apiSuccess message Created presentation Id
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"",
 *          "tagBindings":[],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", checkAuth, function(req, res, next) {
    var params = req.body;

    utils.removeMongooseVersionField(params);

    if(!params.name) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_NAME_REQUIRED);
        error.status = 422;
        return next(error);
    } else {

        presentationDAO.createPresentation(req.user, params.name, params.templateId, params.bpLock,
            function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
    }
});

 /**
 * @api {put} /v1/present/presentations/:presentationId Edit Presentation
 * @apiGroup Presentation
 * @apiName Edit Presentation
 * @apiVersion 1.0.0
 * @apiDescription Edit presentation data with given new data. API can accepts only changed fields. however,
 *                 id and creatorRole is mandatory.<br/>
 * Following fields can't be updated: <br/>
 *      tagBindings <br/>
 *      awsAssetsKeyPrefix <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body presentation data
 * @apiExample Example request
 *  body
 *  {
 *          "_id":"545e61f0649db6140038fc61",
 *          "creatorRole" : "BP",
 *          "name":"Liberty Lofts Goes Solar updated",
 *          "description":null,
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *           "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsKeyPrefix":"aPDwMlyxH"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated presentation data object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {}
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:presentationId", checkAuth, function(req, res, next) {
    var presentationObj = req.body;

    utils.removeMongooseVersionField(presentationObj);

    utils.removeMultipleFields(presentationObj,
        [
            "tagBindings",
            "awsAssetsKeyPrefix"
        ]
    );

    presentationDAO.validate(presentationObj, function(validateErr, status) {
        if(validateErr) {
            return next(validateErr);
        } else {
            presentationDAO.savePresentation(req.user, presentationObj, false, function (err, result) {
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
 * @api {get} /v1/present/presentations Get All Presentations
 * @apiGroup Presentation
 * @apiName Get All Presentations
 * @apiVersion 1.0.0
 * @apiDescription Retreives the all presentations of currently logged in user.
 *
 * @apiSuccess success 1
 * @apiSuccess message presentation objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHdGtrd3dqMU5xaVU",
 *          "tagBindings":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          }],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/", checkAuth, function(req, res, next) {
    presentationDAO.getPresentationsByUser(req.user, function (err, findPresentations) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(findPresentations, res, next);
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/templates Get Presentation Templates
 * @apiGroup Presentation
 * @apiName Get Presentation Tempaltes
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation Templates. These are the presentaions which the is_template field is true.
 *
 * @apiSuccess success 1
 * @apiSuccess message presentation template objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHdGtrd3dqMU5xaVU",
 *          "tagBindings":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          }],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/templates", function(req, res, next) {
    presentationDAO.getPresentationTemplates(function (err, findPresentations) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(findPresentations, res, next);
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/last Get Last Updated Presentation Id
 * @apiGroup Presentation
 * @apiName Last Updated Presentation Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the last updated presentation Id.
 *
 * @apiSuccess success 1
 * @apiSuccess message presentation Id
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":"5422debd68f461c84a8eb76f"
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/last", checkAuth, function(req, res, next) {
    presentationDAO.getLastEditedPresentationId(req.user, function (findPresentationErr, lastEditedPresentationId) {
            if(findPresentationErr) {
                next(findPresentationErr);
            } else {
                return utils.successResponse(lastEditedPresentationId,res, next);
            }
        });
});

/**
 * @api {get} /v1/present/presentations/:presentationId/timeline Get Pesentation Timeline
 * @apiGroup Presentation
 * @apiName Get Pesentation Timeline
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the timeline data of presentation.
 * @apiExample Example request
 *  presentationId 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message timeline data
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "timeline":{
 *              "headline":"Barretts Elementary Goes Solar",
 *              "text":"Barretts Elementary Goes Solar",
 *              "type":"default",
 *              "startDate":"2014,9,12,21,0,0",
 *              "date":[{
 *                  "startDate":"2014,9,12,22,0,0",
 *                  "endDate":"2014,9,12,22,0,10",
 *                  "widgetId":"5415c0fdb1c838ea73500120",
 *                  "availableWidgetId":"541357ee01d4609c1ff24bb5",
 *                  "headline":"Energy Equivalencies",
 *                  "icon":"https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HWWFYNklUVXU4UFk",
 *                  "rowPosition":1,
 *                  "colPosition":6,
 *                  "backgroundColor":"dee9a5",
 *                  "timelineRowPosition":2,
 *                  "previousTimelineRowPosition":-1,
 *                  "resizedOnTimeline":false
 *              },{
 *                  "startDate":"2014,9,12,22,0,0",
 *                  "endDate":"2014,9,12,22,0,10",
 *                  "widgetId":"541759a6a90e8de146a10bfd",
 *                  "availableWidgetId":"541357ee01d4609c1ff24bb8",
 *                  "headline":"Image",
 *                  "icon":"https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HM0tmb3RDQ2hBYTA",
 *                  "rowPosition":3,
 *                  "colPosition":10,
 *                  "backgroundColor":"fbb3bf",
 *                  "timelineRowPosition":1,
 *                  "previousTimelineRowPosition":-1,
 *                  "resizedOnTimeline":false
 *              }]
 *          }
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
 router.get("/:presentationId/timeline", function(req, res, next) {
    var presentationId = req.params.presentationId;
    timeline.getTimeline(presentationId, function (err, findPresentation) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(findPresentation, res, next);
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/editors Get Pesentation Editors
 * @apiGroup Presentation
 * @apiName Get Pesentation Editors
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the users who can edit presentation
 * @apiExample Example request
 *  presentationId 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message user data objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135ec74f09ccc06d5be3d6",
 *          "firstName":"Adam",
 *          "lastName":"Admin",
 *          "email":"adam@brightergy.com",
 *          "emailUser":"adam",
 *          "emailDomain":"brightergy.com",
 *          "__v":17,
 *          "accessibleTags":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          },{
 *              "tagType":"Facility",
 *              "id":"543824bf7174d62c1acad51d"
 *          }],
 *          "accounts":["54135e074f09ccc06d5be3d2"],
 *          "children":[],
 *          "parents":[],
 *          "profilePictureUrl":null,
 *          "sfdcContactId":"003L000000OUS4VIAX",
 *          "defaultApp":"DataSense",
 *          "apps":["Present"],
 *          "previousEditedDashboardId":null,
 *          "lastEditedDashboardId":null,
 *          "previousEditedPresentation":null,
 *          "lastEditedPresentation":null,
 *          "role":"Admin",
 *          "enphaseUserId":null,
 *          "socialToken":null,
 *          "phone":"1-816-866-0555",
 *          "middleName":"",
 *          "name":"Adam Admin",
 *          "sfdcContactURL":"https://cs15.salesforce.com/003L000000OUS4VIAX",
 *          "id":"54135ec74f09ccc06d5be3d6"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
 router.get("/:presentationId/editors", checkAuth, function(req, res, next){
    var presentationId = req.params.presentationId;

     presentationDAO.getEditors(presentationId, req.user, function (err, editors) {
         if (err) {
             return next(err);
         } else {
             return utils.successResponse(editors, res, next);
         }
     });
});

/**
 * API:         Add presentation editor
 *
 * @url         /presentations/editor/add
 * @method      POST
 * @request     User Id
 * @request     Presentation Id
 * @response    Array of User Object or error
 */
router.post("/:presentationId/editors", checkAuth, function(req, res, next){
    var params = req.body;
    var userId = params.userId;
    var presentationId = params.presentationId;

    presentationDAO.addEditor(presentationId, userId, req.user, function (err, editors) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(editors, res, next);
        }
    });
});

/**
 * API:         Remove presentation editor
 *
 * @url         /presentations/editor/remove
 * @method      DELETE
 * @request     User Id
 * @request     Presentation Id
 * @response    Array of User Object or error
 */
router.delete("/:presentationId/editors", checkAuth, function(req, res, next){
    var params = req.body;
    var userId = params.userId;
    var presentationId = params.presentationId;

    presentationDAO.removeEditor(presentationId, userId, req.user, function (err, editors) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(editors, res, next);
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/:presentationId Get Presentation
 * @apiGroup Presentation
 * @apiName Get Presentation
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation data by Id
 * @apiExample Example request
 *  presentationId : 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message Presentation data object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHdGtrd3dqMU5xaVU",
 *          "tagBindings":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          }],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId", function(req, res, next) {

    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        var presentationId = req.params.presentationId;
        var thisUser = null;
        if (currentUser) {
            thisUser = currentUser;
        }
        presentationDAO.getPresentationById(presentationId, thisUser, function (err, findPresentation) {
            if (err) {
                return next(err);
            } else {
                return utils.successResponse(findPresentation, res, next);
            }
        });
    });
});

 /**
 * @api {post} /v1/present/presentations/clone/:presentationId Clone Presentation
 * @apiGroup Presentation
 * @apiName Clone Presentation
 * @apiVersion 1.0.0
 * @apiDescription Clone presentation and retrieves the Id of new presentation.
 * @apiExample Example request
 *  presentationId : 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message presentation id of newly created.
 * @apiSuccessExample Success example
 * {
        "success": 1,
        "message": "5429d13f89c1849502287d5d"
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/clone/:presentationId", checkAuth, function(req, res, next) {

    var presentationId = req.params.presentationId;

    presentationDAO.clone(presentationId, req.user, function(err, clonedPresentation) {
        if(err) {
            return next(err);
        } else {
            req.user.previousEditedPresentation = presentationId;
            req.user.lastEditedPresentation = clonedPresentation._id;

            req.user.save(function (saveErr, savedUser) {
                if(saveErr) {
                    return next(saveErr);
                } else {
                    return utils.successResponse(clonedPresentation._id, res, next);
                }
            });
        }
    });
});

 /**
 * @api {delete} /v1/present/presentations/:presentationId Delete Presentation
 * @apiGroup Presentation
 * @apiName Delete Presentation
 * @apiVersion 1.0.0
 * @apiDescription Delete presention by Id
 * @apiExample Example request
 *  presentationId : 546c887180f57514008590fc
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:presentationId", checkAuth, function(req, res, next) {
    var presentationId = req.params.presentationId;
    presentationDAO.deletePresentationById(presentationId, req.user, function (err, answer) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(answer, res, next);
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/energydata Get Presentation Energy Data
 * @apiGroup Presentation
 * @apiName Get Presentation Energy Data
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation energy data by Id
 * @apiExample Example request
 *  presentationId 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message Presentation energy data object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/energydata", function(req, res, next) {
    return brighterViewWidgetBodyParser.parse(req, res, next, consts.PRESENTATION_ENERGY_DATA);
});

 /**
 * @api {post} /v1/present/presentations/:presentationId/tags Add Presentation TagBinding
 * @apiGroup Presentation
 * @apiName Add TagBinding
 * @apiVersion 1.0.0
 * @apiDescription Add tagbinding to presentation.
 * @apiParam {Object} tagBinding tagBind data
 * @apiExample Example request
 *  presentationId : 545e61f0649db6140038fc61
 *  "tagBinding" :
 *  {
 *      "id" : "543824bf7174d62c1acad51b",
 *      "tagType" : "DataLogger"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated presentation object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"",
 *          "tagBindings":[{
 *              "id" : "543824bd7174d62c1acad510",
 *              "tagType" : "DataLogger"
 *          },
 *          {
 *              "id" : "543824be7174d62c1acad517",
 *              "tagType" : "DataLogger"
 *          }],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:presentationId/tags", checkAuth, function(req, res, next) {
    var presentationId = req.params.presentationId;
    var tagObj = req.body.tagBinding;

    presentationDAO.getPresentationById(presentationId, req.user, function (findErr, foundPresentation) {
        if (findErr) {
            return next(findErr);
        } else {
            presentationDAO.addTag(req.user, foundPresentation, tagObj, function (error, savedPresentation) {
                if (error) {
                    return next(error);
                } else {
                    return utils.successResponse(savedPresentation, res, next);
                }
            });
        }
    });
});

 /**
 * API: Update Tags of Presentation
 *
 * @url         /present/presentations/:presentationId/tags
 * @method      PUT
 * @request     Presentation Id
 * @request     Tag binding object array
 * @response    Presentation object or error
 */
router.put("/:presentationId/tags", checkAuth, function(req, res, next) {
    var presentationId = req.params.presentationId;
    var tagBindings = req.body.tagBindings;

    presentationDAO.getPresentationById(presentationId, req.user, function (findErr, foundPresentation) {
            if (findErr) {
                return next(findErr);
            } else {
                if(foundPresentation.tagBindings && foundPresentation.tagBindings.length > 0) {
                    presentationDAO.removeTagsAll(req.user, foundPresentation, function (error, removedPresentation) {
                            if (error) {
                                return next(error);
                            } else {
                                presentationDAO.addTags(req.user, removedPresentation, tagBindings,
                                    function (error, savedPresentation) {
                                        if (error) {
                                            return next(error);
                                        } else {
                                            return utils.successResponse(savedPresentation, res, next);
                                        }
                                    });
                            }
                        });
                }
                else {
                    presentationDAO.addTags(req.user, foundPresentation, tagBindings,
                        function (error, savedPresentation) {
                            if (error) {
                                return next(error);
                            } else {
                                return utils.successResponse(savedPresentation, res, next);
                            }
                        });
                }

            }
        });
});

 /**
 * @api {delete} /v1/present/presentation/:presentationId/tags/:tagId Remove Presentation Tagbinding
 * @apiGroup Presentation
 * @apiName Remove Tagbinding
 * @apiVersion 1.0.0
 * @apiDescription Remove tagbinding from presentation and retrieves the updated presentation data.
 * @apiExample Example request
 *  tagId : 5458afc6fe540a120074c20f
 *  presentationId : 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message updated presentation object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id":"5413af68b1c838ea73500109",
 *          "creatorRole":"BP",
 *          "name":"Barretts Elementary Goes Solar",
 *          "__v":9,
 *          "gDriveAssetsFolderId":"",
 *          "tagBindings":[{
 *              "id" : "543824bd7174d62c1acad510",
 *              "tagType" : "DataLogger"
 *          }],
 *          "parameters":{
 *              "endDate":null,
 *              "startDate":"2014-09-12T21:00:00.000Z",
 *              "normal2Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "normal1Font":{
 *                  "visible":false,
 *                  "label":null,
 *                  "content":null,
 *                  "size":null,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":null
 *              },
 *              "subHeaderFont":{
 *                  "visible":true,
 *                  "label":null,
 *                  "content":null,
 *                  "size":0.9,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"f9d8ca"
 *              },
 *              "headerFont":{
 *                  "visible":true,
 *                  "label":"Header",
 *                  "content":null,
 *                  "size":4,
 *                  "name":"BentonSans, sans-serif",
 *                  "color":"ffffff"
 *              },
 *              "seventhColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "sixthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fifthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "fourthColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "tertiaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "secondaryColor":{
 *                  "label":null,
 *                  "isVisible":false,
 *                  "color":null
 *              },
 *              "primaryColor":{
 *                  "label":"Title Background Color",
 *                  "isVisible":true,
 *                  "color":null
 *              },
 *              "backgroundColor":"f2672a"
 *          },
 *          "children":[],
 *          "parents":[],
 *          "description":null,
 *          "creator":"54135f90c6ab7c241e28095e",
 *          "creatorName":"Daniel Keith",
 *          "reimbursementRate":0.08,
 *          "isTemplate":true,
 *          "IsNewPresentation":false,
 *          "titleView":true,
 *          "lastUpdatedView":true,
 *          "generatingSinceView":true,
 *          "systemSizeView":true,
 *          "systemSize":25.2,
 *          "webBox":"wb150115159",
 *          "createdDate":"2014-09-12T21:04:11.000Z",
 *          "Longitude":-90.4724,
 *          "Logo":null,
 *          "Latitude":38.5763,
 *          "awsAssetsFolderName":null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:presentationId/tags/:tagId", checkAuth, function(req, res, next) {
    var presentationId = req.params.presentationId;
    var tagId = req.params.tagId;

    presentationDAO.getPresentationById(presentationId, req.user, function (findErr, foundPresentation) {
        if (findErr) {
            return next(findErr);
        } else {
            tagDAO.getTagByIdIfAllowed(tagId, req.user, function (findTagErr, foundTag) {
                if(findTagErr) {
                    return next(findTagErr);
                } else {
                    presentationDAO.removeTag(req.user, foundPresentation, tagId,
                        function (error, savedPresentation) {
                            if (error) {
                                return next(error);
                            } else {
                                return utils.successResponse(savedPresentation, res, next);
                            }
                        });
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/present/presentations/widgets Create Widget
 * @apiGroup Presentation
 * @apiName Create Presentation Widget
 * @apiVersion 1.0.0
 * @apiDescription Create presentation widget
 * @apiParam {Object} body data of widget
 * @apiExample Example request
 *  body
 *  {
 *      "__v" : 0,
 *      "availableWidgetId" : "54515da56109431200c5c1bc",
 *      "presentation" : {
 *          "_id" : "546b7ecb80f57514008590e1",
 *          "__v" : 0,
 *          "name" : "TEST",
 *          "creatorRole" : "BP",
 *          "parameters" : {
 *              "endDate" : null,
 *              "startDate" : "2014-11-17T22:00:00.000Z",
 *              "normal2Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : null
 *              },
 *              "normal1Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : null
 *              },
 *              "subHeaderFont" : {
 *                  "visible" : true,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : 0.9,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "f9d8ca"
 *              },
 *              "headerFont" : {
 *                  "visible" : true,
 *                  "label" : "Header",
 *                  "content" : null,
 *                  "size" : 4,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "seventhColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "sixthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "fifthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "fourthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "tertiaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "secondaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : null
 *              },
 *              "primaryColor" : {
 *                  "label" : "Title Background Color",
 *                  "isVisible" : true,
 *                  "color" : null
 *              },
 *              "backgroundColor" : "f2672a"
 *          },
 *          "tagBindings" : [],
 *          "description" : null,
 *          "creator" : "5458ee0341dbce5800f248c9",
 *          "creatorName" : "Dev Webapp",
 *          "reimbursementRate" : null,
 *          "isTemplate" : false,
 *          "IsNewPresentation" : false,
 *          "titleView" : false,
 *          "lastUpdatedView" : false,
 *          "generatingSinceView" : false,
 *          "systemSizeView" : false,
 *          "systemSize" : null,
 *          "webBox" : null,
 *          "createdDate" : "2014-11-17T22:04:05.000Z",
 *          "Longitude" : null,
 *          "Logo" : null,
 *          "Latitude" : null,
 *          "awsAssetsKeyPrefix" : "aPDwMlyxH"
 *      },
 *      "parameters" : {
 *          "widgetGraphCombineInverters" : true,
 *          "widgetEnergyCombineInverters" : true,
 *          "widgetEnergyInverter" : null,
 *          "widgetEnergyEndDate" : null,
 *          "widgetEnergyStartDate" : null,
 *          "widgetEnergyDateRange" : "Month",
 *          "widgetEnergyOrientation" : "Horizontal",
 *          "widgetEnergyType" : "Cars Removed",
 *          "widgetEnergyGreenhouseKilograms" : false,
 *          "widgetEnergyCO2Kilograms" : false,
 *          "widgetWeatherType" : "Minimal",
 *          "widgetTextareaContent" : null,
 *          "widgetURL" : null,
 *          "widgetTotalEGinGasSaved" : null,
 *          "widgetTotalEGinFewerVehicles" : null,
 *          "widgetTotalEGin60WattBulbs" : null,
 *          "widgetTotalCO2OffsetinTrees" : null,
 *          "widgetSolarGenerationCombineInverters" : true,
 *          "widgetSolarGenerationInverter" : null,
 *          "widgetSolarGenerationOrientation" : "Vertical",
 *          "widgetSolarGenerationEndDate" : null,
 *          "widgetSolarGenerationStartDate" : null,
 *          "widgetSolarGenerationDateRange" : "All",
 *          "widgetSolarGenerationReimbursement" : false,
 *          "widgetSolarGenerationCurrent" : false,
 *          "widgetSolarGenerationkWh" : true,
 *          "widgetIFrameUrl" : null,
 *          "widgetHowDoesSolarWorkOverallDuration" : 15,
 *          "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels to the
 *              inverter where it is converted to AC electricity.",
 *          "widgetHowDoesSolarWorkStepTwoDuration" : 3,
 *          "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to the
 *              electric service panel (breaker box) and routed to power your school.",
 *          "widgetHowDoesSolarWorkStepThreeDuration" : 3,
 *          "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert it to DC electricity.",
 *          "widgetHowDoesSolarWorkStepOneDuration" : 3,
 *          "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more power than your school
 *              is consuming, excess electricity is routed to the power grid.
 *              This earns credits on the school's bill (called net-metering).",
 *          "widgetHowDoesSolarWorkStepFourDuration" : 3,
 *          "widgetGraphMaxPowerChartType" : "false",
 *          "widgetGraphMaxPower" : true,
 *          "wIdgetGraphTemperatureChartType" : "bar",
 *          "widgetGraphTemperature" : false,
 *          "widgetGraphWeather" : false,
 *          "widgetGraphBlockLabel" : "Charting Colors",
 *          "widgetGraphInverter" : null,
 *          "widgetGraphIrradianceChartType" : "bar",
 *          "widgetGraphIrradiance" : false,
 *          "widgetGraphHumidityChartType" : "bar",
 *          "widgetGraphHumidity" : false,
 *          "widgetGraphEndDate" : null,
 *          "widgetGraphStartDate" : null,
 *          "widgetGraphInterval" : "Daily",
 *          "widgetGraphGenerationChartType" : "bar",
 *          "widgetGraphGeneration" : true,
 *          "widgetGraphDateRange" : "All",
 *          "widgetGraphCurrentPowerChartType" : "bar",
 *          "widgetGraphCurrentPower" : false,
 *          "widgetBorderColor" : "28b1b4",
 *          "widgetRandomColor" : "9bd3d0",
 *          "duration" : 20,
 *          "resizedOnTimeline" : false,
 *          "endDate" : "2014-11-10T07:00:20.000Z",
 *          "startDate" : "0:0",
 *          "minimumCols" : 2,
 *          "minimumRows" : 2,
 *          "previousTimelineRowPosition" : -1,
 *          "timelineRowPosition" : 0,
 *          "rowPosition" : 0,
 *          "rowCount" : 7,
 *          "colPosition" : 0,
 *          "colCount" : 9,
 *          "transitionOut" : null,
 *          "transitionIn" : null,
 *          "backgroundImageVisible" : true,
 *          "backgroundColorVisible" : true,
 *          "backgroundImageLabel" : "Background Image",
 *          "backgroundColorLabel" : "Body Background Color",
 *          "backgroundImage" : null,
 *          "backgroundColor" : "ffffff",
 *          "normal2Font" : {
 *              "visible" : true,
 *              "label" : "Labels",
 *              "content" : null,
 *              "size" : 1,
 *              "name" : "BentonSans, sans-serif",
 *              "color" : "4d759e"
 *          },
 *          "normal1Font" : {
 *              "visible" : false,
 *              "label" : null,
 *              "content" : null,
 *              "size" : null,
 *              "name" : "BentonSans, sans-serif",
 *              "color" : "ffffff"
 *          },
 *          "subHeaderFont" : {
 *              "visible" : false,
 *              "label" : null,
 *              "content" : null,
 *              "size" : null,
 *              "name" : "BentonSans, sans-serif",
 *              "color" : "ffffff"
 *          },
 *          "headerFont" : {
 *              "visible" : true,
 *              "label" : "Title",
 *              "content" : null,
 *              "size" : 1.5,
 *              "name" : "BentonSans, sans-serif",
 *              "color" : "ffffff"
 *          },
 *          "seventhColor" : {
 *              "label" : "Weather Graph",
 *              "isVisible" : true,
 *              "color" : "18f20c"
 *          },
 *          "sixthColor" : {
 *              "label" : "Max Power Graph",
 *              "isVisible" : true,
 *              "color" : "d9e803"
 *          },
 *          "fifthColor" : {
 *              "label" : "Current Power Graph",
 *              "isVisible" : true,
 *              "color" : "0d4b75"
 *          },
 *          "fourthColor" : {
 *              "label" : "Humidity Graph",
 *              "isVisible" : true,
 *              "color" : "bf1fbf"
 *          },
 *          "tertiaryColor" : {
 *              "label" : "Temperature Graph",
 *              "isVisible" : true,
 *              "color" : "0d233a"
 *          },
 *          "secondaryColor" : {
 *              "label" : "Generation Graph",
 *              "isVisible" : true,
 *              "color" : "5163ad"
 *          },
 *          "primaryColor" : {
 *              "label" : "Title Background Color",
 *              "isVisible" : true,
 *              "color" : "98a3d0"
 *          }
 *      },
 *      "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HaVRnYThybVhmdWc",
 *      "name" : "Graph"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated Presentation Widget
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {}
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/widgets", checkAuth, function(req, res, next) {
    var widgetObj = req.body;

    utils.removeMongooseVersionField(widgetObj);

    widgetDAO.createWidget(widgetObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

 /**
 * @api {put} /v1/present/presentations/widgets/:widgetId Update Widget
 * @apiGroup Presentation
 * @apiName Update Presentation Widget
 * @apiVersion 1.0.0
 * @apiDescription Edit presentation widget. API can accept only changed fields. However id is mandatory.
 * @apiParam {Object} body data of widget
 * @apiExample Example request
 *  body
 *  {
 *      "_id" : "546edf7353dcae50064f838c",
 *      "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HaVRnYThybVhmdWc"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated Presentation Widget
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {}
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/widgets/:widgetId", checkAuth, function(req, res, next) {
    var widgetObj = req.body;
    var widgetId = req.params.widgetId;

    utils.removeMongooseVersionField(widgetObj);

    widgetDAO.updateWidget(widgetObj, widgetId, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
        }
    });
});

function loadWidgets(presentationId, currentUser, res, next) {
    widgetDAO.getWidgetsByPresentationId(presentationId, currentUser, function (err, widgets) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(widgets, res, next);
            //res.send(new utils.serverAnswer(true, widgets));
        }
    });
}

 /**
 * @api {get} /v1/present/presentations/:presentationId/widgets Get Widgets
 * @apiGroup Presentation
 * @apiName Get Presentation Widgets
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the widgets data of presentation
 * @apiExample Example request
 *  presentationId : 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccess message Widget Objects
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "542ad52dd3a162b52c05f970",
 *          "presentation" : {
 *              _id: "5413af68b1c838ea73500109",
 *              creatorRole: "BP",
 *              name: "Barretts Elementary Goes Solar",
 *              __v: 9,
 *              gDriveAssetsFolderId: "0BwW4a4uizniHdGtrd3dqMU5xaVU",
 *              tagBindings: [{
 *                  tagType: "Facility",
 *                  id: "543824bd7174d62c1acad50f"
 *              }],
 *              parameters: {
 *                  endDate: null,
 *                  startDate: "2014-09-12T21:00:00.000Z",
 *                  normal2Font: {
 *                      visible: false,
 *                      label: null,
 *                      content: null,
 *                      size: null,
 *                      name: "BentonSans, sans-serif",
 *                      color: null
 *                  },
 *                  normal1Font: {
 *                      visible: false,
 *                      label: null,
 *                      content: null,
 *                      size: null,
 *                      name: "BentonSans, sans-serif",
 *                      color: null
 *                  },
 *                  subHeaderFont: {
 *                      visible: true,
 *                      label: null,
 *                      content: null,
 *                      size: 0.9,
 *                      name: "BentonSans, sans-serif",
 *                      color: "f9d8ca"
 *                  },
 *                  headerFont: {
 *                      visible: true,
 *                      label: "Header",
 *                      content: null,
 *                      size: 4,
 *                      name: "BentonSans, sans-serif",
 *                      color: "ffffff"
 *                  },
 *                  seventhColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  sixthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  fifthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  fourthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  tertiaryColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  secondaryColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  primaryColor: {
 *                      label: "Title Background Color",
 *                      isVisible: true,
 *                      color: null
 *                  },
 *                  backgroundColor: "f2672a"
 *              },
 *              children: [ ],
 *              parents: [ ],
 *              description: null,
 *              creator: "54135f90c6ab7c241e28095e",
 *              creatorName: "Daniel Keith",
 *              reimbursementRate: 0.08,
 *              isTemplate: true,
 *              IsNewPresentation: false,
 *              titleView: true,
 *              lastUpdatedView: true,
 *              generatingSinceView: true,
 *              systemSizeView: true,
 *              systemSize: 25.2,
 *              webBox: "wb150115159",
 *              createdDate: "2014-09-12T21:04:11.000Z",
 *              Longitude: -90.4724,
 *              Logo: null,
 *              Latitude: 38.5763,
 *              awsAssetsFolderName: null
 *          },
 *          "availableWidgetId" : "542449b67ced133822b9b0c2",
 *          "parameters" : {
 *              "widgetGraphCombineInverters" : true,
 *              "widgetEnergyCombineInverters" : true,
 *              "widgetEnergyInverter" : null,
 *              "widgetEnergyEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetEnergyStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetEnergyDateRange" : "Month",
 *              "widgetEnergyOrientation" : "Horizontal",
 *              "widgetEnergyType" : "Cars Removed",
 *              "widgetEnergyGreenhouseKilograms" : false,
 *              "widgetEnergyCO2Kilograms" : false,
 *              "widgetWeatherType" : "Minimal",
 *              "widgetTextareaContent" : null,
 *              "widgetURL" : "http://brightergy.com/cms/wp-content/uploads/2014/09/JohnFKennedy_BV_1.jpg",
 *              "widgetTotalEGinGasSaved" : null,
 *              "widgetTotalEGinFewerVehicles" : null,
 *              "widgetTotalEGin60WattBulbs" : null,
 *              "widgetTotalCO2OffsetinTrees" : null,
 *              "widgetSolarGenerationCombineInverters" : true,
 *              "widgetSolarGenerationInverter" : null,
 *              "widgetSolarGenerationOrientation" : "Vertical",
 *              "widgetSolarGenerationEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetSolarGenerationStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetSolarGenerationDateRange" : "All",
 *              "widgetSolarGenerationReimbursement" : false,
 *              "widgetSolarGenerationCurrent" : false,
 *              "widgetSolarGenerationkWh" : true,
 *              "widgetIFrameUrl" : null,
 *              "widgetHowDoesSolarWorkOverallDuration" : 15,
 *              "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels to
 *                  the inverter where it is converted to AC electricity.",
 *              "widgetHowDoesSolarWorkStepTwoDuration" : 3,
 *              "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to
 *                  the electric service panel (breaker box) and routed to power your school.",
 *              "widgetHowDoesSolarWorkStepThreeDuration" : 3,
 *              "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert it to DC electricity.",
 *              "widgetHowDoesSolarWorkStepOneDuration" : 3,
 *              "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more power than your school
 *                  is consuming, excess electricity is routed to the power grid.
 *                  This earns credits on the school's bill (called net-metering).",
 *              "widgetHowDoesSolarWorkStepFourDuration" : 3,
 *              "widgetGraphMaxPowerChartType" : "false",
 *              "widgetGraphMaxPower" : false,
 *              "wIdgetGraphTemperatureChartType" : "bar",
 *              "widgetGraphTemperature" : false,
 *              "widgetGraphWeather" : false,
 *              "widgetGraphBlockLabel" : null,
 *              "widgetGraphInverter" : null,
 *              "widgetGraphIrradianceChartType" : "bar",
 *              "widgetGraphIrradiance" : false,
 *              "widgetGraphHumidityChartType" : "bar",
 *              "widgetGraphHumidity" : false,
 *              "widgetGraphEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetGraphStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetGraphInterval" : "Daily",
 *              "widgetGraphGenerationChartType" : "bar",
 *              "widgetGraphGeneration" : true,
 *              "widgetGraphDateRange" : "Month",
 *              "widgetGraphCurrentPowerChartType" : "bar",
 *              "widgetGraphCurrentPower" : false,
 *              "widgetBorderColor" : "28b1b4",
 *              "widgetRandomColor" : "9bd3d0",
 *              "duration" : 10,
 *              "resizedOnTimeline" : false,
 *              "endDate" : "2014-09-22T15:01:05.000Z",
 *              "startDate" : "0:55",
 *              "minimumCols" : null,
 *              "minimumRows" : null,
 *              "previousTimelineRowPosition" : -1,
 *              "timelineRowPosition" : 0,
 *              "rowPosition" : 0,
 *              "rowCount" : 7,
 *              "colPosition" : 0,
 *              "colCount" : 16,
 *              "transitionOut" : null,
 *              "transitionIn" : null,
 *              "backgroundImageVisible" : false,
 *              "backgroundColorVisible" : false,
 *              "backgroundImageLabel" : null,
 *              "backgroundColorLabel" : null,
 *              "backgroundImage" : "",
 *              "backgroundColor" : "FFFFFF",
 *              "normal2Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "normal1Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "subHeaderFont" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "headerFont" : {
 *                  "visible" : true,
 *                  "label" : "Title",
 *                  "content" : null,
 *                  "size" : 1.5,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "seventhColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "sixthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "fifthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "fourthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "tertiaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "secondaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "eb617b"
 *              },
 *              "primaryColor" : {
 *                  "label" : "Title Background Color",
 *                  "isVisible" : false,
 *                  "color" : "fbb3bf"
 *              }
 *          },
 *          "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HM0tmb3RDQ2hBYTA",
 *          "name" : "Image",
 *          "__v" : 0
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/widgets", function(req, res, next) {
    var presentationId = req.params.presentationId;
    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        if (findUserErr) {
            loadWidgets(presentationId, null, res, next);
        } else {
            loadWidgets(presentationId, currentUser, res, next);
        }
    });
});

 /**
 * @api {delete} /v1/present/presentations/widgets/:widgetId Delete Widget
 * @apiGroup Presentation
 * @apiName Delete Presentation Widget
 * @apiVersion 1.0.0
 * @apiDescription Remove the presentation widget by Id
 * @apiExample Example request
 *  widgetId : 546129bb6d303d4200a168e0
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/widgets/:widgetId", checkAuth, function(req, res, next) {
    var widgetId = req.params.widgetId;
    widgetDAO.deleteWidgetById(widgetId, req.user, function (err, answer) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(answer, res, next);
            //res.send(new utils.serverAnswer(true, answer));
        }
    });
});


 /**
 * @api {get} /v1/present/presentations/widgets/available Get Available Widgets
 * @apiGroup Presentation
 * @apiName Get Available Presentation Widgets
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the all available presentation widgets

 *
 * @apiSuccess success 1
 * @apiSuccess message Widget Objects
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "542ad52dd3a162b52c05f970",
 *          "presentation" : {
 *              _id: "5413af68b1c838ea73500109",
 *              creatorRole: "BP",
 *              name: "Barretts Elementary Goes Solar",
 *              __v: 9,
 *              gDriveAssetsFolderId: "0BwW4a4uizniHdGtrd3dqMU5xaVU",
 *              tagBindings: [{
 *                  tagType: "Facility",
 *                  id: "543824bd7174d62c1acad50f"
 *              }],
 *              parameters: {
 *                  endDate: null,
 *                  startDate: "2014-09-12T21:00:00.000Z",
 *                  normal2Font: {
 *                      visible: false,
 *                      label: null,
 *                      content: null,
 *                      size: null,
 *                      name: "BentonSans, sans-serif",
 *                      color: null
 *                  },
 *                  normal1Font: {
 *                      visible: false,
 *                      label: null,
 *                      content: null,
 *                      size: null,
 *                      name: "BentonSans, sans-serif",
 *                      color: null
 *                  },
 *                  subHeaderFont: {
 *                      visible: true,
 *                      label: null,
 *                      content: null,
 *                      size: 0.9,
 *                      name: "BentonSans, sans-serif",
 *                      color: "f9d8ca"
 *                  },
 *                  headerFont: {
 *                      visible: true,
 *                      label: "Header",
 *                      content: null,
 *                      size: 4,
 *                      name: "BentonSans, sans-serif",
 *                      color: "ffffff"
 *                  },
 *                  seventhColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  sixthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  fifthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  fourthColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  tertiaryColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  secondaryColor: {
 *                      label: null,
 *                      isVisible: false,
 *                      color: null
 *                  },
 *                  primaryColor: {
 *                      label: "Title Background Color",
 *                      isVisible: true,
 *                      color: null
 *                  },
 *                  backgroundColor: "f2672a"
 *              },
 *              children: [ ],
 *              parents: [ ],
 *              description: null,
 *              creator: "54135f90c6ab7c241e28095e",
 *              creatorName: "Daniel Keith",
 *              reimbursementRate: 0.08,
 *              isTemplate: true,
 *              IsNewPresentation: false,
 *              titleView: true,
 *              lastUpdatedView: true,
 *              generatingSinceView: true,
 *              systemSizeView: true,
 *              systemSize: 25.2,
 *              webBox: "wb150115159",
 *              createdDate: "2014-09-12T21:04:11.000Z",
 *              Longitude: -90.4724,
 *              Logo: null,
 *              Latitude: 38.5763,
 *              awsAssetsFolderName: null
 *          },
 *          "availableWidgetId" : "542449b67ced133822b9b0c2",
 *          "parameters" : {
 *              "widgetGraphCombineInverters" : true,
 *              "widgetEnergyCombineInverters" : true,
 *              "widgetEnergyInverter" : null,
 *              "widgetEnergyEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetEnergyStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetEnergyDateRange" : "Month",
 *              "widgetEnergyOrientation" : "Horizontal",
 *              "widgetEnergyType" : "Cars Removed",
 *              "widgetEnergyGreenhouseKilograms" : false,
 *              "widgetEnergyCO2Kilograms" : false,
 *              "widgetWeatherType" : "Minimal",
 *              "widgetTextareaContent" : null,
 *              "widgetURL" : "http://brightergy.com/cms/wp-content/uploads/2014/09/JohnFKennedy_BV_1.jpg",
 *              "widgetTotalEGinGasSaved" : null,
 *              "widgetTotalEGinFewerVehicles" : null,
 *              "widgetTotalEGin60WattBulbs" : null,
 *              "widgetTotalCO2OffsetinTrees" : null,
 *              "widgetSolarGenerationCombineInverters" : true,
 *              "widgetSolarGenerationInverter" : null,
 *              "widgetSolarGenerationOrientation" : "Vertical",
 *              "widgetSolarGenerationEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetSolarGenerationStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetSolarGenerationDateRange" : "All",
 *              "widgetSolarGenerationReimbursement" : false,
 *              "widgetSolarGenerationCurrent" : false,
 *              "widgetSolarGenerationkWh" : true,
 *              "widgetIFrameUrl" : null,
 *              "widgetHowDoesSolarWorkOverallDuration" : 15,
 *              "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels to the
 *                  inverter where it is converted to AC electricity.",
 *              "widgetHowDoesSolarWorkStepTwoDuration" : 3,
 *              "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to
 *                  the electric service panel (breaker box) and routed to power your school.",
 *              "widgetHowDoesSolarWorkStepThreeDuration" : 3,
 *              "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert it to DC electricity.",
 *              "widgetHowDoesSolarWorkStepOneDuration" : 3,
 *              "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more power
 *                  than your school is consuming, excess electricity is routed to the power grid.
 *                  This earns credits on the school's bill (called net-metering).",
 *              "widgetHowDoesSolarWorkStepFourDuration" : 3,
 *              "widgetGraphMaxPowerChartType" : "false",
 *              "widgetGraphMaxPower" : false,
 *              "wIdgetGraphTemperatureChartType" : "bar",
 *              "widgetGraphTemperature" : false,
 *              "widgetGraphWeather" : false,
 *              "widgetGraphBlockLabel" : null,
 *              "widgetGraphInverter" : null,
 *              "widgetGraphIrradianceChartType" : "bar",
 *              "widgetGraphIrradiance" : false,
 *              "widgetGraphHumidityChartType" : "bar",
 *              "widgetGraphHumidity" : false,
 *              "widgetGraphEndDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetGraphStartDate" : "2014-09-30T11:07:00.000Z",
 *              "widgetGraphInterval" : "Daily",
 *              "widgetGraphGenerationChartType" : "bar",
 *              "widgetGraphGeneration" : true,
 *              "widgetGraphDateRange" : "Month",
 *              "widgetGraphCurrentPowerChartType" : "bar",
 *              "widgetGraphCurrentPower" : false,
 *              "widgetBorderColor" : "28b1b4",
 *              "widgetRandomColor" : "9bd3d0",
 *              "duration" : 10,
 *              "resizedOnTimeline" : false,
 *              "endDate" : "2014-09-22T15:01:05.000Z",
 *              "startDate" : "0:55",
 *              "minimumCols" : null,
 *              "minimumRows" : null,
 *              "previousTimelineRowPosition" : -1,
 *              "timelineRowPosition" : 0,
 *              "rowPosition" : 0,
 *              "rowCount" : 7,
 *              "colPosition" : 0,
 *              "colCount" : 16,
 *              "transitionOut" : null,
 *              "transitionIn" : null,
 *              "backgroundImageVisible" : false,
 *              "backgroundColorVisible" : false,
 *              "backgroundImageLabel" : null,
 *              "backgroundColorLabel" : null,
 *              "backgroundImage" : "",
 *              "backgroundColor" : "FFFFFF",
 *              "normal2Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "normal1Font" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "subHeaderFont" : {
 *                  "visible" : false,
 *                  "label" : null,
 *                  "content" : null,
 *                  "size" : null,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "headerFont" : {
 *                  "visible" : true,
 *                  "label" : "Title",
 *                  "content" : null,
 *                  "size" : 1.5,
 *                  "name" : "BentonSans, sans-serif",
 *                  "color" : "ffffff"
 *              },
 *              "seventhColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "sixthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "fifthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "fourthColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "tertiaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "ffffff"
 *              },
 *              "secondaryColor" : {
 *                  "label" : null,
 *                  "isVisible" : false,
 *                  "color" : "eb617b"
 *              },
 *              "primaryColor" : {
 *                  "label" : "Title Background Color",
 *                  "isVisible" : false,
 *                  "color" : "fbb3bf"
 *              }
 *          },
 *          "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HM0tmb3RDQ2hBYTA",
 *          "name" : "Image",
 *          "__v" : 0
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/widgets/available", function(req, res, next) {
    availableWidgetDAO.getAvailableWidgets(function (err, widgets) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(widgets, res, next);
            //res.send(new utils.serverAnswer(true, widgets));
        }
    });
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/widgets/energyequivalencies/:widgetId
 *              Get Energy Equivalencies Widget
 * @apiGroup Presentation
 * @apiName Get Presentation Energy Equivalencies Widget
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation energy equivalencies widget by Id
 * @apiExample Example request
 *  widgetId : 546b7fbe80f57514008590e8
 *
 * @apiSuccess success 1
 * @apiSuccess message Energy equivalencies widget object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "homeElectricityUse":0,
 *          "gallonsOfGasoline":0,
 *          "passengerVehiclesPerYear":0,
 *          "barrelsOfOilConsumed":0,
 *          "tankerTrucksFilledWithGasoline":0,
 *          "homeEnergyUse":0,
 *          "numberOfTreeSeedlingsGrownFor10Years":0,
 *          "acresOfUSForestsStoringCarbonForOneYear":0,
 *          "acresOfUSForestPreservedFromConversionToCropland":0,
 *          "propaneCylindersUsedForHomeBarbecues":0,
 *          "railcarsOfCoalburned":0,
 *          "tonsOfWasteRecycledInsteadOfLandfilled":0,
 *          "coalFiredPowerPlantEmissionsForOneYear":0,
 *          "greenhouseEmissionsInKilograms":0,
 *          "co2AvoidedInKilograms":0
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/widgets/energyequivalencies/:widgetId", function(req, res, next) {
    return brighterViewWidgetBodyParser.parse(req, res, next, consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies);
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/widgets/graph/:widgetId Get Graph Widget
 * @apiGroup Presentation
 * @apiName Get Presentation Graph Widget
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation graph widget by Id
 * @apiExample Example request
 *  widgetId : 546128a66d303d4200a168d9
 *
 * @apiSuccess success 1
 * @apiSuccess message Widget Object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "yAxis":[{
 *              "index":0,
 *              "opposite":false,
 *              "title":{
 *                  "text":"Generation",
 *                  "style":{
 *                      "fontSize":"14px"
 *                  }
 *              }
 *          },{
 *              "index":1,
 *              "opposite":true,
 *              "title":{
 *                  "text":"Max Power",
 *                  "style":{
 *                      "fontSize":"14px"
 *                  }
 *              }
 *          }],
 *          "xAxis":{
 *              "type":"datetime",
 *              "dateTimeLabelFormats":{
 *                  "year":"%Y",
 *                  "week":"%Y<br/>%m-%d",
 *                  "second":"%Y-%m-%d<br/>%H:%M:%S",
 *                  "month":"%Y-%m",
 *                  "minute":"%Y-%m-%d<br/>%H:%M",
 *                  "hour":"%Y-%m-%d<br/>%H:%M",
 *                  "day":"%Y<br/>%m-%d"
 *              }
 *          },
 *          "tooltip":{
 *              "useHTML":true,
 *              "shared":true,
 *              "pointFormat":"<p style=\"text-align:center\"><span style=\"color:{series.color}\">
 *                  {series.name}</span>: <b>{point.y:.2f}</b></p>",
 *              "headerFormat":"{point.key}<br/>"
 *          },
 *          "title":{
 *              "text":null
 *          },
 *          "series":[{
 *              "type":"column",
 *              "yAxis":0,
 *              "name":"Generation",
 *              "data":[]
 *          },{
 *              "type":"spline",
 *              "yAxis":1,
 *              "name":"Max Power",
 *              "data":[]
 *          }],
 *          "plotOptions":{
 *              "spline":{
 *                  "marker":{
 *                      "radius":4,
 *                      "lineWidth":1,
 *                      "lineColor":"#666666"
 *                  }
 *              },
 *              "series":{
 *                  "turboThreshold":40000
 *              }
 *          },
 *          "legend":{
 *              "enabled":false
 *          },
 *          "exporting":{
 *              "enabled":false
 *          },
 *          "credits":{
 *              "enabled":false
 *          }
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/widgets/graph/:widgetId", function(req, res, next) {
    return brighterViewWidgetBodyParser.parse(req, res, next, consts.BRIGHTERVIEW_WIDGET_TYPES.Graph);
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/widgets/solargeneration/:widgetId Get Solar Widget
 * @apiGroup Presentation
 * @apiName Get Presentation Solar Widget
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation solar widget data by Id
 * @apiExample Example request
 *  widgetId : 546c18d580f57514008590f7
 *
 * @apiSuccess success 1
 * @apiSuccess message Solar Widget object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "kWhGenerated":0,
 *          "currentGeneration":0,
 *          "reimbursement":0,
 *          "startDate":null,
 *          "endDate":null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/widgets/solargeneration/:widgetId", function(req, res, next) {
    return brighterViewWidgetBodyParser.parse(req, res, next, consts.BRIGHTERVIEW_WIDGET_TYPES.Solar);
});

 /**
 * @api {get} /v1/present/presentations/:presentationId/widgets/weatherdata Get Weather Widget data
 * @apiGroup Presentation
 * @apiName Get Presentation Weather Widget data
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the presentation weather widget by Id
 * @apiExample Example request
 *  objectId : 545e61f0649db6140038fc61
 *
 * @apiSuccess success 1
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:presentationId/widgets/weatherdata", function(req, res, next) {
    return brighterViewWidgetBodyParser.parse(req, res, next, consts.BRIGHTERVIEW_WIDGET_TYPES.Weather);
});

module.exports = router;

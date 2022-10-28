"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    tagRuleDAO = require("../../core/dao/tag-rule-dao"),
    checkAuth = require("../../core/user/check-auth");
    

 /**
 * @api {get} /v1/tags/rules Get Tag Rules
 * @apiGroup Tag Rules
 * @apiName Get Tag Rules
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the tag rules list
 *
 * @apiSuccess success 1
 * @apiSuccess message Tag rule objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"5446a9cc327d8a881f891a88",
 *          "tagType":"Facility",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["None"],
 *          "allowedChildrenTagTypes":["DataLogger"],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      },{
 *          "_id":"5446a9cc327d8a881f891a89",
 *          "tagType":"DataLogger",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["Facility"],
 *          "allowedChildrenTagTypes":["Sensor"],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      },{
 *          "_id":"5446a9cc327d8a881f891a8a",
 *          "tagType":"Sensor",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["DataLogger"],
 *          "allowedChildrenTagTypes":["Metric"],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      },{
 *          "_id":"5446a9cc327d8a881f891a8b",
 *          "tagType":"Metric",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["Sensor"],
 *          "allowedChildrenTagTypes":[],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/", checkAuth, function(req, res, next) {
    tagRuleDAO.getRules(function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });

});

 /**
 * @api {post} /v1/tags/rules Create Tag Rule
 * @apiGroup Tag Rules
 * @apiName Create Tag Rule
 * @apiVersion 1.0.0
 * @apiDescription Create tag rule
 * @apiParam {Object} body New tag rule data
 * @apiExample Example request
 *  body
 *  {
 *      "_id" : "546d92ee8afb973408dc30cd",
 *      "tagType" : "MetricTest",
 *      "creatorRole" : "BP",
 *      "creator" : "5416f4647fd9bfec17c6253d",
 *      "allowedParentTagTypes" : [ 
 *          "Sensor"
 *      ],
 *      "allowedChildrenTagTypes" : [],
 *      "__v" : 0
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Tag rule object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id":"5446a9cc327d8a881f891a8b",
 *          "tagType":"Metric",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["Sensor"],
 *          "allowedChildrenTagTypes":[],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", checkAuth, function(req, res, next) {
    var ruleObj = req.body;

    utils.removeMongooseVersionField(ruleObj);

    tagRuleDAO.createRule(ruleObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

 /**
 * @api {put} /v1/tags/rules/:ruleId Edit Tag Rule
 * @apiGroup Tag Rules
 * @apiName Edit Tag Rule
 * @apiVersion 1.0.0
 * @apiDescription Edit tag rule by Id
 * @apiParam {Object} body tag rule data with new data.
 * @apiExample Example request
 *  ruleId : 546d92ee8afb973408dc30cd
 *  body
 *  {
 *      "_id" : "546d92ee8afb973408dc30cd",
 *      "tagType" : "MetricTest",
 *      "creatorRole" : "BP",
 *      "creator" : "5416f4647fd9bfec17c6253d",
 *      "allowedParentTagTypes" : [ 
 *          "Sensor"
 *      ],
 *      "allowedChildrenTagTypes" : [],
 *      "__v" : 0
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated Tag rule object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id":"5446a9cc327d8a881f891a8b",
 *          "tagType":"Metric",
 *          "creatorRole":"BP",
 *          "creator":"54133e8fd361774c1696f265",
 *          "allowedParentTagTypes":["Sensor"],
 *          "allowedChildrenTagTypes":[],
 *          "__v":0,
 *          "restrictedTags":[],
 *          "isChildrenRule":true
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:ruleId", checkAuth, function(req, res, next) {
    var ruleId = req.params.ruleId;
    var ruleObj = req.body;

    utils.removeMongooseVersionField(ruleObj);

    tagRuleDAO.editRule(ruleId, ruleObj, req.user, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(result, res, next);
            //res.send(new utils.serverAnswer(true, result));
        }
    });
});

 /**
 * @api {delete} /v1/tags/rules/:ruleId Delete Tag Rule
 * @apiGroup Tag Rules
 * @apiName Delete Tag Rule
 * @apiVersion 1.0.0
 * @apiDescription Remove tag rule object by Id
 * @apiExample Example request
 *  ruleId : 546d92ee8afb973408dc30cd
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:ruleId", checkAuth, function(req, res, next) {
    var ruleId = req.params.ruleId;

    tagRuleDAO.deleteRuleById(ruleId, req.user, function (err, answer) {
        if (err) {
            return next(err);
        } else {
            return utils.successResponse(answer, res, next);
            //res.send(new utils.serverAnswer(true, answer));
        }
    });
});

module.exports = router;

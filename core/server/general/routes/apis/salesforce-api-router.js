"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    sfdcAccountUtils = require("../../core/salesforce/account-utils");

 /**
 * @api {get} /v1/salesforce/accounts/:findNameMask Get SFDC Accounts
 * @apiGroup Salesforce
 * @apiName Get SFDC Accounts
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of salesforce account
 *
 * @apiSuccess success 1
 * @apiSuccess message Account Objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "webSite":null,
 *          "tickerSymbol":null,
 *          "shippingStreet":null,
 *          "shippingState":null,
 *          "shippingPostalCode":null,
 *          "shippingCountry":null,
 *          "shippingCity":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001e000000NXto1AAD",
 *          "email":null,
 *          "dunsNumber":null,
 *          "contacts":[],
 *          "companyName":"Political Contacts",
 *          "billingStreet":null,
 *          "billingState":null,
 *          "billingPostalCode":null,
 *          "billingCountry":null,
 *          "billingCity":null,
 *          "accountType":"Political",
 *          "accountId":"001e000000NXto1AAD"
 *      },{
 *          "webSite":null,
 *          "tickerSymbol":null,
 *          "shippingStreet":null,
 *          "shippingState":null,
 *          "shippingPostalCode":null,
 *          "shippingCountry":null,
 *          "shippingCity":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001e000000PNy6JAAT",
 *          "email":"berckyt@gmail.com",
 *          "dunsNumber":null,
 *          "contacts":[],
 *          "companyName":"Ilya Shekhurin Test1",
 *          "billingStreet":null,
 *          "billingState":null,
 *          "billingPostalCode":null,
 *          "billingCountry":null,
 *          "billingCity":null,
 *          "accountType":null,
 *          "accountId":"001e000000PNy6JAAT"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/accounts/:findNameMask", checkAuth, function(req, res, next) {
    var findNameMask = req.params.findNameMask;

    if(findNameMask === consts.ALL) {
        findNameMask = null;
    }

    sfdcAccountUtils.getSFDCAccountsFromCache(findNameMask, function(err, accounts) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(accounts, res, next);
        }
    });
});

 /**
 * @api {get} /v1/salesforce/projects Get All SalesForce Projects
 * @apiGroup Salesforce
 * @apiName Get All SalesForce Projects
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of salesforce projects
 *
 * @apiSuccess success 1
 * @apiSuccess message SalesForce Project Objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "projectId":"a06C000000lXJ9jIAG",
 *          "name":"WestCountyEMSandFireProtectionDistrict-Manchester-STL",
 *          "friendlyName":null
 *      },
 *      {
 *          "projectId":"a06C000000lXJ9oIAG",
 *          "name":"WestCountyEMSandFireProtectionDistrict-Clayton-STL",
 *          "friendlyName":null
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/projects", checkAuth, function(req, res, next) {
    sfdcAccountUtils.getSFDCProjects(function(err, projects) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(projects, res, next);
        }
    });
});

 /**
 * @api {get} /v1/salesforce/utilityproviders/:findNameMask Get Utility Providers
 * @apiGroup Salesforce
 * @apiName Get Utility Providers
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of utility providers
 * @apiExample
 *  findNameMask : MO - Mansfield Municipal Utilities
 *
 * @apiSuccess success 1
 * @apiSuccess message Utility Provider Objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "name":"MO - M and A Electric Power Cooperative",
 *          "score":6
 *      },{
 *          "name":"MO - Independence Power and Light",
 *          "score":1
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/utilityproviders/:findNameMask", checkAuth, function(req, res, next) {
    var findNameMask = req.params.findNameMask;

    if(findNameMask === consts.ALL) {
        findNameMask = null;
    }

    sfdcAccountUtils.getUtilityProvidersFromCache(findNameMask, function(err, accounts) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(accounts, res, next);
        }
    });
});


module.exports = router;
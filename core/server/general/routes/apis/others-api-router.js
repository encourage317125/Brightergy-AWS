"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    checkAuth = require("../../core/user/check-auth");

/**
 * @api {get} /v1/others/devices/timezones Get Allowed Devices timezones
 * @apiGroup Others
 * @apiName Get Allowed devices timezones
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of timezones
 *
 * @apiSuccess success 1
 * @apiSuccess message Device Objects
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": [
 *       "Atlantic Daylight Time",
 *       "Atlantic Standard Time",
 *       "Alaska Daylight Time",
 *       "Alaska Standard Time",
 *       "Central Daylight Time",
 *       "Central Standard Time",
 *       "Eastern Daylight Time",
 *       "Eastern Standard Time",
 *       "Eastern Greenland Summer Time",
 *       "East Greenland Time",
 *       "Greenwich Mean Time",
 *       "Hawaii-Aleutian Daylight Time",
 *       "Hawaii-Aleutian Standard Time",
 *       "Mountain Daylight Time",
 *       "Mountain Standard Time",
 *       "Newfoundland Daylight Time",
 *       "Newfoundland Standard Time",
 *       "Pacific Daylight Time",
 *       "Pacific Standard Time",
 *       "Pierre & Miquelon Daylight Time",
 *       "Pierre & Miquelon Standard Time",
 *       "Western Greenland Summer Time",
 *       "West Greenland Time"
 *   ]
 *}
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/devices/timezones", checkAuth, function(req, res, next) {
    var tzNames = utils.getAllowedTimeZonesName();

    return utils.successResponse(tzNames, res, next);

});

router.get("/devices/clientTimezone", checkAuth, function(req, res, next) {
    var offset = req.query.offset;
    var tzName = utils.getTimeZoneByOffset(offset);
    return utils.successResponse(tzName, res, next);
});

module.exports = router;
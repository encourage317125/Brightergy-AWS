"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    smartystreetsUtils = require("../../core/smartystreets/smarty-streets-utils");

 /**
 * @api {get} /v1/location/address/street={addressToPars} Get Live Address
 * @apiGroup Location
 * @apiName Get Live Address
 * @apiVersion 1.0.0
 * @apiDescription Get/Parse live address from give address.
 * @apiExample
 *  addressToPars : 1617 Main Street, 3rd Floor, Kansas City, MO 64108
 *
 * @apiSuccess success 1
 * @apiSuccess message parsed address object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "input_index":0,
 *          "candidate_index":1,
 *          "delivery_line_1":"8925 Carroll Way Ste C",
 *          "last_line":"San Diego CA 92121-2488",
 *          "delivery_point_barcode":"921212488751",
 *          "components":{
 *              "primary_number":"8925",
 *              "street_name":"Carroll",
 *              "street_suffix":"Way",
 *              "secondary_number":"C",
 *              "secondary_designator":"Ste",
 *              "city_name":"San Diego",
 *              "state_abbreviation":"CA",
 *              "zipcode":"92121",
 *              "plus4_code":"2488",
 *              "delivery_point":"75",
 *              "delivery_point_check_digit":"1"
 *          },
 *          "metadata":{
 *              "record_type":"H",
 *              "zip_type":"Standard",
 *              "county_fips":"06073",
 *              "county_name":"San Diego",
 *              "carrier_route":"C002",
 *              "congressional_district":"52",
 *              "rdi":"Commercial",
 *              "elot_sequence":"0144",
 *              "elot_sort":"A",
 *              "latitude":32.88584,
 *              "longitude":-117.15948,
 *              "precision":"Zip9",
 *              "time_zone":"Pacific",
 *              "utc_offset":-8,
 *              "dst":true
 *          },
 *          "analysis":{
 *              "dpv_match_code":"Y",
 *              "dpv_footnotes":"AABB",
 *              "dpv_cmra":"N",
 *              "dpv_vacant":"N",
 *              "active":"Y",
 *              "footnotes":"N#"
 *          }
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/address/:query", checkAuth, function(req, res, next) {

    var query = req.params.query;
    if(!query) {
        return next(new Error(consts.SERVER_ERRORS.GENERAL.QUERY_REQUIRED));
    } else {
        smartystreetsUtils.getAddress(query, function(finderr, findResult) {
            if(finderr) {
                return next(finderr);
            } else {
                return utils.successResponse(findResult, res, next);
            }
        });
    }
});

module.exports = router;
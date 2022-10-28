"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    checkAuth = require("../../core/user/check-auth"),
    enphaseUtils = require("../../core/enphase/enphase-utils");

router.get("/auth", checkAuth, function(req, res, next) {
    var enphaseUserId = utils.getObjectValue(req.query, "user_id");
    enphaseUtils.saveEnphaseUserId(enphaseUserId, req.user, function(saveUserErr, result) {
        if(saveUserErr) {
            return next(saveUserErr);
        } else {
            utils.redirectToLoginPage(res);
        }
    });
});


module.exports = router;
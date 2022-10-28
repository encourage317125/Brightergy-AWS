/**
 * Date: 29 июля 2015
 * Author: Georgiy Pankov
 */
"use strict";


var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts");


router.get("/healthcheck", function(req, res, next) {
        var message = new utils.serverAnswer(true, consts.HEALTH_CHECK_MESSAGE);
        res.send(message);
});


module.exports = router;

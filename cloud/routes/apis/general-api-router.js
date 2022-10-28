"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../helpers/utils"),
    moment = require("moment"),
    dataGenerator = require("../../helpers/data-generator");

router.get("/", function(req, res, next) {
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	var dimension = req.query.dimension;
	if (!startDate || !endDate){
		endDate = moment();
		startDate = moment(endDate).subtract(1, "hours");
	}

	var result = dataGenerator.generateDummyData(startDate, endDate, dimension, null);	
	
	return utils.successResponse(result, res, next);
});

router.get("/servertime", function(req, res, next) {

	var result = moment();
	
	return utils.successResponse(result, res, next);
});

module.exports = router;
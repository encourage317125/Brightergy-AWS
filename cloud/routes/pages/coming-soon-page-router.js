"use strict";

var express = require("express"),
  router = express.Router();
// log = require("../../helpers/log"),
// async = require("async");

router.get("/", function(req, res, next) {
  return res.render("coming-soon");
});

module.exports = router;
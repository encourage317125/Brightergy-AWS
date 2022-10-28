"use strict";

var express = require("express"),
  router = express.Router();
// log = require("../../helpers/log"),
// async = require("async");
router.get("/500", function(req, res, next) {
  return res.render("500");
});

router.get("/404", function(req, res, next) {
  return res.render("404");
});
module.exports = router;
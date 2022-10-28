"use strict";

var express = require("express"),
    router = express.Router(),
    presentationDAO = require("../../core/dao/presentation-dao"),
    widgetDAO = require("../../core/dao/widget-dao"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    config = require("../../../../config/environment"),
    async = require("async");


router.get("/", function(req, res, next) {
    var presentationId = req.query.id;
    var isValidId = utils.isValidObjectID(presentationId);
    var viewConfig = config.getMany("env", "cdn", "api");
    log.info("presentation id: %s", presentationId);
    log.info("isValidId: %s", isValidId);

    if(!presentationId) {
        res.render("presentation", {errors: consts.SERVER_ERRORS.PRESENTATION.MISSING_PRESENTATION_ID,
            presentation: null, loadWidgets:null, config: viewConfig });
    } else if(!isValidId) {
        res.render("presentation", {errors: consts.SERVER_ERRORS.PRESENTATION.INCORRECT_PRESENTATION_ID,
            presentation: null, loadWidgets:null, config: viewConfig });
    } else {
        log.info("correct presentation id");

        async.parallel([
            function(cb) {
                presentationDAO.getPresentationById(presentationId, null, cb);
            },
            function(cb) {
                widgetDAO.getWidgetsByPresentationId(presentationId, null, cb);
            }
        ], function(err, results) {
            if (err) {
                res.render("500", {errors: err.message, presentation: null, loadWidgets:null,
                    config: viewConfig });
            } else {
                res.render("presentation", {errors: null, presentation: results[0], loadWidgets:results[1],
                    config: viewConfig });
            }
        });


    }
});

module.exports = router;

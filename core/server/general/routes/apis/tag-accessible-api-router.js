"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    checkAuth = require("../../core/user/check-auth"),
    consts = require("../../../libs/consts");

/**
 * API: Get Presentation Tags
 *
 * @url         /tags/accessible/presentation/:presentationId
 * @method      GET
 * @request     Presentation Id
 * @response    array of Tags Object with full tree structure
 */
router.get("/tags/accessible/presentation/:presentationId", checkAuth, function(req, res, next) {
    var presentationId = req.params.presentationId;

    presentationDAO.getPresentationById(presentationId, req.user, function (findErr, foundPresentation) {
        if (findErr) {
            return next(findErr);
        } else {
            presentationDAO.getPresentationTagsFullHierarchy(foundPresentation, function (err, tags) {
                if (err) {
                    return next(err);
                } else {
                    if(tags[presentationId]) {
                        return utils.successResponse(tags[presentationId], res, next);
                    }
                    else {
                        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.PRESENTATION_TAGS_NOT_FOUND);
                        error.status = 422;
                        return next(error);
                    }
                }
            });
        }
    });
});

module.exports = router;
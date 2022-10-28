"use strict";

var config = require("../../../../config/environment"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    //dataSourceUtils = require("../../../libs/data-source-utils"),
    consts = require("../../../libs/consts"),
    awsAssetsUtils = require("../../core/aws/assets-utils");

// -------------------------------------------------------------------------------------

/**
 * Router: retrieve gernal assets from aws
 *
 * @access  public
 * @param   string
 * @param   number
 * @return  array
 */
function findImages(req, res, next, keyPrefix, fileNameMask, limit) {
    if(fileNameMask === consts.ASTERISK) {
        fileNameMask = null;
    }

    if(limit && !utils.isWholePositiveNumber(limit)) {
        var error = new Error(consts.SERVER_ERRORS.GENERAL.INCORRECT_LIMIT);
        error.status = 422;
        return next(error);
    } else {
        awsAssetsUtils.findImages(keyPrefix, fileNameMask, limit, function (err, filesList) {
            if (err) {
                return next(err);
            } else {
                return utils.successResponse(filesList, res, next);
            }

        });
    }
}

// -------------------------------------------------------------------------------------

/**
 * Retrieve gernal assets from aws
 *
 * @access  public
 * @param   string
 * @param   number
 * @return  array
 */
function findUsualAssets(req, res, next, type, daoFunction) {
    var objectId = req.params.objectId;
    var fileNameMask = req.params.fileNameMask;
    var limit = req.params.limit;
    log.info(fileNameMask);

    daoFunction(objectId, null, function(findErr, findObject) {
        if(findErr) {
            return next(findErr);
        } else {
            if(findObject.awsAssetsKeyPrefix) {
                var keyPrefix = (type === "presentation") ? 
                config.get("aws:assets:presentationassetskeyprefix") : 
                config.get("aws:assets:dashboardassetskeyprefix");
                keyPrefix = keyPrefix + "/" + findObject.awsAssetsKeyPrefix;

                findImages(req, res, next, keyPrefix, fileNameMask, limit);
            }
            else {
                var error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_AWS_ASSETS_KEY);
                error.status = 422;
                return next(error);
            }

        }

    });
}

exports.findImages = findImages;
exports.findUsualAssets = findUsualAssets;
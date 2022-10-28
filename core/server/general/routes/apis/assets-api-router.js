"use strict";

var express = require("express"),
    router = express.Router(),
    log = require("../../../libs/log")(module),
    config = require("../../../../config/environment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    authUtils = require("../../core/user/auth-utils"),
    presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    dashboardDAO = require("../../../bl-data-sense/core/dao/dashboard-dao"),
    assetsDAO = require("../../core/dao/asset-dao"),
    awsAssetsUtils = require("../../core/aws/assets-utils");

// -------------------------------------------------------------------------------------

/**
 * Router: render filde uploader template
 *
 * @method  GET
 * @param   object
 * @return  void
 */
router.get("/upload", function(req, res, next) {
    res.render("fileuploader");
});

 /**
 * @api {get} /v1/general/assets?searchKey=:searchKey&limit=:limit Get General Assets
 * @apiGroup Assets
 * @apiName Get General Assets
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All general assets. When the research key is specified, 
 *  it retrieves the associated general assets including search name. searchKey is mandatory.
 * @apiExample Example request
 *  fileNameMask : Chrysanthemum
 *
 * @apiSuccess success 1
 * @apiSuccess message list of general assets
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/?", function(req, res, next) {
    var searchKey = req.query.searchKey;
    var limit = req.query.limit;
    var keyPrefix = config.get("aws:assets:generalassetskeyprefix");
    log.info("general assets find " + searchKey);

    assetsDAO.findImages(req, res, next, keyPrefix, searchKey, limit);
});

router.get("/presentation/find/:objectId/:fileNameMask/:limit?", function(req, res, next) {
    assetsDAO.findUsualAssets(req, res, next, "presentation", presentationDAO.getPresentationById);
});

router.get("/dashboard/find/:objectId/:fileNameMask/:limit?", function(req, res, next) {
    assetsDAO.findUsualAssets(req, res, next, "dashboard", dashboardDAO.getDashboardById);
});

 /**
 * @api {post} /v1/general/assets Upload General Assets
 * @apiGroup Assets
 * @apiName Upload General Assets
 * @apiVersion 1.0.0
 * @apiDescription Upload general assets to AWS
 * @apiParam {File} assetsFile asset data
 *
 * @apiSuccess success 1
 * @apiSuccess message uploaded assets data
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", checkAuth, function(req, res, next) {
    if (req.user.role === consts.USER_ROLES.BP) {
        var keyPrefix = config.get("aws:assets:generalassetskeyprefix");
        var assetsFiles = req.files.assetsFile;

        if(!Array.isArray(assetsFiles)) {
            assetsFiles = [assetsFiles];
        }

        awsAssetsUtils.uploadMultiFiles(keyPrefix, assetsFiles, true, function (uploadErr, uploadedFiles) {
            if(uploadErr) {
                return next(uploadErr);
            } else {
                return utils.successResponse(uploadedFiles, res, next);
            }
        });

    } else {
        var error = new Error(consts.SERVER_ERRORS.ASSETS.CAN_NOT_UPLOAD_GENERAL_ASSETS);
        error.status = 422;
        return next(error);
    }

});

// -------------------------------------------------------------------------------------

 /**
 * @api {delete} /v1/general/assets/:assetId Delete General Assets
 * @apiGroup Assets
 * @apiName Delete General Assets
 * @apiVersion 1.0.0
 * @apiDescription Remove general assets by Id
 * @apiExample Example request
 *  assetId : assets_14164770890876
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:assetId", checkAuth, function(req, res, next) {
    if (req.user.role === consts.USER_ROLES.BP) {
        var keyPrefix = config.get("aws:assets:generalassetskeyprefix");
        var assetId = req.params.assetId;

        awsAssetsUtils.deleteFile(keyPrefix, assetId, function (err, deletedFile) {
            if(err) {
                return next(err);
            } else {
                return utils.successResponse(deletedFile, res, next);
            }
        });
    } else {
        var error = new Error(consts.SERVER_ERRORS.ASSETS.CAN_NOT_DELETE_GENERAL_ASSETS);
        error.status = 422;
        return next(error);
    }
});

router.post("/presentation/:objectId", checkAuth, function(req, res, next) {
    //uploadUsualAssets(req, res, next, "presentation", presentationDAO.getPresentationById);
    var objectId = req.params.objectId;

    presentationDAO.getPresentationById(objectId, req.user, function(findErr, findObject) {
        if(findErr) {
            return next(findErr);
        } else {
            if(findObject.awsAssetsKeyPrefix) {
                var keyPrefix = config.get("aws:assets:presentationassetskeyprefix");
                keyPrefix = keyPrefix + "/" + findObject.awsAssetsKeyPrefix;

                var assetsFiles = req.files.assetsFile;

                if(!Array.isArray(assetsFiles)){
                    assetsFiles = [assetsFiles];
                }

                awsAssetsUtils.uploadMultiFiles(keyPrefix, assetsFiles, true,
                    function (uploadErr, uploadedFiles) {
                        if(uploadErr) {
                            return next(uploadErr);
                        } else {
                            return utils.successResponse(uploadedFiles, res, next);
                        }
                    });
            }
            else {
                var error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_AWS_ASSETS_KEY);
                error.status = 422;
                return next(error);
            }
        }
    });
});

// -------------------------------------------------------------------------------------

/**
 * Delete normal file from AWS
 *
 * @method  DELETE
 * @param   string
 * @param   number
 * @return  array
 */
function deleteUsualFile(req, res, next, type, daoFunction) {
    authUtils.isAuthenticatedUser(req, false, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var objectId = req.params.objectId;
            var fileId = req.params.fileId;

            daoFunction(objectId, currentUser, function(findErr, findObject) {
                if (findErr) {
                    return next(findErr);
                } else {
                    if(findObject.awsAssetsKeyPrefix) {
                        var keyPrefix = (type === "presentation") ?
                            config.get("aws:assets:presentationassetskeyprefix") :
                            config.get("aws:assets:dashboardassetskeyprefix");
                        keyPrefix = keyPrefix + "/" + findObject.awsAssetsKeyPrefix;

                        awsAssetsUtils.deleteFile(keyPrefix, fileId, function (deleteErr, deletedFile) {
                            if(deleteErr) {
                                return next(deleteErr);
                            } else {
                                return utils.successResponse(deletedFile, res, next);
                            }
                        });
                    }
                    else {
                        var error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_AWS_ASSETS_KEY);
                        error.status = 422;
                        return next(error);
                    }
                }
            });
        }
    });
}


router.delete("/presentation/:objectId/:fileId", function(req, res, next) {
    deleteUsualFile(req, res, next, "presentation", presentationDAO.getPresentationById);
});

/**
 * @api {post} /assets/dashboard/:dashboardId Upload Analyze widget Assets
 * @apiGroup Dashboard
 * @apiName Upload Analyze widget Assets
 * @apiVersion 1.0.0
 * @apiDescription Upload analyze widget assets to AWS
 * @apiParam {File} assetsFile asset data
 * @apiExample Example request
 *  dashboardId : 5461363bdfef7c4800146f4b
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */

router.post("/dashboard/:dashboardId", checkAuth, function(req, res, next) {
    //uploadUsualAssets(req, res, next, "dashboard", dashboardDAO.getDashboardById);
    var dashboardId = req.params.dashboardId;

    dashboardDAO.getDashboardById(dashboardId, req.user, function(findErr, findObject) {
        if(findErr) {
            return next(findErr);
        } else {
            if(findObject.awsAssetsKeyPrefix) {
                var keyPrefix = config.get("aws:assets:dashboardassetskeyprefix");
                keyPrefix = keyPrefix + "/" + findObject.awsAssetsKeyPrefix;

                var assetsFile = req.files.assetsFile;
                if(req.files.file) {
                    assetsFile = req.files.file;
                }

                awsAssetsUtils.uploadFile(keyPrefix, assetsFile, true, function (uploadErr, uploadedFile) {
                    if(uploadErr) {
                        return next(uploadErr);
                    } else {
                        return utils.successResponse(uploadedFile, res, next);
                    }
                });
            }
            else {
                var error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_AWS_ASSETS_KEY);
                error.status = 422;
                return next(error);
            }
        }
    });
});


router.delete("/dashboard/:objectId/:fileId", function(req, res, next) {
    deleteUsualFile(req, res, next, "dashboard", dashboardDAO.getDashboardById);
});

// -------------------------------------------------------------------------------------

/**
 * Router: Clear cache
 *
 * @method  GET
 * @return  array
 */
router.get("/clearcache", function(req, res, next) {
    return awsAssetsUtils.clearCache(function(cacheErr, clearResult) {
        if(cacheErr) {
            return next(cacheErr);
        } else {
            return utils.successResponse(clearResult, res, next);
        }
    });
});

// -------------------------------------------------------------------------------------


module.exports = router;
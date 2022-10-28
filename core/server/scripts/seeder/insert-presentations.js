"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Presentation = mongoose.model("bv_presentation"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    moment = require("moment"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertPresentations(finalCallback) {

    Presentation.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var presentations = [];
                    presentations.push({
                        "_id" : new ObjectId("545e61f0649db6140038fc61"),
                        "creatorRole" : "BP",
                        "name" : "new Presentation",
                        "parameters" : {
                            "endDate" : null,
                            "startDate" : moment("2014-11-08T18:00:00.000Z"),
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : null,
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f9d8ca"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Header",
                                "content" : null,
                                "size" : 4,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : null
                            },
                            "backgroundColor" : "f2672a"
                        },
                        "tagBindings" : [],
                        "description" : null,
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorName" : "Daniel Keith",
                        "reimbursementRate" : null,
                        "isTemplate" : false,
                        "IsNewPresentation" : false,
                        "titleView" : false,
                        "lastUpdatedView" : false,
                        "generatingSinceView" : false,
                        "systemSizeView" : false,
                        "systemSize" : null,
                        "webBox" : null,
                        "createdDate" : moment("2014-11-08T18:33:20.000Z"),
                        "Longitude" : null,
                        "Logo" : null,
                        "subLogo" : null,
                        "Latitude" : null,
                        "awsAssetsKeyPrefix" : "NLRtHqbzd",
                        "__v" : 0
                    });
                    presentations.push({
                        "_id" : new ObjectId("545f2abe649db6140038fc6a"),
                        "creatorRole" : "BP",
                        "name" : "new Presentation",
                        "parameters" : {
                            "endDate" : null,
                            "startDate" : moment("2014-11-09T08:00:00.000Z"),
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : null,
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f9d8ca"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Header",
                                "content" : null,
                                "size" : 4,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : null
                            },
                            "backgroundColor" : "f2672a"
                        },
                        "tagBindings" : [],
                        "description" : null,
                        "creator" : new ObjectId("5458d6a9df148b3b00b6b787"),
                        "creatorName" : "Yakov Mobile3",
                        "reimbursementRate" : null,
                        "isTemplate" : false,
                        "IsNewPresentation" : false,
                        "titleView" : false,
                        "lastUpdatedView" : false,
                        "generatingSinceView" : false,
                        "systemSizeView" : false,
                        "systemSize" : null,
                        "webBox" : null,
                        "createdDate" : moment("2014-11-09T08:50:06.000Z"),
                        "Longitude" : null,
                        "Logo" : null,
                        "subLogo" : null,
                        "Latitude" : null,
                        "awsAssetsKeyPrefix" : "xpubxlmBm",
                        "__v" : 0
                    });
                    presentations.push({
                        "_id" : new ObjectId("545f2c35649db6140038fc6b"),
                        "creatorRole" : "BP",
                        "name" : "new Presentation",
                        "parameters" : {
                            "endDate" : null,
                            "startDate" : moment("2014-11-09T08:00:00.000Z"),
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : null,
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f9d8ca"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Header",
                                "content" : null,
                                "size" : 4,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : null
                            },
                            "backgroundColor" : "f2672a"
                        },
                        "tagBindings" : [],
                        "description" : null,
                        "creator" : new ObjectId("5458d660ab746d33008c77be"),
                        "creatorName" : "Inn Mobile2",
                        "reimbursementRate" : null,
                        "isTemplate" : false,
                        "IsNewPresentation" : false,
                        "titleView" : false,
                        "lastUpdatedView" : false,
                        "generatingSinceView" : false,
                        "systemSizeView" : false,
                        "systemSize" : null,
                        "webBox" : null,
                        "createdDate" : moment("2014-11-09T08:56:21.000Z"),
                        "Longitude" : null,
                        "Logo" : null,
                        "subLogo" : null,
                        "Latitude" : null,
                        "awsAssetsKeyPrefix" : "czzvctueK",
                        "__v" : 0
                    });
                    presentations.push({
                        "_id" : new ObjectId("545f8e3a049d8b2700320784"),
                        "creatorRole" : "BP",
                        "name" : "new Presentation",
                        "parameters" : {
                            "endDate" : null,
                            "startDate" : moment("2014-11-09T15:00:00.000Z"),
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : null,
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f9d8ca"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Header",
                                "content" : null,
                                "size" : 4,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : null
                            },
                            "backgroundColor" : "f2672a"
                        },
                        "tagBindings" : [],
                        "description" : null,
                        "creator" : new ObjectId("5458ee0341dbce5800f248c9"),
                        "creatorName" : "Dev Webapp",
                        "reimbursementRate" : null,
                        "isTemplate" : false,
                        "IsNewPresentation" : false,
                        "titleView" : false,
                        "lastUpdatedView" : false,
                        "generatingSinceView" : false,
                        "systemSizeView" : false,
                        "systemSize" : null,
                        "webBox" : null,
                        "createdDate" : moment("2014-11-09T15:54:34.000Z"),
                        "Longitude" : null,
                        "Logo" : null,
                        "subLogo" : null,
                        "Latitude" : null,
                        "awsAssetsKeyPrefix" : "JWDgn571A",
                        "__v" : 0
                    });
                    presentations.push({
                        "_id" : new ObjectId("54606228049d8b2700320786"),
                        "creatorRole" : "BP",
                        "name" : "new Presentation",
                        "parameters" : {
                            "endDate" : null,
                            "startDate" : moment("2014-11-10T06:00:00.000Z"),
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : null
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : null,
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f9d8ca"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Header",
                                "content" : null,
                                "size" : 4,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : null
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : null
                            },
                            "backgroundColor" : "f2672a"
                        },
                        "tagBindings" : [],
                        "description" : null,
                        "creator" : new ObjectId("545898afa6e5da3a00dfe131"),
                        "creatorName" : "Samar Acharya",
                        "reimbursementRate" : null,
                        "isTemplate" : false,
                        "IsNewPresentation" : false,
                        "titleView" : false,
                        "lastUpdatedView" : false,
                        "generatingSinceView" : false,
                        "systemSizeView" : false,
                        "systemSize" : null,
                        "webBox" : null,
                        "createdDate" : moment("2014-11-10T06:58:48.000Z"),
                        "Longitude" : null,
                        "Logo" : null,
                        "subLogo" : null,
                        "Latitude" : null,
                        "awsAssetsKeyPrefix" : "kabtAuXFW",
                        "__v" : 0
                    });
                    async.each(presentations, function (presentation, saveCallback) {
                        var PresentationModel = new Presentation(presentation);
                        PresentationModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertPresentations = insertPresentations;
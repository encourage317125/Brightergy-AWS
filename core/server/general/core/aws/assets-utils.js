"use strict";

// TODO:: moved to core-service

var AWS = require("aws-sdk"),
    cache = require("../../../libs/cache"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module),
    _ = require("lodash"),
    fs = require("fs"),
    random = require("random-js")(),
    async = require("async"),
    gm = require("gm"),
//    gm = require("gm").subClass({ imageMagick: true }),
    ASSETS_KEY_PREFIX = "assets.",
    awsUtils = require("./utils");


function clearCache(callback) {
    cache.keys("*", function (err, keys) {
        if(err) {
            callback(err);
        }
        else {
            keys.forEach(function (key, pos) {
                if(key.substring(0, "assets.".length) === "assets.") {
                    cache.del(key, function (err, o) {
                        if (err) {
                            console.error("Error occurred:" + key);
                        }
                        else {
                            console.log("Key : " + key);
                        }

                        if (pos === (keys.length - 1)) {
                            cache.quit();
                        }
                    });
                }
            });

            callback(null, consts.OK);
        }
    });
}

function sortImages(images, limit) {
    if(limit) {
        return _.first(images, parseInt(limit));
    } else {
        return images;
    }
}

/*
 * Save all result to cache
 * @param keyPrefix, with parent section e.g. /General/keyPrefix
 * @param assets, array of assets
 * @param callback
 */
function saveToCache(keyPrefix, allResults, callback) {
    cache.set(ASSETS_KEY_PREFIX + keyPrefix, JSON.stringify(allResults), function(redisErr, redisRes) {
        if(redisErr) {
            if(callback) {
                callback(redisErr);
            } else {
                utils.logError(redisErr, null);
            }
        } else {
            log.info("assets stored with key: "+ keyPrefix);
            log.info("size: "+ allResults.length);
            if(callback) {
                callback(null, allResults);
            }
        }
    });
}

function loadImagesFromAWS(keyPrefix, callback) {
    //loadFiles(oauth2Client, params, callback, []);
    awsUtils.setCredentials(AWS);

    var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});
    var params = {
        /*Bucket: "blassets",*/
        Delimiter: "/",
        Prefix: consts.AWS_ASSETS_INFO.CUSTOM_ASSETS_FOLDER + "/" + keyPrefix + "/"
    };

    s3.listObjects(params, function (err, data) {
        if (err) {
            if(callback) {
                callback(err);
            } else {
                utils.logError(err, null);
            }
        } else {
            var allResults = [];
            var now = new Date();

            for(var i = data.Contents.length - 1; i >= 0; i--) {
                if(data.Contents[i].Key.indexOf("/thumb/") !== -1) {
                    continue;
                }

                var imageData = data.Contents[i];
                imageData.id = "assets_" + now.getTime() + i;
                imageData.sourceCDNURL = "https://" + consts.AWS_ASSETS_INFO.CNAMES[random.integer(1,997) % 3] +
                    ".brighterlink.io/" + data.Contents[i].Key;
                imageData.title = (data.Contents[i].Metadata && data.Contents[i].Metadata.title)?
                    data.Contents[i].Metadata.title:
                    utils.getFileNameFromKey(data.Contents[i].Key);
                imageData.Key = data.Contents[i].Key;

                allResults.push(imageData);
            }

            async.map(allResults, function(imageData, imageCallback) {
                var thumbnailKey = utils.searchThumbnailURL(imageData.Key);

                if(thumbnailKey !== "") {
                    s3.getObject({ Key: thumbnailKey}, function (imageErr, imageObject) {
                        if(imageErr) {
                            imageData.thumbnailURL = imageData.sourceCDNURL;
                            imageCallback(null, imageData);
                        }
                        else {
                            imageData.thumbnailURL = "https://" +
                                consts.AWS_ASSETS_INFO.CNAMES[random.integer(1,997) % 3] +
                                ".brighterlink.io/" + thumbnailKey;
                            imageCallback(null, imageData);
                        }
                    });
                }
                else {
                    imageData.thumbnailURL = imageData.sourceCDNURL;
                    imageCallback(null, imageData);
                }
            }, function(resultsErr, results) {
                if(resultsErr) {
                    callback(resultsErr);
                }
                else {
                    saveToCache(keyPrefix, results, callback);
                }
            });
        }
    });

}

function findImages(keyPrefix, fileNameMask, limit, callback) {
    //clearCache();
    cache.get(ASSETS_KEY_PREFIX + keyPrefix, function(redisErr, imagesStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            var images = [];

            if(imagesStr) {
                images = JSON.parse(imagesStr);
            }

            if(Array.isArray(images) && images.length > 0) {

                if(fileNameMask) {
                    //find by mask
                    fileNameMask = fileNameMask.toUpperCase();
                    var findImages = _.filter(images, function(image) {
                        return image.title.toUpperCase().indexOf(fileNameMask) > -1;
                    });
                    callback(null, sortImages(findImages, limit));
                } else {
                    callback(null, sortImages(images, limit));
                }

            } else {
                log.info("loadImagesFromAWS - " + keyPrefix);

                loadImagesFromAWS(keyPrefix, function(loadErr, resultImages){
                    if(loadErr) {
                        loadErr.status = 200;
                        callback(loadErr, null);
                    }
                    else {
                        if(resultImages && resultImages.length > 0) {
                            if(fileNameMask) {
                                //find by mask
                                fileNameMask = fileNameMask.toUpperCase();
                                var findImages = _.filter(resultImages, function(image) {
                                    return image.title.toUpperCase().indexOf(fileNameMask) > -1;
                                });
                                callback(null, sortImages(findImages, limit));
                            } else {
                                callback(null, sortImages(resultImages, limit));
                            }
                        }
                        else {
                            var err = new Error(consts.SERVER_ERRORS.ASSETS.ASSETS_NOT_LOADED);
                            err.status = 200;
                            callback(err, null);
                        }
                    }
                });
            }
        }
    });
}

function storeImagesInCache(keyPrefix) {
    log.info("storeImagesInCache - " + keyPrefix);

    loadImagesFromAWS(keyPrefix);
}

function createFolder(path, callback) {
    awsUtils.setCredentials(AWS);

    var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});
    var folderPath = consts.AWS_ASSETS_INFO.CUSTOM_ASSETS_FOLDER + "/" + path;
    var data = {
        Key: folderPath,
        ACL: "public-read"
    };

    s3.putObject(data, function (fileInsertErr, result) {
        if(fileInsertErr) {
            callback(fileInsertErr, null);
        } else {
            callback(null, result);
        }
    });
}

function addFileToCache(keyPrefix, image, callback) {
    cache.get(ASSETS_KEY_PREFIX + keyPrefix, function(redisErr, imagesStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            var images = null;
            if(imagesStr) {
                // console.log("imagesStr: " + imagesStr);
                // imagesStr: {"IsTruncated":false,"Marker":"","Contents":[],"Name":"blassets",
                //             "Prefix":"generalAssets","MaxKeys":1000,"CommonPrefixes":[]}
                images = JSON.parse(imagesStr);

                if(Array.isArray(images)) {
                    images.unshift(image);
                }
                else {
                    images = [image];
                }
            } else {
                //files not yet added
                images = [image];
            }

            saveToCache(keyPrefix, images, function(saveInCacheErr, saveResult) {
                if(saveInCacheErr) {
                    callback(saveInCacheErr);
                } else {
                    callback(null, image);
                }
            });
        }
    });
}

/*
 * Upload facility image file to AWS S3 assets
 * @param parentFolderName with parent section e.g. /General/keyPrefix
 * @param fileData, uploaded file object
 * @param saveInCache
 * @param callback
 */
function uploadFile(parentFolderName, fileData, saveInCache, finalCallback) {

    var error;
    if(!parentFolderName) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FOLDER_NAME);
        error.status = 422;
        finalCallback(error, null);
    } else if(!fileData) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_FILE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        awsUtils.setCredentials(AWS);

        var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});

        async.waterfall([
            function(callback) {

                // Get the size of image and resize if it"s wider than thumb width
                gm(fileData.path)
                .size(function (sizeErr, size) {
                    if (sizeErr) {
                        callback(sizeErr, null);
                    }
                    else {
                        if(size.width > consts.ASSETS_THUMBNAIL_SIZE.WIDTH) {
                            var resizeHeight = parseInt(consts.ASSETS_THUMBNAIL_SIZE.WIDTH / size.width * size.height);

                            gm(fileData.path)
                            .resize(consts.ASSETS_THUMBNAIL_SIZE.WIDTH, resizeHeight)
                            .write("uploads/thumb_" + fileData.originalname, function (writeErr) {
                                if(writeErr) {
                                    callback(writeErr, null);
                                }
                                else {
                                    callback(null, "uploads/thumb_" + fileData.originalname);
                                }
                            });
                        }
                        else {
                            callback(null, null);
                        }
                    }
                });
            },
            function(thumbPath, callback) {
                // put original image onto S3
                fs.readFile(fileData.path, function (readErr, readedData) {
                    if (readErr) {
                        callback(readErr, null);
                    } else {
                        var now = new Date();
                        var fileName = random.string(16) + "." + fileData.extension;
                        var filePath = consts.AWS_ASSETS_INFO.CUSTOM_ASSETS_FOLDER + "/" +
                            parentFolderName + "/" + fileName;
                        var fileTitle = fileData.originalname;

                        var uploadData = {
                            Key: filePath,
                            ContentType: fileData.mimetype,
                            Body: readedData,
                            ACL: "public-read-write",
                            Metadata: {
                                title: fileTitle,
                            }
                        };

                        s3.putObject(uploadData, function(uploadErr, uploadedFile) {
                            if(uploadErr) {
                                callback(uploadErr, null);
                            } else {
                                uploadedFile.sourceCDNURL = "https://" +
                                    consts.AWS_ASSETS_INFO.CNAMES[random.integer(1,997) % 3] +
                                    ".brighterlink.io/" + filePath;
                                uploadedFile.id = "assets_" + now.getTime();
                                uploadedFile.Key = filePath;
                                uploadedFile.title = fileTitle;
                                uploadedFile.fileName = fileName;
                                uploadedFile.thumbnailURL = uploadedFile.sourceCDNURL;

                                callback(null, uploadedFile, thumbPath);
                            }
                        });
                    }
                });
            },
            function(uploadedFile, thumbPath, callback) {
                if(!thumbPath) {
                    callback(null, uploadedFile, null);
                }
                else {
                    // put thumbnail image onto S3
                    fs.readFile(thumbPath, function (readErr, readedData) {
                        if (readErr) {
                            callback(readErr);
                        } else {
                            var filePath = consts.AWS_ASSETS_INFO.CUSTOM_ASSETS_FOLDER + "/" +
                                parentFolderName + "/thumb/thumb_" + uploadedFile.fileName;

                            delete uploadedFile.fileName;

                            var data = {
                                Key: filePath,
                                ContentType: fileData.mimetype,
                                Body: readedData,
                                ACL: "public-read-write",
                                Metadata: {
                                    thumbnail: "yes"
                                }
                            };

                            s3.putObject(data, function(uploadErr, thumbFile) {
                                if(uploadErr) {
                                    callback(uploadErr);
                                } else {
                                    uploadedFile.thumbnailURL = "https://" +
                                        consts.AWS_ASSETS_INFO.CNAMES[random.integer(1,997) % 3] +
                                        ".brighterlink.io/" + data.Key;

                                    callback(null, uploadedFile, thumbPath);
                                }
                            });
                        }
                    });
                }
            },
            function(uploadedFile, thumbPath, callback) {
                fs.unlink(fileData.path, function (deleteFileErr) {
                    if (deleteFileErr) {
                        callback(deleteFileErr);
                    } else {
                        console.log("Local file deleted: "+ fileData.path);
                        callback(null, uploadedFile, thumbPath);
                    }
                });
            },
            function(uploadedFile, thumbPath, callback) {
                if(!thumbPath) {
                    callback(null, uploadedFile);
                }
                else {
                    fs.unlink(thumbPath, function (deleteFileErr) {
                        if (deleteFileErr) {
                            callback(deleteFileErr);
                        } else {
                            console.log("Local file deleted: "+ thumbPath);
                            callback(null, uploadedFile);
                        }
                    });
                }
            }
        ], function (err, uploadedFile) {
            if(err) {
                finalCallback(err, null);
            } else {
                if(saveInCache) {
                    addFileToCache(parentFolderName, uploadedFile, finalCallback);
                }
                else {
                    finalCallback(null, uploadedFile);
                }
            }
        });
    }
}

/*
 * Upload multi files to AWS S3 assets
 * @param parentFolderName with parent section e.g. /General/keyPrefix
 * @param fileData, array of uploaded file object
 * @param saveInCache
 * @param callback
 */
function uploadMultiFiles(parentFolderName, filesData, saveInCache, finalCallback) {
    var error;
    if(!parentFolderName) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FOLDER_NAME);
        error.status = 422;
        finalCallback(error, null);
    } else if(!filesData) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_FILE);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.map(filesData, function (fileData, singleCallback) {
            uploadFile(parentFolderName, fileData, saveInCache, function (uploadErr, uploadedFile) {
                if(uploadErr) {
                    singleCallback(uploadErr);
                } else {
                    singleCallback(null, uploadedFile);
                }
            });
        }, function(err, uploadedFiles) {
            if(err) {
                finalCallback(err);
            } else {
                finalCallback(null, uploadedFiles);
            }
        });
    }
}

/*
 * Upload file to AWS S3 assets from base64 binary data
 * @param parentFolderName, keyPrefix with parent section e.g. /General/keyPrefix
 * @param fileData, uploaded file object
 * @param saveInCache
 * @param callback
 */
function uploadFileFromBase64(parentFolderName, binaryData, saveInCache, callback) {

    var error;
    if(!parentFolderName) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FOLDER_NAME);
        error.status = 422;
        callback(error, null);
    } else if(!binaryData) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_FILE);
        error.status = 422;
        callback(422, null);
    } else {

        awsUtils.setCredentials(AWS);

        var fileBuffer = new Buffer(binaryData.replace(/^data:image\/\w+;base64,/, ""),"base64");
        var now = new Date();
        var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});
        var filePath = consts.AWS_ASSETS_INFO.CUSTOM_ASSETS_FOLDER + "/" +
            parentFolderName + "/" + now.getTime() + "_cropped.jpg";
        var data = {
            Key: filePath,
            Body: fileBuffer,
            ContentType: "image/jpeg",
            ContentEncoding: "base64",
            ACL: "public-read-write"
        };

        s3.putObject(data, function(uploadErr, uploadedFile) {
            if(uploadErr) {
                callback(uploadErr, null);
            } else {
                uploadedFile.sourceCDNURL = "https://" +
                    consts.AWS_ASSETS_INFO.CNAMES[random.integer(1,997) % 3] +
                    ".brighterlink.io/" + data.Key;
                uploadedFile.id = "assets_" + now.getTime();
                uploadedFile.Key = filePath;
                uploadedFile.thumbnailURL = uploadedFile.sourceCDNURL;

                if(saveInCache) {
                    addFileToCache(parentFolderName, uploadedFile, callback);
                } else {
                    callback(null, uploadedFile);
                }
            }
        });
    }
}

//delete local file
/*
function deleteLocalFile(filePath, uploadedFile, parentFolderName, saveInCache, callback) {
    fs.unlink(filePath, function (deleteFileErr) {
        if (deleteFileErr) {
            callback(deleteFileErr);
        } else {
            console.log("FILE_DELETED: "+ filePath)
            if(saveInCache) {
                addFileToCache(parentFolderName, uploadedFile, callback);
            } else {
                callback(null, uploadedFile);
            }
        }
    });
}
*/

function deleteFile(keyPrefix, fileId, callback) {
    log.info("Delete S3 file - " + fileId);

    var error;
    if(!keyPrefix) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FOLDER_NAME);
        error.status = 422;
        callback(error, null);
    } else if(!fileId) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FILE_ID);
        error.status = 422;
        callback(error, null);
    } else {
        cache.get(ASSETS_KEY_PREFIX + keyPrefix, function(redisErr, imagesStr) {
            if(redisErr) {
                callback(redisErr, null);
            } else {
                if(imagesStr) {

                    var images = JSON.parse(imagesStr);

                    var image = _.find(images, function(el) { return el.id === fileId; });

                    if(image) {
                        awsUtils.setCredentials(AWS);

                        var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});
                        var data = {
                            Key: image.Key
                        };

                        s3.deleteObject(data, function(deleteErr, deletedFile) {
                            if (deleteErr) {
                                callback(deleteErr, null);
                            } else {
                                images = _.reject(images, function(el) { return el.id === fileId; });

                                saveToCache(keyPrefix, images, callback);
                            }
                        });
                    }
                    else {
                        error = new Error(consts.SERVER_ERRORS.ASSETS.NOT_FOUND_ASSETS_FILE +
                        " " + fileId + " in " + keyPrefix);
                        error.status = 422;
                        callback(error);
                    }
                }
            }
        });
    }
}
/*
function deleteFileFromCache(keyPrefix, fileId, callback) {
    cache.get(ASSETS_KEY_PREFIX + keyPrefix, function(redisErr, imagesStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            if(imagesStr) {

                var images = JSON.parse(imagesStr);
                images = _.reject(images, function(el) { return el.id === fileId; });

                saveToCache(keyPrefix, images, callback);
            }
        }
    });
}
*/

/*
 * Upload file to AWS S3 blassets bucket
 * @param parentFolderName with parent section e.g. /General/keyPrefix
 * @param fileData, uploaded file object
 * @param saveInCache
 * @param callback
 */
function uploadFacilityImageFile(parentFolderName, fileData, saveInCache, finalCallback) {

    var error;
    if(!parentFolderName) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_ASSETS_FOLDER_NAME);
        error.status = 422;
        finalCallback(error, null);
    } else if(!fileData) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_FILE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        awsUtils.setCredentials(AWS);

        var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});

        async.waterfall([
            function(callback) {
                // put original image onto S3
                fs.readFile(fileData.path, function (readErr, readedData) {
                    if (readErr) {
                        callback(readErr, null);
                    } else {
                        var now = new Date();
                        var fileName = random.string(16) + "." + fileData.extension;
                        var filePath = consts.AWS_ASSETS_INFO.FACILITY_ASSETS_FOLDER + "/" +
                            parentFolderName + "/" + fileName;
                        var fileTitle = fileData.originalname;

                        var uploadData = {
                            Key: filePath,
                            ContentType: fileData.mimetype,
                            Body: readedData,
                            ACL: "public-read-write",
                            Metadata: {
                                title: fileTitle,
                            }
                        };

                        s3.putObject(uploadData, function(uploadErr, uploadedFile) {
                            if(uploadErr) {
                                callback(uploadErr, null);
                            } else {
                                uploadedFile.sourceCDNURL = "https://" +
                                    consts.AWS_ASSETS_INFO.CNAMES[0] +
                                    ".brighterlink.io/" + filePath;
                                uploadedFile.id = "assets_" + now.getTime();
                                uploadedFile.Key = filePath;
                                uploadedFile.title = fileTitle;
                                uploadedFile.fileName = fileName;
                                uploadedFile.thumbnailURL = uploadedFile.sourceCDNURL;

                                callback(null, uploadedFile);
                            }
                        });
                    }
                });
            },
            function(uploadedFile, callback) {
                fs.unlink(fileData.path, function (deleteFileErr) {
                    if (deleteFileErr) {
                        callback(deleteFileErr);
                    } else {
                        console.log("Local file deleted: "+ fileData.path);
                        callback(null, uploadedFile);
                    }
                });
            }
        ], function (err, uploadedFile) {
            if(err) {
                finalCallback(err, null);
            } else {
                if(saveInCache) {
                    addFileToCache(parentFolderName, uploadedFile, finalCallback);
                }
                else {
                    finalCallback(null, uploadedFile);
                }
            }
        });
    }
}

/*
 * Upload device firmware software file to AWS S3 device-softwares bucket
 * @param fileData, uploaded file object
 * @param saveInCache
 * @param callback
 */
function uploadDeviceSoftwareFile(fileData, finalCallback) {

    var error;
    if(!fileData) {
        error = new Error(consts.SERVER_ERRORS.ASSETS.UNKNOWN_FILE);
        error.status = 422;
        finalCallback(error, null);
    } else {

        awsUtils.setCredentials(AWS);

        var s3 = new AWS.S3({params: {Bucket: consts.AWS_FIRMWARE_INFO.BUCKET_NAME}});

        async.waterfall([
            function(callback) {
                // put original image onto S3
                fs.readFile(fileData.path, function (readErr, readedData) {
                    if (readErr) {
                        callback(readErr, null);
                    } else {
                        var now = new Date();
                        // var fileName = random.string(16) + "." + fileData.extension;
                        var filePath = fileData.originalname;
                        var fileTitle = fileData.originalname;

                        var uploadData = {
                            Key: filePath,
                            ContentType: fileData.mimetype,
                            Body: readedData,
                            ACL: "public-read-write",
                            Metadata: {
                                title: fileTitle,
                            }
                        };

                        s3.putObject(uploadData, function(uploadErr, uploadedFile) {
                            if(uploadErr) {
                                callback(uploadErr, null);
                            } else {
                                uploadedFile.bucketName = consts.AWS_FIRMWARE_INFO.BUCKET_NAME;
                                uploadedFile.s3URL = "s3://" +
                                    consts.AWS_FIRMWARE_INFO.BUCKET_NAME + "/" + filePath;
                                uploadedFile.httpURL = "https://" +
                                    consts.AWS_FIRMWARE_INFO.BUCKET_NAME + "." +
                                    consts.AWS_FIRMWARE_INFO.S3_DOMAIN_NAME + "/" + filePath;
                                uploadedFile.id = "firmware_" + now.getTime();
                                uploadedFile.Key = filePath;
                                uploadedFile.title = fileTitle;

                                callback(null, uploadedFile);
                            }
                        });
                    }
                });
            },
            function(uploadedFile, callback) {
                fs.unlink(fileData.path, function (deleteFileErr) {
                    if (deleteFileErr) {
                        callback(deleteFileErr);
                    } else {
                        console.log("Local file deleted: "+ fileData.path);
                        callback(null, uploadedFile);
                    }
                });
            }
        ], function (err, uploadedFile) {
            if(err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, uploadedFile);
            }
        });
    }
}

exports.clearCache = clearCache;
exports.storeImagesInCache = storeImagesInCache;
exports.findImages = findImages;
exports.createFolder = createFolder;
exports.uploadFile = uploadFile;
exports.uploadFileFromBase64 = uploadFileFromBase64;
exports.deleteFile = deleteFile;
exports.uploadMultiFiles = uploadMultiFiles;
exports.uploadFacilityImageFile = uploadFacilityImageFile;
exports.uploadDeviceSoftwareFile = uploadDeviceSoftwareFile;

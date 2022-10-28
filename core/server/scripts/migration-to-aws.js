"use strict";
var AWS = require("aws-sdk"),
    path = require("path"),
    utils = require("../libs/utils"),
    config = require("../../config/environment"),
    consts = require("../libs/consts"),
    _ = require("lodash"),
    fs = require("fs"),
    async = require("async"),
    IMG_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
    
function setCredentials() {
    AWS.config.update({
        accessKeyId: config.get("aws:auth:accesskeyid"),
        secretAccessKey: config.get("aws:auth:secretaccesskey"),
        region: config.get("aws:auth:region")
    });
}

function processFile(file, callback) {
    
    setCredentials();
    var s3 = new AWS.S3({params: {Bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME}});
    
    var filePath = file.filename, awsKey = file.key;
    var timestamp = fs.statSync(filePath).mtime.getTime();
    
    var mimeType = "";

    if (path.extname(filePath).toLowerCase() === ".png"){
        mimeType = "image/png";
    } else if (path.extname(filePath).toLowerCase() === ".jpg" || 
                path.extname(filePath).toLowerCase() === ".jpeg") {
        mimeType = "image/jpeg";
    } else if (path.extname(filePath).toLowerCase() === ".gif") {
        mimeType = "image/gif";
    } else if (path.extname(filePath).toLowerCase() === ".svg") {
        mimeType = "image/svg+xml";
    } else {
        callback(null, "File type is not image or unknown.");
    }
    
    var params = {
        Key : awsKey
    };

    s3.headObject(params, function (err, response) {
        
        if (response && timestamp <= Date.parse(response.LastModified)) {
            console.log("'" + filePath + "' not modified and is already stored on S3");
            callback(null, file);
        }
        else {
            console.log("'" + filePath + "' was not found on S3 or was modified recently");

            var readedData = fs.readFileSync(filePath);
            
            var data = {
                Key: awsKey, 
                ContentType: mimeType,
                Body: readedData,
                ACL: "public-read-write"
            };

            s3.putObject(data, function(uploadErr, uploadedFile) {
                if(uploadErr) {
                    callback(uploadErr, null);
                } else {
                    fs.utimesSync(filePath, new Date(timestamp), new Date(timestamp));
                    
                    console.log("A file has been uploaded to S3 - " + data.Key);
                    callback(null, uploadedFile);
                }
            });
        }
    });
}

function getFilesRecursiveSync(dir, fileList) {
    if (!fileList) {
        console.log("Variable fileList is undefined or NULL");
    }

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) {
            continue;
        }
        
        var name = dir + "/" + files[i];

        if (fs.statSync(name).isDirectory()) {
            getFilesRecursiveSync(name, fileList);
        } else {
            //console.log(IMG_EXTS.indexOf(path.extname(name).toLowerCase()));
            if(IMG_EXTS.indexOf(path.extname(name).toLowerCase()) !== -1) {
                var file = {"filename" : name, "key" : name.substring("client/".length)};
                
                fileList.push(file);
            }
        }
    }
}

function startMigration() {
    var fileList = [];
    
    var assetsFolders = [
        "client/assets/img", 
        "client/bl-bv-presentation/assets/img", 
        "client/bl-data-sense/assets/img", 
        "client/bl-bv-management/assets/img",
        "client/bl-help-and-updates/assets/img"
    ];

    _(assetsFolders).forEach(function (folder) {
        var tempList = [];
        getFilesRecursiveSync(folder, tempList);
        fileList = fileList.concat(tempList);
    });

    console.log("Total " + fileList.length + " assets detected.");

    // Process uploading for navigation bar assets
    async.eachSeries(fileList, function(file, callback) {
        processFile(file,callback);
    }, function(err){
        if(err) {
            utils.logError(err);
        } else {
            // All upload finished
            console.log("Finished for all assets. Thank you.");
        }

        process.exit();
    });
}

startMigration();

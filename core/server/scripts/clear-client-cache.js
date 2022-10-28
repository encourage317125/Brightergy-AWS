"use strict";

var awsAssetsUtils = require("../general/core/aws/assets-utils");

function clearCache() {
    awsAssetsUtils.clearCache(function (err, success) {
        if ( err ) {
            console.error(err);
        } else {
            console.info(success);
            console.log("Completed - clear cache");
   
            process.exit();
        }

    });
    
}

clearCache();
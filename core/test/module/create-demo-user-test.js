"use strict";

var config = require("../../config/environment"),
    coreService = require("../../module"),
    log = require("../../server/libs/log")(module),
    utils = require("../../server/libs/utils");


var testDomain = config.get("apidomain"); // for testing on BB, WB and Staging servers
if (!testDomain) {
    testDomain = config.get("demobox:url"); // for testing on localhost
}

var coreServiceConf = {
    baseUrl: testDomain,
    apiKey: config.get("demobox:createdemouserapi:auth")
}
coreService.init(coreServiceConf);

var testUserData = {
    "email" : "demouser"+Math.floor(Math.random()*100+1)+"@brightergy.com",
    "role" : "Admin"
};

coreService.createDemoUser(testUserData, function(err, result) {
    if (err) {
        console.log("Error: " + err.message);
    } else {
        console.log("\nResult\n" + JSON.stringify(result) + "\n");
    }

    process.exit();
});

"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    User = mongoose.model("user"),
    log = require("../libs/log")(module),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"));

var testUser = new User({
    "firstName": "test",
    "lastName": "testov",
    "email": "test@example.com",
    "emailUser": "test",
    "emailDomain": "example.com",
    "password": "test",
    "role": "BP"
});

testUser.save(function(saveErr, savedUser) {
    if(saveErr) {
        var correctErr = utils.convertError(saveErr);
        log.error(correctErr);
    } else {
        log.info("user saved");
    }

    process.exit();
});

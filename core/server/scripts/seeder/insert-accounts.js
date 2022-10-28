"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Account = mongoose.model("account"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertAccouts(finalCallback) {

    Account.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var accounts = [];
                    accounts.push({
                        "_id" : new ObjectId("54135e074f09ccc06d5be3d2"),
                        "name" : "Parkway School District",
                        "shippingStreet" : "1617 Main St",
                        "shippingState" : "MO",
                        "shippingPostalCode" : "64108",
                        "shippingCountry" : "US",
                        "shippingCity" : "Kansas City",
                        "billingStreet" : "1617 Main St # Street3",
                        "billingState" : "MO",
                        "billingPostalCode" : "64108",
                        "billingCountry" : "US",
                        "billingCity" : "Kansas City",
                        "cname" : "parkwayschools",
                        "tickerSymbol" : null,
                        "dunsNumber" : null,
                        "webSite" : null,
                        "phone" : "8168660567",
                        "email" : "AdamAdmin@brightergy.com",
                        "sfdcAccountId" : "001C0000013iMilIAE",
                        "__v" : 0,
                        "billingAddress" : "1617 Main Street\n3rd Floor\nKansas City, MO 64108",
                        "shippingAddress" : "1617 Main Street\nKansas City, MO 64108",
                        "awsAssetsKeyPrefix" : "CzosLKynCRHPHBv80nZP3mff",
                        "apps" : [
                            "Present",
                            "Analyze",
                            "Classroom",
                            "Verify",
                            "Control",
                            "Utilities",
                            "Projects",
                            "Connect"
                        ]
                    });
                    accounts.push({
                        "_id" : new ObjectId("54927f9da60298b00cd95fd2"),
                        "name" : "BrightergyPersonnel",
                        "shippingStreet" : "",
                        "shippingState" : "",
                        "shippingPostalCode" : "",
                        "shippingCountry" : "",
                        "shippingCity" : "",
                        "shippingAddress" : "",
                        "billingStreet" : "",
                        "billingState" : "",
                        "billingPostalCode" : "",
                        "billingCountry" : "",
                        "billingCity" : "",
                        "billingAddress" : "",
                        "cname" : "birhgtrerlink",
                        "tickerSymbol" : null,
                        "dunsNumber" : null,
                        "webSite" : "http://brightergy.com",
                        "phone" : "8168660555",
                        "email" : "005test@brightergy.com",
                        "sfdcAccountId" : null,
                        "awsAssetsKeyPrefix" : "XXLg0gmEu",
                        "__v" : 0,
                        "apps" : [
                            "Present",
                            "Analyze",
                            "Classroom",
                            "Verify",
                            "Control",
                            "Utilities",
                            "Projects",
                            "Connect"
                        ]
                    });
                    accounts.push({
                        "_id" : new ObjectId("54626daebbbb861400e59f54"),
                        "shippingAddress" : "360 W Pershing\nKansas City, MO 64108",
                        "billingAddress" : "360 W Pershing\nKansas City, MO 64108",
                        "name" : "Liberty Lofts",
                        "shippingStreet" : "",
                        "shippingState" : "",
                        "shippingPostalCode" : "",
                        "shippingCountry" : "",
                        "shippingCity" : "",
                        "billingStreet" : "",
                        "billingState" : "",
                        "billingPostalCode" : "",
                        "billingCountry" : "",
                        "billingCity" : "",
                        "cname" : "libertylofts",
                        "tickerSymbol" : null,
                        "dunsNumber" : null,
                        "webSite" : "http://thelibertykc.com",
                        "phone" : "8168660555",
                        "email" : "006test@brightergy.com",
                        "sfdcAccountId" : "001C000001JP9ZcIAL",
                        "awsAssetsKeyPrefix" : "XXLg0gmEu",
                        "__v" : 0,
                        "apps" : [
                            "Present",
                            "Analyze",
                            "Classroom",
                            "Verify",
                            "Control",
                            "Utilities",
                            "Projects",
                            "Connect"
                        ]
                    });
                    async.each(accounts, function (account, saveCallback) {
                        var accountModel = new Account(account);
                        accountModel.save(saveCallback);
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

exports.insertAccouts = insertAccouts;
"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    tempoiqWrapper = require("../general/core/tempoiq/tempoiq-wrapper"),
    userDA0 = require("../general/core/dao/user-dao"),
    Tag = mongoose.model("tag"),
    Account = mongoose.model("account"),
    _ = require("lodash"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils"),
    sf = require("node-salesforce"),
    accountDAO = require("../general/core/dao/account-dao");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function getFacility (rootTag, user) {

        var billingAddress = null;
        billingAddress = buildAddress(billingAddress, rootTag["Project__r"]["Account__r"].BillingStreet, true);
        billingAddress = buildAddress(billingAddress, rootTag["Project__r"]["Account__r"].BillingCity, true);
        billingAddress = buildAddress(billingAddress, rootTag["Project__r"]["Account__r"].BillingState, true);
        billingAddress = buildAddress(billingAddress, rootTag["Project__r"]["Account__r"].BillingPostalCode, false);
        billingAddress = buildAddress(billingAddress, rootTag["Project__r"]["Account__r"].BillingCountry, true);

        var utilityAccounts = [];
        if(rootTag["Project__r"]["Utility_Account_Numbers__c"]) {
            var raw = utils.multiReplace(rootTag["Project__r"]["Utility_Account_Numbers__c"], [";", ":"], ",");
            utilityAccounts = raw.split(",");
        }

        var facility = new Tag({
            "name": rootTag["Project__r"].Name,
            "tagType": consts.TAG_TYPE.Facility,
            "_id": mongoose.Types.ObjectId(),
            "creatorRole": user.role,
            "creator": user._id,
            "usersWithAccess": [],
            "appEntities": [],
            "children": [],
            "parents": [],
            "formula": null,
            "metricID": null,
            "metricType": null,
            "metric": null,
            "sensorTarget": null,
            "enphaseUserId": null,
            "endDate": null,
            "weatherStation": null,
            "longitude": null,
            "latitude": null,
            "webAddress": null,
            "interval": null,
            "destination": null,
            "accessMethod": null,
            "deviceID": null,
            "device": null,
            "manufacturer": null,
            "utilityAccounts": utilityAccounts,
            "utilityProvider": rootTag["Project__r"]["Utility_Provider__c"],
            "nonProfit": false,
            "taxID": rootTag["Project__r"]["Tax_ID__c"],
            "street": rootTag["Project__r"]["Account__r"].BillingStreet,
            "state": rootTag["Project__r"]["Account__r"].BillingState,
            "postalCode": rootTag["Project__r"]["Account__r"].BillingPostalCode,
            "country": rootTag["Project__r"]["Account__r"].BillingCountry,
            "city": rootTag["Project__r"]["Account__r"].BillingCity,
            "address": billingAddress
        });

        return facility;
    }

    function getDataLoggersWithChilds(facility, rootTag, user) {
        var dataLoggers = [];
        for (var i=0; i < rootTag.tags.length; i++) {
            var dataLogger = new Tag({
                "_id" : mongoose.Types.ObjectId(),
                "tagType" : consts.TAG_TYPE.Scope,
                "name" :  "Sunny WebBox: " + rootTag.tags[i].wb,
                "creatorRole": user.role,
                "creator": user._id,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : facility._id,
                        "tagType" : consts.TAG_TYPE.Facility
                    }
                ],
                "formula" : null,
                "metricID" : null,
                "metricType" : null,
                "metric" : null,
                "sensorTarget" : null,
                "enphaseUserId" : null,
                "endDate" : null,
                "weatherStation" : "--Use NOAA--",
                "longitude" : rootTag["Project__r"]["UtilityTerritory_Longitude__c"],
                "latitude" : rootTag["Project__r"]["UtilityTerritory_Latitude__c"],
                "webAddress" : null,
                "interval" : "Hourly",
                "destination" : "54.201.16.210",
                "accessMethod" : "Push to FTP",
                "deviceID" : rootTag.tags[i].wb,
                "device" : "Sunny WebBox",
                "manufacturer" : "SMA",
                "utilityAccounts" : [],
                "utilityProvider" : null,
                "nonProfit" : null,
                "taxID" : null,
                "street" : null,
                "state" : null,
                "postalCode" : null,
                "country" : null,
                "city" : null,
                "timezone" : "Central Standard Time"
            });

            facility.children.push({
                "id" : dataLogger._id,
                "tagType" : consts.TAG_TYPE.Scope
            });

            var sensors = getSensorsWithChilds(facility, dataLogger, rootTag.tags[i].inverters, user);


            dataLoggers.push(dataLogger);

            dataLoggers = _.union(dataLoggers, sensors);
        }

        return dataLoggers;
    }

    function getSensorsWithChilds(facility, datalogger, inverters, user) {
        var sensors = [];
        var nameLetters = ["A", "B", "C", "D", "E", "F"];

        for(var i=0; i < inverters.length; i++) {
            var sensor = new Tag({
                "_id" : mongoose.Types.ObjectId(),
                "tagType" : consts.TAG_TYPE.Node,
                "name" : datalogger.deviceID + " inverter " + nameLetters[i],
                "nodeType": consts.NODE_TYPE.Solar,
                "creatorRole": user.role,
                "creator": user._id,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : datalogger._id,
                        "tagType" : consts.TAG_TYPE.Scope
                    }
                ],
                "formula" : null,
                "metricID" : null,
                "metricType" : null,
                "metric" : null,
                "sensorTarget" : "Solar Inverter " + nameLetters[i],
                "enphaseUserId" : null,
                "endDate" : null,
                "weatherStation" : "--Use NOAA--",
                "longitude" : datalogger.longitude,
                "latitude" : datalogger.latitude,
                "webAddress" : null,
                "interval" : "Hourly",
                "destination" : null,
                "accessMethod" : null,
                "deviceID" : inverters[i].key,
                "device" : "Sunny WebBox",
                "manufacturer" : "SMA",
                "utilityAccounts" : [],
                "utilityProvider" : null,
                "nonProfit" : null,
                "taxID" : null,
                "street" : null,
                "state" : null,
                "postalCode" : null,
                "country" : null,
                "city" : null
            });

            datalogger.children.push({
                "id" : sensor._id,
                "tagType" : consts.TAG_TYPE.Node
            });

            var metrics = getMetrics(user, sensor);

            sensors.push(sensor);

            sensors = _.union(sensors, metrics);
        }

        return sensors;
    }

    function getMetrics(user, sensor) {
        var metrics = [];

        var calculated = consts.METRIC_TYPE.Calculated;
        var datafeed = consts.METRIC_TYPE.Datafeed;
        var total = consts.METRIC_SUMMARY_METHODS.Total;
        var average = consts.METRIC_SUMMARY_METHODS.Average;

        var wh = getSingleMetric(user, sensor, consts.METRIC_NAMES.Wh, calculated, total);
        var kwh = getSingleMetric(user, sensor, consts.METRIC_NAMES.kWh, calculated, total);
        var watts = getSingleMetric(user, sensor, consts.METRIC_NAMES.Watts, datafeed, average);
        var kw = getSingleMetric(user, sensor, consts.METRIC_NAMES.kW, datafeed, average);
        var reimbr = getSingleMetric(user, sensor, consts.METRIC_NAMES.Reimbursement, calculated, total);
        reimbr.rate = 0.1;

        metrics.push(wh);
        metrics.push(kwh);
        metrics.push(watts);
        metrics.push(kw);
        metrics.push(reimbr);

        return metrics;
    }

    function getSingleMetric(user, sensor, name, type, summaryMethod) {
        var metric = new Tag({
            "_id" : mongoose.Types.ObjectId(),
            "tagType": consts.TAG_TYPE.Metric,
            "name": name,
            "creatorRole": user.role,
            "creator": user._id,
            "usersWithAccess": [],
            "appEntities": [],
            "children": [],
            "parents": [
                {
                    "id": sensor._id,
                    "tagType": consts.TAG_TYPE.Node
                }
            ],
            "formula": null,
            "metricID": "Pac",
            "metricType": type,
            "metric": "Standard",
            "sensorTarget": null,
            "enphaseUserId": null,
            "endDate": null,
            "weatherStation": null,
            "longitude": null,
            "latitude": null,
            "webAddress": null,
            "interval": null,
            "destination": null,
            "accessMethod": null,
            "deviceID": null,
            "device": null,
            "manufacturer": null,
            "utilityAccounts": [],
            "utilityProvider": null,
            "nonProfit": null,
            "taxID": null,
            "street": null,
            "state": null,
            "postalCode": null,
            "country": null,
            "city": null,
            "summaryMethod": summaryMethod
        });

        sensor.children.push({
            "id" : metric._id,
            "tagType" : consts.TAG_TYPE.Metric
        });

        return metric;
    }

    function getAccount(sfAccount, existsAwsKeys) {

        var awsKey = utils.generateRandomString(9);

        if(existsAwsKeys.indexOf(awsKey) >=0) {
            awsKey += utils.generateRandomString(3);
            existsAwsKeys.push(awsKey);
        }

        var email = sfAccount.Name.toLowerCase();
        email = utils.removeAllSpaces(email);
        email = utils.multiReplace(email, ["-", "_", ".", "[", "]", "(", ")"], "");
        email += "@brightergy.com";

        var shippingAddress = null;
        var billingAddress = null;

        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingStreet, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingCity, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingState, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingPostalCode, false);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingCountry, true);

        billingAddress = buildAddress(billingAddress, sfAccount.BillingStreet, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingCity, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingState, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingPostalCode, false);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingCountry, true);


        var account = new Account({
            "_id": mongoose.Types.ObjectId(),
            "name": sfAccount.Name,
            "shippingStreet": sfAccount.ShippingStreet,
            "shippingState": sfAccount.ShippingState,
            "shippingPostalCode": sfAccount.ShippingPostalCode,
            "shippingCountry": sfAccount.ShippingCountry,
            "shippingCity": sfAccount.ShippingCity,
            "billingStreet": sfAccount.BillingStreet,
            "billingState": sfAccount.BillingState,
            "billingPostalCode": sfAccount.BillingPostalCode,
            "billingCountry": sfAccount.BillingCountry,
            "billingCity": sfAccount.BillingCity,
            "cname": null,
            "tickerSymbol": sfAccount.TickerSymbol,
            "dunsNumber": sfAccount.DunsNumber,
            "webSite": sfAccount.Website,
            "phone": sfAccount.Phone,
            "email": email,
            "sfdcAccountId": sfAccount.Id,
            "billingAddress": billingAddress,
            "shippingAddress": shippingAddress,
            "awsAssetsKeyPrefix": awsKey
        });

        return account;

    }

    function buildAddress(source, addition, addComma) {
        var separator = addComma? ", ": " ";
        if(addition) {
            if(source) {
                source += (separator + addition);
            } else {
                source = addition;
            }
        }

        return source;
    }

    function getInverters(inverters, wb) {
        return  _.filter(inverters, function (inv) {
            return inv.attributes.Device === wb;
        });
    }


    async.waterfall([
        function (callback) {
            console.log("LOADING SF ASSETS");
            var username = config.get("salesforce:auth:username");
            var password = config.get("salesforce:auth:password");

            var con = new sf.Connection({
                loginUrl: config.get("salesforce:auth:url")
            });

            con.login(username, password, function (authErr, userInfo) {
                if (authErr) {
                    callback(authErr, null);
                } else {

                    var select = "WebBox__c, Project__r.Id, Project__r.Name, Project__r.Tax_ID__c, ";
                    select += "Project__r.Utility_Provider__c, Project__r.Utility_Account_Numbers__c, ";
                    select += "Project__r.UtilityTerritory_Latitude__c, Project__r.UtilityTerritory_Longitude__c, ";
                    select += "Project__r.Account__r.Id, Project__r.Account__r.Name, ";
                    select += "Project__r.Account__r.BillingCity, ";
                    select += "Project__r.Account__r.BillingCountry, Project__r.Account__r.BillingPostalCode, ";
                    select += "Project__r.Account__r.BillingState, Project__r.Account__r.BillingStreet, ";
                    select += "Project__r.Account__r.ShippingCity, Project__r.Account__r.ShippingCountry, ";
                    select += "Project__r.Account__r.ShippingPostalCode, Project__r.Account__r.ShippingState, ";
                    select += "Project__r.Account__r.ShippingStreet, Project__r.Account__r.Website, ";
                    select += "Project__r.Account__r.Phone, Project__r.Account__r.DunsNumber, ";
                    select += "Project__r.Account__r.TickerSymbol";

                    con.sobject("BV_Presentation__c")
                        .select(select)
                        .where("Project__c != null")
                        .execute(callback);
                }
            });

        },
        function (presentations, callback) {
            console.log("LOADING TEMPOIQ INVERTERS");
            tempoiqWrapper.getDevicesByFamily("WebBox", function (err, inverters) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, presentations, inverters);
                }
            });
        },
        function(presentations, inverters, callback) {
            console.log("GENERATING ACCOUNTS");

            accountDAO.getAccountsByParams({}, function (searchErr, searchResult) {
                if(searchErr) {
                    callback(searchErr);
                } else {
                    var existsAwsKeys = [];
                    var accIds = [];
                    for(var  existsAccIndex =0; existsAccIndex < searchResult.length; existsAccIndex++) {
                        if(searchResult[existsAccIndex].awsAssetsKeyPrefix) {
                            existsAwsKeys.push(searchResult[existsAccIndex].awsAssetsKeyPrefix);
                        }

                        if(searchResult[existsAccIndex].sfdcAccountId) {
                            accIds.push(searchResult[existsAccIndex].sfdcAccountId);
                        }
                    }

                    var accounts = [];

                    for(var i=0; i < presentations.length; i++) {
                        if(accIds.indexOf(presentations[i]["Project__r"]["Account__r"].Id) < 0) {
                            accIds.push(presentations[i]["Project__r"]["Account__r"].Id);
                            var acc = getAccount(presentations[i]["Project__r"]["Account__r"], existsAwsKeys);
                            accounts.push(acc);
                        }
                    }

                    callback(null, presentations, inverters, accounts);
                }
            });

        },
        function(presentations, inverters, accounts, callback) {
            console.log("INSERTING ACCOUNTS");
            if(accounts.length > 0) {
                async.each(accounts, function(acc, cb) {
                    acc.save(cb);
                }, function(err) {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, presentations, inverters);
                    }
                });
            } else {
                callback(null, presentations, inverters);
            }
        },
        function(presentations, inverters, callback) {
            console.log("SEARCH EXISTING TAGS");
            Tag.find({deviceID: {$ne: null}}, function(err, tags) {
                if(err) {
                    callback(err);
                } else {
                    var existingDeviceIds = _.map(tags, function(tag) {
                        return tag.deviceID;
                    });

                    callback(null, presentations, inverters, existingDeviceIds);

                }

            });

        },
        function (presentations, inverters, existingDeviceIds, callback) {
            console.log("PREPARING TAGS");

            var wbPresentations = _.filter(presentations, function(p) {
                return p["WebBox__c"] && p["WebBox__c"] !== "0";
            });

            var i= 0, j=0;

            //many presentations may yse the same project, so we need combine presentations by project
            var combinedItems = [];

            for(i=0; i < wbPresentations.length; i++) {

                var thisProjectId = wbPresentations[i]["Project__r"].Id;

                var addedProjectIndex = -1;
                for(j=0; j < combinedItems.length; j++) {
                    if(combinedItems[j]["Project__r"].Id === thisProjectId) {
                        addedProjectIndex = j;
                        break;
                    }
                }

                if(addedProjectIndex < 0) {
                    //presentationId not added
                    combinedItems.push(wbPresentations[i]);
                } else {
                    //project added, so add webboxIds
                    var thisWebBox = ", " + wbPresentations[i]["WebBox__c"];

                    combinedItems[addedProjectIndex]["WebBox__c"] += thisWebBox;
                }
            }

            var processedWebBoxes = [];


            for (i = 0; i < combinedItems.length; i++) {
                var thisWebBoxes = combinedItems[i]["WebBox__c"].split(",");

                var presentationTags = [];

                for (j = 0; j < thisWebBoxes.length; j++) {
                    var wb = thisWebBoxes[j].trim();

                    if (wb.indexOf("wb") < 0) {
                        wb = "wb" + wb;
                    }

                    if (processedWebBoxes.indexOf(wb) < 0 && existingDeviceIds.indexOf(wb) < 0) {
                        //not found
                        processedWebBoxes.push(wb);

                        //find inverters by webbox
                        var wbInv = getInverters(inverters, wb);

                        if(wbInv.length > 0) {
                            presentationTags.push({
                                wb: wb,
                                inverters: wbInv
                            });
                        }
                    }

                }

                combinedItems[i].tags = presentationTags;
            }

            callback(null, combinedItems);

        },
        function(tagsToCreate, callback) {
            userDA0.getUserByEmail("daniel.keith@brightergy.com", function(findErr, user) {
                if(findErr) {
                    callback(findErr);
                } else {
                    callback(null, tagsToCreate, user);
                }
            });
        },
        function (tagsToCreate, user, callback) {
            console.log("GENERATING TAGS");
            var tags = [];

            for(var i=0; i < tagsToCreate.length; i++) {
                var rootTag = tagsToCreate[i];
                var facility = getFacility(rootTag, user);

                var dataLoggers = getDataLoggersWithChilds(facility, rootTag, user);

                if(dataLoggers.length > 0) {
                    tags.push(facility);

                    tags = _.union(tags, dataLoggers);
                }
            }

            callback(null, tags);
        },
        function(tags, callback) {
            console.log("INSERTING TAGS");
            if(tags.length > 0) {
                async.each(tags, function(tag, cb) {
                    tag.save(cb);
                }, function(err) {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, consts.OK);
                    }
                });
            } else {
                callback(null, consts.OK);
            }
        }

    ], function (err, result) {
        if (err) {
            var correctErr = utils.convertError(err);
            console.log(correctErr);
        } else {
            console.log(result);
        }

        process.exit();
    });
});

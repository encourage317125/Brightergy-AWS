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
    User = mongoose.model("user"),
    Presentation = mongoose.model("bv_presentation"),
    _ = require("lodash"),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils"),
    sf = require("node-salesforce"),
    moment = require("moment"),
    DEFAULT_COUNTRY = "United States";

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    function validateCountry(country) {
        if(country === "USA" || country === "US") {
            return DEFAULT_COUNTRY;
        }
        return country;
    }

    function getFacility (project, user) {

        var billingAddress = null;
        billingAddress = buildAddress(billingAddress, project["Account__r"].BillingStreet, true);
        billingAddress = buildAddress(billingAddress, project["Account__r"].BillingCity, true);
        billingAddress = buildAddress(billingAddress, project["Account__r"].BillingState, true);
        billingAddress = buildAddress(billingAddress, project["Account__r"].BillingPostalCode, false);
        var billingCountry = project["Account__r"].BillingCountry || null;
        if(billingAddress && !billingCountry) {
            billingCountry = DEFAULT_COUNTRY;
        }
        billingCountry = validateCountry(billingCountry);
        billingAddress = buildAddress(billingAddress, billingCountry, true);


        var installAddress = null;
        installAddress = buildAddress(installAddress, project["Install_Address__c"], true);
        installAddress = buildAddress(installAddress, project["City__c"], true);
        installAddress = buildAddress(installAddress, project["State__c"], true);
        installAddress = buildAddress(installAddress, project["Zip__c"], false);
        var installCountry = project["Account__r"].BillingCountry || null;
        if(installAddress && !installCountry) {
            installCountry = DEFAULT_COUNTRY;
        }
        installCountry = validateCountry(installCountry);
        installAddress = buildAddress(installAddress, installCountry, true);

        var utilityAccounts = [];
        if(project["Utility_Account_Numbers__c"]) {
            var raw = utils.multiReplace(project["Utility_Account_Numbers__c"], [";", ":"], ",");
            utilityAccounts = raw.split(",");
        }

        var facility = new Tag({
            "name": project.Name,
            "displayName": project["Product__r"]["Building__r"].Name || project.Name,
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
            "utilityProvider": project["Utility_Provider__c"] || null,
            "nonProfit": false,
            "taxID": project["Tax_ID__c"] || null,
            "street": project["Account__r"].BillingStreet || null,
            "state": project["Account__r"].BillingState || null,
            "postalCode": project["Account__r"].BillingPostalCode || null,
            "country": billingCountry,
            "city": project["Account__r"].BillingCity || null,
            "address": billingAddress || null,
            "installCountry": installCountry,
            "installCity": project["City__c"] || null,
            "installPostalCode": project["Zip__c"] || null,
            "installState": project["State__c"] || null,
            "installStreet": project["Install_Address__c"] || null,
            "installAddress": installAddress || null,
            "region": "North America",
            "continent": "North America"
        });

        return facility;
    }

    function getScopeDisplayname(deviceID) {
        if(deviceID.indexOf("wb155") > -1) {
            return "WebBox (Bluetooth)";
        } else if(deviceID.indexOf("wb150") > -1) {
            return "WebBox (Legacy)";
        } else {
            return "Scope";
        }
    }

    function getNodeDisplayName(deviceID) {
        if(deviceID.indexOf("WR3") > -1) {
            return "SB 3000 Inverter";
        } else if(deviceID.indexOf("WR5") > -1) {
            return "SB 5000 Inverter";
        } else if(deviceID.indexOf("WR6") > -1) {
            return "SB 6000 Inverter";
        } else if(deviceID.indexOf("WR7") > -1) {
            return "SB 7000 Inverter";
        } else if(deviceID.indexOf("WR8") > -1) {
            return "SB 8000 Inverter";
        } else if(deviceID.indexOf("WRHV5") > -1) {
            return "Tripower 20000 Inverter";
        } else if(deviceID.indexOf("WRHV6") > -1) {
            return "Tripower 24000 Inverter";
        } else {
            return "Node";
        }
    }

    function getScopesWithChilds(facility, project, tags, user) {
        var dataLoggers = [];

        var commissioningDate = null;
        if(project["System_On__c"]) {
            commissioningDate = moment.utc(project["System_On__c"]);
        }

        for (var i=0; i < tags.length; i++) {
            var dataLogger = new Tag({
                "_id" : mongoose.Types.ObjectId(),
                "tagType" : consts.TAG_TYPE.Scope,
                "name" :  "Sunny WebBox: " + tags[i].wb,
                "displayName": getScopeDisplayname(tags[i].wb),
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
                "longitude" : project["UtilityTerritory_Longitude__c"],
                "latitude" : project["UtilityTerritory_Latitude__c"],
                "webAddress" : null,
                "interval" : "Hourly",
                "destination" : "54.201.16.210",
                "accessMethod" : "Push to FTP",
                "deviceID" : tags[i].wb,
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
                "timezone" : "Central Daylight Time",
                "fake": false,
                "commissioningDate": commissioningDate
            });

            facility.children.push({
                "id" : dataLogger._id,
                "tagType" : consts.TAG_TYPE.Scope
            });

            var sensors = getSensorsWithChilds(facility, dataLogger, tags[i].inverters, user, project);


            dataLoggers.push(dataLogger);

            dataLoggers = _.union(dataLoggers, sensors);
        }

        return dataLoggers;
    }

    function getSensorsWithChilds(facility, scope, inverters, user, project) {
        var nodes = [];
        var nameLetters = ["A", "B", "C", "D", "E", "F", "G","H", "I", "J", "K"];

        var potentialPower = project["System_Size__c"] || 0;
        var inverterPotentialPower = parseFloat(potentialPower / inverters.length);

        for(var i=0; i < inverters.length; i++) {
            var node = new Tag({
                "_id" : mongoose.Types.ObjectId(),
                "tagType" : consts.TAG_TYPE.Node,
                "name" : scope.deviceID + " inverter " + nameLetters[i],
                "displayName": getNodeDisplayName(inverters[i].key),
                "nodeType": consts.NODE_TYPE.Solar,
                "creatorRole": user.role,
                "creator": user._id,
                "usersWithAccess" : [],
                "appEntities" : [],
                "children" : [],
                "parents" : [
                    {
                        "id" : scope._id,
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
                "longitude" : scope.longitude,
                "latitude" : scope.latitude,
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
                "city" : null,
                "fake": false,
                "potentialPower": inverterPotentialPower
            });

            scope.children.push({
                "id" : node._id,
                "tagType" : consts.TAG_TYPE.Node
            });

            var metrics = getMetrics(user, scope, node);

            nodes.push(node);

            nodes = _.union(nodes, metrics);
        }

        return nodes;
    }

    function getMetrics(user, scope, node) {
        var metrics = [];

        var calculated = consts.METRIC_TYPE.Calculated;
        var datafeed = consts.METRIC_TYPE.Datafeed;
        var total = consts.METRIC_SUMMARY_METHODS.Total;
        var average = consts.METRIC_SUMMARY_METHODS.Average;

        var wh = getSingleMetric(user, node, consts.METRIC_NAMES.Wh, calculated, total);
        var kwh = getSingleMetric(user, node, consts.METRIC_NAMES.kWh, calculated, total);
        var watts = getSingleMetric(user, node, consts.METRIC_NAMES.Watts, datafeed, average);
        var kw = getSingleMetric(user, node, consts.METRIC_NAMES.kW, datafeed, average);
        var reimbr = getSingleMetric(user, node, consts.METRIC_NAMES.Reimbursement, calculated, total);
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
            "displayName": null,
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
            "summaryMethod": summaryMethod,
            "fake": false
        });

        sensor.children.push({
            "id" : metric._id,
            "tagType" : consts.TAG_TYPE.Metric
        });

        return metric;
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

    function getEmailByAccountName(name) {
        var emailUser = utils.multiReplace(name, [" ", "-"], ".", "_", ",").toLowerCase();
        var email = emailUser + "@brightergy.com";
        email = utils.removeAllSpaces(email);
        return {
            email: email,
            emailUser: emailUser
        };
    }

    function getAccount(sfAccount, existsAwsKeys) {

        var awsKey = utils.generateRandomString(9);

        if(existsAwsKeys.indexOf(awsKey) >=0) {
            awsKey += utils.generateRandomString(3);
            existsAwsKeys.push(awsKey);
        }

        var email = getEmailByAccountName(sfAccount.Name).email;

        var shippingAddress = null;
        var billingAddress = null;

        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingStreet, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingCity, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingState, true);
        shippingAddress = buildAddress(shippingAddress, sfAccount.ShippingPostalCode, false);
        var shippingCountry = sfAccount.ShippingCountry || null;
        if(shippingAddress && !shippingCountry) {
            shippingCountry = DEFAULT_COUNTRY;
        }
        shippingCountry = validateCountry(shippingCountry);
        shippingAddress = buildAddress(shippingAddress, shippingCountry, true);

        billingAddress = buildAddress(billingAddress, sfAccount.BillingStreet, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingCity, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingState, true);
        billingAddress = buildAddress(billingAddress, sfAccount.BillingPostalCode, false);
        var billingCountry = sfAccount.BillingCountry || null;
        if(billingAddress && !billingCountry) {
            billingCountry = DEFAULT_COUNTRY;
        }
        billingCountry = validateCountry(billingCountry);
        billingAddress = buildAddress(billingAddress, billingCountry, true);


        var account = new Account({
            "_id": mongoose.Types.ObjectId(),
            "name": sfAccount.Name,
            "shippingStreet": sfAccount.ShippingStreet,
            "shippingState": sfAccount.ShippingState,
            "shippingPostalCode": sfAccount.ShippingPostalCode,
            "shippingCountry": shippingCountry,
            "shippingCity": sfAccount.ShippingCity,
            "billingStreet": sfAccount.BillingStreet,
            "billingState": sfAccount.BillingState,
            "billingPostalCode": sfAccount.BillingPostalCode,
            "billingCountry": billingCountry,
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

    function getUser(account, accountFacilityObj, facilities, emails) {

        var emailObj = getEmailByAccountName(account.name);
        var accId = account.sfdcAccountId;

        if(emails.indexOf(emailObj.email) < 0) {

            emails.push(emailObj.email);

            var user = new User({
                "_id": mongoose.Types.ObjectId(),
                "firstName": "Placeholder",
                "lastName": "- " + account.name,
                "email": emailObj.email,
                "emailUser": emailObj.emailUser,
                "emailDomain": "brightergy.com",
                "password": "Brightergy1",
                "accounts": [account._id],
                "role": consts.USER_ROLES.Admin,
                "defaultApp": "Analyze",
                "apps": ["Present", "Analyze", "Classroom", "Verify", "Respond", "Utilities", "Projects", "Connect"],
                "accessibleTags": []
            });

            var usedFacilitiesArray = accountFacilityObj[accId];

            _.each(usedFacilitiesArray, function(facilityId) {
                user.accessibleTags.push({
                    "tagType": consts.TAG_TYPE.Facility,
                    "id": facilityId
                });
            });

            for (var i = 0; i < facilities.length; i++) {
                if (usedFacilitiesArray.indexOf(facilities[i]._id.toString()) > -1) {
                    facilities[i].usersWithAccess.push({
                        "id": user._id
                    });
                }
            }

            return user;
        } else {
            return null;
        }
    }

    var saveAccsId = ["546b32f580f57514008590cf"];//BrightergyPersonnel
    var saveFacilitiesId = [
        "5458a2acb0091419007e03df",
        "5490b571e335142e0050115e",
        "54918516adcc581500d216aa",
        "5491855f00e34b15006f2da4",
        "5491869700e34b15006f2da5",
        "549186ccadcc581500d216ab",
        "54f84ab21688f21600d74b48",
        "54f9e98cf0bbdb1600a73c97",
        "552c2583549511b0001504e2",
        "55521beaa25a0c541b38d907"
    ];

    function getTagsHierarchyRecursive(queryCondition, results, callback) {
        Tag.find(queryCondition, function(findErr, tags) {
            if(findErr) {
                return callback(findErr);
            }

            var thisObjectsId = _.map(tags, function(tag) {
                return tag._id.toString();
            });

            results = _.union(results, thisObjectsId);

            var childrenId = [];
            _.each(tags, function(tag) {
                _.each(tag.children, function(children) {
                    childrenId.push(children.id.toString());
                });
            });

            if(childrenId.length === 0 ) {
                return callback(null, results);
            } else {
                getTagsHierarchyRecursive({_id: {$in: childrenId}}, results, callback);
            }
        });
    }

    async.waterfall([

        function(callback) {
            var savefaciltiesCondition = {_id: {$in: saveFacilitiesId}};//facilities that need save
            getTagsHierarchyRecursive(savefaciltiesCondition, [], callback);

        },
        function(saveTagsId, callback) {
            //remove Dashboard app, because all dashboards are removed
            Tag.find({_id: {$in: saveTagsId}}, function(err, tags) {
                if(err) {
                    return callback(err);
                }

                for(var i=0; i < tags.length; i++) {
                    if(tags[i].appEntities.length > 0) {
                        for (var j = tags[i].appEntities.length - 1; j >=0; j--) {
                            if(tags[i].appEntities[j].appName === "Dashboard") {
                                tags[i].appEntities.splice(j, 1);
                            }
                        }
                    }
                }

                async.each(tags, function(tag, cb) {
                    tag.save(cb);
                }, function(err) {
                    callback(err, saveTagsId);
                });
            });

        },
        function(saveTagsId, callback) {
            //some tags are used in presentations
            //need filter it and save in memory for updating id with new tsg
            var presentMap = {};

            Tag.find({}, function(findtagErr, tags) {
                if(findtagErr) {
                    return callback(findtagErr);
                }

                var tagsMap = {};
                _.each(tags, function(tag) {
                    tagsMap[tag._id.toString()] = tag;
                });

                //presentations that uses tags to remove
                Presentation.find({}, function(err, presentations) {
                    if(err) {
                        return callback(err);
                    }


                    //build map where key = presentationId, and values array of webboxId
                    _.each(presentations, function(presentation) {
                        var presentationId = presentation._id.toString();
                        _.each(presentation.tagBindings, function(binding) {
                            var sourceId = binding.id.toString();
                            var sourceType = binding.tagType;
                            if(saveTagsId.indexOf(sourceId) < 0) {
                                //presentation is used tag that will be deleted

                                if(!presentMap[presentationId]) {
                                    presentMap[presentationId] = [];
                                }

                                var usedTag = tagsMap[sourceId];
                                var deviceId = null;
                                if (usedTag.tagType === consts.TAG_TYPE.Facility) {
                                    if (usedTag.children.length > 0) {
                                        var scopeId = usedTag.children[0].id.toString();
                                        deviceId = tagsMap[scopeId].deviceID;
                                        presentMap[presentationId].push({
                                            device: deviceId,
                                            id: sourceId,
                                            deviceType: sourceType
                                        });
                                    }
                                } else if (usedTag.tagType === consts.TAG_TYPE.Scope) {
                                    deviceId = usedTag.deviceID;
                                    presentMap[presentationId].push({
                                        device: deviceId,
                                        id: sourceId,
                                        deviceType: sourceType});
                                } else {
                                    throw new Error("Unknown presentation binding");
                                }
                            }

                        });
                    });

                    //var len = _.size(presentMap);
                    callback(null, saveTagsId, presentMap);
                });
            });

        },
        //remove old data
        function(saveTagsId, presentMap, callback) {
            Tag.remove({_id: {$nin: saveTagsId}}, function(err) {
                callback(err, presentMap);
            });
        }, function(presentMap, callback) {
            Account.remove({_id: {$nin: saveAccsId }}, function(err, s) {
                callback(err, presentMap);
            });
        }, function(presentMap, callback) {
            User.remove({accounts: {$nin: saveAccsId}}, function(err) {
                callback(err, presentMap);
            });
        },
        function(presentMap, callback) {
            //old tags has been deleted, let's create new
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

                    var select = "Id, Name, Tax_ID__c, WebBox__c, ";
                    select += "Utility_Provider__c, Utility_Account_Numbers__c, ";
                    select += "UtilityTerritory_Latitude__c, UtilityTerritory_Longitude__c, ";
                    select += "System_Size__c, System_On__c, ";
                    select += "Install_Address__c, City__c, Zip__c, State__c, Install_Suite_Floor_Other__c, ";
                    select += "Product__r.Building__r.Id, Product__r.Building__r.Name, ";
                    select += "Account__r.Id, Account__r.Name, ";
                    select += "Account__r.BillingCity, ";
                    select += "Account__r.BillingCountry, Account__r.BillingPostalCode, ";
                    select += "Account__r.BillingState, Account__r.BillingStreet, ";
                    select += "Account__r.ShippingCity, Account__r.ShippingCountry, ";
                    select += "Account__r.ShippingPostalCode, Account__r.ShippingState, ";
                    select += "Account__r.ShippingStreet, Account__r.Website, ";
                    select += "Account__r.Phone, Account__r.DunsNumber, ";
                    select += "Account__r.TickerSymbol";

                    con.sobject("Project__c")
                        .select(select)
                        .where("WebBox__c != null")
                        .execute(function(err, projects) {
                            callback(err, projects, presentMap);
                        });
                }
            });
        },
        function (projects, presentMap, callback) {
            console.log("LOADING TEMPOIQ INVERTERS");
            tempoiqWrapper.getDevicesByFamily("WebBox", function (err, inverters) {
                callback(null, projects, inverters, presentMap);
            });
        },
        function(projects, inverters, presentMap, callback) {
            userDA0.getUserByEmail("daniel.keith@brightergy.com", function(findErr, bpUser) {
                callback(null, projects, inverters, bpUser, presentMap);
            });
        },
        function (projects, inverters, bpUser, presentMap, callback) {
            console.log("GENERATING NEW TAGS");
            var tags = [];

            var existingDevices = [];

            for(var i=0; i < projects.length; i++) {
                var facility = getFacility(projects[i], bpUser);

                var webboxes = utils.removeAllSpaces(projects[i]["WebBox__c"]).split(",");

                var thisTags = [];

                for(var j=0; j < webboxes.length;j++) {

                    if(existingDevices.indexOf(webboxes[j]) < 0) {

                        var facilityTagObj = {
                            wb: webboxes[j],
                            inverters: getInverters(inverters, webboxes[j])
                        };

                        if (facilityTagObj.inverters.length > 0) {
                            //it has nodes, we can create it
                            thisTags.push(facilityTagObj);
                        }

                        existingDevices.push(webboxes[j]);
                    }
                }

                if(thisTags.length > 0) {
                    var dataLoggers = getScopesWithChilds(facility, projects[i], thisTags, bpUser);

                    tags.push(facility);

                    tags = _.union(tags, dataLoggers);
                } else {
                    tags.push(facility);
                }
            }

            callback(null, tags, projects, bpUser, presentMap);
        },
        function(tags, projects, user, presentMap, callback){
            console.log("INSERTING TAGS");
            async.map(tags, function(tag, cb) {
                tag.save(cb);
            }, function(err, savedTags) {
                if(err) {
                    callback(err);
                } else {

                    var savedfacilities = _.filter(savedTags, function(tag) {
                       return tag.tagType === consts.TAG_TYPE.Facility;
                    });

                    callback(null, projects, user, savedfacilities, presentMap);
                }
            });
        },
        function(projects, user, facilities, presentMap, callback) {
            console.log("GENERATING ACCOUNTS");
            var accountsForInsert = [];

            var i=0;

            //store name andfacility id
            var facilitiesMap = {};
            for(i=0; i < facilities.length; i++) {
                facilitiesMap[facilities[i].name] = facilities[i]._id.toString();
            }

            var accountFacilityMap = {};
            var existingAwsKeys = [];
            var generatedAccountsId = [];

            //generate account and store accountId with facilityId
            for(i=0; i < projects.length; i++) {
                var projectName = projects[i].Name;
                var accountSFDCId = projects[i]["Account__r"].Id;
                //one account can be used in multiple projects
                //we need create one account and assign to all facilities (via users)
                if(generatedAccountsId.indexOf(accountSFDCId) < 0) {
                    generatedAccountsId.push(accountSFDCId);

                    var acc = getAccount(projects[i]["Account__r"], existingAwsKeys);
                    accountsForInsert.push(acc);

                    accountFacilityMap[accountSFDCId] = [];
                    accountFacilityMap[accountSFDCId].push(facilitiesMap[projectName]);
                } else {
                    //the same account, assign to new facility
                    accountFacilityMap[accountSFDCId].push(facilitiesMap[projectName]);
                }
            }

            callback(null, accountsForInsert, accountFacilityMap, facilities, presentMap);
        },
        function(accountsForInsert, accountFacilityMap, facilities, presentMap, callback){
            console.log("INSERTING ACCOUNTS");
            async.each(accountsForInsert, function(acc, cb) {
                acc.save(cb);
            }, function(err) {
                callback(err, accountsForInsert, accountFacilityMap, facilities, presentMap);
            });
        },
        function(accountsForInsert, accountFacilityMap, facilities, presentMap, callback) {
            console.log("GENERATING USERS");
            var users= [];
            var emails = [];
            for(var i=0; i < accountsForInsert.length; i++) {
                var newUser = getUser(accountsForInsert[i], accountFacilityMap, facilities, emails);
                if(newUser) {
                    users.push(newUser);
                }
            }

            callback(null, users, facilities, presentMap);
        },
        function(users, facilities, presentMap, callback){
            console.log("INSERTING USERS");
            var n =0;
            async.eachSeries(users, function(user, cb) {
                n++;
                console.log(n);
                user.save(cb);
            }, function(err) {
                callback(err, facilities, presentMap);
            });
            //callback(null, facilities, presentMap);
        },
        function(facilities, presentMap, callback){
            console.log("UPDATING FACILITIES");
            async.each(facilities, function(facility, cb) {
                facility.save(cb);
            }, function(err) {
                callback(err, presentMap);
            });
        },
        function(presentMap, callback) {
            console.log("UPDATING PRESENTATIONS");

            var usedDevicesId = [];
            _.each(presentMap, function(arr, presentId) {
                _.each(arr, function(item) {
                    usedDevicesId.push(item.device);
                });
            });

            Tag.find({deviceID: {$in: usedDevicesId}}, function(tagErr, scopes) {
                if(tagErr) {
                    return callback(tagErr);
                }

                var tagsId = _.map(scopes, function(scope) {
                    return scope._id.toString();
                });

                //get parents
                _.each(scopes, function(scope) {
                    tagsId.push(scope.parents[0].id.toString());
                });

                Tag.find({_id: {$in: tagsId}}, function(gettagErr, tags) {
                    callback(gettagErr, tags, presentMap);
                });
            });
        },
        function(tags, presentMap, callback) {
            var presentationsId = Object.keys(presentMap);

            Presentation.find({_id: {$in: presentationsId}}, function(err, presentations) {
                if(err) {
                    return callback(err);
                }

                var tagsMap = {};
                var tagsFacilitiesMap = {};
                var tagsScopesMap = {};
                _.each(tags, function(tag) {
                    tagsMap[tag._id.toString()] = tag;
                });

                _.each(tags, function(tag) {
                    var tagId = tag._id.toString();
                    if(tag.tagType === consts.TAG_TYPE.Scope) {
                        tagsScopesMap[tag.deviceID] = tagId;
                    } else if(tag.tagType === consts.TAG_TYPE.Facility) {
                        var scopeId = tag.children[0].id.toString();
                        var scopeDeviceaId = tagsMap[scopeId].deviceID;

                        tagsFacilitiesMap[scopeDeviceaId] = tagId;
                    }
                });

                for(var i=0; i < presentations.length; i++) {
                    var bindings = presentMap[presentations[i]._id.toString()];

                    for(var j=0; j < bindings.length; j++) {
                        //var binding = presentations[i].tagBindings[j];
                        var device = bindings[j].device;
                        var deviceType = bindings[j].deviceType;
                        var sourceId = bindings[j].id;
                        var newtagId = null;
                        if(deviceType === consts.TAG_TYPE.Facility) {
                            newtagId = tagsFacilitiesMap[device];
                        } else if(deviceType === consts.TAG_TYPE.Scope) {
                            newtagId = tagsScopesMap[device];
                        }

                        //find and and change tagBunling in presentation by sourceId;
                        for(var k=0; k < presentations[i].tagBindings.length; k++) {
                            if(presentations[i].tagBindings[k].id.toString() === sourceId) {
                                presentations[i].tagBindings[k].id = new mongoose.Types.ObjectId(newtagId);

                                //update tag
                                tagsMap[newtagId].appEntities.push({
                                    "appName" : "Presentation",
                                    "id" : presentations[i]._id
                                });
                            }
                        }
                    }
                }

                async.each(presentations, function(presentationToSave, cb) {
                    presentationToSave.save(cb);
                }, function(err) {
                    callback(err, tagsMap);
                });
            });
        },
        function(tagsMap, callback) {
            var tags = _.values(tagsMap);

            async.each(tags, function(tag, cb) {
                tag.save(cb);
            }, function(err) {
                callback(err, "OK");
            });
        }
    ], function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(results);
        }
        process.exit();
    });
});
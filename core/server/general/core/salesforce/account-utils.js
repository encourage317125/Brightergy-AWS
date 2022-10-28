"use strict";

// TODO:: moved to auth-service

var config = require("../../../../config/environment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    cache = require("../../../libs/cache"),
    _ = require("lodash"),
    _str = require("underscore.string"),
    authUtils = require("./auth");

function getSFDCAccountsFromCache(findNameMask, callback) {
    cache.get("sfdcaccounts", function(redisErr, accountsStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            if(accountsStr) {
                var accounts = JSON.parse(accountsStr);

                if(findNameMask) {
                    findNameMask = findNameMask.toUpperCase();

                    accounts = _.filter(accounts, function(acc) {
                        return acc.companyName.toUpperCase().indexOf(findNameMask) > -1;
                    });
                }

                callback(null, accounts);
            } else {
                callback(null, []);
            }
        }
    });
}

function filterUtilityProviders(findNameMask, accounts) {
    var uilityProviders = _.filter(accounts, function(acc) {
        return acc.accountType === "Utility Provider";
    });

    var uilityProvidersNames = _.map(uilityProviders, function(acc) { return acc.companyName; });

    if(findNameMask) {

        var scores = [];

        var generalWords = config.get("utilityprovidersgeneralwords");
        findNameMask = utils.multiReplace(findNameMask, generalWords, "");

        findNameMask = _str.clean(findNameMask);

        var inputWords = utils.toUpperCaseArray(_str.words(findNameMask));
        var inputLetters = utils.toUpperCaseArray(_str.chars(findNameMask));

        //console.log("inputWords"+inputWords)
        //console.log("inputLetters"+inputLetters)

        findNameMask = utils.removeAllSpaces(findNameMask.toUpperCase());
        //console.log("findNameMask final:"+findNameMask)

        for(var providerIndex = 0; providerIndex < uilityProvidersNames.length; providerIndex++) {
            var providerName = uilityProvidersNames[providerIndex];

            var exactMatchScore = 0;

            //find by exact match
            if(utils.removeAllSpaces(providerName.toUpperCase()) === findNameMask) {
                exactMatchScore = 25;
            }

            //find by each word
            var providerNameWords = utils.toUpperCaseArray(_str.words(providerName));
            var sameWords = _.intersection(providerNameWords, inputWords);
            //console.log("sameWords"+sameWords)

            //find by each letter
            var providerLetters = utils.toUpperCaseArray(_str.chars(providerName));
            var sameLetters = _.intersection(providerLetters, inputLetters);

            //console.log("providerLetters"+providerLetters)
            //console.log("sameLetters"+sameLetters)

            scores.push({
                name: providerName,
                score: exactMatchScore + sameWords.length * 5 + sameLetters.length
            });

        }

        var sortedScores = _.sortBy(scores, function(item) {
            return item.score * -1;//desc sort
        });

        return _.first(sortedScores, 5);

    } else {
        return _.map(uilityProvidersNames, function (providerName) {
            return {
                name: providerName,
                score: 0
            };
        });
    }
}

function getUtilityProvidersFromCache(findNameMask, callback) {
    cache.get("sfdcaccounts", function(redisErr, accountsStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            if(accountsStr) {
                var accounts = JSON.parse(accountsStr);
                var utilityProviders = filterUtilityProviders(findNameMask, accounts);
                callback(null, utilityProviders);
            } else {
                callback(null, []);
            }
        }
    });
}

function convertAccountToSFDC(accountObj, capitalize) {
    var sfdcAcc = {
        Name: accountObj.name,
        BrighterLink_Id__c: accountObj._id.toString(),// jshint ignore:line
        BrighterLink_Apps__c: accountObj.apps.length > 0 ? accountObj.apps.join(", ") : null// jshint ignore:line
    };

    var copyField = ["webSite", "dunsNumber", "tickerSymbol", "phone", "email"];

    for(var prop in accountObj) {
        if(prop.indexOf("billing") > -1 || prop.indexOf("shipping") > -1 || _.contains(copyField, prop)) {

            if(capitalize && prop === "email") {
                sfdcAcc = utils.setObjectValue(sfdcAcc, "Email__c", accountObj[prop]);
            } else {
                var thisPropertyName = capitalize ? utils.capitalizeString(prop) : prop;

                sfdcAcc[thisPropertyName] = accountObj[prop];
            }
        }
    }

    return sfdcAcc;
}

function updateSFDCAccount(accountObj, callback) {
    var authData = authUtils.getSFAuthData();
    var con = authUtils.getSFConnection();

    con.login(authData.username, authData.password, function(err, userInfo) {
        if (err) {
            callback(err, null);
        } else {

            var sfdcAcc = convertAccountToSFDC(accountObj, false);
            sfdcAcc.companyName = accountObj.name;
            sfdcAcc.accountId = accountObj.sfdcAccountId;

            con.apex.post(config.get("salesforce:accountupdateurl"), sfdcAcc, function(updateAccErr, loadedData) {
                if(updateAccErr) {
                    callback(updateAccErr, null);
                } else {
                    callback(null, loadedData);
                }
            });
        }
    });
}

function createSFDCAccount(accountObj, callback) {
    var authData = authUtils.getSFAuthData();
    var con = authUtils.getSFConnection();

    con.login(authData.username, authData.password, function(err, userInfo) {
        if (err) {
            callback(err, null);
        } else {

            var sfdcAcc = convertAccountToSFDC(accountObj, true);

            con.sobject("Account").create(sfdcAcc, function(err, ret) {
                console.log(err);
                console.log(ret);
                if (err || !ret.success) {
                    callback(err);
                } else {
                    callback(null, ret);
                }
            });
        }
    });
}

function getSFDCAccount(bvAccount, callback) {
    if(!bvAccount.sfdcAccountId) {
        var error = new Error(consts.SERVER_ERRORS.ACCOUNT.ACCOUNT_NOT_EXISTS);
        error.status = 422;
        callback(error);
    } else {
        var authData = authUtils.getSFAuthData();
        var con = authUtils.getSFConnection();

        con.login(authData.username, authData.password, function(authErr, userInfo) {
            if (authErr) {
                callback(authErr, null);
            } else {

                console.log("Id: "+ bvAccount.sfdcAccountId);

                con.sobject("Account")
                    .select("*")
                    .where({
                        Id : bvAccount.sfdcAccountId
                    })
                    .execute(function(findErr, records) {
                        if(findErr) {
                            callback(findErr, null);
                        } else {
                            callback(null, records);
                        }

                    });
            }
        });
    }
}

//SFDC Account Id should be correct
function checkSFAccount(sfdcAccountId, callback) {
    cache.get("sfdcaccounts", function(redisErr, accountsStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            if(accountsStr) {
                var accounts = JSON.parse(accountsStr);
                var findAccounts = _.filter(accounts, function(account) {
                    return account.accountId === sfdcAccountId;
                });

                if(findAccounts.length === 0) {
                    var error = new Error(consts.SERVER_ERRORS.ACCOUNT.INCORRECT_SF_ACCOUNT_ID);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, consts.OK);
                }
            } else {
                callback(new Error(consts.SERVER_ERRORS.GENERAL.UNKNOWN_KEY), null);
            }
        }
    });
}

function convertAccountToSFDCLead(account, user) {
     var lead = {
         Company: account.name,
         Website: account.webSite,
         CompanyDunsNumber: account.dunsNumber,
         Country: account.shippingCountry,
         State: account.shippingState,
         Street: account.shippingStreet,
         City: account.shippingCity,
         PostalCode: account.shippingPostalCode,
         Email: user.email,
         FirstName: user.firstName,
         //MiddleName: user.middleName,
         LastName: user.lastName,
         Phone: user.phone,
         isBrighterLink_Lead__c: true // jshint ignore:line
     };

    return lead;
}

function createSFDCLead(account, user, callback) {
    var authData = authUtils.getSFAuthData();
    var con = authUtils.getSFConnection();

    con.login(authData.username, authData.password, function(err, userInfo) {
        if (err) {
            callback(err, null);
        } else {

            var sfdcLead = convertAccountToSFDCLead(account, user);

            con.sobject("Lead").create(sfdcLead, function(err, ret) {
                console.log(err);
                console.log(ret);
                if (err || !ret.success) {
                    callback(err);
                } else {
                    callback(null, ret);
                }
            });
        }
    });
}

function getSFDCProjects(callback) {
    cache.get("sfdcprojects", function(redisErr, projectsStr) {
        if(redisErr) {
            callback(redisErr);
        } else {
            if(projectsStr) {
                var projects = JSON.parse(projectsStr);
                callback(null, projects);
            } else {
                callback(null, []);
            }
        }
    });
}

exports.checkSFAccount = checkSFAccount;
exports.getUtilityProvidersFromCache = getUtilityProvidersFromCache;
exports.getSFDCAccountsFromCache = getSFDCAccountsFromCache;
exports.createSFDCAccount = createSFDCAccount;
exports.updateSFDCAccount = updateSFDCAccount;
exports.getSFDCAccount = getSFDCAccount;
exports.createSFDCLead = createSFDCLead;
exports.getSFDCProjects = getSFDCProjects;
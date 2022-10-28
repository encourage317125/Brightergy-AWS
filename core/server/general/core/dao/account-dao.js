"use strict";

var mongoose = require("mongoose"),
    Account = mongoose.model("account"),
    User = mongoose.model("user"),
    userDAO = require("./user-dao"),
    _ = require("lodash"),
    async = require("async"),
    //config = require("../../../../config/environment"),
    //log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    //dataSourceUtils = require("../../../libs/data-source-utils"),
    consts = require("../../../libs/consts"),
    sfdcAccountUtils = require("../salesforce/account-utils");
    //awsAssetsUtils = require("../../core/aws/assets-utils");

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function getAccountsByParams(params, callback) {
    Account.find(params)
        .lean()
        .exec(function (err, findAccount) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, findAccount);
            }
        });
}

function validateAccount(account, callback) {

    var appsErrors = utils.appsValidator(account.apps);
    if(appsErrors) {
        return callback(appsErrors);
    }

    return account.validate(callback);
}

// -------------------------------------------------------------------------------------

/**
 * Add account asset key
 *
 * @access  public
 * @param   object
 * @param   number
 * @return  array
 */
function createAccountFolder(savedAccount, callback) {
    var awsAssetsKeyPrefix = utils.generateRandomString(16);

    getAccountsByParams({awsAssetsKeyPrefix : awsAssetsKeyPrefix}, function (searchErr, searchResult) {
        if(searchErr) {
            callback(searchErr);
        }
        else {
            if(searchResult.length > 0) {
                awsAssetsKeyPrefix += utils.generateRandomString(4);
            }
            
            savedAccount.awsAssetsKeyPrefix = awsAssetsKeyPrefix;
            
            callback(null, savedAccount);
        }
    });
    
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   boolean
 * @param   callback
 * @return  void
 */
function insertData(account, user, createUserSFDContact, callback) {
    //var keyPrefix = sfAccountAssetsId + "/BrighterLink/Assets/Users";
    createAccountFolder(account, function (createErr, accountWithKey) {
        accountWithKey.save(function (saveAccountErr, updatedAccount) {
            if (saveAccountErr) {
                callback(saveAccountErr);
            } else {
                //Approval is disabled for BP
                user.accounts = [updatedAccount._id];

                userDAO.createUser(user, createUserSFDContact, account.sfdcAccountId,
                    false, function (saveUserErr, savedUser) {
                    if (saveUserErr) {
                        account.remove();
                        callback(saveUserErr);
                    } else {
                        callback(null, updatedAccount, savedUser);
                    }

                });
            }
        });
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function create(accountObj, userObj, finalCallback) {

    var thisAccountModel = new Account(accountObj);
    var thisUserModel = new User(userObj);
    var error;

    async.series([
        function (callback) {
            validateAccount(thisAccountModel, callback);
        },
        function (callback) {
            if(thisAccountModel.sfdcAccountId) {
                thisUserModel.validate(callback);
            } else {
                error = new Error(consts.SERVER_ERRORS.ACCOUNT.SF_ACCOUNT_REQUIRED);
                error.status = 422;
                callback(error, null);
            }
        },
        function (callback) {
            //sfdcAccountUtils.checkSFAccount(thisAccountModel.sfdcAccountId, callback);
            Account.count({sfdcAccountId: thisAccountModel.sfdcAccountId}, function(err, count) {
                if(err || count > 0) {
                    callback(consts.SERVER_ERRORS.ACCOUNT.INCORRECT_SF_ACCOUNT_ID);
                } else {
                    callback(null, consts.OK);
                }
            });
        },
        function (callback) {
            if(thisUserModel.role === consts.USER_ROLES.BP) {
                error = new Error(consts.SERVER_ERRORS.ACCOUNT.CAN_NOT_ASSOCIATE_BP_WITH_ACCOUNT);
                error.status = 422;
                callback(error, null);
            } else {
                callback(null, null);
            }
        }
    ],  function (err, results) {
        if (err) {
            finalCallback(err, null);
        } else {
            insertData(thisAccountModel, userObj, true, finalCallback);
        }
    });
}

// -------------------------------------------------------------------------------------
/**
 * Add account asset key and save
 *
 * @access  public
 * @param   object
 * @param   number
 * @return  array
 */
function createAccountFolderAndSave(savedAccount, callback) {
    var awsAssetsKeyPrefix = utils.generateRandomString(9);

    getAccountsByParams({awsAssetsKeyPrefix : awsAssetsKeyPrefix}, function (searchErr, searchResult) {
        if(searchErr) {
            callback(searchErr);
        }
        else {
            if(searchResult.length > 0) {
                awsAssetsKeyPrefix += utils.generateRandomString(3);
            }
            
            savedAccount.awsAssetsKeyPrefix = awsAssetsKeyPrefix;
            savedAccount.save(function (saveAccountErr, updatedAccount) {
                if (saveAccountErr) {
                    callback(saveAccountErr);
                }
                else {
                    callback(null, updatedAccount);
                }
            });
        }
    });
    
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function insertDataWithSF(accountModel, user, callback) {
    var billingAddress = accountModel.billingAddress;
    var shippingAddress = accountModel.shippingAddress;
    delete accountModel._doc.billingAddress;
    delete accountModel._doc.shippingAddress;
    sfdcAccountUtils.createSFDCAccount(accountModel, function (sfdcErr, sfdcAccount) {
        if(sfdcErr) {
            callback(sfdcErr, null);
        } else {
            accountModel.sfdcAccountId = sfdcAccount.id;
            accountModel.billingAddress = billingAddress;
            accountModel.shippingAddress = shippingAddress;
            //user.sfdcContactId = null;//create new SFDC Contact always
            insertData(accountModel, user, true, callback);
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function createWithSF(accountObj, userObj, finalCallback) {
    var thisAccountModel = new Account(accountObj);
    var thisUserModel = new User(userObj);

    thisAccountModel.sfdcAccountId = "";
    
    async.series([
        function (callback) {
            validateAccount(thisAccountModel, callback);
        },
        function (callback) {
            thisUserModel.validate(callback);
        },
        function (callback) {
            var error;
            if(thisUserModel.role === consts.USER_ROLES.BP) {
                error = new Error(consts.SERVER_ERRORS.ACCOUNT.CAN_NOT_ASSOCIATE_BP_WITH_ACCOUNT);
                error.status = 422;
                callback(error, null);
            } else if(userObj.sfdcContactId) {
                error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_USE_EXISTING_SF_CONTACT);
                error.status = 422;
                callback(error, null);
            } else {
                callback(null, null);
            }
        }
    ],  function (err, results) {
        if (err) {
            finalCallback(err, null);
        } else {
            insertDataWithSF(thisAccountModel, userObj, finalCallback);
        }
    });
}

// -------------------------------------------------------------------------------------
/**
 * Save account record, create user and SF Lead and Contact
 *
 * @access  public
 * @param   accountObj
 * @param   userObj
 * @param   finalCallback
 * @return  void
 */
function createSelf(accountObj, userObj, finalCallback) {

    accountObj.sfdcAccountId = "";//temporary
    userObj.sfdcContactId = null;
    userObj.accessibleTags = [];//self registred user can not specify tags

    var thisAccountModel = new Account(accountObj);
    var thisUserModel = new User(userObj);

    async.waterfall([
        function (callback) {
            validateAccount(thisAccountModel, callback);
        },
        function (callback) {
            thisUserModel.validate(callback);
        },
        function (callback) {
            var error;
            if(thisUserModel.role === consts.USER_ROLES.BP) {
                error = new Error(consts.SERVER_ERRORS.ACCOUNT.CAN_NOT_ASSOCIATE_BP_WITH_ACCOUNT);
                error.status = 422;
                callback(error, null);
            } else if(userObj.sfdcContactId) {
                error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_USE_EXISTING_SF_CONTACT);
                error.status = 422;
                callback(error, null);
            } else {
                callback(null, consts.OK);
            }
        },
        function(status, callback) {
            sfdcAccountUtils.createSFDCLead(thisAccountModel, userObj, callback);
        },
        function(lead, callback) {
            thisAccountModel.sfdcAccountId = "Lead" + lead.id;
            userObj.sfdcContactId = "Lead" + lead.id;
            insertData(thisAccountModel, userObj, false, callback);
        }
    ],  function (err, results) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(err, results);
        }
    });
}

function getAccountQueryParamsByIdANDAccounts(findUserId, currentUser) {
    if(currentUser.role === consts.USER_ROLES.BP) {
        return {_id: findUserId};
    } else {
        return {$and: [
            {_id:  findUserId},
            {_id: { $in: currentUser.accounts}}
        ]};
    }
}

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function getAccountByIdIfAllowed(accountId, currentUser, callback) {

    var findParams = null;

    if(!callback) {
        //current user is optional, so callback will be undefined and real callback will be currentUser object
        callback = currentUser;

        findParams = {_id: accountId};
    } else {
        //we have currentUser object
        findParams = getAccountQueryParamsByIdANDAccounts(accountId, currentUser);
    }

    Account.findOne(findParams, function (findAccountErr, findAcount) {
        if (findAccountErr) {
            callback(findAccountErr, null);
        } else {
            if(!findAcount) {
                var error = new Error(consts.SERVER_ERRORS.ACCOUNT.ACCOUNT_NOT_EXISTS + accountId);
                error.status = 422;
                callback(error, null);
            } else {
                callback(null, findAcount);
            }
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function updateData(account, callback) {

    account.save(function (saveAccountErr, savedAccount) {
        if (saveAccountErr) {
            callback(saveAccountErr, null);
        } else {
            var billingAddress = savedAccount.billingAddress;
            var shippingAddress = savedAccount.shippingAddress;
            delete savedAccount._doc.billingAddress;
            delete savedAccount._doc.shippingAddress;
            sfdcAccountUtils.updateSFDCAccount(savedAccount, function(sfdcErr, sfdcRes) {
                savedAccount.billingAddress = billingAddress;
                savedAccount.shippingAddress = shippingAddress;

                if(sfdcErr) {
                    sfdcErr.account = savedAccount.toObject();
                    utils.logError(sfdcErr);
                }

                callback(null, savedAccount);
            });
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function update(accountObj, accountId, currentUser, callback) {

    getAccountByIdIfAllowed(accountId, currentUser, function (findErr, findAcount) {
        if (findErr) {
            callback(findErr, null);
        } else if (!accountObj.sfdcAccountId) {
            var error = new Error(consts.SERVER_ERRORS.ACCOUNT.SF_ACCOUNT_REQUIRED);
            error.status = 422;
            callback(error, null);
        } else {

            var paramsToChange = Object.keys(accountObj);

            paramsToChange.forEach(function (param) {
                findAcount[param] = accountObj[param];
            });

            updateData(findAcount, callback);
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function getUsersByAllAccounts(user, findNameMask, limit, callback) {
    //find accounts
    var accountParams = {};

    if(user.role !== consts.USER_ROLES.BP) {
        var userAccounts = user.accounts;
        accountParams._id = { $in: userAccounts};
    }

    Account.find(accountParams).exec(function(err, accounts) {
        if(err) {
            callback(err, null);
        } else {
            var accountIds = _.map(accounts, function(acc) { return acc._id; });

            var userParams = {
                accounts: { $in: accountIds}
            };
            var searchKey = findNameMask;
            if(findNameMask) {
                searchKey = findNameMask.trim();
                var searchKeyItem = searchKey.split(" ")[0];
                userParams.$or =  [
                    { firstName: new RegExp(searchKeyItem, "i") },
                    { middleName: new RegExp(searchKeyItem, "i") },
                    { lastName: new RegExp(searchKeyItem, "i") }
                ];
            }

            var q = User.find(userParams);

            if (limit) {
                q.limit(limit);
            }

            q.lean().exec(function (err, users) {
                if (err) {
                    callback(err, null);
                } else {
                    //var result = addUsersToAccounts(accounts, users);
                    var uniqUsers = _.uniq(users, function(user) {
                        return user._id.toString();
                    });
                    if( searchKey ) {
                        var patt = new RegExp(searchKey, "i");
                        uniqUsers = _.filter(uniqUsers, function(user){
                            return patt.test(user.name);
                        });
                    }
                    callback(null, uniqUsers);
                }
            });
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * filter user by account id
 *
 * @access  public
 * @param   array of users
 * @param   string 
 * @param   callback
 * @return  void
 */
/*
function filterUsersByAccountId(users, accountId) {
    
    var filteredUsers = _.filter(users, function(user) { 
        return user.accounts.indexOf(accountId) > -1; 
    });

    return filteredUsers;
}
*/

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
/*
function addUsersToAccounts(accounts, users) {
    var results = [];
    for(var accIndex = 0; accIndex < accounts.length;accIndex++) {
        var accObj = accounts[accIndex].toObject();
        //accObj.users = [];

        var usersByAcc = filteredUsers(users, accObj._id);
        
        accObj.users = usersByAcc;

        results.push(accObj);
    }

    return results;
}
*/

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function getUsersByAccount(user, accountId, limit, callback) {

    getAccountByIdIfAllowed(accountId, user, function(findAccountErr, findAccount) {
        if(findAccountErr) {
            callback(findAccountErr);
        } else {

            var params = {
                accounts:findAccount._id
            };

            var q = User.find(params);

            if (limit) {
                q.limit(limit);
            }

            q.lean().exec(function (err, accounts) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, accounts);
                }
            });
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function getAccountsByUser(user, findNameMask, limit, callback) {

    var params = {};

    if(findNameMask) {
        params.name = new RegExp(findNameMask, "i");
    }

    if(user.role !== consts.USER_ROLES.BP) {
        var userAccounts = user.accounts;
        params._id = { $in: userAccounts};
    }

    var q = Account.find(params);
    if(limit) {
        q.limit(limit);
    }

    q.lean().exec(function(err, accounts) {
        return callback(err, accounts);
        /*if(err) {
            callback(err, null);
        } else {
            //get users for accounts and build applications manually

            var accountsMap = {};
            _.each(accounts, function(acc) {
                acc.apps = [];
                accountsMap[acc._id.toString()] = acc;
            });

            userDAO.getUsersByParams({accounts: {$in: accounts}}, function (userErr, users) {
                if (userErr) {
                    callback(userErr);
                } else {
                    //build applications in account
                    _.each(users, function (u) {

                        _.each(u.accounts, function(userAcc) {
                            var accId = userAcc.toString();

                            var acc = accountsMap[accId];

                            acc.apps.push.apply(acc.apps, u.apps);
                            acc.apps = _.uniq(acc.apps);
                        });
                    });

                    callback(null, _.values(accountsMap));
                }
            });

            //callback(null, accounts);
        }*/
    });
}

// -------------------------------------------------------------------------------------

/**
 * Save account record and create a user per account
 *
 * @access  public
 * @param   object
 * @param   object
 * @param   callback
 * @return  void
 */
function verifyCNAME(cname, callback) {
    cname = cname.toLowerCase();
    getAccountsByParams({cname: cname}, function(err, findAccounes) {
        if(err) {
            callback(err);
        } else {
            callback(null, findAccounes.length === 0);
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Create BP account
 *
 * @access  public
 * @param   callback
 * @return  void
 */
function createBPAccount(callback) {
    var BPAccount = new Account();
    BPAccount.name = consts.BP_ACCOUNT_NAME;
    BPAccount.save(function (saveErr, savedAccount) {
        if(saveErr) {
            callback(saveErr);
        }
        else {
            callback(null, savedAccount);
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Find BP account
 *
 * @access  public
 * @param   callback
 * @return  void
 */
function findBPAccount(callback) {
    var param = { name : consts.BP_ACCOUNT_NAME };
    
    getAccountsByParams(param, function(err, findAccounes) {
        if(err) {
            callback(err);
        } else {
            if(findAccounes.length > 0) {
                callback(null, findAccounes[0]);
            }
            else {
                callback(null, null);
            }
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Create Demo account
 *
 * @access  public
 * @param   callback
 * @return  void
 */
function createDemoAccount(callback) {
    var DemoAccount = new Account();
    DemoAccount.name = consts.DEMO_ACCOUNT_NAME;
    DemoAccount.sfdcAccountId = "DummyValueForDemoAccount";
    DemoAccount.save(function (saveErr, savedAccount) {
        if(saveErr) {
            callback(saveErr);
        }
        else {
            callback(null, savedAccount);
        }
    });
}

// -------------------------------------------------------------------------------------

/**
 * Find Demo account
 *
 * @access  public
 * @param   callback
 * @return  void
 */
function findDemoAccount(callback) {
    var param = { name : consts.DEMO_ACCOUNT_NAME };
    
    getAccountsByParams(param, function(err, findAccounes) {
        if(err) {
            callback(err);
        } else {
            if(findAccounes.length > 0) {
                callback(null, findAccounes[0]);
            }
            else {
                callback(null, null);
            }
        }
    });
}

// -------------------------------------------------------------------------------------
/**
 * Delete account with matched matched sf lead Id
 *
 * @param     {string} leadId
 * @param     {function} finalCallback
 * @return    void
 */
function deleteAccountByLeadId(leadId, finalCallback) {

    async.waterfall([
        function(cb) {
            var sfLeadId = "Lead" + leadId;
            getAccountsByParams({
                $or: [
                    {sfdcAccountId: leadId},
                    {sfdcAccountId: sfLeadId}
                ]
            }, cb);
        }, function(foundAccounts, cb) {
            if(foundAccounts.length > 0) {

                //remove found account
                Account.remove({sfdcAccountId: foundAccounts[0].sfdcAccountId}, function (deleteErr) {
                    if (deleteErr) {
                        cb(deleteErr, null);
                    } else {

                        var accIds = _.map(foundAccounts, function(acc) {
                            return acc._id.toString();
                        });

                        cb(null, accIds);
                    }
                });
            } else {
                cb(null, []);
            }
        }, function(accIds, cb) {
            //remove user with found accounts
            userDAO.deleteUsersByAccountId(accIds, cb);
        }
    ], function(err, result) {
        if(err) {
            finalCallback(err);
        } else {
            finalCallback(null, result);
        }
    });
}

function setCorrectSFDCIdByLead(leadId, accountId, contactId, finalCallback) {
    async.waterfall([
        function(cb) {
            var sfLeadId = "Lead" + leadId;
            getAccountsByParams({
                $or: [
                    {sfdcAccountId: leadId},
                    {sfdcAccountId: sfLeadId}
                ]
            }, cb);
        }, function(foundAccounts, cb) {
            if(foundAccounts.length > 0) {

                foundAccounts[0].sfdcAccountId = accountId;
                foundAccounts[0].save(cb);

            } else {
                cb(null, null);
            }
        }, function(savedAccount, cb) {
            //remove user with found accounts
            userDAO.setCorrectSFDCIdByLead(leadId, contactId, cb);
        }
    ], function(err, result) {
        if(err) {
            finalCallback(err);
        } else {
            finalCallback(null, consts.OK);
        }
    });
}

function addAccountApplications(accountId, apps, currentUser, callback) {
    getAccountByIdIfAllowed(accountId, currentUser, function(getAccErr, account) {
        if(getAccErr) {
            return callback(getAccErr);
        }

        var error = null;
        if(currentUser.role !== consts.USER_ROLES.BP) {
            error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS);
            error.status = 422;
            return callback(error);
        }

        account.apps = _.union(account.apps, apps);
        var validateErrors = utils.appsValidator(account.apps);
        if(validateErrors) {
            return callback(validateErrors);
        }

        account.save(callback);
    });
}

function removeAccountApplications(accountId, apps, currentUser, callback) {
    getAccountByIdIfAllowed(accountId, currentUser, function(getAccErr, account) {
        if(getAccErr) {
            return callback(getAccErr);
        }

        var error = null;
        if(currentUser.role !== consts.USER_ROLES.BP) {
            error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS);
            error.status = 422;
            return callback(error);
        }

        account.apps = _.difference(account.apps, apps);
        var validateErrors = utils.appsValidator(account.apps);
        if(validateErrors) {
            return callback(validateErrors);
        }

        async.waterfall([
            function(cb) {
                account.save(cb);
            },
            function(savedAcc, updated, cb) {
                User.find({accounts:savedAcc._id}, function(err, users) {
                    cb(err, users, savedAcc);
                });
            },
            function(foundUsers, savedAcc, cb) {
                async.each(foundUsers, function(user, next) {
                    user.apps = _.difference(user.apps, apps);
                    user.save(next);
                }, function(err) {
                    cb(err, savedAcc);
                });
            }
        ], function(err, savedAcc) {
            if(err) {
                callback(err);
            } else {
                callback(null, savedAcc);
            }
        });
    });
}

exports.create = create;
exports.createWithSF = createWithSF;
exports.update = update;
exports.getUsersByAllAccounts = getUsersByAllAccounts;
exports.getAccountsByUser = getAccountsByUser;
exports.getUsersByAccount = getUsersByAccount;
exports.getAccountByIdIfAllowed = getAccountByIdIfAllowed;
exports.verifyCNAME = verifyCNAME;
exports.getAccountsByParams = getAccountsByParams;
exports.createAccountFolderAndSave = createAccountFolderAndSave;
exports.createBPAccount = createBPAccount;
exports.findBPAccount = findBPAccount;
exports.createDemoAccount = createDemoAccount;
exports.findDemoAccount = findDemoAccount;
exports.createSelf = createSelf;
exports.deleteAccountByLeadId = deleteAccountByLeadId;
exports.setCorrectSFDCIdByLead = setCorrectSFDCIdByLead;
exports.addAccountApplications = addAccountApplications;
exports.removeAccountApplications = removeAccountApplications;

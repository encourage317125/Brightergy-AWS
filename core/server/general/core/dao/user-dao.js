"use strict";

var mongoose = require("mongoose"),
    User = mongoose.model("user"),
    Tag = mongoose.model("tag"),
    //Account = mongoose.model("account"),
    //presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    accountDAO = require("./account-dao"),
    passwordUtils = require("../user/password-utils"),
    ObjectId = mongoose.Types.ObjectId,
    _ = require("lodash"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    validationUtils = require("../../../libs/validation-util"),
    async = require("async"),
    consts = require("../../../libs/consts"),
    config = require("../../../../config/environment"),
    //dataSourceUtils = require("../../../libs/data-source-utils"),
    tagDAO = require("./tag-dao"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
    sfdcContactUtils = require("../salesforce/contact-utils"),
    cacheHelper = require("../../../libs/cache-helper");

// constants
/*var timezoneOffsets = {};
_.each(consts.TIME_ZONES, function(zone, i) {
    timezoneOffsets[zone.name] = zone.offset;
});*/

function getUserQueryParamsByIdANDAccounts(findUserId, currentUser) {
    if(currentUser.role === consts.USER_ROLES.BP) {
        return {_id: findUserId};
    } else {
        return {$and: [
            {_id:  findUserId},
            {accounts: { $in: currentUser.accounts}}
        ]};
    }
}

/**
 * Get User By email
 *
 * @param     String, findEmail
 * @return    Object, User object or error
 */
function getUserByEmail(findEmail, callback) {

    if(findEmail) {
        findEmail = findEmail.toLowerCase();
    }

    User.findOne({email : findEmail}, "+password +previousPasswords +tokens", function (err, findUser) {
        if(err) {
            callback(err, null);
        } else {
            if(findUser) {
                callback(null, findUser);
            } else {
                var userErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_EMAIL);
                userErr.status = 403;
                callback(userErr, null);
            }
        }
    });
}

/**
 * Get User By token
 *
 * @param     String, token type
 * @param     String, token
 * @return    Object, User object or error
 */
function getUserByToken(tokenType, token, callback) {
    User.findOne({"tokens.type":tokenType, "tokens.token":token}, "+password +previousPasswords +tokens",
        function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var userErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_OR_EXPIRED_TOKEN);
                    userErr.status = 403;
                    callback(userErr, null);
                }
            }
        });
}

function getUserBySocialToken(socialToken, callback) {
    User.findOne({"socialToken":socialToken}, "+password +previousPasswords +tokens", function (err, findUser) {
        if(err) {
            callback(err, null);
        } else {
            if(findUser) {
                callback(null, findUser);
            } else {
                var error = new Error(consts.SERVER_ERRORS.USER.NOT_LINKED_SOCIAL_NETWORK);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

/**
 * Validate user model
 *
 * @param     Object, User object
 * @return    Object, OK or error
 */
function validate(userObj, callback) {
    var user = new User(userObj);
    user.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

/**
 * Get User by Id
 *
 * @param     String, User Id
 * @return    Object, User object or error
 */
function getUserById(userId, callback) {
    User.findById(userId)
        .exec(function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.USER.USER_NOT_EXISTS);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

function createDummyFacility(user, params, finalCallback) {
    if (!finalCallback) {
        finalCallback = params;
        params = {};
    }

    if (!params.searchFaciltyName) {
        params.searchFaciltyName = "Barret";
    }
    if (!params.dummyFaciltyName) {
        params.dummyFaciltyName = "Dummy Facility " + user.name;
    }
    if (!params.strictMode) {
        params.strictMode = false;
    }

    var findParams = {
        $and: [{tagType: consts.TAG_TYPE.Facility},
            { name: new RegExp(params.searchFaciltyName, "i") }]
    };

    async.waterfall([
        function(cb) {
            tagDAO.getTagsByParams(findParams, cb);
        },
        function(foundTags, cb) {
            if(foundTags.length === 0) {
                cb(new Error("Can not find " + params.searchFaciltyName + " facility"));
            } else {
                cb(null, foundTags[0]);
            }
        },
        function(sourceFacility, cb) {
            tagDAO.clone(sourceFacility, user, _.values(consts.METRIC_NAMES), cb);
        },
        function(clonnedTags, cb) {
            var scopeIndex = 0, nodeIndex =0;
            for(var i=0; i < clonnedTags.length;i++) {

                if(clonnedTags[i].tagType === consts.TAG_TYPE.Facility) {
                    clonnedTags[i].name = params.dummyFaciltyName;
                    clonnedTags[i].displayName = params.dummyFaciltyName;

                    //set user access
                    clonnedTags[i].usersWithAccess.push({
                        id: user._id
                    });

                    user.accessibleTags.push({
                        id : clonnedTags[i]._id,
                        tagType: clonnedTags[i].tagType
                    });

                } else if(clonnedTags[i].tagType === consts.TAG_TYPE.Scope) {
                    clonnedTags[i].name = "Dummy Scope - " + clonnedTags[i].name;
                    scopeIndex++;
                } else if(clonnedTags[i].tagType === consts.TAG_TYPE.Node) {
                    clonnedTags[i].name = "Dummy Node - " + clonnedTags[i].name;
                    nodeIndex++;
                }

                clonnedTags[i].fake = true;
            }

            cb(null, clonnedTags);
        },
        function(clonnedTags, cb) {
            async.each(clonnedTags, function(tag, next){
                var saveIns = new Tag(tag);
                saveIns.save(next);
            }, function(err) {
               if(err) {
                   cb(err);
               } else {
                   user.save(cb);
               }
            });
        }
    ], function(err, savedUser) {
        if (params.strictMode) {
            finalCallback(err, savedUser);
        } else {
            if(err) {
                utils.logError(err);
            }
            //send user object without error
            finalCallback(null, user);
        }
    });
}

/**
 * Create new User
 *
 * @param     Object, User object
 * @param     Boolean, createSFContact
 * @param     String, Account Id in salesforce
 * @param     Boolean, Status of approval in salesforce
 * @return    Object, User object or error
 */
function createUser(userObj, createSFContact, sfdcAccountId, startContactApproval, finalCallback) {
    //log.info("User Insert");

    delete userObj.password;//we will send set password email
    userObj.creationTime = new Date();
    var user = new User(userObj);

    var error = utils.appsValidator(user.apps);

    if(error) {
        finalCallback(error);
    } else if(user.role === consts.USER_ROLES.BP) {
        error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_REGISTER_BP);
        error.status = 422;
        finalCallback(error, null);
    } else if(user.accounts.length === 0) {
        error = new Error(consts.SERVER_ERRORS.ACCOUNT.INCORRECT_ACCOUNTS_IDS);
        error.status = 422;
        finalCallback(error, null);
    } else if (createSFContact && !sfdcAccountId) {
        error = new Error(consts.SERVER_ERRORS.ACCOUNT.UNKNOWN_SF_ACCOUNT);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function(callback) {
                accountDAO.getAccountByIdIfAllowed(user.accounts[0], function(err, account) {
                    if(err) {
                        callback(err);
                    } else if(_.difference(user.apps, account.apps).length > 0) {
                        error = new Error("Account does not have such apps");
                        error.status = 422;
                        return callback(error);
                    } else {
                        callback(null, consts.OK);
                    }
                });
            },
            function (status, callback) {
                if(createSFContact) {
                    if (!user.sfdcContactId) {
                        //create new SFDC Contact
                        sfdcContactUtils.createSFDCContact(user, sfdcAccountId, startContactApproval, callback);
                    } else {
                        sfdcContactUtils.checkSFContact(sfdcAccountId, user.sfdcContactId, callback);
                    }
                } else {
                    callback(null, user.sfdcContactId);
                }
            },
            function (sfdcContactId, callback) {
                user.sfdcContactId = sfdcContactId;
                passwordUtils.sendSetPasswordLink(user, callback);
            },
            function (userWithToken, callback) {
                userWithToken.save(callback);
            },
            function (savedUser, nEffected, callback) {
                tagBindingUtils.bindTags("User", savedUser._id, {"accessibleTags": savedUser.accessibleTags},
                    function (err, res) {
                        if (err) {
                            User.remove({_id: savedUser._id}, function (deleteErr) {
                                if (deleteErr) { utils.logError(deleteErr); }
                                callback(err);
                            });
                        } else {
                            createDummyFacility(savedUser, callback);
                            //callback(null, savedUser);
                        }
                    }
                );
            }
        ], function (err, savedUser) {
            if (err) {
                finalCallback(err, null);
            } else {
                getUserById(savedUser._id, finalCallback);
            }
        });
    }
}

/**
 * Create new BP User
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function createBP(userObj, finalCallback) {

    delete userObj.password;//we will send set password email
    userObj.creationTime = new Date();
    var user = new User(userObj);

    var error = utils.appsValidator(user.apps);

    if(error) {
        finalCallback(error);
    } else if(user.role !== consts.USER_ROLES.BP) {
        error = new Error(consts.SERVER_ERRORS.USER.REQUIRED_BP_ROLE);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                passwordUtils.sendSetPasswordLink(user, callback);
            },
            function (userWithToken, callback) {
                //userWithToken.save(callback);
                //set BP account
                accountDAO.findBPAccount(function (findBPAccountErr, foundBPAccount) {
                    if(findBPAccountErr) {
                        callback(findBPAccountErr);
                    }
                    else {
                        userWithToken.accounts = [];

                        if(foundBPAccount) {
                            userWithToken.accounts.push(foundBPAccount._id.toString());
                            //savedUser.save(finalCallback);
                            callback(null, userWithToken);
                        }
                        else {
                            accountDAO.createBPAccount(function (createBPAccountErr, createdBPAccount) {
                                userWithToken.accounts.push(new ObjectId(createdBPAccount._id));
                                callback(null, userWithToken);
                            });
                        }
                    }
                });
            },
            function(userWithAccount, callback) {
                sfdcContactUtils.connecteBPUserTOSFDC(userWithAccount, false, callback);
            },
            function (userWithAccount, callback) {
                userWithAccount.save(callback);
            }
        ], function (err, savedUser) {
            if(err) {
                finalCallback(err);
            }
            else {
                getUserById(savedUser._id, finalCallback);
            }
        });
    }
}

/**
 * Add user account
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function addUserAccount(user, account, callback) {
    User.update ({_id:user._id}, { $push: {accounts : account._id.toString()} }, function (updateErr, UpdateSuccess) {
        if(updateErr) {
            callback(updateErr);
        }
        else {
            getUserById(user._id, callback);
        }
    });
}

/**
 * Save user into User model
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function saveUser(userModelInstance, callback) {
    userModelInstance.save(function (saveUserErr, savedUser) {
        if (saveUserErr) {
            callback(saveUserErr, null);
        } else {
            callback(null, savedUser);
        }
    });
}

/**
 * Update User
 *
 * @param     Object, Current User object
 * @param     Object, User object
 * @return    Object, User object or error
 */
function editUser(currentUser, userObj, userId, finalCallback) {
    log.info("Update user");

    delete userObj.children;//don"t update  relationships
    delete userObj.parents;
    var error;

    var findParams = getUserQueryParamsByIdANDAccounts(userId, currentUser);

    //update and validate existing
    User.findOne(findParams, "+password +previousPasswords +tokens", function (findErr, findUser) {
        if (findErr) {
            finalCallback(findErr, null);
        } else {
            if (!findUser) {
                error = new Error(consts.SERVER_ERRORS.USER.USER_NOT_EXISTS + userId);
                error.status = 422;
                finalCallback(error, null);
            } else {

                if (findUser.role === consts.USER_ROLES.BP && currentUser &&
                    currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_EDIT_BP);
                    error.status = 403;
                    finalCallback(error, null);
                } else {
                    var paramsToChange = null;

                    if (findUser.role === consts.USER_ROLES.BP) {

                        var isEmailChanged = userObj.email && findUser.email !== userObj.email;

                        paramsToChange = Object.keys(userObj);

                        paramsToChange.forEach(function (param) {
                            findUser[param] = userObj[param];
                        });


                        findUser.accounts = [];

                        async.waterfall([
                            function (callback) {
                                if (isEmailChanged) {
                                    sfdcContactUtils.connecteBPUserTOSFDC(findUser, false, callback);
                                } else {
                                    callback(null, findUser);
                                }
                            },
                            function (userToSave, callback) {
                                saveUser(userToSave, callback);
                            },
                            function (savedUser, callback) {
                                //set BP account
                                accountDAO.findBPAccount(function (findBPAccountErr, foundBPAccount) {
                                    if (findBPAccountErr) {
                                        callback(findBPAccountErr);
                                    }
                                    else {
                                        savedUser.accounts = [];

                                        if (foundBPAccount) {
                                            callback(null, savedUser, foundBPAccount);
                                        }
                                        else {
                                            accountDAO.createBPAccount(
                                                function (createBPAccountErr, createdBPAccount) {
                                                    callback(null, savedUser, createdBPAccount);
                                                });
                                        }
                                    }
                                });
                            },
                            function (BPUser, BPAccount, callback) {
                                addUserAccount(BPUser, BPAccount, callback);
                            }
                        ], function (err, userWithAccount) {
                            if (err) {
                                finalCallback(err);
                            }
                            else {
                                finalCallback(null, userWithAccount);
                            }
                        });
                    }
                    else {

                        paramsToChange = Object.keys(userObj);

                        paramsToChange.forEach(function (param) {
                            findUser[param] = userObj[param];
                        });
                        saveUser(findUser, function (saveErr, savedUser) {
                            if (saveErr) {
                                finalCallback(saveErr, null);
                            } else {
                                getUserById(savedUser._id, finalCallback);
                            }
                        });
                    }
                }
            }
        }
    });
}

/**
 * Add user account
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function addUserAccount(user, account, callback) {
    User.update ({_id:user._id}, { $push: {accounts : account._id.toString()} }, function (updateErr, UpdateSuccess) {
        if(updateErr) {
            callback(updateErr);
        }
        else {
            getUserById(user._id, callback);
        }
    });
}

/**
 * Save user into User model
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function saveUser(userModelInstance, callback) {
    userModelInstance.save(function (saveUserErr, savedUser) {
        if (saveUserErr) {
            callback(saveUserErr, null);
        } else {
            callback(null, savedUser);
        }
    });
}

/**
 * Get User by Id
 *
 * @param     String, User Id
 * @return    Object, User object or error
 */
function getUserByIdIfAllowed(userId, currentUser, callback) {

    var findParams = null;

    if(!callback) {
        //current user is optional, so callback will be unefined and real callback will be currentUser object
        callback = currentUser;

        findParams = {_id: userId};
    } else {
        //we have currentUser object
        findParams = getUserQueryParamsByIdANDAccounts(userId, currentUser);
    }

    User.findOne(findParams)
        .exec(function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.USER.USER_NOT_EXISTS + userId);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

/**
 * Delete User by Id
 *
 * @param     Object, current user object
 * @param     String, User Id
 * @return    Object, User object or error
 */
function deleteUserById(currentUser, userId, callback) {

    var error;
    if(currentUser.role === consts.USER_ROLES.TM) {
        error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_DELETE_USERS);
        error.status = 422;
        return callback(error, null);
    } else {

        getUserByIdIfAllowed(userId, currentUser, function (findErr, findUser) {
            if (findErr) {
                callback(findErr, null);
            } else {
                if (findUser._id === userId) {
                    error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_DELETE_YOURSELF);
                    error.status = 422;
                    callback(error, null);
                } else if (findUser.role === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_DELETE_BP);
                    error.status = 422;
                    callback(error, null);
                } else {
                    if(findUser.accessibleTags && findUser.accessibleTags.length>0) {
                        tagBindingUtils.unbindTags("User", findUser._id.toString(), findUser.accessibleTags,
                            function(err, result) {
                                if(err) {
                                    callback(err);
                                } else {
                                    User.remove({_id: findUser._id}, function (deleteErr) {
                                        if (deleteErr) {
                                            callback(deleteErr, null);
                                        } else {
                                            callback(null, consts.OK);
                                        }
                                    });
                                }
                            });
                    }
                    else {
                        User.remove({_id: findUser._id}, function (deleteErr) {
                            if (deleteErr) {
                                callback(deleteErr, null);
                            } else {
                                callback(null, consts.OK);
                            }
                        });
                    }
                }
            }
        });
    }
}

/**
 * Find Users by name
 *
 * @param     Object, current user object
 * @param     String, search text
 * @param     Int, limit of result rows
 * @return    Array, users array
 */
function getUsersByName(currentUser, findNameMask, limit, callback) {
    var params = {};

    if(findNameMask) {
        //params.name = new RegExp(findNameMask, "i");
        params.$or =  [
            { firstName: new RegExp(findNameMask, "i") },
            { middleName: new RegExp(findNameMask, "i") },
            { lastName: new RegExp(findNameMask, "i") }
        ];
    }

    if(currentUser.role !== consts.USER_ROLES.BP) {

        //var userSensors = currentUser.sensors;
        params.accounts = { $in: currentUser.accounts};
    }

    if(params.$or && params.accounts) {
        params = {$and: [{$or: params.$or}, {accounts: params.accounts}]};
    }

    var q = User.find(params);

    if(limit) {
        q.limit(limit);
    }

    q.exec(function(findErr, findUsers) {
        if(findErr) {
            callback(findErr, null);
        } else {
            callback(null, findUsers);
        }
    });
}

/**
 * Get Admins all
 *
 * @param     Int, limit of result rows
 * @return    Array, array of admin users
 */
function getAdmins(user, limit, callback) {
    var params = null;

    if(user.role === consts.USER_ROLES.BP) {
        params = {role: consts.USER_ROLES.Admin};
    } else {
        params= {$and: [
            {role: consts.USER_ROLES.Admin},
            {
                accounts: { $in: user.accounts}
            }
        ]};
    }

    var q = User.find(params);

    if(limit) {
        q.limit(limit);
    }

    q.exec(function(findErr, findUsers) {
        if(findErr) {
            callback(findErr, null);
        } else {
            callback(null, findUsers);
        }
    });
}

/**
 * Get BPs all
 *
 * @param     Int, limit of result rows
 * @return    Array, array of admin users
 */
function getBPs(limit, callback) {
    var params = null;

    params = {role: consts.USER_ROLES.BP};
    
    var q = User.find(params);

    if(limit) {
        q.limit(limit);
    }

    q.exec(function(findErr, findUsers) {
        if(findErr) {
            callback(findErr, null);
        } else {
            callback(null, findUsers);
        }
    });
}

/**
 * Find Users by params
 *
 * @param     Object, search param
 * @return    Array, users array
 */
function getUsersByParams(params, callback) {
    User.find(params)
        .exec(function (err, findUsers) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, findUsers);
            }
        });
}

function delUser(user, cb) {
    User.remove({_id: user._id}, function (deleteErr) {
        if (deleteErr) {
            deleteErr.user = user;
            utils.logError(deleteErr);
        }
        //process deleting for other users, send null error
        cb(null, consts.OK);
    });
}

/**
 * Delete multiple users with matched account Id
 *
 * @param     {array} accountIds
 * @param     {function} finalCallback
 * @return    void
 */
function deleteUsersByAccountId(accountIds, finalCallback) {

    getUsersByParams({accounts: { $in: accountIds}}, function(findUserErr, foundUsers) {

        if(findUserErr) {
            finalCallback(findUserErr);
        } else if(foundUsers.length > 0) {

            //unbind tags for each user
            async.each(foundUsers, function(user, cb) {

                if (user.accessibleTags && user.accessibleTags.length > 0) {
                    tagBindingUtils.unbindTags("User", user._id.toString(), user.accessibleTags,
                        function (unbindTagsErr, result) {
                            if (unbindTagsErr) {
                                unbindTagsErr.user = user;
                                utils.logError(unbindTagsErr);
                                cb(null, consts.OK);//process deleting for other users, send null error
                            } else {
                                delUser(user, cb);
                            }
                        });
                }
                else {
                    delUser(user, cb);
                }
            }, function(deleteAllUsersErr) {
                if(deleteAllUsersErr) {
                    finalCallback(deleteAllUsersErr);
                } else {
                    finalCallback(null, consts.OK);
                }
            });
        } else {
            finalCallback(null, consts.OK);
        }
    });
}

/**
 * Get apps of current user
 *
 * @param     Object, current user object
 * @return    Array, apps array
 */
function getApplications(currentUser, callback) {
    var allapps = utils.getDefaultApps();
    if(currentUser.role === consts.USER_ROLES.BP) {
        callback(null, allapps);
    } else {
        var userapps = currentUser.apps;
        for(var appName in allapps) {
            if(userapps.indexOf(appName) < 0) {
                delete allapps[appName];
            }
        }

        callback(null, allapps);
    }
}

/**
 * Add Tag to User sc>>>>>>> 0c89c3e1291e7ea0e3b387531839f0d259f4f5b5
 ma and userWithAccess to Tag schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     Object, Tag object
 * @return    Object, User object or error
 */
function addTag(currentUser, foundUser, tag, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    if (utils.childExistsInParent(tag, foundUser.accessibleTags)) {
        callback(null, consts.OK);
    } else {
        if (!foundUser.accessibleTags) {
            foundUser.accessibleTags = [];
        }
        foundUser.accessibleTags.push(tag);
        async.parallel([
                function(cb) {
                    tagBindingUtils.bindTags("User", foundUser._id,
                        {"accessibleTags": {"id": tag.id, "tagType": tag.tagType}}, cb);
                },
                function(cb) {
                    saveUser(foundUser, cb);
                }
            ],
            function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results[1]);
                }
            });
    }
}

/**
 * Add Tags to User schema and userWithAccess to Tag schema into empty accessibleTags
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     Object, Tag object
 * @return    Object, User object or error
 */
function addTags(currentUser, foundUser, tags, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    foundUser.accessibleTags = tags;

    async.parallel([
        function(cb) {
            tagBindingUtils.bindTags("User", foundUser._id, {"accessibleTags": tags}, cb);
        },
        function(cb) {
            saveUser(foundUser, cb);
        }
    ],
    function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

/**
 * Remove Tag from User Schema and userWithAccess from Tag Schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     String, Tag Id
 * @return    Object, User object or error
 */
function removeTag(currentUser, foundUser, tagId, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var i = 0;
    foundUser.accessibleTags.forEach(function (iteratorObj) {
        if (iteratorObj.id.toString() === tagId.toString()) {
            foundUser.accessibleTags.splice(i, 1);
        }
        i++;
    });
    async.parallel([
            function (cb) {
                tagBindingUtils.unbindTags("User", foundUser._id, [
                    {"id": tagId}
                ], cb);
            },
            function (cb) {
                saveUser(foundUser, cb);
            }
        ],
        function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[1]);
            }
        });
}

/**
 * Remove Tags All from User Schema and userWithAccess from Tag Schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @return    Object, User object or error
 */
function removeTagsAll(currentUser, foundUser, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var accessibleTags = foundUser.accessibleTags;

    async.parallel([
        function (cb) {
            tagBindingUtils.unbindTags("User", foundUser._id, accessibleTags, cb);
        },
        function (cb) {
            saveUser(foundUser, cb);
        }
    ],
    function (err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

/**
 * Remove Tag from Users and userWithAccess from Tag Schema
 *
 * @param     Object, Tag object
 * @param     Array, array of user Id
 * @return    Array, array of user object or error
 */
function removeTagFromAllUsersWithAccess(tagObject, userIdsArray, finalCallback) {
    async.each(userIdsArray, function(userId, callback) {
        User.update(
            {_id: new ObjectId(userId)},
            {$pull: {accessibleTags: tagObject}}).exec(callback);
    }, function(updateError, updateResult) {
        if (updateError) {
            finalCallback(updateError, null);
        } else {
            finalCallback(null, updateResult);
        }
    });
}

/**
 * Get Tags of User with full hierarchy
 *
 * @param     Object, User object
 * @param     Object, Pager object with limit and offset fields
 * @param     Object, Filter
 * @return    Array, array of tags object with full hierarchy
 */
function getUserTagsFullHierarchy(findUser, pager, filter, finalCallback) {
    if (!finalCallback) {
        finalCallback = filter;
        filter = null;
        pager = {limit: null, offset: null};
    }

    if (findUser.role === consts.USER_ROLES.BP) {
        tagDAO.getAllTagsFullHierarchy(pager, filter, function (tagsErr, tagsTreeArray) {
            if (tagsErr) {
                finalCallback(tagsErr);
            } else {
                var thisTags = {};
                thisTags[findUser._id.toString()] = tagsTreeArray;
                finalCallback(null, thisTags);
            }
        });
    } else {
        if (findUser.accessibleTags && findUser.accessibleTags.length > 0) {
            var entityIds = [findUser._id.toString()];
            tagDAO.getTagsFullHierarchyByEntityIds(consts.USER_WITH_ACCESS_TYPE.USER, entityIds,
                null, filter, true, pager,
                function (tagsErr, tagsFullHierarchy) {
                    if(tagsErr) {
                        finalCallback(tagsErr);
                    } else {
                        finalCallback(null, tagsFullHierarchy);
                    }
                });
        } else {
            var thisTags = {};
            thisTags[findUser._id.toString()] = [];
            finalCallback(null, thisTags);
        }
    }
}

function findNodesByFacility(tag, parentTagName, parentTagTZ,
                             facilitiesStorage, scopeObj, geoObject, allowedNodeTypes, resultObject) {

    if (tag.latitude && tag.longitude) {
        if(!geoObject.latitude || !geoObject.longitude) {
            geoObject.latitude = tag.latitude;
            geoObject.longitude = tag.longitude;
        }

        facilitiesStorage.latitude = tag.latitude;
        facilitiesStorage.longitude = tag.longitude;
    }

    if (tag.installCity && !geoObject.city) {
        geoObject.city = tag.installCity;
    }

    if (tag.timezone && !geoObject.timeZone) {
        geoObject.timeZone = tag.timezone;
        geoObject.zoneOffset = utils.getOffsetByTimeZone(geoObject.timeZone);
        log.silly("timezone = " + geoObject.timeZone +
            ", zoneOffest = " + geoObject.zoneOffset);
    }

    var i = 0;

    // disabled until discussion about egauge devices in RES
    // var iseGauge = tag.manufacturer === "eGauge";

    // disabled until discussion about egauge devices in RES
    //if (tag.tagType === consts.TAG_TYPE.Scope && !iseGauge) {
    if (tag.tagType === consts.TAG_TYPE.Scope) {
        scopeObj = {
            id: tag._id.toString(),
            name: tag.name,
            displayName: tag.displayName,
            potentialPower: 0,
            dateTimeFormat: tag.dateTimeFormat,
            nodes: [],
            selected: true,
            commissioningDate: tag.commissioningDate || null
        };

        facilitiesStorage.commissioningDate = scopeObj.commissioningDate; //copy from scope to facility

        if (tag.childTags) {
            for (i = 0; i < tag.childTags.length; i++) {
                findNodesByFacility(tag.childTags[i], tag.displayName || tag.name, tag.timezone,
                    facilitiesStorage, scopeObj, geoObject, allowedNodeTypes, resultObject);
            }

            if (scopeObj.nodes.length > 0) {
                facilitiesStorage.scopes.push(scopeObj);
            }
        }
    // disabled until discussion about egauge devices in RES
    //} else if (tag.tagType === consts.TAG_TYPE.Node && allowedNodeTypes.indexOf(tag.nodeType) >-1 && !iseGauge) {
    } else if (tag.tagType === consts.TAG_TYPE.Node && allowedNodeTypes.indexOf(tag.nodeType) >-1) {
        var nodeObj = {
            id: tag._id.toString(),
            name: tag.name,
            displayName: tag.displayName,
            scopeName: parentTagName,
            nodeId: tag.deviceID,
            nodeType: tag.nodeType,
            rate: 0,
            deviceTimeZone: parentTagTZ,
            powerMetricId: null,
            electricDemandMetricId: "ED",
            tempMetricID: null,
            selected: true,
            commissioningDate: scopeObj.commissioningDate,//copy from scopem
            isActive: tag.isActive
        };

        if (tag.potentialPower) {
            facilitiesStorage.potentialPower += tag.potentialPower;
            scopeObj.potentialPower += tag.potentialPower;
        }

        facilitiesStorage.nodesCount++;

        for(i=0; i < tag.childTags.length; i++) {

            if(nodeObj.rate && nodeObj.powerMetricId) {
                break;
            }

            if(tag.childTags[i].tagType === consts.TAG_TYPE.Metric &&
                tag.childTags[i].name === consts.METRIC_NAMES.Reimbursement) {
                nodeObj.rate = tag.childTags[i].rate;
            }

            if(tag.childTags[i].tagType === consts.TAG_TYPE.Metric &&
                tag.childTags[i].name === consts.METRIC_NAMES.kW) {
                nodeObj.powerMetricId = tag.childTags[i].metricID;
            }

            if(tag.childTags[i].tagType === consts.TAG_TYPE.Metric &&
                tag.childTags[i].name === consts.METRIC_NAMES.Temperature) {
                nodeObj.tempMetricID = tag.childTags[i].metricID;
            }
        }

        scopeObj.nodes.push(nodeObj);

        /*if(nodeObj.nodeType === consts.NODE_TYPE.Thermostat) {
            resultObject.thermostatList.push(nodeObj);
        }*/

    } else if (tag.childTags) {
        for (i = 0; i < tag.childTags.length; i++) {
            findNodesByFacility(tag.childTags[i], tag.displayName || tag.name, tag.timezone,
                facilitiesStorage, scopeObj, geoObject, allowedNodeTypes, resultObject);
        }
    }
}

function setSourceSelection(source, selectedSources, allowEmptySelection, isFacilitySelected) {
    if(allowEmptySelection) {
        //scope and node, can be selected if :
        //facility is selected and a)selected sources is empty or b)not empty and source id is added in list
        var len = selectedSources.length;
        source.selected = isFacilitySelected?
            (len === 0 || (len > 0 && selectedSources.indexOf(source.id) >= 0)) : false;
    } else {
        //facility can be selected, only if added in selectd sources
        source.selected = selectedSources.indexOf(source.id) >= 0;
    }
}

function setUserSelectedSources(result, cachedSources) {
    var maxSelected = 3;
    var currentlySelected =0;
    var maxNodes = 3;
    var i=0, j= 0, k=0;

    if(!cachedSources) {
        //user didn't select sources, use default flow

        if (result.facilities.length > maxSelected) {
            //if more than 5 facilities, first 5 will be selected by default
            for (i = 0; i < result.facilities.length; i++) {

                var isBrightergyFacility = result.facilities[i].name.toLowerCase().indexOf("brightergy") >= 0;

                if ((currentlySelected < maxSelected && result.facilities[i].nodesCount <= maxNodes) ||
                    isBrightergyFacility) {
                    currentlySelected++;
                    //result.facilities[i].selected = true;
                } else {
                    result.facilities[i].selected = false;

                    for(j=0; j < result.facilities[i].scopes.length; j++) {

                        result.facilities[i].scopes[j].selected = false;

                        for (k=0; k < result.facilities[i].scopes[j].nodes.length; k++) {

                            result.facilities[i].scopes[j].nodes[k].selected = false;
                        }
                    }
                }
            }
        }
    } else {
        for (i = 0; i < result.facilities.length; i++) {

            setSourceSelection(
                result.facilities[i],
                cachedSources.selectedFacilities,
                false,
                null
            );

            for(j=0; j < result.facilities[i].scopes.length; j++) {

                setSourceSelection(
                    result.facilities[i].scopes[j],
                    cachedSources.selectedScopes,
                    true,
                    result.facilities[i].selected
                );

                for (k=0; k < result.facilities[i].scopes[j].nodes.length; k++) {

                    setSourceSelection(
                        result.facilities[i].scopes[j].nodes[k],
                        cachedSources.selectedNodes,
                        true,
                        result.facilities[i].selected
                    );
                }
            }
        }

        if(cachedSources.selectedThermostats && cachedSources.selectedThermostats.length > 0) {
            for (i = 0; i < result.thermostatList.length; i++) {
                result.thermostatList[i].selected =
                    cachedSources.selectedThermostats.indexOf(result.thermostatList[i].id) >= 0;
            }
        }
    }
}

function filterNodes(result) {
    for (var i = 0; i < result.facilities.length; i++) {
        for (var j = 0; j < result.facilities[i].scopes.length; j++) {
            var nodesLen = result.facilities[i].scopes[j].nodes.length;
            if (nodesLen > 0) {
                for (var k = nodesLen -1; k >= 0; k--) {
                    var node = result.facilities[i].scopes[j].nodes[k];
                    var isActive = node.isActive;
                    if (!isActive) {
                        result.facilities[i].scopes[j].nodes.splice(k, 1);
                        result.facilities[i].nodesCount--;
                    } else if(node.nodeType === consts.NODE_TYPE.Thermostat && node.selected) {
                        result.thermostatList.push(node);
                    }
                }
            }
        }
    }
}

function getUserTagsByNodeType(user, allowedNodeTypes, userCachedSourcesKey, finalCallback) {
    cacheHelper.getCachedElementData(userCachedSourcesKey, null, function(cacheErr, cachedSources) {
        if(cacheErr) {
            return finalCallback(cacheErr);
        }

        getUserTagsFullHierarchy(user, null, function(err, foundTags) {
            if (err) {
                finalCallback(err);
            } else {
                var result = {
                    facilities: [],
                    thermostatList: []
                };

                var tags = foundTags[user._id.toString()];
                var i=0;
                for(i=0; i < tags.length; i++) {
                    if(tags[i].tagType === consts.TAG_TYPE.Facility) {

                        var tag = tags[i];
                        log.debug("tag.name = " + tag.name + ", tag.city = " + tag.installCity);

                        var billIntv = (tag.billingInterval) ? tag.billingInterval : 30;

                        var geo = {};
                        if (tag.latitude) {
                            geo.latitude = tag.latitude;
                        }
                        if (tag.longitude) {
                            geo.longitude = tag.longitude;
                        }
                        if (tag.installCity) {
                            geo.city = tag.installCity;
                        }

                        var obj = {
                            id: tag._id.toString(),
                            name: tag.name,
                            displayName: tag.displayName,
                            scopes: [],
                            potentialPower: 0,
                            address: tag.address,
                            installAddress: tag.installAddress,
                            // do we need them now?
                            latitude: null,
                            longitude: null,
                            selected: true,
                            geo: geo,
                            nodesCount: 0,
                            billingInterval: billIntv,
                            image: tag.image,
                            commissioningDate: null,
                            constEmissionFactor: tag.constEmissionFactor
                        };

                        findNodesByFacility(tag, tag.displayName || tag.name, tag.timezone,
                            obj, null, geo, allowedNodeTypes, result);

                        log.debug("name: " + obj.name + ", resulting geoObject: " + JSON.stringify(obj.geo));

                        if(obj.scopes.length > 0) {
                            //facility has solar nodes
                            result.facilities.push(obj);
                        }
                    }
                }


                setUserSelectedSources(result, cachedSources);
                var isEMS = allowedNodeTypes.indexOf(consts.NODE_TYPE.Supply) > -1;
                if(isEMS) {
                    filterNodes(result);
                }

                // the geo object will be the object of first selected facility
                var firstGeoObject = _.chain(result.facilities).
                    filter("selected").
                    filter("geo").
                    first().
                    value();

                if(firstGeoObject) {
                    result.geo = firstGeoObject.geo;
                } else {
                    result.geo = {};
                }

                if(!result.geo.latitude || !result.geo.longitude) {
                    result.geo.latitude = 39.083672;
                    result.geo.longitude = -94.58940699999999;
                }

                result.cachedSources = cachedSources;

                log.debug("geo = " + JSON.stringify(result.geo));

                finalCallback(null, result);
            }
        });

    });
}

/**
 * Get Tags of User with full hierarchy
 *
 * @param     Object, User object
 * @return    Array, array of tags object with full hierarchy
 */
function addTagToAccessibleArray(findUser, tagObject, finalCallback){
    User.update({_id: new ObjectId(findUser._id.toString())},
        {$push: {accessibleTags: tagObject}})
        .exec(function (err, updatedUser) {
            if (err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, updatedUser);
            }
        });
}
// -------------------------------------------------------------------------------------

function setCorrectSFDCIdByLead(leadId, contactId, callback) {
    var sfLeadId = "Lead" + leadId;
    getUsersByParams({
        $or: [
            {sfdcContactId: leadId},
            {sfdcContactId: sfLeadId}
        ]
    }, function(err, foundUsers) {
        if(err) {
            callback(err);
        } else if(foundUsers.length > 0) {
            foundUsers[0].sfdcContactId = contactId;
            foundUsers[0].save(callback);
        } else {
            callback(null);
        }

    });
}

function getUserBySessionId(sessionId, callback) {
    var sessionsCollection = mongoose.connection.db.collection("sessions");

    async.waterfall([
        function(cb) {
            sessionsCollection.findOne({_id:sessionId}, cb);
        }, function(foundSession, cb) {
            if(!foundSession) {
                var incorrectSessionErr = new Error(consts.SERVER_ERRORS.USER.INCORRECT_SESSION);
                incorrectSessionErr.status = 403;
                cb(incorrectSessionErr, null);
            } else {
                var sessionField = JSON.parse(foundSession.session);
                var userId = sessionField.userId;
                cb(null, userId);
            }
        }, function(userId, cb) {
            getUserByIdIfAllowed(userId, cb);
        }
    ], function (err, user) {
        if(err) {
            callback(err);
        } else {
            callback(null, user);
        }
    });
}


function getUserSolarTags(user, finalCallback) {
    var cacheKey = consts.WEBSOCKET_EVENTS.ASSURF.SelectedSources + user._id.toString();
    getUserTagsByNodeType(user, [consts.NODE_TYPE.Solar], cacheKey, finalCallback);
}


function getUserSolarTagsCompressed(user, finalCallback) {
    async.waterfall([
        function(next) {
            getUserSolarTags(user, next);
        },
        function(result, next) {
            utils.compressAndEncodeBase64(JSON.stringify(result), next);
        }
    ],
    function(err, result) {
        finalCallback(err, result);
    });
}


function getUserDemandAndSupplyTags(user, finalCallback) {
    var cacheKey = consts.WEBSOCKET_EVENTS.EMS.SelectedSources + user._id.toString();
    getUserTagsByNodeType(user, [
        consts.NODE_TYPE.Supply,
        consts.NODE_TYPE.Demand,
        consts.NODE_TYPE.Thermostat
    ], cacheKey, finalCallback);
}

/**
 * Create new Demo User
 *
 * @param     Object, User data
 * @return    Object, User object or error
 */
function createDemoUser(userData, finalCallback) {
    var userObj = {};
    userObj.creationTime = new Date();
    var demoPassword = config.get("demobox:user:password");
    var error;

    async.waterfall([
        function (callback) {
            if (!userData.email) {
                error = new Error("Email is required to create a demo user.");
                error.status = 422;
                callback(error);
            } else if (!validationUtils.isValidEmail(userData.email.trim())) {
                error = new Error("Please enter valid email address.");
                error.status = 422;
                callback(error);
            } else if (consts.ALLOWED_USER_ROLES.indexOf(userData.role.trim()) < 0) {
                error = new Error("Please specify valid user role.");
                error.status = 422;
                callback(error);
            } else {
                callback(null);
            }            
        }, function (callback) {
            var parsedEmail = utils.parseEmail(userData.email);
            userObj.email = parsedEmail[0];
            userObj.emailUser = parsedEmail[1];
            userObj.emailDomain = parsedEmail[2];

            userObj.firstName = config.get("demobox:user:firstname");
            userObj.lastName = config.get("demobox:user:lastname");
            userObj.password = demoPassword;
            userObj.role = userData.role.trim();
            userObj.apps = _.clone(consts.ALLOWED_APPS);

            callback(null, userObj);
        }, function (userObj, callback) {
            accountDAO.findDemoAccount(function (findDemoAccountErr, foundDemoAccount) {
                if(findDemoAccountErr) {
                    callback(findDemoAccountErr);
                }
                else {
                    userObj.accounts = [];

                    if(foundDemoAccount) {
                        userObj.accounts.push(new ObjectId(foundDemoAccount._id));
                        callback(null, userObj);
                    }
                    else {
                        accountDAO.createDemoAccount(function (createDemoAccountErr, createdDemoAccount) {
                            if (createDemoAccountErr) {
                                callback(createDemoAccountErr);
                            } else {
                                userObj.accounts.push(new ObjectId(createdDemoAccount._id));
                                callback(null, userObj);
                            }
                        });
                    }
                }
            });
        }, function (userObj, callback) {
            var user = new User(userObj);
            user.save(callback);
        }, function (savedUser, nEffected, callback) {
            var params = {
                searchFaciltyName: "Barretts Elementary",
                dummyFaciltyName: "Dummy Facility 1 for Demo " + savedUser.email,
                strictMode: true
            };
            createDummyFacility(savedUser, params, callback);
        }, function (savedUser, callback) {
            var params = {
                searchFaciltyName: "Brightergy 6th Floor",
                dummyFaciltyName: "Dummy Facility 2 for Demo " + savedUser.email,
                strictMode: true
            };
            createDummyFacility(savedUser, params, callback);
        }
    ], function (err, savedUser) {
        if (err) {
            finalCallback(err, null);
        } else {
            // getUserById(savedUser._id, finalCallback);
            var result = {
                email: savedUser.email,
                password: demoPassword,
                demoLoginUrl: utils.getDomain(false) + config.get("demobox:user:loginpath")
            };
            finalCallback(null, result);
        }
    });

}

function addUserApplications(userId, apps, currentUser, callback) {
    getUserByIdIfAllowed(userId, currentUser, function(getUserErr, user) {
        if(getUserErr) {
            return callback(getUserErr);
        }

        var error = null;
        if(currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
            error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS);
            error.status = 422;
            return callback(error);
        }

        accountDAO.getAccountByIdIfAllowed(user.accounts[0], currentUser, function(getAccErr, account) {
           if(getAccErr) {
               return callback(getAccErr);
           } else {
               var diff = _.difference(apps, account.apps);
               if(diff.length > 0) {
                   error = new Error("Account does not have such apps");
                   error.status = 422;
                   return callback(error);
               }

               user.apps = _.union(user.apps, apps);
               var validateErrors = utils.appsValidator(user.apps);
               if(validateErrors) {
                   return callback(validateErrors);
               }

               user.save(callback);
           }
        });
    });
}

function removeUserApplications(userId, apps, currentUser, callback) {
    getUserByIdIfAllowed(userId, currentUser, function(getUserErr, user) {
        if(getUserErr) {
            return callback(getUserErr);
        }

        var error = null;
        if(currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
            error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS);
            error.status = 422;
            return callback(error);
        }

        user.apps = _.difference(user.apps, apps);
        var validateErrors = utils.appsValidator(user.apps);
        if(validateErrors) {
            return callback(validateErrors);
        }

        user.save(callback);
    });
}



exports.createBP = createBP;
exports.getUsersByParams = getUsersByParams;
exports.deleteUserById = deleteUserById;
exports.getAdmins = getAdmins;
exports.getBPs = getBPs;
exports.validate = validate;
exports.getUserByToken = getUserByToken;
exports.getUserBySocialToken = getUserBySocialToken;
exports.getUserByIdIfAllowed = getUserByIdIfAllowed;
exports.getUserByEmail = getUserByEmail;
exports.getUsersByName = getUsersByName;
exports.editUser = editUser;
exports.saveUser = saveUser;
exports.createUser = createUser;
exports.getApplications = getApplications;
exports.addTag = addTag;
exports.addTags = addTags;
exports.removeTag = removeTag;
exports.removeTagsAll = removeTagsAll;
exports.removeTagFromAllUsersWithAccess = removeTagFromAllUsersWithAccess;
exports.getUserTagsFullHierarchy = getUserTagsFullHierarchy;
exports.addTagToAccessibleArray = addTagToAccessibleArray;
exports.addUserAccount = addUserAccount;
exports.deleteUsersByAccountId = deleteUsersByAccountId;
exports.setCorrectSFDCIdByLead = setCorrectSFDCIdByLead;
exports.getUserBySessionId = getUserBySessionId;
exports.getUserSolarTags = getUserSolarTags;
exports.getUserSolarTagsCompressed = getUserSolarTagsCompressed;
exports.findNodesByFacility = findNodesByFacility;
exports.getUserDemandAndSupplyTags = getUserDemandAndSupplyTags;
exports._setUserSelectedSources  = setUserSelectedSources;
exports.createDemoUser = createDemoUser;
exports.addUserApplications = addUserApplications;
exports.removeUserApplications = removeUserApplications;
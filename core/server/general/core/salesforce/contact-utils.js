"use strict";

// TODO:: moved to auth-service

var config = require("../../../../config/environment"),
    consts = require("../../../libs/consts"),
    cache = require("../../../libs/cache"),
    _ = require("lodash"),
    authUtils = require("./auth"),
    userDAO = require("../dao/user-dao");

/**
 * Function converts bl user to SFDC Contact object
 * @access private
 * @param {object} contactObj
 * @param {string} accountId for contact
 * @returns {object}
 */
function convertContactToSFDC(contactObj, accountId) {
    var sfdcCon = {
        attributes: {
            type:"Contact"
        },
        FirstName: contactObj.firstName,
        LastName: contactObj.lastName,
        Email: contactObj.email,
        AccountId: accountId
    };

    if(contactObj.phone) {
        sfdcCon.Phone = contactObj.phone;
    }

    return sfdcCon;
}

/**
 * Function creates new SFDC Contact
 * @access public
 * @param {object} contactObj
 * @param {string} accountId for contact
 * @param {boolean} startContactApproval
 * @param {function} callback
 * @returns {void}
 */
function createSFDCContact(contactObj, accountId, startContactApproval, callback) {

    var authData = authUtils.getSFAuthData();
    var con = authUtils.getSFConnection();

    con.login(authData.username, authData.password, function (err, userInfo) {
        if (err) {
            callback(err, null);
        } else {

            var sfdcCon = convertContactToSFDC(contactObj, accountId);

            var body = {
                approval: startContactApproval,
                contact: sfdcCon
            };

            con.apex.post(config.get("salesforce:contacturl"), body, function (createContactErr, loadedData) {
                if (createContactErr) {
                    callback(createContactErr, null);
                } else {
                    callback(null, loadedData);
                }
            });
        }
    });
}

//sfdc Contact should be associated with parent sfdc Account
function checkSFContact(sfdcAccountId, sfdcContactId, callback) {
    cache.get("sfdcaccounts", function(redisErr, accountsStr) {
        if(redisErr) {
            callback(redisErr, null);
        } else {
            var error;
            if(accountsStr) {
                var accounts = JSON.parse(accountsStr);
                var findAccounts = _.filter(accounts, function(account) {
                    return account.accountId === sfdcAccountId;
                });

                if(findAccounts.length === 0) {
                    error = new Error(consts.SERVER_ERRORS.ACCOUNTINCORRECT_SF_ACCOUNT_ID);
                    error.status = 422;
                    callback(error, null);
                } else {
                    var findContacts = _.filter(findAccounts.contacts, function(contact) {
                        return contact.contactId === sfdcContactId;
                    });

                    if(findContacts.length === 0) {
                        error = new Error(consts.SERVER_ERRORS.ACCOUNT.SF_CONTACT_ASSOCIATED_WITH_DIFFERENT_SF_ACCOUNT);
                        error.status = 422;
                        callback(error, null);
                    } else {
                        callback(null, sfdcContactId);
                    }
                }
            } else {
                error = new Error(consts.SERVER_ERRORS.GENERAL.UNKNOWN_KEY);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

/**
 * Function finds SFDC Users with the same email and adds user Id it to BP user
 * @access public
 * @param {object} user
 * @param {boolean} isSaveUser - save user in db or not
 * @param {function} callback
 * @returns {void}
 */
function connecteBPUserTOSFDC(user, isSaveUser, callback) {
    if(user.role !== consts.USER_ROLES.BP) {
        var error = new Error(consts.SERVER_ERRORS.USER.REQUIRED_BP_ROLE);
        error.status = 422;
        callback(error);
    } else {

        var authData = authUtils.getSFAuthData();
        var con = authUtils.getSFConnection();

        con.login(authData.username, authData.password, function (err, userInfo) {
            if (err) {
                callback(err, null);
            } else {

                con.sobject("User")
                    .select("*")
                    .where({
                        Email : user.email
                    })
                    .limit(1)
                    .execute(function(findErr, records) {
                        if(findErr) {
                            callback(findErr, null);
                        } else {
                            if(records.length > 0) {
                                user.sfdcContactId = records[0].Id;
                            }

                            if(user.sfdcContactId && isSaveUser) {
                                userDAO.saveUser(user, callback);
                            } else {
                                callback(null, user);
                            }
                        }

                    });
            }
        });
    }
}

exports.checkSFContact = checkSFContact;
exports.createSFDCContact = createSFDCContact;
exports.connecteBPUserTOSFDC = connecteBPUserTOSFDC;

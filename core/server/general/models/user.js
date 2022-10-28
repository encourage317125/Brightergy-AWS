"use strict";

// TODO:: moved to core-service

var bcrypt = require("bcryptjs"),
    config = require("../../../config/environment"),
    consts = require("../../libs/consts"),
    mongoose = require("mongoose"),
    //_ = require("lodash"),
    //postFind = require("mongoose-post-find"),
    //utils = require("../../libs/utils"),
    //Account = mongoose.model("account"),
    uniqueValidator = require("mongoose-unique-validator"),
    Schema = mongoose.Schema;

module.exports = function() {

    var userSchema = new Schema({
        firstName: { type: String, required: true, trim: true},
        lastName: { type: String, required: true, trim: true},
        middleName: { type: String, default: "", trim: true},
        phone: { type: String, default: null, trim: true},
        email: { type: String, required: true, unique: true, lowercase: true, trim: true},
        emailUser: { type: String, required: true, lowercase: true, trim: true},
        emailDomain: { type: String, required: true, lowercase: true, trim: true},
        password: { type: String, default: null, select: false},
        socialToken: {type: String, default: null, trim: true},
        enphaseUserId: {type: String, default: null, trim: true},
        tokens: { type: Array, default: [], select: false},
        role: {type: String, default: null, enum: consts.ALLOWED_USER_ROLES},
        lastEditedPresentation: {type: Schema.Types.ObjectId, ref: "bv_presentation", default: null},
        previousEditedPresentation: {type: Schema.Types.ObjectId, ref: "bv_presentation", default: null},
        lastEditedDashboardId: {type: Schema.Types.ObjectId, ref: "ds_dashboard", default: null},
        previousEditedDashboardId: {type: Schema.Types.ObjectId, ref: "ds_dashboard", default: null},
        previousPasswords: { type: Array, default: [], select: false},
        apps: { type: Array, default: []},
        defaultApp: { type: String, default: null},
        sfdcContactId: {type: String, default: null},
        profilePictureUrl: {type: String, default: null},
        energyCapUserName: { type: String, default: null, trim: true},
        energyCapPassword: { type: String, default: null},
        energyCapDataSource: { type: String, default: null, trim: true},

        /*
        parents: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tag: { type: String, required: false, trim: true},
            tagType: { type: String, required: false, trim: true}
        }],
        children: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tag: { type: String, required: false, trim: true},
            tagType: { type: String, required: false, trim: true}
        }],
        */

        accessibleTags: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, ref:"tag", required: true},
            tagType: { type: String, required: false, trim: true, enum: consts.TAG_TYPES}
        }],

        collections: [{
            _id: false,
            text: { type: String, default: null},
            dashboards: { type: Array, default: []}
        }],

        accounts: [{type: Schema.Types.ObjectId, ref: "account", default: null}],

        creationTime: {type: Date, default: Date.now}
    });

    userSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    userSchema.path("defaultApp").validate(function (defaultApp, respond) {
        if(!defaultApp) {
            respond(true);
        } else {
            respond(consts.ALLOWED_APPS.indexOf(defaultApp) >= 0);
        }
    }, consts.SERVER_ERRORS.USER.NOT_ALLOWED_DEFAULT_APP);

    /*userSchema.path("sensors").validate(function (sensors, respond) {
        var user = this;
        var isCorrect = false;
        if(user.role === consts.USER_ROLES.BP) {
            isCorrect = true;
        } else {
            isCorrect = sensors && sensors.length > 0 && !utils.hasDuplicateItems(sensors);
        }

        if(!isCorrect) {
            respond(false);
        } else {
            //check ids
            Sensor.find({_id: { $in: sensors }}, function(err, doc) {
                if (err || !doc) {
                    respond(false);
                } else {
                    respond(doc.length === sensors.length);
                }
            });
        }
    }, consts.INCORRECT_SENSORS_IDS)*/

    /*
    userSchema.path("accounts").validate(function (accounts, respond) {
        var user = this;
        var isCorrect = false;
        if(user.role === consts.USER_ROLES.BP) {
            isCorrect = true;
        } else {
            isCorrect = accounts && accounts.length > 0 && !utils.hasDuplicateItems(accounts);
        }

        if(!isCorrect) {
            respond(false);
        } else {
            if(user.role === consts.USER_ROLES.BP) {
                //check ids and BPaccount
                Account.find({_id: { $in: accounts }, name: consts.BP_ACCOUNT_NAME }, function(err, doc) {
                    if (err || !doc) {
                        respond(false);
                    } else {
                        respond(doc.length === accounts.length);
                    }
                });
            }
            else {
                //check ids
                Account.find({_id: { $in: accounts }}, function(err, doc) {
                    if (err || !doc) {
                        respond(false);
                    } else {
                        respond(doc.length === accounts.length);
                    }
                });
            }
        }
    }, consts.INCORRECT_ACCOUNTS_IDS)
    */

//save previous user role

    userSchema.path("role").set(function (newValue) {
        this.previousRole = this.role;
        return newValue;
    });


//store old value of password
    userSchema.path("password").set(function (newValue) {
        //console.log("set password");
        //console.log("password: "+ this.password)
        //console.log("previousPassword: "+ this.previousPassword)
        this.previousPassword = this.password;
        return newValue;
    });

    userSchema.methods.getSalt = function (callback) {
        //console.log("prev pass:" + this.previousPassword);
        if (!this.previousPassword) {
            //console.log("generate new salt")
            //user added first password, so generate new salt
            bcrypt.genSalt(10, function (saltErr, salt) {
                if (saltErr) {
                    callback(saltErr, null);
                } else {
                    callback(null, salt);
                }
            });
        } else {
            //console.log("use existing salt")
            callback(null, bcrypt.getSalt(this.previousPassword));
        }
    };

    userSchema.methods.isNewPassword = function (newHashedPassword) {
        //console.log("this hash:"+ newHashedPassword);
        //console.log("previousPasswords:"+ this.previousPasswords);
        for (var i = 0; i < this.previousPasswords.length; i++) {
            if (newHashedPassword === this.previousPasswords[i]) {
                return false;
            }
        }

        return true;
    };

    userSchema.pre("save", function (next) {

        //console.log("pre save")

        var user = this;
        var error;

        //user.markModified("tokens");

        if (user.previousRole && (user.role !== user.previousRole)) {
            error = new Error(consts.SERVER_ERRORS.USER.CAN_NOT_CHANGE_USER_ROLE);
            error.status = 422;
            return next(error);
        } else {

            //BP will have access to all data sources, so don't need manually specify data sources
            if(user.role === consts.USER_ROLES.BP) {
                //user.accounts = [];
                user.apps = [];
            }

            if (user.isModified("password")) {

                //console.log("modified pass")

                user.getSalt(function (saltErr, salt) {
                    if (saltErr) {
                        return next(saltErr);
                    } else {
                        //console.log("salt: "+ salt)
                        //console.log("password: "+ user.password)
                        bcrypt.hash(user.password, salt, function (hashErr, hash) {
                            if (hashErr) {
                                return next(hashErr);
                            } else {
                                //console.log("hashed");
                                if (user.isNewPassword(hash)) {
                                    // override the cleartext password with the hashed one
                                    user.password = hash;
                                    user.previousPasswords.push(hash);
                                    return next();
                                } else {
                                    error = new Error(consts.SERVER_ERRORS.USER.PASSWORD_HAS_BEEN_USED);
                                    error.status = 422;
                                    return next(error);
                                }
                            }
                        });
                    }
                });
            } else {
                return next();
            }
        }
    });

    userSchema.methods.checkPassword = function (candidatePassword, callback) {
        //return this.encryptPassword(rawPassword) === this.hashedPassword;
        if(this.password && candidatePassword) {
            bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null, isMatch);
                }
            });
        } else {
            callback(null, false);
        }
    };

    userSchema.set("toJSON", { virtuals: true });
    userSchema.set("toObject", { virtuals: true });

    userSchema
        .virtual("sfdcContactURL")
        .get(function () {
            if(this.sfdcContactId) {
                return config.get("salesforce:auth:url") + "/" + this.sfdcContactId.replace("Lead", "");
            } else {
                return null;
            }
        });

    userSchema
        .virtual("name")
        .get(function () {
            if(this.middleName) {
                return this.firstName + " " + this.middleName + " " + this.lastName;
            } else {
                return this.firstName + " " + this.lastName;
            }
        });

    mongoose.model("user", userSchema);
    //module.exports = User;
};

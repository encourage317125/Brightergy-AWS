"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var facilitySchema = new Schema({
        name: {type: String, required: true},
        city: {type: String, default: null, trim: true},
        country: {type: String, default: null, trim: true},
        postalCode: {type: String, default: null, trim: true},
        state: {type: String, default: null, trim: true},
        street: {type: String, default: null, trim: true},

        taxID: {type: String, default: null, trim: true},
        nonProfit: {type: Boolean, default: null, trim: true},
        utilityProvider: {type: String, default: null, trim: true},
        utilityAccounts: { type: Array, default: []},

        billingInterval: {type: Number, default: 30},


        creatorRole: {type: String, required: true},
        dataLoggers: [{type: Schema.Types.ObjectId, ref: "dataLogger", default: null}]
    });

    //facilitySchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    facilitySchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    facilitySchema.pre("save", function (next) {

        //console.log("pre save")

        var obj = this;
        if (obj.previousCreatorRole && (obj.creatorRole !== obj.previousCreatorRole)) {
            var error = new Error(consts.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });

    mongoose.model("facility", facilitySchema);
};
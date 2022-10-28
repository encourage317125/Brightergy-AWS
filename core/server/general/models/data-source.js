"use strict";

// TODO:: moved to core-service

var //config = require("../../../config/environment"),
    mongoose = require("mongoose"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    utils = require("../../libs/utils"),
    Schema = mongoose.Schema;

module.exports = function() {
    var dataSourceSchema = new Schema({
        name: {type: String, required: true},
        dataSourceType: {type: String, required: true, enum: consts.DATA_SOURCE_TYPES},

        //facility
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

        //datalogger
        manufacturer : {type: String, default: null, trim: true},
        device : {type: String, default: null, trim: true},
        deviceID : {type: String, default: null, trim: true},
        accessMethod : {type: String, default: null, trim: true},
        destination : {type: String, default: null, trim: true},
        interval : {type: String, default: null, trim: true},
        webAddress : {type: String, default: null, trim: true},
        latitude: {type: Number, default: null},
        longitude: {type: Number, default: null},
        weatherStation : {type: String, default: null, trim: true},
        endDate: { type: Date, default: null},
        enphaseUserId: {type: String, default: null, trim: true},

        //sensor
        sensorTarget : {type: String, default: null, trim: true},

        //metric
        metric: {type: String, default: null, trim: true},
        metricType: {type: String, default: null, trim: true},
        summaryMethod: {type: String, enum: consts.SUMMARY_METHOD_TYPES},

        metricID: {type: String, default: null, trim: true},
        formula: {type: String, default: null, trim: true},

        parents: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tag: { type: String, required: true, trim: true}
        }],
        children: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tag: { type: String, required: true, trim: true}
        }],
        /*
        appEntities: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            appName: { type: String, required: true, trim: true}
        }],
        usersWithAccess: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, ref: "user", required: true}
        }],
        */

        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true}
    });

    //dataSourceSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    dataSourceSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    dataSourceSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    dataSourceSchema.path("dataSourceType").set(function (newValue) {
        this.previousDataSourceType = this.dataSourceType;
        return newValue;
    });

    dataSourceSchema.path("latitude").set(function (newValue) {
        this.previousLatitude = this.latitude;
        return newValue;
    });

    dataSourceSchema.path("longitude").set(function (newValue) {
        this.previousLongitude = this.longitude;
        return newValue;
    });

    dataSourceSchema.pre("save", function (next) {
        var obj = this;
        var error;

        if (utils.isCreratorRoleChanged(obj)) {
            error = new Error(consts.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else if (utils.isCreatorChanged(obj)) {
            error = new Error(consts.CAN_NOT_CHANGE_CREATOR);
            error.status = 422;
            return next(error);
        } else if(obj.previousDataSourceType && (obj.dataSourceType !== obj.previousDataSourceType)) {
            error = new Error(consts.CAN_NOT_CHANGE_DATA_SOURCE_TYPE);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });

    mongoose.model("datasource", dataSourceSchema);
};
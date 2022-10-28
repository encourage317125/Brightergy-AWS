"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    utils = require("../../libs/utils"),
    Schema = mongoose.Schema;

module.exports = function() {
    var tagSchema = new Schema({
        name: {type: String, required: true},
        tagType: {type: String, required: true, enum: consts.TAG_TYPES},

        // name chosen by the client
        displayName: {type: String},

        //facility
        region: {type: String, default: null, trim: true},
        continent: {type: String, default: null, trim: true},
        city: {type: String, default: null, trim: true},
        country: {type: String, default: null, trim: true},
        postalCode: {type: String, default: null, trim: true},
        state: {type: String, default: null, trim: true},
        street: {type: String, default: null, trim: true},
        address: {type: String, default: null, trim: true},

        taxID: {type: String, default: null, trim: true},
        nonProfit: {type: Boolean, default: null, trim: true},
        utilityProvider: {type: String, default: null, trim: true},
        utilityAccounts: { type: Array, default: []},

        billingInterval: {type: Number, default: 30},
        image: {type: String, default: null, trim: true},
        constEmissionFactor: {type: Number, default: null, min: 0},

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
        timezone: {type: String, default: null, trim: true},
        dateTimeFormat: {type: String, default: null, trim: true},
        username: {type: String, default: null, trim: true},
        password: {type: String, default: null, trim: true},
        //sensor
        sensorTarget : {type: String, default: null, trim: true},

        //metric
        rate: {type: Number, default: null},
        metric: {type: String, default: null, trim: true},
        metricType: {type: String, default: null, trim: true},
        metricID: {type: String, default: null, trim: true},
        formula: {type: String, default: null, trim: true},
        summaryMethod: {type: String, default: null, trim: true},
        datacoreMetricID: {type: String, default: null, trim: true},
        externalId: {type: String, default: null, trim: true},

        parents: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tagType: { type: String, required: true, trim: true}
        }],
        children: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tagType: { type: String, required: true, trim: true}
        }],
        appEntities: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            appName: { type: String, required: true, trim: true}
        }],
        usersWithAccess: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, ref: "user", required: true}
        }],

        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true},
        bpLock: {type: Boolean, default:false, trim: true},
        nodeType: {type: String, default: null, trim: true},
        potentialPower: {type: Number, default: null, trim: true},
        commissioningDate: { type: Date, default: null},

        deviceSoftware: [{
            _id:false,
            bucketName: { type: String, required: true, trim: true},
            version: { type: String, required: true, trim: true},
            uploadedDate: { type: Date, default: null}
        }],

        fake: {type: Boolean, default:false},

        installCity: {type: String, default: null, trim: true},
        installCountry: {type: String, default: null, trim: true},
        installPostalCode: {type: String, default: null, trim: true},
        installState: {type: String, default: null, trim: true},
        installStreet: {type: String, default: null, trim: true},
        installAddress: {type: String, default: null, trim: true},

        creationTime: {type: Date, default: Date.now},
        isActive: {type: Boolean, default:true},
        hasAuth: {type: Boolean, default:false}
    });

    //tagSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    tagSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    tagSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    tagSchema.path("tagType").set(function (newValue) {
        this.previousTagType = this.tagType;
        return newValue;
    });

    /*tagSchema.path("latitude").set(function (newValue) {
        this.previousLatitude = this.latitude;
        return newValue;
    });

    tagSchema.path("longitude").set(function (newValue) {
        this.previousLongitude = this.longitude;
        return newValue;
    });*/

    tagSchema.pre("save", function (next) {
        var obj = this;
        var error;

        if (utils.isCreratorRoleChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else if (utils.isCreatorChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR);
            error.status = 422;
            return next(error);
        } else if(obj.previousTagType && (obj.tagType !== obj.previousTagType)) {
            error = new Error(consts.SERVER_ERRORS.TAG.CAN_NOT_CHANGE_TAG_TYPE);
            error.status = 422;
            return next(error);
        } else if(obj.tagType === consts.TAG_TYPE.Metric &&
            consts.ALLOWED_METRICS_SUMMARY_METHODS.indexOf(obj.summaryMethod) < 0) {
            error = new Error(consts.SERVER_ERRORS.TAG.REQUIRED_METRIC_SUMMARY_METHOD);
            error.status = 422;
            return next(error);
        } else if(obj.dateTimeFormat && consts.ALLOWED_DATE_TIME_FORMAT.indexOf(obj.dateTimeFormat) < 0) {
            return next(new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_DATE_TIME_FORMAT));
        } else if(obj.tagType === consts.TAG_TYPE.Node && obj.nodeType &&
            consts.NODE_TYPES.indexOf(obj.nodeType) < 0) {
            error = new Error(consts.SERVER_ERRORS.TAG.NOT_ALLOWED_NODE_TYPE);
            error.status = 422;
            return next(error);
        } else if(obj.tagType === consts.TAG_TYPE.Scope && obj.hasAuth && (!obj.username || !obj.password)) {
            error = new Error("Scope uses auth. Please input username and password");
            error.status = 422;
            return next(error);
        } else {
            return next();
        } /*else {
            var Tag = mongoose.model("tag");
            Tag.find({$and: [
                {tagType: obj.tagType},
                {deviceID: obj.deviceID}
            ]}, function (err, tags) {
                if(err) {
                    return next(err);
                } else if(obj.deviceID && tags.length > 0 && tags[0]._id.toString() !== obj._id.toString()) {
                    error = new Error("Device Id must be unique");
                    error.status = 422;
                    return next(error);
                } else if(utils.isGeoDataChanged(obj)) {
                    utils.checkGeoData(obj, next);
                } else {
                    return next();
                }
            });
        }*/
    });

    mongoose.model("tag", tagSchema);
};

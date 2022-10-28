"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var sensorSchema = new Schema({
        name: {type: String, required: true},
        manufacturer : {type: String, required: true, trim: true},
        device : {type: String, required: true, trim: true},
        deviceID : {type: String, required: true, trim: true},
        sensorTarget : {type: String, required: true, trim: true},
        interval : {type: String, required: true, trim: true},
        Latitude: {type: Number, required: true},
        Longitude: {type: Number, required: true},
        weatherStation : {type: String, required: true, trim: true},
        metrics: [{type: Schema.Types.ObjectId, ref: "metric", default: null}],
        creatorRole: {type: String, required: true}
    });

    //facilitySchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    sensorSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    sensorSchema.path("Latitude").set(function (newValue) {
        this.previousLatitude = this.Latitude;
        return newValue;
    });

    sensorSchema.path("Longitude").set(function (newValue) {
        this.previousLongitude = this.Longitude;
        return newValue;
    });

    sensorSchema.pre("save", function (next) {

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

    mongoose.model("sensor", sensorSchema);
};
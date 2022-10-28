"use strict";

// TODO:: moved to core-service

var //config = require("../../../config/environment"),
    mongoose = require("mongoose"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var dataLoggerSchema = new Schema({
        name: {type: String, required: true},
        manufacturer : {type: String, required: true, trim: true},
        device : {type: String, required: true, trim: true},
        deviceID : {type: String, required: true, trim: true},
        accessMethod : {type: String, required: true, trim: true},
        destination : {type: String, default: null, trim: true},
        interval : {type: String, required: true, trim: true},
        webAddress : {type: String, default: null, trim: true},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        weatherStation : {type: String, required: true, trim: true},
        creatorRole: {type: String, required: true},
        endDate: { type: Date, default: null},
        enphaseUserId: {type: String, default: null, trim: true},

        sensors: [{type: Schema.Types.ObjectId, ref: "sensor", default: null}]
    });

    //facilitySchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    dataLoggerSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    dataLoggerSchema.pre("save", function (next) {

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

    mongoose.model("dataLogger", dataLoggerSchema);
};

"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var metricSchema = new Schema({
        metric: {type: String, required: true, trim: true},
        metricType: {type: String, required: true, trim: true},
        metricName: {type: String, default: null, trim: true},
        metricID: {type: String, default: null, trim: true},
        formula: {type: String, default: null, trim: true},

        creatorRole: {type: String, required: true}
    });

    //metricSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    metricSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    metricSchema.pre("save", function (next) {

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

    mongoose.model("metric", metricSchema);
};
"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var demouserSchema = new Schema({
        email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    	role: {type: String, enum: consts.ALLOWED_USER_ROLES},
        creationTime: {type: Date, default: Date.now}
    });
    
    mongoose.model("demouser", demouserSchema);
};
"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateGatewaySoftwareSchema = new Schema({
    	dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        status: {type: String, required: true, trim: true},
        softwareVersion : {type: String, required: true, trim: true},
        upgradeTime : {type: Date, required: true}
    });
    
    mongoose.model("gatewaySoftware", tagStateGatewaySoftwareSchema, "tagstates");
};
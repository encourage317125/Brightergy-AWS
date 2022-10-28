"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateDigiEndListSchema = new Schema({
    	dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        GEM: [{
            _id:false,
            "mac_address": { type: String, required: true, trim: true}
        }],
        Thermostat: [{
            _id:false,
            "mac_address": { type: String, required: true, trim: true}
        }]
    });
    
    mongoose.model("digiEndList", tagStateDigiEndListSchema, "tagstates");
};
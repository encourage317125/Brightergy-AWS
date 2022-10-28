"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateDigiEventLogSchema = new Schema({
    	dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        logUrl: {type: String, required: true, trim: true},
        uploadTime: {type: String, default: null, trim: true}
    });
    
    mongoose.model("digiEventLog", tagStateDigiEventLogSchema, "tagstates");
};
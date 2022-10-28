"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStatePresentDeviceLogcatLinkSchema = new Schema({
    	dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        link: {type: String, default: null, trim: true},
        uploadTime: {type: String, default: null}
    });
    
    mongoose.model("presentDeviceLogcatLink", tagStatePresentDeviceLogcatLinkSchema, "tagstates");
};
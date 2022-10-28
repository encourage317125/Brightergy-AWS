"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateDigiConfigSchema = new Schema({
        dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        PANID: {type: String, required: true, trim: true},
        NJ_TIME: {type: Number, default: null},
        DATA_REPORT_INTERVAL: {type: Number, default: null}
    });
    
    mongoose.model("digiConfig", tagStateDigiConfigSchema, "tagstates");
};
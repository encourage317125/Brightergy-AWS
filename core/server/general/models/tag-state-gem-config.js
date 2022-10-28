"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateGemConfigSchema = new Schema({
        dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        ctChannelsType: {type: String, required: true, trim: true},
        primaryPacketFormat : {type: Number, required: true},
        packetSendInterval : {type: Number, required: true},
        realtimeReporting : {type: Boolean, required: true}
    });
    
    mongoose.model("gemConfig", tagStateGemConfigSchema, "tagstates");
};
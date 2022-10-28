"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStateGatewayNetworkSchema = new Schema({
    	dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        networkState: {type: String, required: true, trim: true},
    });
    
    mongoose.model("gatewayNetwork", tagStateGatewayNetworkSchema, "tagstates");
};
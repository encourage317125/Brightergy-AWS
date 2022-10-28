"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    //consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var defaultMappingSchema = new Schema({
        type: {type: String, required: true, trim: true},
        target: {type: String, required: true, trim: true},
        formula: {type: Schema.Types.Mixed, required: true}
    });

    mongoose.model("defaultMapping", defaultMappingSchema);
};
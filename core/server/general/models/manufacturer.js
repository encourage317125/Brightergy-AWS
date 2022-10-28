"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    //consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var manufacturerSchema = new Schema({
        name: { type: String, required: true}
    });

    mongoose.model("manufacturer", manufacturerSchema);
};
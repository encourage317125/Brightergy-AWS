"use strict";

var mongoose = require("mongoose"),
    AvailableWidget = mongoose.model("bv_availableWidget");

function getAvailableWidgets(callback) {
    AvailableWidget.find({}).lean().exec(function(err, obj) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, obj);
        }
    });
}

exports.getAvailableWidgets = getAvailableWidgets;
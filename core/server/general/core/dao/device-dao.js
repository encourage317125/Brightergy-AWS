"use strict";

var mongoose = require("mongoose"),
	Device = mongoose.model("device");

function getDevices(limit, callback) {

    var q = Device.find({});
    if(limit) {
        q.limit(limit);
    }

    q.lean().exec(function(err, manufacturer) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, manufacturer);
        }
    });
}

exports.getDevices = getDevices;
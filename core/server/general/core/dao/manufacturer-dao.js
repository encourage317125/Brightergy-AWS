"use strict";

var mongoose = require("mongoose"),
	Manufacturer = mongoose.model("manufacturer");

function getManufacturers(limit, callback) {

    var q = Manufacturer.find({});
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

exports.getManufacturers = getManufacturers;
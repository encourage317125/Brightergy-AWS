"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Manufacture = mongoose.model("manufacturer"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertManufactures(finalCallback) {

    Manufacture.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var manufactures = [];
                    manufactures.push({
                        "_id" : new ObjectId("5421ab08885c2846dcce9d3d"),
                        "name" : "Enphase"
                    });
                    manufactures.push({
                        "_id" : new ObjectId("5458a5b9885c2846dcce9db2"),
                        "name" : "SMA"
                    });
                    manufactures.push({
                        "_id" : new ObjectId("5458a5d7885c2846dcce9db3"),
                        "name" : "eGauge"
                    });
                    manufactures.push({
                        "_id" : new ObjectId("5458a5d7885c2846dcce9db4"),
                        "name" : "Digi"
                    });
                    manufactures.push({
                        "_id" : new ObjectId("5458a5d7885c2846dcce9db5"),
                        "name" : "Brultech"
                    });
                    manufactures.push({
                        "_id" : new ObjectId("5458a5d7885c2846dcce9db6"),
                        "name" : "Centralite"
                    });
                    async.each(manufactures, function (manufacture, saveCallback) {
                        var ManufacturesModel = new Manufacture(manufacture);
                        ManufacturesModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertManufactures = insertManufactures;
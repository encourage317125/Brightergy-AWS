"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    async = require("async"),
    utils = require("../libs/utils");

function processItems(collectionName, callback) {

    var collection = mongoose.connection.db.collection(collectionName);

    collection.update({},
        { $unset: {
            sourceFacilities: "",
            sourceDataLoggers: "",
            sourceSensors: "",
            sourceMetrics: ""
        },
        $set: {
            children: [],
            parents: []
        }},
        { multi: true },
        callback
    );
}

function processDSWidgets(callback) {
    var collection = mongoose.connection.db.collection("ds_widgets");

    collection.update({},
        {
            $set: {
                metric: null,
                compareMetric: null,
                equivType: null
            }},
        { multi: true },
        callback
    );
}

function updateSchemaTagging() {
    mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

        async.parallel([
            function (callback) {
                processItems("bv_presentations", callback);
            },
            function (callback) {
                processItems("users", callback);
            },
            function (callback) {
                processItems("ds_dashboards", callback);
            },
            function (callback) {
                processDSWidgets(callback);
            }
        ], function (err, result) {
            if (err) {
                utils.logError(err);
            } else {
                console.log("Completed");
                console.log(result);
            }

            process.exit();

        });
    });
}

exports.updateSchemaTagging = updateSchemaTagging;
"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../../config/environment"),
    consts = require("../../libs/consts"),
    log = require("../../libs/log")(module),
    async = require("async"),
    utils = require("../../libs/utils"),
    insertAccouts = require("./insert-accounts"),
    insertBVAvailablewidgets = require("./insert-bv-available-widgets"),
    insertPresentations = require("./insert-presentations"),
    insertBVWidgets = require("./insert-bv-widgets"),
    insertDevices = require("./insert-devices"),
    insertDashboards = require("./insert-dashboards"),
    insertDSWidgets = require("./insert-ds-widgets"),
    insertUsers = require("./insert-users"),
    insertTags = require("./insert-tags"),
    insertManufactures = require("./insert-manufactures"),
    insertTagRules = require("./insert-tag-rules"),
    insertGroups = require("./insert-groups"),
    insertPresentDeviceLogs = require("./insert-present-device-logs"),
    insertPresentDevices = require("./insert-present-devices"),
    insertAllParents = require("../insert-tag-all-parents"),
    insertMetricFields = require("../insert-metric-parent-fields");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

    async.waterfall([
        function (callback) {
            insertTagRules.insertTagRules(callback);
        },
        function (result, callback) {
            insertAccouts.insertAccouts(callback);
        },
        function (result, callback) {
            insertBVAvailablewidgets.insertBVAvailablewidgets(callback);
        },
        function (result, callback) {
            insertPresentations.insertPresentations(callback);
        },
        function (result, callback) {
            insertBVWidgets.insertBVWidgets(callback);
        },
        function (result, callback) {
            insertDevices.insertDevices(callback);
        },
        function (result, callback) {
            insertDashboards.insertDashboards(callback);
        },
        function (result, callback) {
            insertUsers.insertUsers(callback);
        },
        function (result, callback) {
            insertTags.insertTags(callback);
        },
        function (result, callback) {
            insertDSWidgets.insertDSWidgets(callback);
        },
        function (result, callback) {
            insertManufactures.insertManufactures(callback);
        },
        function (result, callback) {
            insertGroups.insertGroups(callback);
        },
        function (result, callback) {
            insertPresentDevices.insertPresentDevices(callback);
        },
        function (result, callback) {
            insertPresentDeviceLogs.insertPresentDeviceLogs(callback);
        },
        function (result, callback) {
            insertAllParents.insertALLTagParents(callback);
        },
        function (result, callback) {
            insertMetricFields.insertMetricFieldsFromParents(callback);
        },
        function (result, callback) {
            var collectionNames = ["sessions"];

            async.each(collectionNames, function(collectionName, collsCallback) {
                var collection = mongoose.connection.db.collection(collectionName);
                if (collection) {
                    collection.remove(collsCallback);
                } else {
                    collsCallback(null, consts.OK);
                }
            }, function(removeErr) {
                if(removeErr) {
                    callback(removeErr, null);
                } else {
                    callback(null, consts.OK);
                }
            });
        }
    ],
    function (err, result) {
        if(err) {
            utils.logError(err);
        } else {
            log.info("[Your DB \"BrighterLink\" is now ready with test collections!!!]");
        }
        process.exit();
    });
});

"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    argv = require("minimist")(process.argv.slice(2)),
    tempodbWrapper = require("../general/core/tempodb/tempodb-wrapper"),
    userDA0 = require("../general/core/dao/user-dao"),
    facilityDAO = require("../general/core/dao/facility-dao"),
    dataLoggerDAO = require("../general/core/dao/data-logger-dao"),
    sensorDAO = require("../general/core/dao/sensor-dao"),
    metricDAO = require("../general/core/dao/metric-dao"),
    _ = require("lodash"),
    log = require("../libs/log")(module),
    async = require("async"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"));

if(!argv.facilityid || !argv.webbox) {
    log.error("Please add keys");
    process.exit();
} else {
    async.waterfall([
        function (callback) {
            //"wb150165937"
            tempodbWrapper.getSensorsByDevice(argv.webbox, "Pac", callback);
        },
        function (tempodbResult, callback) {
            var inverters = _.map(tempodbResult, function (series) {
                return series.attributes.Sensor;
            });

            callback(null, inverters);
        },
        function (inverters, callback) {
            if(inverters.length === 0) {
                callback(new Error("Inverters does not exists for webbox:" + argv.webbox));
            } else {
                callback(null, inverters);
            }
        },
        function(inverters, callback) {
            facilityDAO.getFacilityById(argv.facilityid, function(findFacilityErr, findFacility) {
                if(findFacilityErr) {
                    callback(findFacilityErr);
                } else {
                    callback(null, findFacility, inverters);
                }
            });
        },
        function(findFacility, inverters, callback) {
            userDA0.getUsersByParams({role: consts.USER_ROLES.BP}, function(findUserErr, findUsers) {
                if(findUserErr) {
                    callback(findUserErr);
                } else {
                    if(findUsers.length === 0 ) {
                        callback(new Error("BP required"));
                    } else {
                        callback(null, findUsers[0], findFacility, inverters);
                    }
                }
            });
        },
        function (currentUser, findFacility, inverters, callback) {
            var dataLoggerA = {
                name: "DataLogger_Script",
                "manufacturer": "manufacturerA",
                "device": "Sunny WebBox",
                "deviceID": argv.webbox,
                "accessMethod": "Push to FTP",
                "interval": "Daily",
                "latitude": 94.1234,
                "longitude": -36.5678,
                "weatherStation": "--Use NOAA--",
                "webAddress": "http://google.com",
                "destination": "127.0.0.1"
            };
            dataLoggerDAO.saveDataLogger(dataLoggerA, currentUser, function (saveErr, savedDataLogger) {
                if(saveErr) {
                    callback(saveErr);
                } else {
                    callback(null, currentUser, findFacility, savedDataLogger, inverters);
                }
            });
        },
        function(currentUser, findFacility, savedDataLogger, inverters, callback) {
            dataLoggerDAO.addDataLoggersToFacility(findFacility._id, [savedDataLogger._id], 
                function (relationshipErr, result) {
                    if(relationshipErr) {
                        callback(relationshipErr);
                    } else {
                        callback(null, currentUser, savedDataLogger, inverters);
                    }
            });
        },
        function (currentUser, savedDataLogger, inverters, callback) {
            var sensors = [];
            for (var i=0; i < inverters.length; i++) {
                var sensor = {
                    name: "Sensor_script_" + i,
                    "manufacturer": "manufacturerA",
                    "device": "Sunny WebBox",
                    "deviceID": inverters[i],
                    "sensorTarget": "sss",
                    "interval": "Daily",
                    "Latitude": 94.1234,
                    "Longitude": -36.5678,
                    "weatherStation": "--Use NOAA--",
                    "creatorRole": "BP"
                };

                sensors.push(sensor);
            }

            async.map(sensors, function(sensor, callback) {
                sensorDAO.saveSensor(sensor, currentUser, function (saveErr, savedSensor) {
                    if(saveErr) {
                        callback(saveErr);
                    } else {
                        callback(null, savedSensor);
                    }

                });
            }, function(err, savedSensors){
                if(err) {
                    callback(err, null);
                } else {
                    //console.log("savedSensors:" + savedSensors.length)
                    callback(null, currentUser, savedDataLogger, savedSensors);
                }
            });
        },

        function (currentUser, savedDataLogger, savedSensors, callback) {

            var sensorIds = _.map(savedSensors, function(sensor) {
                return sensor._id.toString();
            });

            sensorDAO.addSensorsToDataLogger(savedDataLogger._id, sensorIds, function (relationshipErr, result) {
                if(relationshipErr) {
                    callback(relationshipErr);
                } else {
                    callback(null, currentUser, savedSensors);
                }
            });

        },
        function (currentUser, savedSensors, callback) {
            var metricObj = {
                metricID: "Pac",
                metricName: "Watts (Power)",
                metric: "Standard",
                metricType: "Datafeed"
            };

            async.map(savedSensors, function(sensor, callback) {
                metricDAO.createMetric(metricObj, currentUser, function (saveErr, savedMetric) {
                    if(saveErr) {
                        callback(saveErr);
                    } else {

                        metricDAO.addMetricsToSensor(sensor._id, [savedMetric._id], function (relationshipErr, result) {
                            if(relationshipErr) {
                                callback(relationshipErr, null);
                            } else {
                                callback(null, consts.OK);
                            }

                        });
                    }

                });
            }, function(err, result){
                if(err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });

        }
    ], function (err, result) {
        if (err) {
            var correctErr = utils.convertError(err);
            log.error(correctErr);
        } else {
            log.info(result);
        }

        process.exit();
    });
}
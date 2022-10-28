"use strict";

// TODO:: should be deleted

var log = require("../../../libs/log")(module),
    config = require("../../../../config/environment"),
    moment = require("moment"),
    tempoiq = require("tempoiq"),
    utils = require("../../../libs/utils"),
    _ = require("lodash"),
    //os = require("os"),
    //cpus = os.cpus(),
    client = new tempoiq.Client(config.get("tempoiq:apikey"),
        config.get("tempoiq:apisecret"),
        config.get("tempoiq:host")
    ),
    profiling = require("../../../libs/profiling")("tempoiqQueries"),
    consts = require("../../../libs/consts");

/*function profilingCPU(logTitle) {
    var type;

    console.log(logTitle);

    for (var i=0, len = cpus.length; i < len; i++) {
        console.log('CPU %s:',i);
        var cpu = cpus[i], total = 0;

        for (type in cpu.times) {
            total += cpu.times[type];
        }

        for (type in cpu.times) {
            console.log("\t", type, Math.round(100 * cpu.times[type] / total));
        }
    }
}*/

/**
 * Function writes data to tempoiq
 * @access public
 * @param {object} dataPoints
 * @param {function} callback
 * @returns {void}
 */
function writeMultiDataPoints(dataPoints, callback) {
    if(_.size(dataPoints) > 0) {

        client.writeBulk(dataPoints, function (err, result) {
            if (err) {
                log.error("WRITING DATA POINTS AGAIN. ERROR: %s", err.message);
                /*//even if writing failed, we need try write other data points, so pass null to callback
                 if (fileName) {
                 log.error("file: %s", fileName);
                 console.log(dataPoints)
                 }
                 utils.logError(err);
                 */
                writeMultiDataPoints(dataPoints, callback);

            } else {
                //console.log("DATA POINTS WRITED");
                dataPoints = null;
                callback(null);
            }
        });
    } else {
        callback(null);
    }
}

/**
 * Function writes data to tempoiq only onetime
 * @access public
 * @param {object} dataPoints
 * @param {function} callback
 * @returns {void}
 */
function writeDataPoints(dataPoints, callback) {
    if(_.size(dataPoints) > 0) {

        client.writeBulk(dataPoints, function (err, result) {
            if (err) {
                log.error("WRITING DATA POINTS ERROR: %s", err.message);
                callback(err);
            } else {
                console.log("DATA POINTS WRITED FROM UPLOADED DATA");

                var returnObj = {
                    "dataPoints": dataPoints,
                    "result" : result
                };

                dataPoints = null;
                callback(null, returnObj);
            }
        });
    } else {
        callback(null);
    }
}

/**
 * Function creates new device in tempoiq
 * @access public
 * @param {object} device
 * @param {array} existing device names
 * @param {function} callback
 * @returns {void}
 */
function createDevice(device, globalDevicesNames, callback) {

    var found = globalDevicesNames.indexOf(device.key) > -1;

    if(!found) {
        client.createDevice(device, function (err, result) {
            if (err) {
                if(err.message.indexOf("A device with that key already exists") < 0) {
                    err.deviceToCreate = device;
                    utils.logError(err);
                } else {
                    //log.info("DEVICE_ALREADY_CREATED: " + device.key);
                    if(globalDevicesNames.indexOf(device.key) < 0) {
                        globalDevicesNames.push(device.key);
                    }
                }
            } else {
                //log.info("CREATED DEVICE:" + device.key);
                globalDevicesNames.push(device.key);
            }
            callback(null);
        });
    } else {
        callback(null);
    }
}

function shiftTempoiqData(tempoIQData, offset) {
    for(var i=0; i < tempoIQData.length; i++) {
        tempoIQData[i].ts = moment.utc(tempoIQData[i].ts);
        //var thisDay = tempoIQData[i].ts.date();
        tempoIQData[i].ts.add(offset, "m");

        //if(tempoIQData[i].ts.date() < thisDay) {
            ////shifted date has next month, that is wrong, shift back
            //tempoIQData[i].ts.subtract(offset, "m");
        //}
    }
}

/**
 * Function reads data from tempoiq
 * @access private
 * @param {string} startDateStr
 * @param {string} endDateStr
 * @param {object} selection
 * @param {object} pipeline
 * @param {function} callback
 * @returns {void}
 */
function readMulti(startDateStr, endDateStr, selection, pipeline, options, callback) {

    var tempoiqQueryParameters = options.query;
    if(!tempoiqQueryParameters) {
        tempoiqQueryParameters = {};
    }
    var filterData = tempoiqQueryParameters.limit !== null && !_.isUndefined(tempoiqQueryParameters.limit);

    tempoiqQueryParameters.streamed = true;

    if (pipeline && pipeline.functions) {
        for (var i=0; i < pipeline.functions.length; i++) {
            if(pipeline.functions[i].arguments.length < 3) {
                pipeline.functions[i].arguments.push(startDateStr);
            }
        }
    }

    /*if(pipeline && pipeline.functions && pipeline.functions.length === 0) {
        pipeline = null;
    }*/

    if (config.get("tempoiq:log:query")) {
        var profileId = profiling.generateId();
        profiling.start(profileId);
    }

    client.read(selection, startDateStr, endDateStr, pipeline,  tempoiqQueryParameters, function (cursor) {

        var existingDates = [];

        var tempoiqData = [];
        cursor.on("data", function (data) {

            if(filterData) {
                var ts = data.ts.toISOString();
                if(existingDates.indexOf(ts) < 0) {
                    //new datapoint
                    existingDates.push(ts);
                    tempoiqData.push(data);
                }
            } else {
                //just add value
                tempoiqData.push(data);
            }
        });

        cursor.on("end", function () {

            if (config.get("tempoiq_log_query")) {
                var query = {
                    selection: selection,
                    pipeline: pipeline,
                    start: startDateStr,
                    end: endDateStr,
                    tempoiqParams: tempoiqQueryParameters,
                    responseTime: profiling.getTime(profileId)
                };
                log.info("tempoiqQuery: " + JSON.stringify(query));
            }

            //console.log("DATA READED");
            //profilingCPU('readMulti Readed Data From TempoIQ');

            if(options.tz && options.tz.shiftResult && options.tz.offset) {
                shiftTempoiqData(tempoiqData, options.tz.offset);
            }

            var obj = {
                "dataPoints":tempoiqData,
                "selection": selection,
                "tempoIQParam": options.queryItem
            };

            //var endTime = new Date();

            //log.error("TEMPOIQ READING: " + (endTime - startTime) / 1000);

            callback(null, obj);
        });

        cursor.on("error", function (cursorErr) {
            cursorErr.message = consts.SERVER_ERRORS.EXTERNAL.COMMON_ERROR;
            callback(cursorErr);
        });

    });
}

function loadData(startDate, endDate, selection, pipeline, options, cb) {
    //using client offset for shfting dates
    if(options.tz && options.tz.shiftStart && options.tz.offset) {
        startDate.subtract(options.tz.offset, "m");
    }

    if(options.tz && options.tz.shiftEnd && options.tz.offset) {
        endDate.subtract(options.tz.offset, "m");
    }

    readMulti(startDate.toISOString(), endDate.toISOString(), selection, pipeline, options, cb);
}


/**
 * Function returns tempoiq devices by family
 * @access private
 * @param {string} family
 * @param {function} callback
 * @returns {void}
 */
function getDevicesByFamily(family, callback) {

    var selection = {
        "devices": {
            "attributes": {"Family": family}
        }
    };

    client.listDevices(selection, {
        streamed: false
    }, function (err, data) {

        if(err) {
            err.message = consts.SERVER_ERRORS.EXTERNAL.COMMON_ERROR;
            callback(err);
        } else {
            callback(null, data);
        }

        /*var foundDevices = [];
         cursor.on("data", function (data) {
         foundDevices.push(data);
         })

         cursor.on("end", function () {
         callback(null, foundDevices);
         })

         cursor.on("error", function (cursorErr) {
         callback(cursorErr);
         })
         */

    });
}

/**
 * Function adds data to tempoiq data points object
 * @access private
 * @param {object} dataPoints
 * @param {string} deviceName
 * @param {string} metric
 * @param {object} t
 * @param {number} v
 * @returns {void}
 */
function addDataPoints(dataPoints, deviceName, metric, t, v) {
    if (!dataPoints[deviceName]) {
        dataPoints[deviceName] = {};
    }

    if (!dataPoints[deviceName][metric]) {
        dataPoints[deviceName][metric] = [];
    }

    dataPoints[deviceName][metric].push({
        t: t,
        v: v
    });
}

exports.writeMultiDataPoints = writeMultiDataPoints;
exports.writeDataPoints = writeDataPoints;
exports.loadData = loadData;
exports.getDevicesByFamily = getDevicesByFamily;
exports.createDevice = createDevice;
exports.addDataPoints = addDataPoints;

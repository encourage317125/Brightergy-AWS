/**
 * Created 01 May 2015
 *
 */
"use strict";

var _ = require("lodash"),
    moment = require("moment");


var rand = function(min, max) {
    return Math.random() * (max - min) + min;
};


function generateFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}


//function generateSystemMode() {
    //return generateFromArray(["Heat", "Auto"]);
//}


//function generateTemperature() {
    //return rand(0, 40);
//}

//function generateTempoiqRange(min, max) {
    //return {
        //"t": moment.utc().toISOString(),
        //"v": rand(min, max)
    //};
//}


function generateOneRecord() {

    var deviceAddress = generateFromArray([
        "00:0d:6f:00:02:f7:46:86",
        "00:13:a2:00:40:30:e8:33_1",
        "00:13:a2:00:40:30:e8:33_2"
    ]);

    var systemMode = generateFromArray([
        "Heat",
        "Cool"
    ]);

    var type = null;
    var values = null;
    if(deviceAddress === "00:0d:6f:00:02:f7:46:86") {
        type = "PearlThermostat";
        values = {};
        values["local_temperature"] = rand(20, 23);
        values["desired_temperature"] = rand(20, 23);
        values["system_mode"] = systemMode;
    } else {
        type = "GEM";
        values = {
            W: rand(100, 500)
        };
    }

    var result = {
        device: deviceAddress,
        type: type,
        ts: moment.utc().toISOString(),
        values: values
    };
    return { key: deviceAddress, data: result };
}


function generateManyRecords(numberOfRecords) {
    return _.range(numberOfRecords).map(function() {
        return generateOneRecord();
    });
}


exports.generate = generateOneRecord;
exports.generateManyRecords = generateManyRecords;

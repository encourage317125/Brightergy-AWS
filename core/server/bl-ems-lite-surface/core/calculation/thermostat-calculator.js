"use strict";

function simulateMode(record) {
    var curentTemp = record.values["local_temperature"];
    var coolSetPoint = record.values["cool_setpoint"];
    var heatSetPoint = record.values["heat_setpoint"];

    if (curentTemp && coolSetPoint && heatSetPoint) {
        if(curentTemp < heatSetPoint) {
            record.values["system_mode"] = "Heating";
        }

        if(curentTemp > heatSetPoint && curentTemp < coolSetPoint) {
            record.values["system_mode"] = "Idle";
        }

        if(curentTemp > coolSetPoint) {
            record.values["system_mode"] = "Cooling";
        }
    }


}

function processKinesisResponse(record, clientObject, clientAnswerObj) {
    record.values = record.values || {};
    simulateMode(record);
    clientAnswerObj.send(record);
}

exports.processKinesisResponse = processKinesisResponse;
exports._simulateMode = simulateMode;
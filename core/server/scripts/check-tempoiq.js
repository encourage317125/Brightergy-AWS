"use strict";

var moment = require("moment"),
    tempoiq = require("tempoiq"),
    config = require("../../config/environment"),
    client = new tempoiq.Client(config.get("tempoiq:apikey"),
    config.get("tempoiq:apisecret"),
    config.get("tempoiq:host")
);

function readMulti(startDateStr, endDateStr, selection, callback) {

    client.read(selection, startDateStr, endDateStr, null,  {streamed: true}, function (cursor) {

        var tempoiqData = [];
        cursor.on("data", function (data) {
            tempoiqData.push(data);
        });

        cursor.on("end", function () {
            callback(null, tempoiqData);
        });

        cursor.on("error", function (cursorErr) {
            callback(cursorErr);
        });

    });
}

//add TEMPOIQ_APIKEY, TEMPOIQ_APISECRET, TEMPOIQ_HOST env vars
var startDate = moment.utc().startOf("day");//moment.utc([2015, 10, 1]) = 1 october 2015, month starts from 0
var endDate = moment.utc();

var selection = {
    "devices": {
        "key": "00:13:a2:00:40:30:e8:33_30"
    },
    "sensors": {
        "key": "W"
    }
};

readMulti(startDate.toISOString(), endDate.toISOString(), selection, function(err, data) {
    if(err) {
        console.log(err.message);
    } else {
        console.log(JSON.stringify(data));
    }
    process.exit();
});
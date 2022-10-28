"use strict";

var tempoiqWrapper = require("../general/core/tempoiq/tempoiq-wrapper"),
    consts = require("../libs/consts"),
    utils = require("../libs/utils"),
    fs = require("fs"),
    parse = require("csv-parse"),
    argv = require("minimist")(process.argv.slice(2)),
    log = require("../libs/log")(module),
    _ = require("lodash"),
    async = require("async");

var fileName = argv.file;

if(!fileName) {
    log.error("Select file");
    process.exit();
}

var parser = parse({}, function(parseErr, data){
    if(parseErr) {
        log.error(parseErr);
        process.exit();
    }

    log.info("Going to import data for webbox " + data[0][1]);

    var dataPoints = {};
    var metric = "Pac";
    var nodes = data[0];

    var points = 0;
    var obj = null;
    var node = null;


    var allDataPoints = [];

    for(var i=2; i < data.length;i++) {
        var row = data[i];

        //in row 0 - time
        //1 - webbox value (ignore it)
        //2,etc - node value
        var ts = row[0];

        //start from node values
        for(var j=2; j < row.length; j++) {
            var column = row[j];
            node = nodes[j];

            if (!dataPoints[node]) {
                dataPoints[node] = {};
            }

            if (!dataPoints[node][metric]) {
                dataPoints[node][metric] = [];
            }

            var val = parseFloat(column);
            if(utils.isNumber(val)) {
                dataPoints[node][metric].push({
                    t: ts,
                    v: val * 1000 //kw to watts
                });

                points++;
            }

            if (dataPoints[node][metric].length === 10000) {
                obj = {};
                obj[node] = {};
                obj[node][metric] = _.clone(dataPoints[node][metric]);
                allDataPoints.push(obj);
                dataPoints[node][metric].length = 0;
            }


        }
    }

    //copy last values from datapoints
    for(node in dataPoints) {
        if(dataPoints[node]) {
            obj = {};
            obj[node] = {};
            obj[node][metric] = _.clone(dataPoints[node][metric]);
            allDataPoints.push(obj);
        }
    }

    log.info("Points imported: " + points + " arrays: " + allDataPoints.length);

    async.eachSeries(allDataPoints, function(thisDataPointsArray, callback) {
        tempoiqWrapper.writeMultiDataPoints(thisDataPointsArray, callback);
    }, function (tempoiqErr) {
        if(tempoiqErr) {
            log.error(tempoiqErr);
        } else {
            log.info(consts.OK);
        }

        process.exit();
    });

});

fs.createReadStream(fileName).pipe(parser);
/**
 * Created 04 May 2015
 */
"use strict";

var fs = require("fs"),
    config = require("../../../config/environment"),
    Transform = require("stream").Transform,
    kinesis = require("kinesis");
    //KinesisStream = kinesis.KinesisStream;


var params = {
    accessKeyId: config.get("aws:auth:accesskeyid"),
    secretAccessKey: config.get("aws:auth:secretaccesskey"),
    region: config.get("aws:auth:region")
};

console.dir(params);


kinesis.listStreams({
    credentials: params,
    region: config.get("aws:auth:region")} , function(err, streams) {
    if (err) {
        throw err;
    }

    console.log(streams);
});

var kinesisSource = kinesis.stream({
        name: "DevicesDataStream",
        credentials: params,
        region: config.get("aws:auth:region"),
        oldest: true});


var bufferify = new Transform({objectMode: true});
bufferify._transform = function(record, encoding, cb) {
    cb(null, record.Data);
};

kinesisSource.pipe(bufferify).pipe(fs.createWriteStream("DevicesDataStream.log"));

//console.log(kinesisSource.read());



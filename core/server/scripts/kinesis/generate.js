/**
 * Created 30 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    async = require("async"),
    kinesisHelper = require("../../general/core/aws/kinesis-utils"),
    kinesis = kinesisHelper.kinesis,
    log = require("../../libs/log")(module);

var argv = require("minimist")(process.argv.slice(2));

var record = require("./record");
var config = require("../../../config/environment");
var streamName = config.get("aws:kinesis:streamname");
var rpc = argv.rpc || 1;


async.waterfall([
        function(next) {
            // check if such stream already exists
            kinesisHelper.checkIfStreamExist(streamName, next);
        },
        function(streamExists, next) {
            if (streamExists) {
                log.debug("stream already exists");
                return next();
            }

            log.debug("stream not exists, creating the stream");
            var params = {
                ShardCount: 1,
                StreamName: streamName
            };
            kinesis.createStream(params, next);
        },
        function(next) {
            // starting to write into stream

            function writeDataToKinesis() {
                var data = record.generateManyRecords(rpc);
                log.silly("generated data = " + JSON.stringify(data));
                if (!_.all(data, "key")) {
                    log.error("Logic error, no key in data: " + JSON.stringify(data));
                    return;
                }
                var params = {
                    Records: _.map(data, function(record) {
                        return {
                            Data: JSON.stringify(record.data),
                            PartitionKey: record.key
                        };
                    }),
                    StreamName: streamName
                };
                kinesis.putRecords(params, function (err, data) {
                    if (err) {
                        log.error(err);
                        process.exit(1);
                    }
                    log.debug("Record: " + JSON.stringify(params) + ", put data: " + JSON.stringify(data));
                });
            }
            setInterval(writeDataToKinesis, 1000);
        }
    ],
    function(err) {
        if (err) {
            log.error(err);
        }
    }
);


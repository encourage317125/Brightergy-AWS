/**
 * Created 01 May 2015
 */
"use strict";

var _ = require("lodash"),
    async = require("async"),
    kinesisHelper = require("../../general/core/aws/kinesis-utils"),
    kinesis = kinesisHelper.kinesis,
    log = require("../../libs/log")(module);

var argv = require("minimist")(process.argv.slice(2), { string: "seq" });
var streamName = require("./config").streamName;


// the save sequences for shards
var shardSequence = {
    //"shardId-000000000000": "49550266646053518777380983264501694202460255177892954114"
    //"shardId-000000000000": "49550266646053518777380983265038457266369247906961031170"
};


var forever = true;
var shardIteratorType = "TRIM_HORIZON";

if (argv.latest) {
    shardIteratorType = "LATEST";
}

if (argv.seq) {
    shardSequence["shardId-000000000000"] = String(argv.seq);
    shardIteratorType = "AT_SEQUENCE_NUMBER";
    forever = false;
}




// get all records
function getAllRecords(shardIterator, shardId, callback) {

    log.debug("getAllRecords, forever = " + forever + ", starting iterator: " + shardIterator);

    function getRecordImpl(shardIterator, next) {
        kinesis.getRecords({ ShardIterator: shardIterator }, function(err, data) {
            if (err) {
                next(err);
            }
            next(null, data);
        });
    }

    var iterator = shardIterator;

    async.doWhilst(
        function(callback) {
            getRecordImpl(iterator, function(err, data) {
                if (err) {
                    return callback(err);
                }

                log.silly("data = " + JSON.stringify(data));

                // decode Buffer to strings
                _.each(data.Records, function(record) {
                    record.Data = JSON.parse(record.Data.toString());
                    record.ShardId = shardId;
                    log.debug(JSON.stringify(record));
                });

                iterator = data.NextShardIterator;
                log.silly("next iterator = " + iterator);
                callback(null);
            });
        },
        function() {
            return forever;
        },
        function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        }
    );
}


async.waterfall([
    function(next) {
        kinesisHelper.getShards(streamName, {shardIteratorType: "LATEST"}, next);
    },
    function(shardRecords, next) {
        log.debug("shardRecords size: " + shardRecords.length);
        async.each(
            shardRecords,
            function(record, next) {

                // this function will never call next (except for error)
                getAllRecords(record.shardIterator,
                              record.shardId, function(err, record) {
                    if (err) {
                        return next(err);
                    }
                    //next(null, records);
                });

                //next(null);
            },
            function(err) {
                if (err) {
                    return next(err);
                }
            }
       );
    }
],
function(err) {
    if (err) {
        log.error(err);
    }
});



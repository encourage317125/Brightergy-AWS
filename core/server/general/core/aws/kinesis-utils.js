"use strict";

// TODO:: moved to core-service

var _ = require("lodash"),
    async = require("async"),
    AWS = require("aws-sdk"),
    config = require("../../../../config/environment"),
    log = require("../../../libs/log")(module);


/** configure and return kinesis stream
 *
 * @return AWS.Kinesis{Object}
  */
function createKines() {

    var params = {
        accessKeyId: config.get("aws:auth:accesskeyid"),
        secretAccessKey: config.get("aws:auth:secretaccesskey"),
        region: config.get("aws:auth:region")
    };

    var endpoint = config.get("aws:kinesis:endpoint");
    if (endpoint) {
        params.endpoint = endpoint;
    }
    log.silly("kinesis config params: " + JSON.stringify(params));
    return new AWS.Kinesis(params);
}

var kinesis = createKines();


/**
 * check if stream with given name exists
 * @param streamName
 * @param callback function(err, Boolean)
 * @returns {*}
 */
var checkIfStreamExist = function(streamName, callback) {

    function checkImpl(exclusiveStartStreamName, callback) {
        var params = {};
        if (exclusiveStartStreamName) {
            params.ExclusiveStartStreamName = exclusiveStartStreamName;
        }

        kinesis.listStreams(params, function(err, data) {
            if (err) {
                return callback(err);
            }
            log.silly("answer from listStream: " + JSON.stringify(data));
            if (_.contains(data.StreamNames, streamName)) {
                return callback(null, true);
            }
            if (data.HasMoreStreams) {
                return checkImpl(data.ExclusiveStartStreamName);
            }
            return callback(null, false);
        });
    }

    return checkImpl(null, callback);
};


/**
 * describe stream considering HasMoreShards possibility
 * @param streamName
 * @param callback
 */
var describeStream = function(streamName, callback) {

    function impl(exclusiveStartShardId, result, callback) {
        var params = {
            StreamName: streamName
        };
        if (exclusiveStartShardId) {
            params.ExclusiveStartShardId = exclusiveStartShardId;
        }
        kinesis.describeStream(params, function(err, data) {
            if (err) {
                return callback(err);
            }

            log.silly("data = " + JSON.stringify(data));

            if (!_.isEmpty(result)) {
                result.StreamDescription.Shards = result.StreamDescription.Shards.concat(data.StreamDescription.Shards);
            } else {
                result = data;
            }

            if (data.HasMoreShards) {

                var lastShard = _.last(data.StreamDescription.Shards);
                log.silly("lastShard = " + JSON.stringify(lastShard) + ", lastShardId: " + lastShard.ShardId);

                // recursive call
                return impl(lastShard.ShardId, result, callback);
            }

            callback(null, result);
        });
    }

    impl(null, {}, callback);
};


/**
 * Return the list of records for stream (shardId and shardIterator)
 * @param streamName {String} stream name
 * @param options {Object} extra options
 * @param callback function(err, data)
 *
 * shard record: { shardId: *, shardIterator: * }
 */
function getShards(streamName, options, callback) {

    log.silly("getShards");

    if (!options) {
        options = {
            //shardIteratorType: "TRIM_HORIZON"
            shardIteratorType: "LATEST"
        };
    }

    async.waterfall([
            // describe stream so that we could find out all existing shards
            function(next) {
                describeStream(streamName, function(err, data) {
                    if (err) {
                        return next(err);
                    }
                    if (data.StreamDescription.StreamStatus !== "ACTIVE") {
                        return next("Stream is not active");
                    }
                    next(null, data);
                });
            },
            function(descData, next) {

                // get Shard iterators for each shard
                var shardIds = _.pluck(descData.StreamDescription.Shards, "ShardId");

                // how many shards will be read in parallel
                var kinesisParallelRead = config.get("aws.kinesis.shardsparallelread") || 10;

                log.debug("shardIds: " + JSON.stringify(shardIds));

                async.mapLimit(shardIds, kinesisParallelRead, function(shardId, next) {

                    var params = {
                        StreamName: streamName,
                        ShardId: shardId,
                        ShardIteratorType: options.shardIteratorType
                    };

                    log.silly("Shard Iterator params = " + JSON.stringify(params));
                    kinesis.getShardIterator(params, function(err, data) {
                        if (err) {
                            return next(err);
                        }
                        next(null, {
                            shardIterator: data.ShardIterator,
                            shardId: shardId
                        });

                    });
                }, next);
            },
            function(shardRecords) {
                log.silly("shardRecords = " + JSON.stringify(shardRecords));
                callback(null, shardRecords);
            }
        ],
        function(err) {
            if (err) {
                log.error(err);
                return callback(err);
            }
        });
}


/**
 * Read all records continuously
 * @param shardIterator {string}
 * @param shardId {string}
 * @param recordCallback the function for record
 * @param callback
 */
function readRecords(shardIterator, shardId, recordCallback, callback) {

    // delay between two read operations
    var readPeriod = config.get("aws:kinesis:readperiodmilliseconds") || 1000;

    log.debug("readRecords: readPeriod(ms): " + readPeriod + ", starting iterator: " + shardIterator);

    function getRecordImpl(shardIterator, next) {
        kinesis.getRecords({ ShardIterator: shardIterator }, function(err, data) {
            if (err) {
                return next(err);
            }

            // log.silly("data = " + JSON.stringify(data));

            // decode Buffer to string and to Object
            _.each(data.Records, function(record) {

                try {
                    record.Data = JSON.parse(record.Data.toString());
                    record.ShardId = shardId;

                    // run callback for each record
                    recordCallback(record);
                } catch (e) {
                    log.error("readRecords: " + e.name + " " + e.message + " " + e.stack);
                }
            });

            var iterator = data.NextShardIterator;
            setTimeout(getRecordImpl, readPeriod, iterator, next);
        });
    }

    getRecordImpl(shardIterator, callback);
}


module.exports.kinesis = kinesis;
module.exports.checkIfStreamExist = checkIfStreamExist;
module.exports.describeStream = describeStream;
module.exports.getShards = getShards;
module.exports.readRecords = readRecords;

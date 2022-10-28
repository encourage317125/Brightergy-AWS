"use strict";

var _             = require("lodash");
var async         = require("async");
var moment        = require("moment");
var config        = require("../../../../config/environment");
var kinesisHelper = require("../../../general/core/aws/kinesis-utils");
var log           = require("../../../libs/log")(module);
var cacheHelper   = require("../../../libs/cache-helper");
var consts        = require("../../../libs/consts");
var utils         = require("../../../libs/utils");

var nodes = {};

function recordCallback(record) {
    //log.silly("recordCallback: " + JSON.stringify(record) + ", listeners: " + _.keys(listeners).length);
    var device = record.device;
    if (device) {
        var records = nodes[device.trim()];
        if (records) {
            _.each(records, function (listener) {
                listener.processor.process(_.cloneDeep(record));
            });
        }
    } else {
        _.forOwn(record, function (value, nodeId) {
            log.silly("nodeId: " + nodeId);
            var records = nodes[nodeId];
            _.each(records, function (record) {
                record.processor.process(_.cloneDeep(value));
            });
        });
    }
}

// this function is not suppose to be finished
function kinesisLoop(processMessageCallback) {
    var loopCallback = function(record) {
        var nowMinute = moment.utc(record.Data.ts).minute();
        //get all cached kinesis records
        cacheHelper.getArray(consts.KINESIS, function(getErr, cachedData) {
            if (getErr) {
                return utils.logError(getErr);
            }

            var saveFunc = function() {
                cacheHelper.pushArrayItem(consts.KINESIS, record.Data, function(saveErr) {
                    if (saveErr) {
                        return utils.logError(saveErr);
                    }
                    processMessageCallback(record.Data);
                });
            };

            if (cachedData.length > 0 && moment.utc(cachedData[0].ts).minute() !== nowMinute) {
                //we have data for prev minutes
                cacheHelper.delSingleKey(consts.KINESIS, function(deleErr) {
                    if (deleErr) {
                        return utils.logError(deleErr);
                    }

                    saveFunc();
                });
            } else {
                saveFunc();
            }
        });
    };

    var kinesisFailTimeout = config.get("aws:kinesis:failtimeoutseconds") || 1;
    log.info("Kinesis run, failTimeout (seconds): " + kinesisFailTimeout);

    async.waterfall([
        // describe stream so that we could find out all necessary shards
        function(next) {
            kinesisHelper.getShards(
                config.get("aws:kinesis:streamname"),
                {shardIteratorType: "LATEST"},
                next);
        },

        function(shardRecords, next) {
            log.debug("shardRecords size: " + shardRecords.length);

            // read all records for each shard in continuous mode
            async.each(
                shardRecords,
                function(record, next) {
                    // this function will never call next (except for error)
                    kinesisHelper.readRecords(
                        record.shardIterator,
                        record.shardId,
                        loopCallback,
                        next);
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
        // if we have error for some reason, we just restart kinesis loop
        if (err) {
            log.error(err);
        }
        setTimeout(kinesisLoop, kinesisFailTimeout * 1000, processMessageCallback);
        log.info("kinesisLoop was restarted");
    });
}

function subscribe(listener, nodeList, processor) {
    log.silly("Subscribed: " + listener + ", nodeList size: " + nodeList.length);
    _.each(nodeList, function(node) {
        nodes[node] = nodes[node] || [];
        nodes[node].push({ listener: listener, processor: processor });
    });
}

function unsubscribe(listener) {
    for (var node in nodes) {
        if (nodes.hasOwnProperty(node)) {
            if (nodes[node].length > 0) {
                for (var i = nodes[node].length - 1; i >= 0; i--) {
                    if (nodes[node][i].listener === listener) {
                        nodes[node].splice(i, 1);
                    }
                }
            }

            if (_.isEmpty(nodes[node])) {
                delete nodes[node];
            }
        }
    }
}

function getProcessor(listener) {
    for (var node in nodes) {
        if (nodes.hasOwnProperty(node)) {
            for (var i=0; i < nodes[node].length; i++) {
                if (nodes[node][i].listener === listener) {
                    return nodes[node][i].processor;
                }
            }
        }
    }

    return null;
}

exports.run = kinesisLoop;
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.getProcessor = getProcessor;
exports.recordCallback = recordCallback;

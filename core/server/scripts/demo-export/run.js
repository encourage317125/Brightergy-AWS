"use strict";
require("../../general/models");

var config = require("../../../config/environment"),
    async = require("async"),
    utils = require("../../libs/utils"),
    mongodb = require("mongodb"),
    MongoClient = mongodb.MongoClient;


function copyDatabase(sourceDb, targetDb, callback) {
    sourceDb.collections(function(err1, collections) {
        if (err1) {
            callback(err1);
        } else {
            async.each(collections, function (sourceCollection, cb) {

                if (sourceCollection.collectionName === "system.indexes") {
                    cb(null);
                } else {
                    targetDb.createCollection(sourceCollection.collectionName, function(err2, targetCollection) {
                        if (err2) {
                            cb(err2);
                        } else {
                            sourceCollection.find().toArray(function(err3, sourceDocuments) {
                                if (err3) {
                                    cb(err3);
                                } else {
                                    targetCollection.insert(sourceDocuments, {w: 1}, function(err4, result) {
                                        if (err4) {
                                            cb(err4);
                                        } else {
                                            console.log("Collection `" + sourceCollection.collectionName + 
                                                "` (" + sourceDocuments.length + " documents) copied");
                                            cb(null);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                
            }, function(err) {
                callback(err, collections.length-1);
            });
        }
    });
    
}

function nullifyCreationTime(db, collectionNames, callback) {
    async.each(collectionNames, function(collectionName, cb) {
        db.collection(collectionName, function(err1, collection) {
            if (err1) {
                cb(err1);
            } else {
                collection.update({}, {$set: {creationTime: null}}, {w: 1, multi: true}, function(err2, numberUpdated) {
                    if (err2) {
                        cb(err2);
                    } else {
                        console.log("creationTime set to null for collection `" + 
                            collectionName + "` " + numberUpdated);
                        cb(null);
                    }
                });
            }
        });
    }, function(err) {
        callback(err);
    });
}

function createExpireIndex(db, collectionNames, expireSeconds, callback) {
    async.each(collectionNames, function(collectionName, cb) {
        db.createIndex(collectionName, {creationTime: 1}, {expireAfterSeconds: expireSeconds, w: 1}, 
            function (err1, indexName) {
            if (err1) {
                cb(err1);
            } else {
                console.log("expireAfterSeconds index on creationTime created for collection `" + 
                    collectionName + "` - " + indexName);
                cb(null);
            }
        });
    }, function(err) {
        callback(err);
    });
}

MongoClient.connect(config.get("db:url"), {"uri_decode_auth": true}, function(err, prodDb) {

    if (err) {
        console.log("Connection to Production DB failed!");
    } else {

        var demoDbURL = config.get("demobox:db:url");
        if (!demoDbURL) {
            demoDbURL = "mongodb://127.0.0.1:27017/BrighterlinkDemo";
        }

        MongoClient.connect(demoDbURL, {"uri_decode_auth": true}, function(err, demoDb) {

            if (err) {
                console.log("Connection to DemoBox DB failed!");
            } else {

                async.waterfall([
                    function (callback) {
                        var cmdCheck = { dbStats: 1, scale: 1 };
                        demoDb.command(cmdCheck, callback);
                    },
                    function (checkResult, callback) {
                        if (checkResult.dataSize) {
                            console.log("DemoBox database already exists! Deleting...");
                            demoDb.dropDatabase(callback);
                        } else {
                            callback(null, null);
                        }
                    },
                    function (deleteResult, callback) {
                        if (deleteResult) {
                            console.log("DemoBox DB Deleted: " + JSON.stringify(deleteResult));
                            console.log("==============================================");
                        }
                        
                        console.log("Copying Production database to DemoBox ...");
                        copyDatabase(prodDb, demoDb, callback);
                    },
                    function (copyResult, callback) {
                        console.log("DB Copied: (" + JSON.stringify(copyResult) + " collections)");
                        console.log("==============================================");
                        
                        nullifyCreationTime(demoDb, ["tags", "users"], callback);
                    },
                    function (callback) {
                        console.log("==============================================");

                        var expireSeconds = config.get("demobox:db:expireafterseconds");
                        if (!expireSeconds) {
                            expireSeconds = 3600;
                        }
                        createExpireIndex(demoDb, ["tags", "users"], expireSeconds, callback);
                    }
                ], function (err, result) {
                    if (err) {
                        utils.logError(err);
                    } else {
                        console.log("==============================================");
                        console.log("Successfully Completed!!!");
                    }
                    prodDb.close();
                    demoDb.close();
                    process.exit();
                });

            }

        });
    }

    
});

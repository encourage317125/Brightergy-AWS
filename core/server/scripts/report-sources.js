"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    Tag = mongoose.model("tag"),
    Account = mongoose.model("account"),
    User = mongoose.model("user"),
    _ = require("lodash"),
    consts = require("../libs/consts");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {
    var report = [];

    Account.find({}, function(accErr, accounts) {
        var accountsMap = {};
        _.each(accounts, function(acc) {
            accountsMap[acc._id.toString()] = acc;
        });

        User.find({}, function(userErr, users) {
            var usersMap = {};
            var usersAccountMap = {};
            _.each(users, function(user) {
                usersMap[user._id.toString()] = user;
                var accountId = user.accounts[0].toString();
                usersAccountMap[accountId] = user;
            });

            Tag.find({}, function(err, tags) {
                var tagsMap = {};
                var tagsUserMap = {};
                _.each(tags, function(tag) {
                    tagsMap[tag._id.toString()] = tag;
                    if(tag.tagType === consts.TAG_TYPE.Facility && tag.usersWithAccess.length > 0) {
                        var userId = tag.usersWithAccess[0].id.toString();
                        if(!tagsUserMap[userId]) {
                            tagsUserMap[userId] = [];
                        }
                        tagsUserMap[userId].push(tag);
                    }

                });

                _.each(accounts, function(acc) {
                    var reportItem = {
                        account: acc.name,
                        facilities: []
                    };

                    var userId = usersAccountMap[acc._id.toString()]._id.toString();
                    var facilities = tagsUserMap[userId];
                    if(facilities) {
                        var facilitiesData = _.map(facilities, function (facility) {

                            var scopeIds = _.map(facility.children, function (child) {
                                return child.id.toString();
                            });

                            var scopes = _.map(scopeIds, function(scopeId) {
                               return tagsMap[scopeId];
                            });

                            var scopesData = _.map(scopes, function (scope) {


                                var nodesId = _.map(scope.children, function (child) {
                                    return child.id.toString();
                                });

                                var nodes = _.map(nodesId, function(nodeId) {
                                    return tagsMap[nodeId];
                                });

                                var nodesData = _.map(nodes, function (node) {

                                    var metricsId = _.map(node.children, function (child) {
                                        return child.id.toString();
                                    });

                                    var metrics = _.map(metricsId, function(metricId) {
                                        return tagsMap[metricId];
                                    });

                                    var metricsData = _.map(metrics, function (metric) {
                                        return metric.name;
                                    });

                                    return {
                                        deviceID: node.deviceID,
                                        metricsData: metricsData
                                    };
                                });

                                return {
                                    deviceID: scope.deviceID,
                                    commissionDate: scope.commissioningDate,
                                    nodesData: nodesData
                                };
                            });


                            return {
                                name: facility.name,
                                displayName: facility.displayName,
                                installAddress: facility.installAddress,
                                scopes: scopesData
                            };
                        });

                        reportItem.facilities = facilitiesData;

                        report.push(reportItem);
                    }

                });

                console.log(JSON.stringify(report));
                process.exit();
            });
        });
    });


});
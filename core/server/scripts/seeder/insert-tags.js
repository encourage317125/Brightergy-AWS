"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    _ = require("lodash"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils"),
    currentTime = new Date();

function insertTags(finalCallback) {

    Tag.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var tags = [];
                    tags.push({
                        "_id": new ObjectId("5458a2acb0091419007e03df"),
                        "tagType": "Facility",
                        "name": "Liberty Lofts",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            },
                            {
                                "id" : new ObjectId("54135e285a749f381d2dd46a")
                            }
                        ],
                        "appEntities": [{
                            "appName" : "Dashboard",
                            "id" : new ObjectId("5461ff1251d2f91500187462")
                        }],
                        "children": [
                            {
                                "id" : new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType" : "Scope"
                            }
                        ],
                        "parents": [],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": "",
                        "nonProfit": null,
                        "taxID": null,
                        "street": "",
                        "state": "",
                        "postalCode": "",
                        "country": "",
                        "city": ""
                    });
                    tags.push({
                        "_id" : new ObjectId("5458a84f5409c90e00884cdf"),
                        "tagType" : "Scope",
                        "name" : "Liberty Lofts eGauge",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v" : 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458a8a95409c90e00884ce0"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458aea9fe540a120074c206"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af11fe540a120074c207"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af22fe540a120074c208"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af36fe540a120074c209"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af3ffe540a120074c20a"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af53fe540a120074c20b"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af72fe540a120074c20c"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af85fe540a120074c20d"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a2acb0091419007e03df"),
                                "tagType": "Facility"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": "http://egauge8795.egaug.es/",
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": "Download via API",
                        "timezone": "America/Chicago",
                        "deviceID": "egauge8795",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "dateTimeFormat":  consts.DATE_TIME_FORMAT.UTC
                    });
                    tags.push({
                        "_id": new ObjectId("5458a8a95409c90e00884ce0"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter A",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458a8bc5409c90e00884ce1"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter A",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458a8bc5409c90e00884ce1"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458a8a95409c90e00884ce0"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458aea9fe540a120074c206"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter A+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb0179fd7a46009ef843"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter A+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af11fe540a120074c207"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter B",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb1479fd7a46009ef844"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter B",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("5458af22fe540a120074c208"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter B+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb1f79fd7a46009ef845"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter B+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af36fe540a120074c209"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter C",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb3179fd7a46009ef846"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter C",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af3ffe540a120074c20a"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter C+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb4379fd7a46009ef847"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter C+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af53fe540a120074c20b"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Elevator",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb5479fd7a46009ef848"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("555208bb69d07e341e9ca090"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Elevator",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Elevator",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af72fe540a120074c20c"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Garage Lighting",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb5e79fd7a46009ef849"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Garage Lighting",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Garage Lighting",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af85fe540a120074c20d"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Lobby Lighting",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb6a79fd7a46009ef84a"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Lobby Lighting",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Lobby Lighting",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af9bfe540a120074c20e"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Lot Lights",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 2,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545cee9b7f99954600348f4d"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb7779fd7a46009ef84b"),
                                "tagType": "Metric"
                            },
                            {
                                "tagType": "Metric",
                                "id": new ObjectId("545cef9f7f99954600348f52")
                            },
                            {
                                "tagType": "Metric",
                                "id": new ObjectId("545cefc77f99954600348f53")
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Lot Lights",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Lot Lights",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458afc6fe540a120074c20f"),
                        "tagType": "Facility",
                        "name": "Barretts Elementary",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("5457e1990c5a5d2700affe77"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461363bdfef7c4800146f4b"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461ff0951d2f91500187461"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461ff1251d2f91500187462"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "parents": [],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": -90.472394,
                        "latitude": 38.576286,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": "",
                        "nonProfit": null,
                        "taxID": null,
                        "street": "",
                        "state": "",
                        "postalCode": "",
                        "country": "",
                        "city": "Kansas City",
                        "displayName": "Some renamed facility",
                        "installAddress" : "1780 Carman Road, Manchester, MO 63021, USA",
                        "installCity" : "Manchester",
                        "installCountry" : "USA",
                        "installPostalCode" : "63021",
                        "installState" : "MO",
                        "installStreet" : "1780 Carman Road"
                    });
                    tags.push({
                        "_id": new ObjectId("5458b01afe540a120074c210"),
                        "tagType": "Scope",
                        "name": "Barretts Elementary: Sunny WebBox",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("5457e33f0c5a5d2700affe7c"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458afc6fe540a120074c20f"),
                                "tagType": "Facility"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "timezone": "America/Chicago",
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": "54.201.16.210",
                        "accessMethod": "Push to FTP",
                        "deviceID": "wb150115159",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "displayName": "Hello",
                        "potentialPower" : 25,
                        "commissioningDate" : "2013-01-31T00:00:00.000Z"
                    });
                    tags.push({
                        "_id": new ObjectId("5458b22379e7b60e00b1133a"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter A",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b27e79e7b60e00b1133c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c522c0fa5a0e0045f178"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c54dc0fa5a0e0045f179"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c56dc0fa5a0e0045f17b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c597c0fa5a0e0045f17d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c646c0fa5a0e0045f17f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c664c0fa5a0e0045f182"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c699c0fa5a0e0045f183"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6bec0fa5a0e0045f186"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6e1c0fa5a0e0045f188"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6f1c0fa5a0e0045f189"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c717c0fa5a0e0045f18c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c735c0fa5a0e0045f18d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c75bc0fa5a0e0045f18f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c781c0fa5a0e0045f191"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c793c0fa5a0e0045f193"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7bec0fa5a0e0045f195"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7e5c0fa5a0e0045f197"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c805c0fa5a0e0045f199"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c83fc0fa5a0e0045f19b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906ddded7ea0f0079840c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906e4ded7ea0f0079840d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906edded7ea0f0079840e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906edded7ea0f0079940e"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR7KU009:2002112342",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "displayName": "Earth",
                        "potentialPower" : 7
                    });
                    tags.push({
                        "_id": new ObjectId("5458b23e79e7b60e00b1133b"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter B",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b2aa79e7b60e00b1133d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c4edc0fa5a0e0045f177"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c55ac0fa5a0e0045f17a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c56fc0fa5a0e0045f17c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c59ac0fa5a0e0045f17e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c649c0fa5a0e0045f180"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c663c0fa5a0e0045f181"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c69cc0fa5a0e0045f184"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6bcc0fa5a0e0045f185"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6dec0fa5a0e0045f187"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6f5c0fa5a0e0045f18a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c714c0fa5a0e0045f18b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c737c0fa5a0e0045f18e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c75ec0fa5a0e0045f190"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c784c0fa5a0e0045f192"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c798c0fa5a0e0045f194"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7c1c0fa5a0e0045f196"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7e8c0fa5a0e0045f198"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c808c0fa5a0e0045f19a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c841c0fa5a0e0045f19c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906f7ded7ea0f0079840f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906feded7ea0f00798410"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("54590706804783290060e700"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR7KU009:2002112282",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "displayName": "Venus",
                        "potentialPower" : 10
                    });
                    tags.push({
                        "_id": new ObjectId("5458b27e79e7b60e00b1133c"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458b2aa79e7b60e00b1133d"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter C",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458ba46c0fa5a0e0045f162"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bbf0c0fa5a0e0045f163"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc02c0fa5a0e0045f164"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc29c0fa5a0e0045f165"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc53c0fa5a0e0045f166"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc61c0fa5a0e0045f167"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc73c0fa5a0e0045f168"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc81c0fa5a0e0045f169"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bca4c0fa5a0e0045f16a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bccbc0fa5a0e0045f16b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bce6c0fa5a0e0045f16c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd23c0fa5a0e0045f16d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd52c0fa5a0e0045f16f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd5fc0fa5a0e0045f170"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd70c0fa5a0e0045f171"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd7ac0fa5a0e0045f172"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd8cc0fa5a0e0045f173"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdabc0fa5a0e0045f174"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdb6c0fa5a0e0045f175"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdc7c0fa5a0e0045f176"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("54590712804783290060e701"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5459071e1c1bb134009a9757"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5459072a1c1bb134009a9758"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR8KU002:2002126708",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "displayName": "Mercury"
                    });
                    tags.push({
                        "_id": new ObjectId("5458ba46c0fa5a0e0045f162"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bbf0c0fa5a0e0045f163"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess": [
                            {
                                "id": new ObjectId("54135f90c6ab7c241e28095e")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc02c0fa5a0e0045f164"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc29c0fa5a0e0045f165"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc53c0fa5a0e0045f166"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc61c0fa5a0e0045f167"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc73c0fa5a0e0045f168"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc81c0fa5a0e0045f169"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bca4c0fa5a0e0045f16a"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bccbc0fa5a0e0045f16b"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bce6c0fa5a0e0045f16c"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd23c0fa5a0e0045f16d"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": 70,
                        "latitude": 47,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd52c0fa5a0e0045f16f"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd5fc0fa5a0e0045f170"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd70c0fa5a0e0045f171"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd7ac0fa5a0e0045f172"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd8cc0fa5a0e0045f173"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdabc0fa5a0e0045f174"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdb6c0fa5a0e0045f175"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdc7c0fa5a0e0045f176"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c4edc0fa5a0e0045f177"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c522c0fa5a0e0045f178"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c54dc0fa5a0e0045f179"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c55ac0fa5a0e0045f17a"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c56dc0fa5a0e0045f17b"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c56fc0fa5a0e0045f17c"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c597c0fa5a0e0045f17d"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": "Line Voltage L1-N",
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c59ac0fa5a0e0045f17e"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c646c0fa5a0e0045f17f"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c649c0fa5a0e0045f180"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c663c0fa5a0e0045f181"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c664c0fa5a0e0045f182"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c699c0fa5a0e0045f183"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c69cc0fa5a0e0045f184"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6bcc0fa5a0e0045f185"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6bec0fa5a0e0045f186"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6dec0fa5a0e0045f187"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6e1c0fa5a0e0045f188"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6f1c0fa5a0e0045f189"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6f5c0fa5a0e0045f18a"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c714c0fa5a0e0045f18b"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": "Input Terminal Voltage",
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c717c0fa5a0e0045f18c"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c735c0fa5a0e0045f18d"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c737c0fa5a0e0045f18e"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c75bc0fa5a0e0045f18f"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c75ec0fa5a0e0045f190"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c781c0fa5a0e0045f191"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c784c0fa5a0e0045f192"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c793c0fa5a0e0045f193"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c798c0fa5a0e0045f194"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7bec0fa5a0e0045f195"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7c1c0fa5a0e0045f196"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7e5c0fa5a0e0045f197"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7e8c0fa5a0e0045f198"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c805c0fa5a0e0045f199"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c808c0fa5a0e0045f19a"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c83fc0fa5a0e0045f19b"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c841c0fa5a0e0045f19c"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb0179fd7a46009ef843"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458aea9fe540a120074c206"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb1479fd7a46009ef844"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af11fe540a120074c207"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb1f79fd7a46009ef845"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af22fe540a120074c208"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb3179fd7a46009ef846"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af36fe540a120074c209"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb4379fd7a46009ef847"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af3ffe540a120074c20a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb5479fd7a46009ef848"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af53fe540a120074c20b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb5e79fd7a46009ef849"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af72fe540a120074c20c"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb6a79fd7a46009ef84a"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af85fe540a120074c20d"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb7779fd7a46009ef84b"),
                        "tagType": "Metric",
                        "name": consts.METRIC_NAMES.kW,
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906ddded7ea0f0079840c"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": 70,
                        "latitude": 47,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906e4ded7ea0f0079840d"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079840e"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940e"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.3,
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906f7ded7ea0f0079840f"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906feded7ea0f00798410"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("54590706804783290060e700"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("54590712804783290060e701"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5459071e1c1bb134009a9757"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5459072a1c1bb134009a9758"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545cef9f7f99954600348f52"),
                        "name": "Energy (kWh)",
                        "tagType": "Metric",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135e285a749f381d2dd46a"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "__v": 1
                    });
                    tags.push({
                        "_id": new ObjectId("545cefc77f99954600348f53"),
                        "name": "Energy (Wh)",
                        "tagType": "Metric",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "__v": 0
                    });


                    //-------------------------------------enphase sources
                    tags.push({
                        "_id" : new ObjectId("549012531e94a8881e6e8e54"),
                        "name" : "Enphase Facility",
                        "displayName": "Three witches watch three Swatch watches",
                        "tagType" : "Facility",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("549012d1c15488681a64b6ab")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ed7ba2ca1141e4afd72")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ee7ba2ca1141e4afd73")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ef4ba2ca1141e4afd74")
                            }
                        ],
                        "parents" : [],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [
                            ""
                        ],
                        "utilityProvider" : "",
                        "nonProfit" : false,
                        "taxID" : "",
                        "address" : "",
                        "street" : "",
                        "state" : "",
                        "postalCode" : "",
                        "country" : "",
                        "city" : "",
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("549012d1c15488681a64b6ab"),
                        "name" : "Envoy_1",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [
                            {
                                "appName" : "Dashboard",
                                "id" : new ObjectId("5461fee651d2f9150018745f")
                            }
                        ],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5490307bba2ca1141e4afd75")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "415544",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ed7ba2ca1141e4afd72"),
                        "name" : "Envoy_2",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [
                            {
                                "appName" : "Dashboard",
                                "id" : new ObjectId("5461fee651d2f9150018745f")
                            }
                        ],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("549068c968eabd681b71182a")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "416036",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ee7ba2ca1141e4afd73"),
                        "name" : "Envoy_3",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5490697f81cda60823657639")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "347894",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ef4ba2ca1141e4afd74"),
                        "name" : "Envoy_4",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("54906a9b81cda60823657641")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : -94.58940699999999,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "406326",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : "Kansas City",
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("5490307bba2ca1141e4afd75"),
                        "name" : "Envoy sensor1",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490308aba2ca1141e4afd76")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549069e981cda6082365763b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549069f781cda6082365763c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a0381cda6082365763d")
                            },
                            {
                                "tagType": "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940d")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012d1c15488681a64b6ab"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "ff",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Daily",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:415544",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 8
                    });

                    tags.push({
                        "_id" : new ObjectId("549068c968eabd681b71182a"),
                        "name" : "Envoy sensor 2",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549068e368eabd681b71182b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490691c81cda60823657636")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490693781cda60823657637")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490694581cda60823657638")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940c")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ed7ba2ca1141e4afd72"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:416036",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("5490697f81cda60823657639"),
                        "name" : "Envoy sensor 3",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490699081cda6082365763a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a3281cda6082365763e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a4081cda6082365763f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a4b81cda60823657640")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940b")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ee7ba2ca1141e4afd73"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:347894",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4,
                        "displayName": "Jupiter"
                    });

                    tags.push({
                        "_id" : new ObjectId("54906a9b81cda60823657641"),
                        "name" : "Envoy sensor 4",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906ab081cda60823657642")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906add68eabd681b71182c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906af268eabd681b71182e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940a")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ef4ba2ca1141e4afd74"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Daily",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:406326",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4,
                        "displayName": "Mars"
                    });

                    tags.push({
                        "_id" : new ObjectId("5490308aba2ca1141e4afd76"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });


                    tags.push({
                        "_id" : new ObjectId("5490693781cda60823657637"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490694581cda60823657638"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("549069e981cda6082365763b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a4081cda6082365763f"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a4b81cda60823657640"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906af268eabd681b71182e"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("549068e368eabd681b71182b"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490691c81cda60823657636"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490699081cda6082365763a"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("549069f781cda6082365763c"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a0381cda6082365763d"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a3281cda6082365763e"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906ab081cda60823657642"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906add68eabd681b71182c"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    //EnphaseReimbursement

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940d"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.3,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940c"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("549068c968eabd681b71182a"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.4,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940b"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5490697f81cda60823657639"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.5,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940a"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("54906a9b81cda60823657641"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.6,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id" : new ObjectId("555208bb69d07e341e9ca090"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("5416f4a4aa6409d01d0c91dc"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5458af53fe540a120074c20b"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.3,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("54f84ab21688f21600d74b48"),
                        "name" : "Saint Luke's East",
                        "tagType" : "Facility",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135ec74f09ccc06d5be3d6")
                            }
                        ],
                        "appEntities" : [
                        ],
                        "children" : [
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54f84f55f47d311b000f0950")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54f84f9df47d311b000f0955")
                            }
                        ],
                        "parents" : [],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [
                            ""
                        ],
                        "utilityProvider" : "MO - KCPL - GMO",
                        "nonProfit" : false,
                        "taxID" : "",
                        "address" : "100 NE Saint Luke's Blvd Lee's Summit, MO 64086",
                        "street" : "Saint Lukes Blvd",
                        "state" : "MO",
                        "postalCode" : "64086",
                        "country" : "USA",
                        "city" : "Lees Summit",
                        "__v" : 8
                    });



                    tags.push({
                        "_id" : new ObjectId("54f84f55f47d311b000f0950"),
                        "name" : "eGauge 17505 - 1st Floor Rm 1A017",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("54f9a1c5af2e953000d20329")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("54ff4e06e1e0e51600b3c81e")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f84ab21688f21600d74b48"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : "jessica.oakley@brightergy.com",
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.38157099999999,
                        "latitude" : 38.942055,
                        "webAddress" : "http://egauge17505.egaug.es/",
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Download via API",
                        "deviceID" : "egauge17505",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 6,
                        "displayName" : "Scope"
                    });

                    tags.push({
                        "_id" : new ObjectId("54f9a1c5af2e953000d20329"),
                        "name" : "Lighting Panel A1-26-HC",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54f9a1d4af2e953000d2032a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54f9a1d4af2e953000d2032e")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f84f55f47d311b000f0950"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.38157099999999,
                        "latitude" : 38.942055,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17505:A1-26-HC",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 9,
                        "nodeType" : "Supply",
                        "displayName" : "Node"
                    });


                    tags.push({
                        "_id" : new ObjectId("54f9a1d4af2e953000d2032a"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f9a1c5af2e953000d20329"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Minimum",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Custom",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 3
                    });

                    tags.push({
                        "_id" : new ObjectId("54f9a1d4af2e953000d2032e"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f9a1c5af2e953000d20329"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.2,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54ff4e06e1e0e51600b3c81e"),
                        "name" : "Lighting Panel A1-7-HN",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("55008735043382da01343450")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("55008735043382da01343454")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f84f55f47d311b000f0950"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.38157099999999,
                        "latitude" : 38.942055,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17505:A1-7-HN",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 5,
                        "nodeType" : "Supply",
                        "displayName" : "Node"
                    });

                    tags.push({
                        "_id" : new ObjectId("55008735043382da01343450"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54ff4e06e1e0e51600b3c81e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Minimum",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Custom",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 2
                    });

                    tags.push({
                        "_id" : new ObjectId("55008735043382da01343454"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54ff4e06e1e0e51600b3c81e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54f84f9df47d311b000f0955"),
                        "name" : "eGauge 17510 - 3rd Floor Rm 3A073",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("54f85254614f4b2a008b4375")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f84ab21688f21600d74b48"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : "jessica.oakley@brightergy.com",
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.38157099999999,
                        "latitude" : 38.942055,
                        "webAddress" : "http://egauge17510.egaug.es/",
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Download via API",
                        "deviceID" : "egauge17510",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4,
                        "displayName" : "Scope"
                    });

                    tags.push({
                        "_id" : new ObjectId("54f85254614f4b2a008b4375"),
                        "name" : "Lighting Panel A3-18-HC",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54f8531d1688f21600d74b4b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54f8531d1688f21600d74b4f")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f84f9df47d311b000f0955"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.38157099999999,
                        "latitude" : 38.942055,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17510:view.A3-18-HC",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 17,
                        "nodeType" : "Supply",
                        "displayName" : "Node"
                    });

                    tags.push({
                        "_id" : new ObjectId("54f8531d1688f21600d74b4b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f85254614f4b2a008b4375"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Minimum",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Custom",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("54f8531d1688f21600d74b4f"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("547ecc8bebd697a8132e7e3b"),
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54f85254614f4b2a008b4375"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.2,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521beaa25a0c541b38d907"),
                        "name" : "Brightergy 6th Floor",
                        "displayName" : "Brightergy 6th Floor",
                        "tagType" : "Facility",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("55521cf9a25a0c541b38d908")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("56685b282279ba2e004337d3")
                            },
                            {
                                "tagType" : "BPD",
                                "id" : new ObjectId("55521cf9a25a0c541b38d90b")
                            },
                            {
                                "tagType" : "BPD",
                                "id" : new ObjectId("55521cf9a25a0c541b38d90c")
                            }
                        ],
                        "parents" : [],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : "Kansas City Power & Light",
                        "nonProfit" : false,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "billingInterval" : 30,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521cf9a25a0c541b38d908"),
                        "name" : "Digi Gateway",
                        "displayName" : "Digi Gateway",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("55521d53a25a0c541b38d909")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("55633fb725db5c501fd1afc5")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to URI",
                        "deviceID" : "00:13:a2:00:40:c0:97:f1",
                        "device" : "Gateway",
                        "manufacturer" : "Digi",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521d53a25a0c541b38d909"),
                        "name" : "Pearl Thermostat",
                        "displayName" : "Pearl Thermostat",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Thermostat",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("55521e2ea25a0c541b38d90a")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521cf9a25a0c541b38d908"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:0d:6f:00:02:f7:46:86",
                        "device" : "Pearl Thermostat",
                        "manufacturer" : "Centralite",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521e2ea25a0c541b38d90a"),
                        "name" : "Temperature",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521d53a25a0c541b38d909"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "desired_temperature",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55633fb725db5c501fd1afc5"),
                        "name" : "GEM",
                        "displayName" : "GEM",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afc6")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afcc")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afd2")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afd8")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afde")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afe4")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1afea")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1aff0")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1aff6")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1affc")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b002")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b008")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b00e")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b014")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b01a")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b020")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b026")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b02c")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b032")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b038")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b03e")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b044")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b04a")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b050")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b056")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b05c")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b062")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b068")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b06e")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b074")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b07a")
                            },
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5563401125db5c501fd1b080")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521cf9a25a0c541b38d908"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : 60,
                        "destination" : null,
                        "accessMethod" : "Push to URI",
                        "deviceID" : "00:13:a2:00:40:30:e8:33",
                        "device" : "GreenEye Monitor",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #1
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afc6"),
                        "isActive": false,
                        "name" : "Power Base NW",
                        "displayName" : "Power Base NW",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afc7")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afc8")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afc9")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afca")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afcb")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_1",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afc7"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afc6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afc8"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afc6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afc9"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afc6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afca"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afc6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afcb"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afc6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #2
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afcc"),
                        "isActive": false,
                        "name" : "Power Base NE",
                        "displayName" : "Power Base NE",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afcd")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afce")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afcf")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd0")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd1")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_2",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afcd"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afcc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afce"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afcc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afcf"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afcc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd0"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afcc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd1"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afcc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #3
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd2"),
                        "isActive": false,
                        "name" : "Receptical Conference",
                        "displayName" : "Receptical Conference",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd3")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd4")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd5")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd6")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd7")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_3",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd3"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd2"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd4"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd2"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd5"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd2"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd6"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd2"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd7"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd2"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #4
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd8"),
                        "isActive": false,
                        "name" : "Lighting West",
                        "displayName" : "Lighting West",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afd9")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afda")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afdb")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afdc")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afdd")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_4",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afd9"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd8"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afda"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd8"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afdb"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd8"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afdc"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd8"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afdd"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afd8"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #5
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afde"),
                        "isActive": false,
                        "name" : "Lighting Center West",
                        "displayName" : "Lighting Center West",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afdf")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe0")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe1")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe2")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe3")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_5",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afdf"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afde"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe0"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afde"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe1"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afde"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe2"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afde"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe3"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afde"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #6
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe4"),
                        "isActive": false,
                        "name" : "Lighting Center East",
                        "displayName" : "Lighting Center East",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe5")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe6")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe7")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe8")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afe9")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_6",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe5"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afe4"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe6"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afe4"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe7"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afe4"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe8"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afe4"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afe9"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afe4"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #7
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afea"),
                        "isActive": false,
                        "name" : "Lighting East",
                        "displayName" : "Lighting East",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afeb")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afec")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afed")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afee")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afef")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_7",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afeb"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afea"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afec"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afea"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afed"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afea"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afee"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afea"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afef"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1afea"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #8
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff0"),
                        "isActive": false,
                        "name" : "IT Outlets",
                        "displayName" : "IT Outlets",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff1")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff2")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff3")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff4")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff5")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_8",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff1"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff0"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff2"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff0"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff3"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff0"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff4"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff0"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff5"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff0"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #9
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff6"),
                        "isActive": false,
                        "name" : "IT Outlets",
                        "displayName" : "IT Outlets",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff7")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff8")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1aff9")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1affa")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1affb")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_9",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff7"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff8"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1aff9"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1affa"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1affb"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1aff6"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #10
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1affc"),
                        "isActive": false,
                        "name" : "Unknown Ch10",
                        "displayName" : "Unknown Ch10",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1affd")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1affe")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1afff")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b000")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b001")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_10",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1affd"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1affc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1affe"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1affc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1afff"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1affc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b000"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1affc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b001"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1affc"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #11
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b002"),
                        "isActive": false,
                        "name" : "Water Heater",
                        "displayName" : "Water Heater",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b003")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b004")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b005")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b006")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b007")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_11",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b003"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b002"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b004"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b002"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b005"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b002"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b006"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b002"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b007"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b002"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #12
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b008"),
                        "isActive": false,
                        "name" : "Water Heater",
                        "displayName" : "Water Heater",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b009")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b00a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b00b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b00c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b00d")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_12",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b009"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b008"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00a"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b008"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b008"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00c"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b008"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00d"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b008"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #13
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00e"),
                        "isActive": false,
                        "name" : "Power Base North",
                        "displayName" : "Power Base North",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b00f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b010")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b011")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b012")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b013")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_13",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b00f"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b00e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b010"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b00e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b011"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b00e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b012"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b00e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b013"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b00e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #14
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b014"),
                        "isActive": false,
                        "name" : "Receptical NE Office",
                        "displayName" : "Receptical NE Office",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b015")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b016")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b017")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b018")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b019")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_14",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b015"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b014"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b016"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b014"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b017"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b014"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b018"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b014"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b019"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b014"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #15
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01a"),
                        "isActive": false,
                        "name" : "Receptical SE Office",
                        "displayName" : "Receptical SE Office",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b01b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b01c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b01d")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b01e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b01f")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_15",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01b"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01c"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01d"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01e"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b01f"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #16
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b020"),
                        "isActive": false,
                        "name" : "Receptical East Col",
                        "displayName" : "Receptical East Col",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b021")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b022")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b023")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b024")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b025")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_16",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b021"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b020"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b022"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b020"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b023"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b020"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b024"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b01a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b025"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b020"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #17
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b026"),
                        "isActive": false,
                        "name" : "Receptical West Col",
                        "displayName" : "Receptical West Col",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b027")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b028")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b029")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b02a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b02b")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_17",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b027"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b026"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b028"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b026"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b029"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b026"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02a"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b026"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02b"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b026"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #18
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02c"),
                        "isActive": false,
                        "name" : "Receptical Kitchen Counter",
                        "displayName" : "Receptical Kitchen Counter",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b02d")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b02e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b02f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b030")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b031")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_18",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02d"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b02c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02e"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b02c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b02f"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b02c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b030"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b02c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b031"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b02c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #19
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b032"),
                        "isActive": false,
                        "name" : "Receptical Refrigerator",
                        "displayName" : "Receptical Refrigerator",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b033")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b034")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b035")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b036")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b037")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_19",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b033"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b032"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b034"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b032"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b035"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b032"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b036"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b032"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b037"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b032"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #20
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b038"),
                        "isActive": false,
                        "name" : "Receptical Kitchen Counter",
                        "displayName" : "Receptical Kitchen Counter",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b039")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b03a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b03b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b03c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b03d")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_20",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b039"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b038"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03a"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b038"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b038"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03c"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b038"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03d"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b038"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #21
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03e"),
                        "isActive": false,
                        "name" : "Printer/Copier",
                        "displayName" : "Printer/Copier",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b03f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b040")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b041")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b042")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b043")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_21",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b03f"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b03e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b040"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b03e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b041"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b03e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b042"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b03e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b043"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b03e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #22
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b044"),
                        "isActive": false,
                        "name" : "Unknown Ch22",
                        "displayName" : "Unknown Ch22",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b045")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b046")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b047")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b048")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b049")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_22",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b045"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b044"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b046"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b044"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b047"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b044"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b048"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b044"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b049"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b044"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #23
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04a"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b04b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b04c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b04d")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b04e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b04f")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_23",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04b"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b04a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04c"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b04a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04d"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b04a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04e"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b04a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b04f"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b04a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #24
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b050"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b051")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b052")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b053")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b054")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b055")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_24",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b051"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b050"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b052"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b050"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b053"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b050"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b054"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b050"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b055"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b050"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #25
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b056"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b057")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b058")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b059")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b05a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b05b")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_25",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b057"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b056"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b058"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b056"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b059"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b056"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05a"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b056"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05b"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b056"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #26
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05c"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b05d")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b05e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b05f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b060")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b061")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_26",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05d"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b05c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05e"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b05c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b05f"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b05c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b060"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b05c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b061"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b05c"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #27
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b062"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b063")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b064")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b065")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b066")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b067")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_27",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b063"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b062"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b064"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b062"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b065"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b062"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b066"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b062"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b067"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b062"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #28
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b068"),
                        "isActive": false,
                        "name" : "Condensor",
                        "displayName" : "Condensor",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b069")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b06a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b06b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b06c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b06d")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_28",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b069"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b068"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06a"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b068"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b068"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06c"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b068"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06d"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b068"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #29
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06e"),
                        "isActive": false,
                        "name" : "Unknown Ch29",
                        "displayName" : "Unknown Ch29",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b06f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b070")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b071")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b072")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b073")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_29",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b06f"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b06e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b070"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b06e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b071"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b06e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b072"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b06e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b073"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b06e"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #30
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b074"),
                        "isActive": true,
                        "name" : "Main Line - Phase A",
                        "displayName" : "Main Line - Phase A",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b075")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b076")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b077")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b078")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b079")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_30",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b075"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b074"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b076"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b074"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b077"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b074"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b078"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b074"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b079"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b074"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #31
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07a"),
                        "isActive": false,
                        "name" : "Main Line - Phase B",
                        "displayName" : "Main Line - Phase B",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b07b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b07c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b07d")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b07e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b07f")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_31",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07b"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b07a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07c"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b07a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07d"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b07a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07e"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b07a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b07f"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b07a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    // Channel #32
                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b080"),
                        "isActive": false,
                        "name" : "Main Line - Phase C",
                        "displayName" : "Main Line - Phase C",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b081")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b082")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b083")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b084")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5563401125db5c501fd1b085")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("55633fb725db5c501fd1afc5"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 38.5763,
                        "latitude" : -90.47239999999999,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "00:13:a2:00:40:30:e8:33_32",
                        "device" : "GEM Channel",
                        "manufacturer" : "Brultech",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b081"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b080"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b082"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b080"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b083"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b080"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b084"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b080"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("5563401125db5c501fd1b085"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5563401125db5c501fd1b080"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "Wh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521cf9a25a0c541b38d90b"),
                        "name" : "BPD-Mx2",
                        "displayName" : "Brightergy Present Display",
                        "tagType" : "BPD",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "Local Time",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "c4:4e:ac:07:ac:cf",
                        "device" : "MX2",
                        "manufacturer" : "Matricom",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521cf9a25a0c541b38d90c"),
                        "name" : "Pavel's BPD",
                        "displayName" : "Pavel's BPD",
                        "tagType" : "BPD",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "Local Time",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "c4:4e:ac:0d:6e:33",
                        "device" : "MX2",
                        "manufacturer" : "Matricom",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("55521cf9a25a0c541b38d90d"),
                        "name" : "Pavel's BPD Sub 2",
                        "displayName" : "Pavel's BPD Sub 2",
                        "tagType" : "BPD",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "potentialPower" : null,
                        "nodeType" : null,
                        "bpLock" : false,
                        "usersWithAccess" : [],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "Local Time",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "CC:FA:00:CB:78:98",
                        "device" : "MX2",
                        "manufacturer" : "Matricom",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id": new ObjectId("56685b282279ba2e004337d3"),
                        "name": "egauge 17984",
                        "displayName": "egauge 17984",
                        "tagType": "Scope",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive": true,
                        "creationTime": "2015-12-09T16:47:36.062+0000",
                        "installAddress": null,
                        "installStreet": null,
                        "installState": null,
                        "installPostalCode": null,
                        "installCountry": null,
                        "installCity": null,
                        "fake": false,
                        "deviceSoftware": [],
                        "commissioningDate": null,
                        "potentialPower": null,
                        "nodeType": null,
                        "bpLock": false,
                        "usersWithAccess": [],
                        "appEntities": [],
                        "children": [
                            {
                                "tagType": "Node",
                                "id": new ObjectId("56685bb12279ba2e004337e0")
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType": "Facility"
                            }
                        ],
                        "externalId": null,
                        "datacoreMetricID": null,
                        "summaryMethod": null,
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "rate": null,
                        "sensorTarget": null,
                        "password": "U2FsdGVkX18vGloepbqKUZLF6ffbbyXcQHig5HVyxO8=",
                        "username": "ilya.shekhurin@brightergy.com",
                        "dateTimeFormat": "UTC",
                        "timezone": "America/Chicago",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.589407,
                        "latitude": 39.083672,
                        "webAddress": "http://egauge17984.egaug.es",
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": "Download via API",
                        "deviceID": "egauge17984",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "image": null,
                        "billingInterval": 0,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "address": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "continent": null,
                        "region": null,
                        "__v": 0
                    });

                    tags.push({
                        "_id" : new ObjectId("56685bb12279ba2e004337e0"),
                        "name" : "Grid",
                        "displayName" : "Grid",
                        "tagType" : "Node",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:49:53.669+0000",
                        "installAddress" : null,
                        "installStreet" : null,
                        "installState" : null,
                        "installPostalCode" : null,
                        "installCountry" : null,
                        "installCity" : null,
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : 0,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("56685bbe2279ba2e004337e1")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("56685bbe2279ba2e004337e2")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("56685bbe2279ba2e004337e3")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("56685bbe2279ba2e004337e4")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("56685bbe2279ba2e004337e5")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : null,
                        "datacoreMetricID" : null,
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "rate" : null,
                        "sensorTarget" : "Grid",
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "continent" : null,
                        "region" : null,
                        "__v" : 6
                    });

                    tags.push({
                        "_id" : new ObjectId("56685bbe2279ba2e004337e1"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:50:06.375+0000",
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : null,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [

                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685bb12279ba2e004337e0"),
                                "tagType" : "Node"
                            },
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : "egauge17984-egauge17984:Grid-W",
                        "datacoreMetricID" : "W",
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "continent" : null,
                        "region" : "North America",
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("56685bbe2279ba2e004337e2"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:50:06.382+0000",
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : null,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [

                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685bb12279ba2e004337e0"),
                                "tagType" : "Node"
                            },
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : "egauge17984-egauge17984:Grid-kW",
                        "datacoreMetricID" : "kW",
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "continent" : null,
                        "region" : "North America",
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("56685bbe2279ba2e004337e3"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:50:06.384+0000",
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : null,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [

                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685bb12279ba2e004337e0"),
                                "tagType" : "Node"
                            },
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : "egauge17984-egauge17984:Grid-Wh",
                        "datacoreMetricID" : "Wh",
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "continent" : null,
                        "region" : "North America",
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("56685bbe2279ba2e004337e4"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:50:06.393+0000",
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : null,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [

                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685bb12279ba2e004337e0"),
                                "tagType" : "Node"
                            },
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : "egauge17984-egauge17984:Grid-kWh",
                        "datacoreMetricID" : "kWh",
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : null,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "continent" : null,
                        "region" : "North America",
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("56685bbe2279ba2e004337e5"),
                        "name" : "Reimbursement",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "isActive" : true,
                        "creationTime" : "2015-12-09T16:50:06.399+0000",
                        "fake" : false,
                        "deviceSoftware" : [

                        ],
                        "commissioningDate" : null,
                        "potentialPower" : null,
                        "nodeType" : "Supply",
                        "bpLock" : false,
                        "usersWithAccess" : [

                        ],
                        "appEntities" : [

                        ],
                        "children" : [

                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("56685bb12279ba2e004337e0"),
                                "tagType" : "Node"
                            },
                            {
                                "id" : new ObjectId("56685b282279ba2e004337d3"),
                                "tagType" : "Scope"
                            },
                            {
                                "id" : new ObjectId("55521beaa25a0c541b38d907"),
                                "tagType" : "Facility"
                            }
                        ],
                        "externalId" : "egauge17984-egauge17984:Grid-R",
                        "datacoreMetricID" : "R",
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "W",
                        "metricType" : "Calculated",
                        "metric" : "Standard",
                        "rate" : 0.1,
                        "sensorTarget" : null,
                        "password" : null,
                        "username" : null,
                        "dateTimeFormat" : "UTC",
                        "timezone" : "America/Chicago",
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : -94.589407,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "egauge17984:Grid",
                        "device" : "EG3000",
                        "manufacturer" : "eGauge",
                        "image" : null,
                        "billingInterval" : 30,
                        "utilityAccounts" : [

                        ],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : "1712 Main Street, 6th Floor, Kansas City, MO, 64108",
                        "street" : "1712 Main Street",
                        "state" : "MO",
                        "postalCode" : "64108",
                        "country" : "USA",
                        "city" : "Kansas City",
                        "continent" : null,
                        "region" : "North America",
                        "__v" : 0
                    });

                    async.each(tags, function (tag, saveCallback) {
                        if (tag.tagType === consts.TAG_TYPE.Facility) {
                            tag.usersWithAccess.push({"id" : new ObjectId("55648919c11ee6ff0bf5c911")});
                            tag.usersWithAccess.push({"id" : new ObjectId("55648919c11ee6ff0bf5c912")});
                            tag.usersWithAccess.push({"id" : new ObjectId("5582c3e0a322bd3e12644342")});
                            tag.usersWithAccess.push({"id" : new ObjectId("5582c3e0a322bd3e12644343")});
                        }
                        if (tag.tagType === consts.TAG_TYPE.Metric) {
                            switch (tag.name) {
                                case "Power (W)":
                                    tag.datacoreMetricID = "W";
                                    break;
                                case "Power (kW)":
                                    tag.datacoreMetricID = "kW";
                                    break;
                                case "Energy (Wh)":
                                    tag.datacoreMetricID = "Wh";
                                    break;
                                case "Energy (kWh)":
                                    tag.datacoreMetricID = "kWh";
                                    break;
                                default:
                                    tag.datacoreMetricID = tag.metricID;
                            }

                            var externalNodeId = "", externalScopeId = "";
                            var nodeId = tag.parents[0].id;
                            var parentNode = _.find(tags, function (ntag) {
                                return ntag._id.toString() === nodeId.toString();
                            });
                            if (parentNode) {
                                externalNodeId = parentNode.deviceID;
                                var scopeId = parentNode.parents[0].id;
                                var parentScope = _.find(tags, function (stag) {
                                    return stag._id.toString() === scopeId.toString();
                                });

                                if (parentScope) {
                                    externalScopeId = parentScope.deviceID;

                                    tag.externalId = externalScopeId + "-" + externalNodeId +
                                        "-" + tag.datacoreMetricID;
                                }
                            }
                        }

                        tag.creationTime = currentTime;

                        var TagModel = new Tag(tag);
                        TagModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertTags = insertTags;
"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Dashboard = mongoose.model("ds_dashboard"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    moment = require("moment"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertDashboards(finalCallback) {

    Dashboard.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var dashboards = [];
                    dashboards.push({
                        "_id" : new ObjectId("5457e1990c5a5d2700affe77"),
                        "title" : "PV System Overview",
                        "startDate" : moment("2014-12-01T00:00:00.000Z"),
                        "endDate" : moment("2015-01-16T00:00:00.000Z"),
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorRole" : "BP",
                        "compareEndDate" : null,
                        "compareStartDate" : null,
                        "widgets" : [
                            {
                                "widget" : new ObjectId("5458ae05fe540a120074c205")
                            },
                            /*{
                                "widget" : new ObjectId("545cff01288e3015002fab73")
                            },
                            {
                                "widget" : new ObjectId("545cff01288e3015002fab72")
                            },
                            {
                                "widget": new ObjectId("545cff01288e3015002fab73")
                            },*/
                            {
                                "widget" : new ObjectId("54637ee3dfcbe62000a7ede7")
                            },
                            /*{
                                "widget" : new ObjectId("545ce53282fc6c3b007005c9")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700111")
                            },*/
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700222")
                            }/*,
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700333")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700444")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700555")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700666")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700777")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700888")
                            },
                            {
                                "widget" : new ObjectId("545ce53282fc6c3b00700999")
                            }*/
                        ],
                        "collections" : [
                            "Default Dashboards"
                        ],
                        "layout" : {
                            "selectedStyle" : 1,
                            "includePrimary": false,
                            "widgets" : {
                                "column1" : [],
                                "column0" : []
                            }
                        },
                        "isPrivate": false,
                        "__v" : 4,
                        "awsAssetsKeyPrefix" : "Tu6BAv3fRFTVBPa1t4ZMnNVF",
                        "segments" : [{
                            "tagBindings" : [{
                                "id" : new ObjectId("5458afc6fe540a120074c20f"),
                                "tagType" : "Scope"
                            }],
                            "name" : "Barretts Elementary Segment",
                            "id" : new ObjectId("545cead6f708b2970ae7edcb")
                        }]
                    });
                    dashboards.push({
                        "_id" : new ObjectId("5461363bdfef7c4800146f4b"),
                        "title" : "Plant Overview",
                        "startDate" : moment("2014-11-02T05:00:00.000Z"),
                        "endDate" : moment("2014-11-08T06:00:00.000Z"),
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorRole" : "BP",
                        "segments" : [
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    }
                                ],
                                "name" : "Liberty Lofts - Solar Power Plant",
                                "id" : new ObjectId("54637850dfcbe62000a7eddf")
                            }
                        ],
                        "compareEndDate" : null,
                        "compareStartDate" : null,
                        "awsAssetsKeyPrefix" : "5jwuF2dHI",
                        "widgets" : [
                            {
                                "widget" : new ObjectId("54637911dfcbe62000a7ede0")
                            },
                            {
                                "widget" : new ObjectId("54637c89dfcbe62000a7ede1")
                            },
                            {
                                "widget" : new ObjectId("54637d58dfcbe62000a7ede2")
                            },
                            {
                                "widget" : new ObjectId("54637d8fdfcbe62000a7ede3")
                            }
                        ],
                        "collections" : [
                            "PV Solar Power Plant"
                        ],
                        "layout" : {
                            "selectedStyle" : 4,
                            "includePrimary" : false,
                            "widgets" : {
                                "column1" : [
                                    "54637c89dfcbe62000a7ede1",
                                    "54637d8fdfcbe62000a7ede3"
                                ],
                                "column0" : [
                                    "54637911dfcbe62000a7ede0",
                                    "54637d58dfcbe62000a7ede2"
                                ]
                            }
                        },
                        "__v" : 134
                    });
                    dashboards.push({
                        "_id" : new ObjectId("5461fee651d2f9150018745f"),
                        "title" : "Inverter Comparison",
                        "startDate" : moment("2014-10-01T00:00:00.000Z"),
                        "endDate" : moment("2014-10-31T00:00:00.000Z"),
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorRole" : "BP",
                        "segments" : [
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Scope",
                                        "id" : new ObjectId("549012d1c15488681a64b6ab")
                                    }
                                ],
                                "name" : "Envoy 1",
                                "id" : new ObjectId("54906c3181cda60823657644")
                            },
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Scope",
                                        "id" : new ObjectId("54902ed7ba2ca1141e4afd72")
                                    }
                                ],
                                "name" : "Envoy 2",
                                "id" : new ObjectId("54906c4281cda60823657645")
                            }
                        ],
                        "compareEndDate" : null,
                        "compareStartDate" : null,
                        "awsAssetsKeyPrefix" : "p8cahZX5x",
                        "widgets" : [
                            {
                                "widget" : new ObjectId("54637ee3dfcbe62000a7ede7")
                            },
                            {
                                "widget" : new ObjectId("5463be269f889721004ffa6c")
                            },
                            {
                                "widget" : new ObjectId("5463beb99f889721004ffa6d")
                            }
                        ],
                        "collections" : [
                            "PV Solar Power Plant"
                        ],
                        "layout" : {
                            "selectedStyle" : 1,
                            "includePrimary" : false,
                            "widgets" : {
                                "column0" : [
                                    "54637ee3dfcbe62000a7ede7",
                                    "5463be269f889721004ffa6c",
                                    "5463beb99f889721004ffa6d"
                                ]
                            }
                        },
                        "__v" : 108
                    });
                    dashboards.push({
                        "_id" : new ObjectId("5461ff0951d2f91500187461"),
                        "title" : "Monthly Report",
                        "startDate" : moment("2014-10-01T00:00:00.000Z"),
                        "endDate" : moment("2014-10-31T00:00:00.000Z"),
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorRole" : "BP",
                        "segments" : [
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    }
                                ],
                                "name" : "Liberty Lofts - Solar Power Plant",
                                "id" : new ObjectId("5463904fdaed9615003bac52")
                            }
                        ],
                        "compareEndDate" : null,
                        "compareStartDate" : null,
                        "awsAssetsKeyPrefix" : "8qRk6oDWP",
                        "widgets" : [
                            {
                                "widget" : new ObjectId("546390ecdaed9615003bac53")
                            },
                            {
                                "widget" : new ObjectId("54639174daed9615003bac54")
                            },
                            {
                                "widget" : new ObjectId("5463925bdaed9615003bac55")
                            },
                            {
                                "widget" : new ObjectId("54639392eb1c0e210015063b")
                            },
                            {
                                "widget" : new ObjectId("5463bd0c9f889721004ffa6a")
                            }
                        ],
                        "collections" : [
                            "PV Solar Power Plant"
                        ],
                        "layout" : {
                            "selectedStyle" : 5,
                            "includePrimary" : false,
                            "widgets" : {
                                "column0" : [
                                    "54639174daed9615003bac54",
                                    "5463bd7e9f889721004ffa6b"
                                ],
                                "column1" : [
                                    "546390ecdaed9615003bac53",
                                    "5463bd0c9f889721004ffa6a"
                                ],
                                "column2" : [
                                    "5463925bdaed9615003bac55",
                                    "54639392eb1c0e210015063b"
                                ]
                            }
                        },
                        "__v" : 43
                    });
                    dashboards.push({
                        "_id" : new ObjectId("5461ff1251d2f91500187462"),
                        "title" : "Daily Report",
                        "startDate" : moment("2014-10-13T00:00:00.000Z"),
                        "endDate" : moment("2014-10-14T00:00:00.000Z"),
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "creatorRole" : "BP",
                        "segments" : [
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    }
                                ],
                                "name" : "New Segment",
                                "id" : new ObjectId("54683f86f48ee7140096618c")
                            },
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    },
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458a2acb0091419007e03df")
                                    }
                                ],
                                "name" : "another",
                                "id" : new ObjectId("546c7b7380f57514008590fa")
                            },
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    },
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458a2acb0091419007e03df")
                                    }
                                ],
                                "name" : "AnotherSeg",
                                "id" : new ObjectId("546c7b8b80f57514008590fb")
                            },
                            {
                                "tagBindings" : [
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458afc6fe540a120074c20f")
                                    },
                                    {
                                        "tagType" : "Facility",
                                        "id" : new ObjectId("5458a2acb0091419007e03df")
                                    }
                                ],
                                "name" : "seg xx",
                                "id" : new ObjectId("546c9eb080f57514008590fe")
                            }
                        ],
                        "compareEndDate" : null,
                        "compareStartDate" : null,
                        "awsAssetsKeyPrefix" : "ZQ2n64jZV",
                        "widgets" : [
                            {
                                "widget" : new ObjectId("54683fa4f48ee7140096618d")
                            },
                            {
                                "widget" : new ObjectId("546c9bd080f57514008590fd")
                            }
                        ],
                        "collections" : [
                            "PV Solar Power Plant"
                        ],
                        "layout" : {
                            "selectedStyle" : 1,
                            "includePrimary" : false,
                            "widgets" : {
                                "column1" : [],
                                "column0" : []
                            }
                        },
                        "__v" : 36
                    });
                    async.each(dashboards, function (dashboard, saveCallback) {
                        var DashboardModel = new Dashboard(dashboard);
                        DashboardModel.save(saveCallback);
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

exports.insertDashboards = insertDashboards;
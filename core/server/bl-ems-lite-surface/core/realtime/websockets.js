"use strict";

var _                        = require("lodash");
var async                    = require("async");
var cronJob                  = require("cron").CronJob;
var memwatch                 = require("memwatch-next");
var moment                   = require("moment");
var config                   = require("../../../../config/environment");
var userDAO                  = require("../../../general/core/dao/user-dao");
var locker                   = require("../../../libs/controller-lock");
var cacheHelper              = require("../../../libs/cache-helper");
var DateTimeUtils            = require("../../../libs/date-time-utils");
var utils                    = require("../../../libs/utils");
var consts                   = require("../../../libs/consts");
var log                      = require("../../../libs/log")(module);
var calcUtils                = require("../calculation/calculator-utils");
var thermostatCalc           = require("../calculation/thermostat-calculator");
var sourcesCalc              = require("../calculation/sources");
var realTimePowerCalc        = require("../calculation/real-time-power-calculator");
var kpiCalc                  = require("../calculation/kpis");
var kwhEnergyConsumptionCalc = require("../calculation/kwh-energy-consumption-calculator");
var exportCalc               = require("../calculation/export");
var electricDemand           = require("../calculation/electric-demand");
var peakDemandDrilldown      = require("../calculation/electric-demand");
var peakDemand               = require("../calculation/peak-demand");
var heatMap                  = require("../calculation/heat-map");
var kinesis                  = require("./kinesis");
var permissionsUtils         = require("../../../general/core/user/permissions-utils");

// this callback will be called on detected memory leak
memwatch.on("leak", function(info) {
    log.error("memory leak, " + moment().format() + " info: " + JSON.stringify(info));
});

// this callback will be called on v8 garbage collection event
memwatch.on("stats", function(stats) {
    log.info("memory stats, " + moment().format() + " info: " + JSON.stringify(stats));
});

// Simple helper to check input data and socketId
var validateInputParams = function(data, socket, eventName, parameters) {
    var clientAnsert = new utils.ClientWebsocketAnswer(socket, eventName);
    if (!data) {
        clientAnsert.error("Empty data");
        return false;
    }
    if (!data.socketId) {
        clientAnsert.error("Incorrect input parameters: No socket id");
        return false;
    }
    log.debug(JSON.stringify(data));

    for (var i = 0, l = parameters.length; i < l; i ++) {
        var v = parameters[i];
        if (_.isEmpty(data[v])) {
            clientAnsert.error("Incorrect parameters: " + v + " is required");
            return false;
        }
    }
    return true;
};

// SocketBinder
var SocketBinder = function(socket, eventName) {
    this.eventName = eventName;
    this.socket = socket;
};

SocketBinder.prototype.bind = function(callback) {
    log.silly("Binding " + this.eventName);
    this.socket.on(this.eventName, function(data) {
        var clientAnswer = new utils.ClientWebsocketAnswer(this.socket, this.eventName);
        if (!data || !data.socketId) {
            return clientAnswer.error("Incorrect parameters");
        }
        var context = {
            eventName: this.eventName,
            clientAnswer: clientAnswer
        };
        callback(data, context);
    }.bind(this));
};
// SocketBinder end

// Kinesis processor
function KinesisProcessor(clientObject, cachedKinesisRecords) {
    this.clientObject = clientObject;

    var nowStart = moment.utc().startOf("minute");
    var nowEnd = moment.utc().endOf("minute");
    //we need add to buffer cached records for current minute
    this.kinesisBuffer = _.filter(cachedKinesisRecords, function(item) {
        var ts = moment.utc(item.ts);
        return !calcUtils.isThermostatKinesisData(item) && ts >= nowStart && ts <= nowEnd &&
            clientObject.nodeArray.indexOf(item.device) > -1;
    });

    for (var i=0; i < this.kinesisBuffer.length; i++) {
        this.kinesisBuffer[i].ts = moment.utc(this.kinesisBuffer[i].ts).milliseconds(0);
    }
}

KinesisProcessor.prototype.evalBuffer = function(buffer) {

    buffer = calcUtils.getLastDevicesDataPoint(buffer);

    sourcesCalc.processKinesisResponse(buffer, this.clientObject,
        this.clientObject.clientAnswerSources);

    realTimePowerCalc.processKinesisResponse(buffer, this.clientObject,
        this.clientObject.clientAnswerRTP);

    electricDemand.processKinesisResponse(
        buffer, this.clientObject.electricDemand, this.clientObject);

    peakDemand.processKinesisResponse(buffer, this.clientObject.peakDemand, this.clientObject);

    peakDemandDrilldown.processKinesisResponse(
        buffer, this.clientObject.peakDemandDrilldown, this.clientObject);

    kpiCalc.processKinesisResponse(
        buffer, this.clientObject.currentDemand, this.clientObject);
};

KinesisProcessor.prototype.getZeroDataItem = function(ts) {
    return _.map(_.cloneDeep(this.kinesisBuffer), function(item) {
        item.ts = ts;
        for (var key in item.values) {
            if (item.values[key] && key !== "ED") {
                item.values[key] = 0;
            }
        }
        return item;
    });
};

//delete records for previous minutes
KinesisProcessor.prototype.clearBuffer = function() {
    if (this.kinesisBuffer.length > 0) {
        var currentMin = moment.utc().minute();
        for (var i= this.kinesisBuffer.length -1; i >=0; i--) {
            if (this.kinesisBuffer[i].ts.minute() !== currentMin) {
                this.kinesisBuffer.splice(i, 1);
            }
        }
    }
};

KinesisProcessor.prototype.process = function(thisRecord) {
    if (!this.clientObject.dateTimeUtils) {
        return;
    }

    thisRecord.ts = moment.utc(thisRecord.ts).milliseconds(0);

    if (calcUtils.isThermostatKinesisData(thisRecord)) {
        return thermostatCalc.processKinesisResponse(thisRecord,
            this.clientObject,
            this.clientObject.clientAnswerThermostat);
    }

    var thisDate = thisRecord.ts;
    var bufferDate = _.isEmpty(this.kinesisBuffer)? null : moment.utc(this.kinesisBuffer[0].ts);

    // buffer the GEM records by minutes
    if (!bufferDate || (bufferDate.hour() === thisDate.hour() && bufferDate.minute() === thisDate.minute())) {
        return this.kinesisBuffer.push(thisRecord);
    }

    //new minute, process buffered records

    this.evalBuffer(this.kinesisBuffer);

    //need compare thisDate and date in buffer
    //if diff more than 1 minute, we do not have data for previous minutes and should generate it with zero values

    var fakeRangeStart = bufferDate.clone();
    var fakeRangeEnd = thisDate.clone();

    var fakes = [];
    while(Math.abs(fakeRangeEnd.minute() - fakeRangeStart.minute()) > 1 &&
    Math.abs(fakeRangeEnd.minute() - fakeRangeStart.minute()) < 59) {
        fakeRangeStart.add(1, "m");
        fakes.push(this.getZeroDataItem(fakeRangeStart.clone()));
    }

    var self = this;
    _.each(fakes, function(fakeRecords) {
        self.evalBuffer(fakeRecords);
    });

    log.debug("this.recordsBuffer size: " + this.kinesisBuffer.length);

    //save curent record
    this.kinesisBuffer = [thisRecord];
};
// Kinesis processor end

exports.run = function(io, sessionParameters) {
    io.use(require("express-socket.io-session")(sessionParameters));

    var clients = {};

    io.sockets.on("connection", function(webSocket) {
        var channelLocker = new locker.Locker();
        var socket = channelLocker.bindSocket(webSocket);

        log.info("SOCKET_CONNECTION:" + socket.id);

        if (!socket.handshake || !socket.handshake.session || !socket.handshake.session.userId) {
            // not logged user
            return log.warn("Not logged user");
        }

        async.waterfall(
            [
                function(cb) {
                    userDAO.getUserByIdIfAllowed(socket.handshake.session.userId, cb);
                },
                function(user, cb) {
                    // get some information from user...
                    userDAO.getUserDemandAndSupplyTags(user, function(err, tags) {
                        cb(err, user, tags);
                    });
                },
                function(user, tags, cb) {
                    cacheHelper.getArray(consts.KINESIS, function(err, cachedData) {
                        cb(err, user, tags, cachedData);
                    });
                }
            ],
            function(err, user, tags, cachedKinesisRecords) {
                if (err) {
                    return utils.logError(err);
                }

                if(!permissionsUtils.userHaveAccessToControl(user)) {
                    return utils.logError(new Error(consts.SERVER_ERRORS.USER.NOT_ALLOWED_APP));
                }

                var emptySources = {
                    selectedFacilities: [],
                    selectedScopes: [],
                    selectedNodes: [],
                    selectedThermostats: []
                };
                var tmp = calcUtils.getTempoIQParametersByUserSources(true, tags, emptySources, tags.cachedSources);

                clients[socket.id] = {
                    emsTags: tags,
                    socket: socket,
                    user: user.toObject(), // plain js object
                    channelLocker: channelLocker,
                    selection: tmp.selection,
                    electricDemandSelection: tmp.electricDemandSelection,
                    facilitiesList: tmp.facilitiesList,
                    nodeList: tmp.nodeList,
                    nodeArray: tmp.nodeArray,
                    selectedFacilities: tmp.firstSelectedSources.selectedFacilities,
                    selectedScopes: tmp.firstSelectedSources.selectedScopes,
                    selectedNodes: tmp.firstSelectedSources.selectedNodes,
                    selectedThermostats: tmp.firstSelectedSources.selectedThermostats,
                    sources: {
                        isHistoricalDataLoaded: false,
                        savedResult: null
                    },
                    dateTimeUtils: new DateTimeUtils(null),
                    realTimePower: {
                        dateRange: "3-hours",
                        isHistoricalDataLoaded: false,
                        savedResult: null
                    },
                    kwhEnergyConsumption: {
                        dateRange: "3-hours"
                    },
                    currentDemand: {
                        isHistoricalDataLoaded: false,
                        savedResult: null,
                        clientAnswer: new utils.ClientWebsocketAnswer(
                            socket, consts.WEBSOCKET_EVENTS.EMS.CurrentDemand),
                    },
                    electricDemand: {
                        dateRange: "3-hours",
                        clientAnswer: new utils.ClientWebsocketAnswer(
                            socket, consts.WEBSOCKET_EVENTS.EMS.ElectricDemand),
                        savedResult: null,
                        isHistoricalDataLoaded: false
                    },
                    peakDemand: {
                        dateRange: "3-hours",
                        clientAnswer: new utils.ClientWebsocketAnswer(
                            socket, consts.WEBSOCKET_EVENTS.EMS.PeakDemand),
                        savedResult: null,
                        isHistoricalDataLoaded: false
                    },
                    peakDemandDrilldown: {
                        dateRange: "3-hours",
                        clientAnswer: new utils.ClientWebsocketAnswer(
                            socket, consts.WEBSOCKET_EVENTS.EMS.PeakDemandDrilldown),
                        savedResult: null
                    },
                    heatMap: {
                        dateRange: "week",
                        clientAnswer: new utils.ClientWebsocketAnswer(
                            socket, consts.WEBSOCKET_EVENTS.EMS.HeatMap
                        )
                    },
                    clientAnswerThermostat: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.Thermostat),
                    clientAnswerSources: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.Sources),
                    clientAnswerRTP: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.RealTimePower),
                    clientAnswerKPIEnergy: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.Energy),
                    clientAnswerKwhEnergyConsumption: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption),
                    clientAnswerExport: new utils.ClientWebsocketAnswer(
                        socket, consts.WEBSOCKET_EVENTS.EMS.Export)
                };

                tmp = null;
                var clientObject = clients[socket.id];

                // subscribe for kinesis events
                var kinesisProcessor = new KinesisProcessor(clientObject, cachedKinesisRecords);
                kinesis.subscribe(socket.id, clientObject.nodeArray, kinesisProcessor);

                //send socketId to client
                socket.emit("connected", { socketId: socket.id });

                async.parallel([
                    function(cb) {
                        channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.Sources, function() {
                            sourcesCalc.loadData(
                                clients[socket.id],
                                clients[socket.id].clientAnswerSources,
                                cb
                            );
                        });
                    },
                    function(cb) {
                        channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.Energy, function() {
                            kpiCalc.loadEnergyData(
                                clients[socket.id],
                                clients[socket.id].clientAnswerKPIEnergy,
                                cb
                            );
                        });
                    },
                    function(cb) {
                        channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.CurrentDemand, function() {
                            kpiCalc.loadCurrentDemandData(
                                clients[socket.id],
                                clients[socket.id].currentDemand.clientAnswer,
                                cb
                            );
                        });
                    }
                ], function(firstEventsErr) {
                    if (firstEventsErr) {
                        utils.logError(firstEventsErr);
                    }
                    if (clients[socket.id]) {
                        // run other calculators
                        async.parallel([
                            function(cb) {
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption,
                                    function() {
                                        kwhEnergyConsumptionCalc.loadHistoricalData(
                                            clients[socket.id],
                                            clients[socket.id].kwhEnergyConsumption.dateRange,
                                            false,
                                            clients[socket.id].clientAnswerKwhEnergyConsumption,
                                            cb
                                        );
                                    });
                            },
                            function(cb) {
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.RealTimePower, function() {
                                    realTimePowerCalc.loadHistoricalData(
                                        clients[socket.id],
                                        clients[socket.id].realTimePower.dateRange,
                                        false,
                                        clients[socket.id].clientAnswerRTP,
                                        cb
                                    );
                                });
                            },
                            function(cb) {
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.ElectricDemand, function() {
                                    electricDemand.loadData(
                                        clients[socket.id],
                                        clients[socket.id].electricDemand,
                                        false,
                                        cb
                                    );
                                });
                            },
                            function(cb) {
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.PeakDemand, function() {
                                    peakDemand.loadData(
                                        clients[socket.id],
                                        clients[socket.id].peakDemand,
                                        false,
                                        cb
                                    );
                                });
                            },
                            function(cb) {
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.HeatMap, function() {
                                    heatMap.loadData(
                                        clients[socket.id],
                                        clients[socket.id].heatMap,
                                        cb
                                    );
                                });
                            }
                        ], function(otherElementsErr) {
                            if (otherElementsErr) {
                                utils.logError(otherElementsErr);
                            }
                            //preloadData(clients[socket.id]);
                        });

                    }
                });

                socket.on("disconnect", function() {
                    // unsubscribe from kinesis events
                    kinesis.unsubscribe(socket.id);
                    delete clients[socket.id];
                    console.log("SOCKET_DISCONNECT: " + socket.id);
                });
            }
        );

        function processUserSelection(dataSocketId, reloadElements) {
            kinesis.unsubscribe(dataSocketId);

            var newKinesisProcessor = new KinesisProcessor(clients[dataSocketId]);

            kinesis.subscribe(
                socket.id,
                clients[dataSocketId].nodeArray,
                newKinesisProcessor);

            clients[dataSocketId].realTimePower.isHistoricalDataLoaded = false;
            clients[dataSocketId].sources.isHistoricalDataLoaded = false;
            clients[dataSocketId].currentDemand.isHistoricalDataLoaded = false;
            clients[dataSocketId].electricDemand.isHistoricalDataLoaded = false;
            clients[dataSocketId].peakDemand.isHistoricalDataLoaded = false;

            if (reloadElements) {
                runAllElements(clients[dataSocketId], true);
            }
        }

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputSelectedSources, function(data) {
            if (!data.selectedFacilities && !data.selectedScopes && !data.selectedNodes &&
                !data.reloadElements && !data.selectedThermostats) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.EMS.inputSelectedSources, result);
            } else if (clients[data.socketId]) {
                clients[data.socketId].selectedFacilities = data.selectedFacilities || [];
                clients[data.socketId].selectedScopes = data.selectedScopes || [];
                clients[data.socketId].selectedNodes = data.selectedNodes || [];
                clients[data.socketId].selectedThermostats = data.selectedThermostats || [];

                var userId = clients[data.socketId].user._id.toString();
                var cacheKey = consts.WEBSOCKET_EVENTS.EMS.SelectedSources + userId;
                var cacheData = {
                    selectedFacilities: clients[data.socketId].selectedFacilities,
                    selectedScopes: clients[data.socketId].selectedScopes,
                    selectedNodes: clients[data.socketId].selectedNodes,
                    selectedThermostats: clients[data.socketId].selectedThermostats
                };

                var tmp = calcUtils.getTempoIQParametersByUserSources(
                    false,
                    clients[data.socketId].emsTags,
                    cacheData
                );

                clients[data.socketId].selection = tmp.selection;
                clients[data.socketId].electricDemandSelection = tmp.electricDemandSelection;
                clients[data.socketId].nodeList = tmp.nodeList;
                clients[data.socketId].facilitiesList = tmp.facilitiesList;
                clients[data.socketId].nodeArray = tmp.nodeArray;

                if (cacheData.selectedFacilities.length > 0 && tmp.selection.devices.or.length > 0) {
                    cacheHelper.setElementDataInfinite(cacheKey, cacheData, function(err) {
                        if (err) {
                            utils.logError(err);
                        }
                        processUserSelection(data.socketId, data.reloadElements);
                    });
                } else {
                    processUserSelection(data.socketId, data.reloadElements);
                }

            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputRealTimePower, function(data) {
            if (!data.dateRange) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.EMS.RealTimePower, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].realTimePower.dateRange = data.dateRange || "month";
                clients[data.socketId].realTimePower.isHistoricalDataLoaded = false;

                var processor = kinesis.getProcessor(data.socketId);
                if (processor) {
                    processor.clearBuffer();
                }

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.RealTimePower, function() {
                    realTimePowerCalc.loadHistoricalData(
                        clients[data.socketId],
                        clients[data.socketId].realTimePower.dateRange,
                        false,
                        clients[data.socketId].clientAnswerRTP,
                        null
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputKwhEnergyConsumption, function(data) {
            if (!data.dateRange) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].kwhEnergyConsumption.dateRange = data.dateRange || "month";

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption, function() {
                    kwhEnergyConsumptionCalc.loadHistoricalData(
                        clients[socket.id],
                        clients[socket.id].kwhEnergyConsumption.dateRange,
                        false,
                        clients[socket.id].clientAnswerKwhEnergyConsumption,
                        null
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputExport, function(data) {
            if (!data.format || !data.table) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.EMS.Export, result);
            } else if (data.socketId && clients[data.socketId]) {

                var userId = clients[data.socketId].user._id.toString();
                exportCalc.exportTable(userId, data.format, data.table, clients[data.socketId].clientAnswerExport);
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputElectricDemand, function(data) {
            if (!validateInputParams(data, socket, consts.WEBSOCKET_EVENTS.EMS.ElectricDemand, ["dateRange"])) {
                return;
            }

            var processor = kinesis.getProcessor(data.socketId);
            if (processor) {
                processor.clearBuffer();
            }

            if (data.socketId && clients[data.socketId]) {

                clients[data.socketId].electricDemand.dateRange = data.dateRange;
                clients[data.socketId].electricDemand.savedResult = null;
                clients[data.socketId].electricDemand.movingAvgCalculator = null;
                electricDemand.loadData(
                    clients[data.socketId],
                    clients[data.socketId].electricDemand,
                    false,
                    null);
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputPeakDemandDrilldown, function(data) {
            if (!validateInputParams(data, socket, consts.WEBSOCKET_EVENTS.EMS.PeakDemandDrilldown, ["dateRange"])) {
                return;
            }

            var processor = kinesis.getProcessor(data.socketId);
            if (processor) {
                processor.clearBuffer();
            }

            if (data.socketId && clients[data.socketId]) {

                clients[data.socketId].peakDemandDrilldown.dateRange = data.dateRange;
                clients[data.socketId].peakDemandDrilldown.savedResult = null;
                clients[data.socketId].peakDemandDrilldown.movingAvgCalculator = null;
                peakDemandDrilldown.loadData(
                    clients[data.socketId],
                    clients[data.socketId].peakDemandDrilldown,
                    false,
                    null);
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputPeakDemand, function(data) {
            if (!validateInputParams(data, socket, consts.WEBSOCKET_EVENTS.EMS.PeakDemand, ["dateRange"])) {
                return;
            }

            var processor = kinesis.getProcessor(data.socketId);
            if (processor) {
                processor.clearBuffer();
            }

            if (data.socketId && clients[data.socketId]) {

                clients[data.socketId].peakDemand.dateRange = data.dateRange;
                clients[data.socketId].peakDemand.realtimeAvgCalculator = null;
                peakDemand.loadData(
                    clients[data.socketId],
                    clients[data.socketId].peakDemand,
                    false);
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.EMS.inputHeatMap, function(data) {
            clients[data.socketId].heatMap.dateRange = data.dateRange;
            heatMap.loadData(
                clients[data.socketId],
                clients[data.socketId].heatMap
            );
        });
    });

    /*function preloadDataForElements(clientObject, dateRangeObj, finalCallback) {
        var fakeClientAnswer = {
            send: function() {},
            error: function() {},
            ok: function() {}
        };

        if (clientObject) {
            async.parallel([
                function(cb) {
                    if (dateRangeObj.Kwh) {
                        kwhEnergyConsumptionCalc.loadHistoricalData(
                            clientObject,
                            dateRangeObj.Kwh,
                            true,
                            clientObject.clientAnswerKwhEnergyConsumption,
                            cb
                        );
                    } else {
                        cb(null);
                    }
                }, function(cb) {
                    if (dateRangeObj.RTP) {
                        realTimePowerCalc.loadHistoricalData(
                            clientObject,
                            dateRangeObj.RTP,
                            true,
                            clientObject.clientAnswerRTP,
                            cb
                        );
                    } else {
                        cb(null);
                    }
                },
                function(cb) {
                    if (dateRangeObj.electricDemand) {
                        electricDemand.loadData(
                            clientObject,
                            {
                                clientAnswer: fakeClientAnswer,
                                dateRange: dateRangeObj.electricDemand
                            },
                            true,
                            cb
                        );
                    } else {
                        cb(null);
                    }
                },
                function(cb) {
                    if (dateRangeObj.peakDemand) {
                        peakDemand.loadData(
                            clientObject,
                            {
                                clientAnswer: fakeClientAnswer,
                                dateRange: dateRangeObj.peakDemand
                            },
                            true,
                            cb
                        );
                    } else {
                        cb(null);
                    }
                }
            ], function(err) {
                finalCallback(err);
            });
        } else {
            finalCallback(null);
        }
    }

    function preloadData(clientObject) {
        async.waterfall([
            function(cb) {
                var dateRangeObj = {
                    Kwh: "24-hours",
                    RTP: "24-hours",
                    electricDemand: "24-hours",
                    peakDemand: "24-hours"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            },
            function(cb) {
                var dateRangeObj = {
                    Kwh: "week",
                    RTP: "week",
                    electricDemand: "week",
                    peakDemand: "week"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            },
            function(cb) {
                var dateRangeObj = {
                    Kwh: "month",
                    RTP: "month",
                    electricDemand: "month",
                    peakDemand: "month"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            },
            function(cb) {
                var dateRangeObj = {
                    Kwh: "year",
                    RTP: "year",
                    electricDemand: "year",
                    peakDemand: "year"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            }
        ], function(preloadErr) {
            if (preloadErr) {
                utils.logError(preloadErr);
            }
        });
    }*/

    function runAllElements(clientObject, runHistoricalElements) {
        if (!clientObject.dateTimeUtils) {
            return;
        }

        var channelLocker = clientObject.channelLocker;

        channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.Energy, function() {
            kpiCalc.loadEnergyData(clientObject, clientObject.clientAnswerKPIEnergy);
        });

        channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.KwhEnergyConsumption, function() {
            kwhEnergyConsumptionCalc.loadHistoricalData(
                clientObject,
                clientObject.kwhEnergyConsumption.dateRange,
                false,
                clientObject.clientAnswerKwhEnergyConsumption,
                null
            );
        });

        if (runHistoricalElements) {
            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.ElectricDemand, function() {
                clientObject.electricDemand.savedResult = null;
                clientObject.electricDemand.movingAvgCalculator = null;
                electricDemand.loadData(
                    clientObject,
                    clientObject.electricDemand,
                    false,
                    null
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.CurrentDemand, function() {
                kpiCalc.loadCurrentDemandData(clientObject, clientObject.currentDemand.clientAnswer);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.PeakDemand, function() {
                clientObject.peakDemand.realtimeAvgCalculator = null;
                peakDemand.loadData(
                    clientObject,
                    clientObject.peakDemand,
                    false
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.PeakDemandDrilldown, function() {
                clientObject.peakDemandDrilldown.savedResult = null;
                clientObject.peakDemandDrilldown.movingAvgCalculator = null;
                peakDemandDrilldown.loadData(
                    clientObject,
                    clientObject.peakDemandDrilldown,
                    null
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.Sources, function() {
                sourcesCalc.loadData(clientObject, clientObject.clientAnswerSources);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.RealTimePower, function() {
                realTimePowerCalc.loadHistoricalData(
                    clientObject,
                    clientObject.realTimePower.dateRange,
                    false,
                    clientObject.clientAnswerRTP,
                    null
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.EMS.HeatMap, function() {
                heatMap.loadData(
                    clientObject,
                    clientObject.heatMap,
                    null
                );
            });
        }
    }

    // start reading data and sending to client by cron job
    var websocketJob = new cronJob({
        cronTime: config.get("websocketsrestartcrontime"),
        onTick: function() {
            log.debug("websocketJob");

            _.forOwn(clients, function(clientObject) {
                runAllElements(clientObject, false);
            }.bind(this));
        },
        start: false
    });

    websocketJob.start();
};

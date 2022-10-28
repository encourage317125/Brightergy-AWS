"use strict";

var _ = require("lodash");
var config = require("../../../../config/environment"),
    cronJob = require("cron").CronJob,
    userDAO = require("../../../general/core/dao/user-dao"),
    async = require("async"),
    utils = require("../../../libs/utils"),
    profiling = require("../../../libs/profiling")(),
    weather = require("./../calculation/weather"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module),
    sourcesCalc = require("../calculation/sources"),
    yieldComparator = require("../calculation/yield-comparision-calculator"),
    kpiCalc = require("../calculation/kpis"),
    kWhElementsDataLoader = require("../calculation/kwh-elements-dataloader"),
    realTimePowerCalc = require("../calculation/real-time-power-calculator"),
    currentPowerChart = require("../calculation/current-power"),
    facilityDrillDown = require("../calculation/facility-drilldown"),
    lastSunnyDay = require("../calculation/last-sunny-day"),
    savingsCalc = require("../calculation/savings-calculator"),
    actualPredictedEnergyCalc = require("../calculation/actual-predicted-energy"),
    solarEnergyCalc = require("../calculation/solar-energy-generation-calculator"),
    locker = require("../../../libs/controller-lock"),
    energyTodayKPIDrilldownCalc = require("../calculation/energy-today-kpi-drilldown"),
    zlib = require("zlib"),
    tableCalc = require("../calculation/table-chart-calculator"),
    calcUtils = require("../calculation/calculator-utils"),
    cacheHelper = require("../../../libs/cache-helper"),
    DateTimeUtils = require("../../../libs/date-time-utils"),
    permissionsUtils = require("../../../general/core/user/permissions-utils");

// disabled 24.03.2015
// moment = require("moment"),
//sunHoursCalc = require("../calculation/sun-hours-calculator");


var memwatch = require("memwatch-next");
var moment = require("moment");

// this callback will be called on detected memory leak
memwatch.on("leak", function(info) {
        log.error("memory leak, " + moment().format() + " info: " + JSON.stringify(info));
    }
);


// this callback will be called on v8 garbage collection event
memwatch.on("stats", function(stats) {
    log.info("memory stats, " + moment().format() + " info: " + JSON.stringify(stats));
});

var CompressionSocket = function(socketIO) {

    // save the emit function
    socketIO.__emitFunction = socketIO.emit;

    // replace the emit function
    // with function with compression

    socketIO.emit = function(event, message) {

        profiling.endTime(event);

        var json = JSON.stringify(message);

        zlib.gzip(json, function(err, zipResult) {
            if (err) {
                log.error(err.message);
                return this.__emitFunction(event, message);
            } else {
                log.debug("event: " + event + ", original size: " + json.length +
                    ", compressed size: " + zipResult.length);
                return this.__emitFunction(event, zipResult);
            }
        }.bind(this));

    };

    return socketIO;
};


exports.run = function(io, sessionParameters) {
    io.use(require("express-socket.io-session")(sessionParameters));

    var clients = {};

    io.sockets.on("connection", function (webSocket) {

        var compressionEnabled = config.get("assurf:compression");

        var socket = webSocket;
        if (compressionEnabled) {
            log.info("socket compression enabled");
            socket = new CompressionSocket(webSocket);
        }

        var channelLocker = new locker.Locker();
        socket = channelLocker.bindSocket(webSocket);

        log.info("SOCKET_CONNECTION:" + socket.id + utils.getWokerIdStr());

        if(socket.handshake && socket.handshake.session && socket.handshake.session.userId) {

            //this is logged user
            async.waterfall([
                function(cb) {
                    userDAO.getUserByIdIfAllowed(socket.handshake.session.userId, cb);
                },
                function(user, cb) {
                    userDAO.getUserSolarTags(user, function(err, tags) {
                        cb(err, user, tags);
                    });
                }
            ], function(err, user, tags) {
                if(err) {
                    utils.logError(err);
                } else {

                    if(!permissionsUtils.userHaveAccessToAnalyze(user)) {
                        return utils.logError(new Error(consts.SERVER_ERRORS.USER.NOT_ALLOWED_APP));
                    }

                    var emptySources = {
                        selectedFacilities: [],
                        selectedScopes: [],
                        selectedNodes: []
                    };

                    var tmp = calcUtils.getTempoIQParametersByUserSources(true, tags, emptySources, tags.cachedSources);

                    var deviceTimeZone = calcUtils.getDeviceTimeZoneByNodeList(tmp.nodeList);

                    clients[socket.id] = {
                        socket: socket,
                        channelLocker: channelLocker,
                        user: user.toObject(),//plain js object
                        dateTimeUtils: new DateTimeUtils(deviceTimeZone),
                        solarTags: tags,
                        selection: tmp.selection,
                        nodeList: tmp.nodeList,
                        facilitiesList: tmp.facilitiesList,
                        // the geo of first selected facility
                        geo: tags.geo,
                        // the geo is not selected facilities
                        defaultGeo: tags.geo,
                        selectedFacilities: tmp.firstSelectedSources.selectedFacilities,
                        selectedScopes: tmp.firstSelectedSources.selectedScopes,
                        selectedNodes: tmp.firstSelectedSources.selectedNodes,
                        solarEnergyGeneration: {
                            dateRange: "month",
                            "year": null,
                            month: null
                        },
                        yieldComparator: {
                            //selectedFacilities: []
                        },
                        currentPower: {
                            //selectedFacilities: []
                        },
                        energyToday: {
                            //selectedFacilities: []
                        },
                        equivalencies: {
                            dateRange: "month"
                        },
                        CarbonAvoided: {
                            dateRange: "month"
                        },
                        realTimePower: {
                            dateRange: "month",
                            "day": null,
                            savedData: {}
                        },
                        savings: {
                            dateRange: "month",
                            "year": null
                        },
                        actualPredictedEnergy: {
                            dateRange: "year",
                            year: null
                        },
                        totalEnergyGeneration: {
                            dateRange: "month"
                        },
                        solarEnergyGenerationDrilldown: {
                            "year": "2015",
                            "dateRange": null
                        },
                        weatherHistory: {},
                        energyTodayKPIDrilldown: {}
                    };
                    tmp = null;

                    async.parallel([
                        function(cb) {
                            profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Energy);
                            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Energy, function() {
                                kpiCalc.loadData(clients[socket.id], cb);
                            });
                        },
                        function(cb) {
                            profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Power);
                            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Power, function() {
                                kpiCalc.loadPowerData(clients[socket.id], cb);
                            });
                        },
                        function(cb) {
                            if (clients[socket.id].geo) {
                                //console.time(consts.WEBSOCKET_EVENTS.ASSURF.Weather);
                                profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Weather);
                                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Weather, function() {
                                    weather.getWeather(clients[socket.id], socket, cb);
                                });
                            } else {
                                cb(null);
                            }
                        }
                    ], function(firstEventsErr, firstEventsdata) {
                        if(firstEventsErr) {
                            utils.logError(firstEventsErr);
                        }

                        if(clients[socket.id]) {

                            //start loading data for other events in parallel

                            async.parallel([
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator);
                                    channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator,
                                        function () {
                                            yieldComparator.loadData(clients[socket.id], cb);
                                        });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy);
                                    channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy,
                                        function () {
                                            actualPredictedEnergyCalc.loadData(clients[socket.id], cb);
                                        });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided);
                                    // No locking should be wrapped
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Sources);
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Savings);

                                    kWhElementsDataLoader.loadTotalMonthlyData(clients[socket.id],
                                        function (totalErr, totalMothlyData) {
                                            if (totalErr) {
                                                utils.logError(totalErr);
                                            } else if (clients[socket.id]) {
                                                channelLocker.tryLockAndRun([
                                                    consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided,
                                                    consts.WEBSOCKET_EVENTS.ASSURF.Sources
                                                ], function () {
                                                    kWhElementsDataLoader.loadCarbonAvoidedData(clients[socket.id],
                                                        totalMothlyData);
                                                    sourcesCalc.loadData(clients[socket.id], totalMothlyData);
                                                    savingsCalc.loadData(clients[socket.id], "month", null,
                                                        totalMothlyData);
                                                });
                                            }

                                            cb(null);
                                        });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration);
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies);
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration);
                                    // ??? need to split maybe?
                                    channelLocker.tryLockAndRun(
                                        [
                                            consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration,
                                            consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies,
                                            consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration
                                        ], function () {
                                            kWhElementsDataLoader.loadData(clients[socket.id], "month", null, null,
                                                [
                                                    consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration,
                                                    consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies,
                                                    consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration
                                                ],
                                                false,
                                                cb
                                            );
                                        });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower);
                                    channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower,
                                        function () {
                                            realTimePowerCalc.loadData(
                                                clients[socket.id], "month", null, false, cb
                                            );
                                        });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay);
                                    channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, function () {
                                        lastSunnyDay.loadLastSunnyDay(clients[socket.id], cb);
                                    });
                                },
                                function(cb) {
                                    profiling.start(consts.WEBSOCKET_EVENTS.ASSURF.Table);
                                    channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Table,
                                        function () {
                                            tableCalc.loadData(clients[socket.id], cb);
                                        });
                                }
                            ], function(otherElementsErr, otherElementsData) {
                                //we loaded data for all elements. Start preloading data for different date ranges
                                if (otherElementsErr) {
                                    utils.logError(otherElementsErr);
                                }

                                //preloadData(clients[socket.id]);


                            });
                        }
                    });

                    //send socketId to client
                    socket.emit("connected", { socketId: socket.id });

                    socket.on("disconnect", function () {
                        delete clients[socket.id];
                        console.log("SOCKET_DISCONNECT: " +socket.id);
                    });
                }
            });
        }

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputEnergyTodayKPIDrilldown, function (data) {
            if (!data.viewerTZOffset || !utils.isNumber(data.viewerTZOffset)) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, result);
            } else if (clients[data.socketId]) {
                clients[data.socketId].energyTodayKPIDrilldown.viewerTZOffset = data.viewerTZOffset;
                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, function () {
                    energyTodayKPIDrilldownCalc.loadData(clients[data.socketId]);
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, function (data) {
            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, function() {
                lastSunnyDay.loadLastSunnyDay(clients[data.socketId]);
            });
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputFacilityDrillDown, function (data) {
            if(!data.inspectedFacility || !data.energyYear) {
                var err = new Error("Incorrect input parameters.");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, result);
            } else if (data.socketId && clients[data.socketId]){
                clients[data.socketId].inspectedFacility = data.inspectedFacility;
                clients[data.socketId].facilityEnergyYear = data.energyYear; // What for?!

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, function(){
                    facilityDrillDown.loadData(
                        clients[data.socketId],
                        clients[data.socketId].inspectedFacility,
                        clients[data.socketId].facilityEnergyYear
                    );
                });
            }
        });

        // received history weather request from client
        // we expect data.dateRange to be { from: [Date], to: [Date] }
        // and location in client socket geo
        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, function (data) {

            log.debug(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory + " event");

            var sendErrorAns = function(message) {
                var err = new Error(message);
                var result = new utils.serverAnswer(false, err);
                return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, result);
            };

            if (!data.socketId) {
                return sendErrorAns("Incorrect input parameters: socketId");
            }

            if (!data.dateRange || !data.dateRange.from || !data.dateRange.to) {
                return sendErrorAns("Incorrect input parameters: dateRange");
            }

            var clientObject = clients[data.socketId];
            if (!clientObject || !clientObject.geo) {
                return sendErrorAns("No geo information for client");
            }
            clientObject.weatherHistory.dateRange = data.dateRange;

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, function() {
                weather.getWeatherHistory(clientObject, data.dateRange, clientObject.socket);
            });
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputSolarEnergyGeneration, function (data) {
            if(!data.dateRange && !data.year && !data.month) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].solarEnergyGeneration.dateRange = data.dateRange || "year";
                clients[data.socketId].solarEnergyGeneration.year = data.year || null;
                clients[data.socketId].solarEnergyGeneration.month = data.month;

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration, function () {
                    kWhElementsDataLoader.loadData(
                        clients[data.socketId],
                        clients[data.socketId].solarEnergyGeneration.dateRange,
                        clients[data.socketId].solarEnergyGeneration.year,
                        clients[data.socketId].solarEnergyGeneration.month,
                        [consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration]
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputTotalEnergyGeneration, function (data) {
            if(!data.dateRange) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration, result);
            } else if (clients[data.socketId]) {
                clients[data.socketId].totalEnergyGeneration.dateRange = data.dateRange || "year";

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration, function() {
                    kWhElementsDataLoader.loadData(
                        clients[data.socketId],
                        clients[data.socketId].totalEnergyGeneration.dateRange,
                        null,
                        null,
                        [consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration]
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputEquivalencies, function (data) {
            if(!data.dateRange) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].equivalencies.dateRange = data.dateRange || "year";

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies, function() {
                    kWhElementsDataLoader.loadData(
                        clients[data.socketId],
                        clients[data.socketId].equivalencies.dateRange,
                        null,
                        null,
                        [consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies]
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputCarbonAvoided, function (data) {
            if(!data.dateRange) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, result);
            } else if (data.socketId && clients[data.socketId]){
                clients[data.socketId].CarbonAvoided.dateRange = data.dateRange || "year";

                // Need to wrap in locker
                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, function() {
                    kWhElementsDataLoader.loadCarbonAvoidedData(clients[data.socketId]);
                });
                /*kWhElementsDataLoader.loadData(
                 clients[data.socketId],
                 clients[data.socketId].CarbonAvoided.dateRange,
                 null,
                 [consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided]
                 );*/
            }
        });

        /*socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputEnergy, function (data) {
         if (data.socketId && clients[data.socketId]){
         channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Energy, function() {
         kpiCalc.loadData(clients[data.socketId]);
         });
         }
         });*/

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, function (data) {
            if (data.socketId && clients[data.socketId]){
                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, function() {
                    currentPowerChart.loadData(clients[data.socketId]);
                });
            }
        });

        // probably were have chosen some facilities
        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator, function (data) {
            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator, function() {
                yieldComparator.loadData(clients[socket.id]);
            });
        });

        /*socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputPower, function (data) {
         if (data.socketId && clients[data.socketId]){
         channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Power, function() {
         kpiCalc.loadPowerData(clients[data.socketId]);
         });
         }
         });*/

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputRealTimePower, function (data) {
            if(!data.dateRange && !data.day) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].realTimePower.dateRange = data.dateRange || "year";
                clients[data.socketId].realTimePower.day = data.day || null;
                clients[data.socketId].realTimePower.savedData = {};

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, function() {
                    realTimePowerCalc.loadData(
                        clients[data.socketId],
                        clients[data.socketId].realTimePower.dateRange,
                        clients[data.socketId].realTimePower.day
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputSavings, function (data) {
            if(!data.dateRange && !data.year) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings, result);
            } else if (data.socketId && clients[data.socketId]) {
                clients[data.socketId].savings.dateRange = data.dateRange || "year";
                clients[data.socketId].savings.year = data.year || null;

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Savings, function() {
                    savingsCalc.loadData(
                        clients[data.socketId],
                        clients[data.socketId].savings.dateRange,
                        clients[data.socketId].savings.year
                    );
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputActualPredictedEnergy, function (data) {
            if(!data.dateRange && !data.year) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, result);
            } else if (clients[data.socketId]) {
                if (!_.include(["year", "total"], data.dateRange)) {
                    log.warn("Incorrect dateRange: " + data.dateRange + ", use year instead");
                    data.dateRange = "year";
                }
                clients[data.socketId].actualPredictedEnergy.dateRange = data.dateRange || "year";
                clients[data.socketId].actualPredictedEnergy.year = data.year || null;

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, function() {
                    actualPredictedEnergyCalc.loadData(clients[data.socketId]);
                });
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputSolarEnergyGenerationDrilldown, function (data) {
            if(!data.dateRange && !data.year) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, result);
            } else if (clients[data.socketId]) {
                clients[data.socketId].solarEnergyGenerationDrilldown.year = data.year || null;
                clients[data.socketId].solarEnergyGenerationDrilldown.dateRange = data.dateRange || null;

                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, function() {
                    solarEnergyCalc.loadCandlestick(
                        clients[data.socketId],
                        clients[data.socketId].solarEnergyGenerationDrilldown.dateRange,
                        clients[data.socketId].solarEnergyGenerationDrilldown.year
                    );
                });
            }
        });

        function processUserSelection(dataSocketId) {
            // need to clear realTime state
            clients[dataSocketId].realTimePower.savedData = {};

            runAllElements(clients[dataSocketId]);

            if(clients[dataSocketId].weatherHistory.dateRange) {
                channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, function () {
                    weather.getWeatherHistory(
                        clients[dataSocketId],
                        clients[dataSocketId].weatherHistory.dateRange,
                        clients[dataSocketId].socket
                    );
                });
            }
        }

        socket.on(consts.WEBSOCKET_EVENTS.ASSURF.inputSelectedSources, function (data) {
            if(!data.selectedFacilities && !data.selectedScopes && !data.selectedNodes) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.inputSelectedSources, result);
            } else if (clients[data.socketId]) {

                clients[data.socketId].selectedFacilities = data.selectedFacilities || [];
                clients[data.socketId].selectedScopes = data.selectedScopes || [];
                clients[data.socketId].selectedNodes = data.selectedNodes || [];

                var userId = clients[data.socketId].user._id.toString();
                var cacheKey = consts.WEBSOCKET_EVENTS.ASSURF.SelectedSources + userId;
                var cacheData = {
                    selectedFacilities: clients[data.socketId].selectedFacilities,
                    selectedScopes: clients[data.socketId].selectedScopes,
                    selectedNodes: clients[data.socketId].selectedNodes
                };

                var tmp = calcUtils.getTempoIQParametersByUserSources(
                    false,
                    clients[data.socketId].solarTags,
                    cacheData);

                clients[data.socketId].selection = tmp.selection;
                clients[data.socketId].nodeList = tmp.nodeList;
                clients[data.socketId].facilitiesList = tmp.facilitiesList;

                if(cacheData.selectedFacilities.length > 0 && tmp.selection.devices.or.length > 0) {
                    cacheHelper.setElementDataInfinite(cacheKey, cacheData, function (err) {
                        if (err) {
                            utils.logError(err);
                        }
                        processUserSelection(data.socketId);

                    });
                } else {
                    processUserSelection(data.socketId);
                }
            }
        });

        // disabled 24.04.2015
        // need to modify formulas and approach for sun hours
        // calculation
        //socket.on(consts.WEBSOCKET_EVENTS.ASSURF.SunHours, function (data) {
        //    var year = data.year || moment.utc().year();
        //    var socketId = data.socketId;
        //    var clientObj = clients[socketId];
        //    sunHoursCalc.loadData(clientObj.geo, year, clientObj.socket);
        //});

    });

    function setGeo(clientObject) {
        if (_.isEmpty(clientObject.selectedFacilities)) {
            // all facilities selected
            clientObject.geo = clientObject.defaultGeo;
        } else {
            var firstSelectedFacilityId = clientObject.selectedFacilities[0];
            var facility = _.find(clientObject.solarTags.facilities, function (item) {
                return item.id === firstSelectedFacilityId;
            });

            if(facility && facility.geo && facility.geo.latitude && facility.geo.longitude) {
                //log.silly("clientObject.solarTags: " + JSON.stringify(clientObject.solarTags));
                //log.silly("selected = " + firstSelectedFacilityId + ", facility = " + JSON.stringify(facility));
                clientObject.geo = facility.geo;
            } else {
                clientObject.geo = clientObject.defaultGeo;
            }
        }
    }

    /*function preloadDataForElements(clientObject, dateRangeObj, finalCallback) {
        if(clientObject) {

            setGeo(clientObject);

            async.parallel([
                function (cb) {
                    if(dateRangeObj.SEG) {
                        kWhElementsDataLoader.loadData(clientObject, dateRangeObj.SEG, null, null,
                            [
                                consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration,
                                consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies,
                                consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration
                            ],
                            true,
                            cb
                        );
                    } else {
                        cb(null);
                    }
                }, function (cb) {
                    if(dateRangeObj.RTP) {
                        realTimePowerCalc.loadData(clientObject, dateRangeObj.RTP, null, true, cb);
                    } else {
                        cb(null);
                    }
                },
                function (cb) {
                    if(dateRangeObj.Savings) {
                        savingsCalc.loadData(clientObject, dateRangeObj.Savings, null, null, true, cb);
                    } else {
                        cb(null);
                    }
                }
            ], function (err) {
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
                    SEG: "year",
                    RTP: "today",
                    Savings: "YTD"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            },
            function(cb) {
                var dateRangeObj = {
                    SEG: "week",
                    RTP: "week",
                    Savings: "today"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            },
            function(cb) {
                var dateRangeObj = {
                    SEG: "total",
                    RTP: null,
                    Savings: "total"
                };
                preloadDataForElements(clientObject, dateRangeObj, cb);
            }
        ], function(preloadErr) {
            if(preloadErr) {
                utils.logError(preloadErr);
            }
        });
    }*/

    function runAllElements(clientObject) {

        if (clientObject.dateTimeUtils) {

            var channelLocker = clientObject.channelLocker;

            setGeo(clientObject);

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Weather, function () {
                weather.getWeather(clientObject, clientObject.socket);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Sources, function () {
                sourcesCalc.loadData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, function () {
                kWhElementsDataLoader.loadCarbonAvoidedData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Energy, function () {
                kpiCalc.loadData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, function () {
                currentPowerChart.loadData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Power, function () {
                kpiCalc.loadPowerData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, function () {
                lastSunnyDay.loadLastSunnyDay(clientObject);
            });

            //solarEnergyCalc.loadData(clientObject);

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration, function () {
                kWhElementsDataLoader.loadData(
                    clientObject,
                    clientObject.solarEnergyGeneration.dateRange,
                    clientObject.solarEnergyGeneration.year,
                    clientObject.solarEnergyGeneration.month,
                    [consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration]
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration, function () {
                kWhElementsDataLoader.loadData(
                    clientObject,
                    clientObject.totalEnergyGeneration.dateRange,
                    null,
                    null,
                    [consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration]
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies, function () {
                kWhElementsDataLoader.loadData(
                    clientObject,
                    clientObject.equivalencies.dateRange,
                    null,
                    null,
                    [consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies]
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, function () {
                realTimePowerCalc.loadData(
                    clientObject,
                    clientObject.realTimePower.dateRange,
                    clientObject.realTimePower.day
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Savings, function () {
                savingsCalc.loadData(
                    clientObject,
                    clientObject.savings.dateRange,
                    clientObject.savings.year
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.YieldComparator, function () {
                yieldComparator.loadData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, function () {
                facilityDrillDown.loadData(
                    clientObject,
                    clientObject.inspectedFacility,
                    clientObject.facilityEnergyYear
                );
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, function () {
                actualPredictedEnergyCalc.loadData(clientObject);
            });


            // disabled 24.04.2015
            // need to modify formulas and approach for sun hours
            // calculation
            //sunHoursCalc.loadData(clientObject.geo, null,
            //    clientObject.socket, consts.WEBSOCKET_EVENTS.ASSURF.SunHoursRealtime) ;

            if (clientObject.solarEnergyGenerationDrilldown.year ||
                clientObject.solarEnergyGenerationDrilldown.dateRange) {
                channelLocker.tryLockAndRun(
                    consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, function () {
                        solarEnergyCalc.loadCandlestick(
                            clientObject,
                            clientObject.solarEnergyGenerationDrilldown.dateRange,
                            clientObject.solarEnergyGenerationDrilldown.year
                        );
                    });
            }

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, function () {
                energyTodayKPIDrilldownCalc.loadData(clientObject);
            });

            channelLocker.tryLockAndRun(consts.WEBSOCKET_EVENTS.ASSURF.Table, function () {
                tableCalc.loadData(clientObject);
            });
        }
    }

    //start reading data and sending to client by cron job
    var websocketJob = new cronJob({
        cronTime: config.get("websocketsrestartcrontime"),
        onTick: function() {
            log.debug("websocketJob");
            log.info("cron clients: " + _.size(clients) + utils.getWokerIdStr());

            _.forOwn(clients, function(clientObject) {
                runAllElements(clientObject);
            }.bind(this));
        },
        start: false
    });

    websocketJob.start();

};

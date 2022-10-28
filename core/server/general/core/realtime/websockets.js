"use strict";

var _ = require("lodash"),
    async = require("async"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module),
    userDAO = require("../../../general/core/dao/user-dao"),
    datasenseWidgetBodyParser = require("../../../bl-data-sense/core/calculation/widget/widget-body-parser"),
    brighterViewWidgetBodyParser = require("../../../bl-brighter-view/core/calculation/widget/widget-body-parser"),
    deviceInfoProcessor = require("../../../bl-brighter-view/core/calculation/presentation/device-info-processor"),
    config = require("../../../../config/environment"),
    cronJob  = require("cron").CronJob;


/**
 * Function loads data for dashboard widgets and sends result to socket
 * @access private
 * @param {object} clientObject
 * @returns {void}
 */
function processDashboards(clientObject) {
    console.log("START DASHBOARDS");
    var socket = clientObject.socket;
    var dashboardsIds = clientObject.dashboards;
    var viewerTZOffset = clientObject.viewerTZOffset;

    dashboardsIds.forEach(function(dashboardId) {
        datasenseWidgetBodyParser.processDashboardBySocket(dashboardId, viewerTZOffset, socket);
    });
}


/**
 * Function loads data for presentation widgets and sends result to socket
 * @access private
 * @param {object} clientObject
 * @returns {void}
 */
function processPresentations(clientObject) {
    console.log("START PRESENTATIONS");
    var socket = clientObject.socket;
    var presentationsIds = clientObject.presentations;

    presentationsIds.forEach(function(presentationId) {
        brighterViewWidgetBodyParser.processPresentationBySocket(presentationId, socket);
    });
}


/**
 * Function loads all devices configs and logs
 */
function processDeviceInfo(clientObject) {
    log.debug("processDeviceInfo");
    deviceInfoProcessor.process(clientObject);
}

// disabled since it's not required for cron
///**
// * Function loads all devices configs and logs
// */
//function processDeviceInfoById(clientObject) {
//    log.debug("processDeviceInfoById");
//    var deviceInfo = clientObject.deviceInfoById;
//    var socket = clientObject.socket;
//    deviceInfoProcessor.process(deviceInfo, socket, true);
//}


/**
 * Function defines server events and adds/removes client socket
 * @access public
 * @param {object} io - socket initial object
 * @returns {void}
 */
exports.run = function(io, sessionParameters) {

    io.use(require("express-socket.io-session")(sessionParameters));

    var clients = {};

    io.sockets.on("connection", function (socket) {

        console.log("SOCKET_CONNECTION:" + socket.id);

        var isClientAuthorised = true;
        if (!socket.handshake || !socket.handshake.session || !socket.handshake.session.userId) {
            log.info("Client not authorized");
            isClientAuthorised = false;
        }

        async.waterfall([
            // we need to get the user first
            function (next) {
                if (isClientAuthorised) {
                    userDAO.getUserByIdIfAllowed(socket.handshake.session.userId, next);
                } else {
                    next(null, null);
                }
            }
        ], function (err, user) {
            if (err) {
                return log.warn(err);
            }

            clients[socket.id] = {
                socket: socket,
                dashboards: [],
                presentations: [],
                deviceConfigs: [],
                deviceInfo: {},
                deviceInfoById: {}
            };
            if (user) {
                clients[socket.id].user = user;
            }

            socket.emit("connected", {socketId: socket.id});

            socket.on("disconnect", function () {
                console.log("SOCKET_DISCONNECT: " + socket.id);
                delete clients[socket.id];
            });

            socket.on("getDashboardData", function (data) {
                if (!data.socketId || !data.dashboards || !data.viewerTZOffset) {
                    var err = new Error("Incorrect input parameters");
                    var result = new utils.serverAnswer(false, err);
                    socket.emit(consts.WEBSOCKET_EVENTS.DASHBOARD_DATA, result);
                } else {
                    clients[data.socketId].dashboards = data.dashboards;
                    clients[data.socketId].viewerTZOffset = data.viewerTZOffset;
                    processDashboards(clients[data.socketId]);
                }
            });

            socket.on("getPresentationData", function (data) {
                log.debug("getPresentationData");
                if (!data.socketId || !data.presentations) {
                    var err = new Error("Incorrect input parameters");
                    var result = new utils.serverAnswer(false, err);
                    socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, result);
                } else {
                    clients[data.socketId].presentations = data.presentations;
                    processPresentations(clients[data.socketId]);
                }
            });


            socket.on(consts.WEBSOCKET_EVENTS.PRESENTATION.inputDeviceInfo, function (data) {
                if (!data || !data.socketId || !clients[data.socketId]) {
                    var err = new Error("Incorrect input parameters");
                    var result = new utils.serverAnswer(false, err);
                    return socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo, result);
                }

                var clientObject = clients[data.socketId];
                clientObject.deviceInfo = {};

                deviceInfoProcessor.process(clientObject);
            });


            socket.on(consts.WEBSOCKET_EVENTS.PRESENTATION.inputDeviceInfoById, function (data) {
                if (!data || !data.socketId || !clients[data.socketId] || !data.deviceIds) {
                    var err = new Error("Incorrect input parameters");
                    var result = new utils.serverAnswer(false, err);
                    return socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo, result);
                }

                var clientObject = clients[data.socketId];
                clientObject.deviceInfoById = {
                    deviceIds: data.deviceIds
                };

                deviceInfoProcessor.process(clientObject, true);
            });
        });
    });


        //start reading data and sending to client by cron job
    var websocketJob = new cronJob({
        cronTime: config.get("websocketsrestartcrontime"),
        onTick: function() {

            for(var socketId in clients) {
                if(clients[socketId]) {
                    var clientObject = clients[socketId];

                    processPresentations(clientObject);

                    processDashboards(clientObject);

                    if (!_.isEmpty(clients[socketId].user)) {
                        // this block only for authorized clients
                        processDeviceInfo(clientObject);
                        return;
                    }
                }
            }
        },
        start: false
    });

    websocketJob.start();
};

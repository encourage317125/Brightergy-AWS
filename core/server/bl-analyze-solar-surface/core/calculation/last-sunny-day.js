"use strict";

var _            = require("lodash");
var moment       = require("moment");
var async        = require("async");
var weatherSrvc  = require("weather-service");
var dataProvider = require("dataprovider-service");
var utils        = require("../../../libs/utils");
var log          = require("../../../libs/log")(module);
var consts       = require("../../../libs/consts");

/**
 * Function processes data from TempoIQ in order to find last sunny day
 * @param {object} data
 * @returns {object} lastSunnyDay
 */
function getLastSunnyDay(weatherItems) {
    var lastSunnyDay = _.findLast(weatherItems, function(item) {
        return item.icon === "clear-day";
    });
    if (lastSunnyDay) {
        return moment.unix(lastSunnyDay.time).utc();
    }
    return moment.utc();
}

/**
 * Function sends query to TempoIQ
 * @param {object} clientObject
 * @returns {void}
 */
function loadLastSunnyDay(clientObject, finalCallback) {
    var socket = clientObject.socket;

    var ctz = clientObject.dateTimeUtils.getClientOffset();
    var latitude = clientObject.geo.latitude;
    var longitude = clientObject.geo.longitude;

    async.waterfall([
        function(cb) {
            var range = clientObject.dateTimeUtils.getNDaysRange(45, "day", "day");
            var includes = "icon";
            weatherSrvc.getForRange(
                latitude, longitude, range.start.unix(), range.end.unix(), ctz, includes
            ).
            then(function(weatherItems) {
                cb(null, weatherItems);
            })
            .catch(cb);
        },
        function(data, cb) {
            var sunnyDay = getLastSunnyDay(data);
            log.debug("sunnyDay: " + sunnyDay.format());

            var range = clientObject.dateTimeUtils.rangeForDay(sunnyDay);

            var selection = clientObject.selection;
            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] // average power by hour
                }, {
                    "name": "rollup",
                    "arguments": ["sum", "1day"]
                }]
            };

            var tempoiqOptions = {
                selection: selection,
                pipeline: pipeline
            };

            if (selection.devices.or.length === 0){
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay,
                    new utils.serverAnswer(false, new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION)));
                return ;
            }

            dataProvider.loadData(range, clientObject.dateTimeUtils, tempoiqOptions, cb);
        },
        function(data, cb) {
            var tmp = _.map(data.dataPoints, function(point) {
                var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
                    var metric = _.first(_.keys(el)); // We are expecting powr or Pac
                    var val = el[metric];
                    return _.isNumber(val) ? parseFloat(val) : 0;
                }), function(sum, x) {
                    return sum + x;
                }, 0.0);

                var day = point.ts;

                return {
                    "day": day,
                    "Energy": sumOfNodes / 1000.0
                };
            });

            cb(null, tmp);
        }
        ],function (err, result) {
            var finalResult = null;
            if(err) {
                finalResult = new utils.serverAnswer(false, err);
            } else {
                // Compose finalResult here
                finalResult = new utils.serverAnswer(true, result);
            }
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, finalResult);

            if (finalCallback) {
                finalCallback(err);
            }
    });
}

exports.loadLastSunnyDay = loadLastSunnyDay;
exports.getLastSunnyDay = getLastSunnyDay;

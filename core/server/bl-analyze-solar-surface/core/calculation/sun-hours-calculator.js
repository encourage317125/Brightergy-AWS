"use strict";

var _      = require("lodash");
var async  = require("async");
var moment = require("moment");
var consts = require("../../../libs/consts");
var log    = require("../../../libs/log")(module);
var utils  = require("../../../libs/utils");

var forecast = null; // TODO: it's never initializing

/** convert degrees to radians */
function toRadian(degrees) {
    return degrees * Math.PI / 180;
}

// radian to degree
function toDegree(rad) {
    return 180 * rad / Math.PI;
}

/** Solar getDeclination
 * @param day Julian day
 * @returns {number} in radians
 */
function getDeclination(day) {
    return 23.45 * Math.sin(toRadian(360 / 365 * (day - 81)));
}

// return AirMass according to formula AM =  1 / cos (fi)
function getAirMass(hour, day, latitude) {
    var latRad = toRadian(latitude);

    // calculate declination from day
    var declination = toRadian(getDeclination(day));
    //log.debug("declination: " + declination + ", degree: " + getDeclination(day));

    // calculate Hour Angle (HRA)
    // it's not hour from local time, it's hour from solar time !!!
    var hra = toRadian(15 * (hour - 12));
    // log.debug("hra: " + hra);

    // calculate elevation
    var elevation = Math.asin(Math.sin(declination) * Math.sin(latRad) +
    Math.cos(declination) * Math.cos(latRad) * Math.cos(hra));
    //log.debug("elevation: " + elevation + ", eleveation degree: " + toDegree(elevation));

    // calculate solar azimuth
    var fi = toRadian(90) - elevation;
    //log.debug("fi: " + fi);

    return 1 / (1E-4 + Math.cos(fi));
}

// return sunrise and sunset in solar time
function getSunTimes(day, latitude) {

    var dec = toRadian(getDeclination(day));
    var lat = toRadian(latitude);

    var x = -(Math.sin(lat) * Math.sin(dec));
    x = x / (Math.cos(lat) * Math.cos(dec));

    if (x > 1.0) {
        x = 1.0;
    }

    if (x < -1.0) {
        x = -1.0;
    }

    var f = Math.acos(x);
    var H = toDegree(f * 1 / 15.0);

    var sunrise = 12.0 - H;
    var sunset = 12.0 + H;

    return { sunrise: sunrise, sunset: sunset, diff: sunset - sunrise };
}

function getSolarRadiation(hour, day, latitude) {
    var am = getAirMass(hour, day, latitude);
    var x1 = Math.pow(0.7, am);
    var sr = 1.353 * Math.pow(x1, 0.68);
    return sr;
}

function getSunHours(location, day, cloudCover) {

    var result = 0;
    var sunTimes = getSunTimes(day, location.latitude);
    log.debug("day: " + day + ", sunTimes: " + JSON.stringify(sunTimes));

    _.range(0, 24, 0.1).forEach(function(hour) {
        if (hour < sunTimes.sunrise || hour > sunTimes.sunset) {
            return;
        }
        var solarRadiation = getSolarRadiation(hour, day, location.latitude);


        // I'am not sure I can do that because, I think dependency is not liner...
        if (cloudCover) {
            solarRadiation *= cloudCover;
        }
        if (solarRadiation >= 0.12) {
            result += 0.1; // 1/10 of hour
        }
    });
    return Math.round(result * 100) / 100;
}

/**
 * incupsulate protocol of work with client
 * @constructor
 * @param socket
 * @param event
 */
var ClientSocket = function(socket, event) {
    this.socket = socket;
    this.event = event;
};

ClientSocket.prototype.sendError = function(message) {
    var err = new Error(message);
    var result = new utils.serverAnswer(false, err);
    this.socket.emit(this.event, result);
};

ClientSocket.prototype.sendAnswer = function(data) {
    var answer = new utils.serverAnswer(true, data);
    this.socket.emit(this.event, answer);
};

/**
 * calculate the sun hours theoretical value
 * @param sunset parsed with moment
 * @param sunrise parsed with moment
 * @param latitude float
 * @param cloudCover float for 0 to 1
 */
function calculateSunHours(day, location, cloudCover) {
    //var value = ((sunset - sunrise)  * (1 - cloudCover)) / 3600;
    //value = Math.round(value * 100) / 100;
    //return value;

    var value = getSunHours(location, day, cloudCover);
    return value;
}

/**
 * Send successful result to client
 * @param forecastResults
 * @param latitude
 * @param clientSocket clientSocket
 */
function sendAnswerToClient(forecastResults, location, clientSocket) {
    var data = [];
    _.forEach(forecastResults, function(res) {
            log.silly("res: " + JSON.stringify(res));
            //var sunrise = moment(res.sunriseTime);
            //var sunset = moment(res.sunsetTime);
            var cloudCover = res.cloudCover || 0;
            var time = moment.unix(res.time);
            var value = calculateSunHours(time.dayOfYear(), location, cloudCover);
            data.push([
                time,
                time.day(),
                value]);
        }
    );

    clientSocket.sendAnswer(data);
}

/**
 * Return array of days from startingDate to endDate
 * date is in the middle of the day (12 hours)
 * @param startDate moment date
 * @param endDate moment date
 */
function calculateDaysForInterval(startDate, endDate) {
    var result = [];
    var current = startDate.clone();
    while (current <= endDate) {
        result.push(current.clone().hour(12));
        current.add(1, "day");
    }
    return result;
}

/**
 * loadData and send to client
 * @private
 * @param geo location { latitude: *, longitude: *}
 * @param historyProvider the provider of historyData
 * @param startingDate moment.utc(..)
 * @param clientSocket clientSocket
 */
function loadDataImpl(geo, historyProvider, startingDate, clientSocket) {
    log.debug("loadDataImpl");

    if (!geo || !geo.latitude || !geo.longitude) {
        clientSocket.sendError("Incorrect input parameters");
    }

    var startDate = startingDate.clone().startOf("year");
    var endDate = startingDate.clone().endOf("year");

    log.debug("startDate: " + startDate + ", endDate: " + endDate);

    var days = calculateDaysForInterval(startDate, endDate);
    var currentDate = moment.utc();

    async.mapLimit(days, 10, function(day, next) {

        // if the day in future
        if (day > currentDate) {
            var result = {
                sunriseTime: 0,
                sunsetTime: 0,
                time: day.unix(),
                cloudCover: 0
            };
            return next(null, result);
        }

        historyProvider.getHistoryDataCustom(geo, day, ["time", "sunriseTime", "sunsetTime", "cloudCover"], next);
    }, function(err, results) {
        if (err) {
            log.error(err);
            return clientSocket.sendError(err);
        }
        sendAnswerToClient(results, geo, clientSocket);
    });
}

/**
 * load data calculated from forecast.provider
 * @param geo location
 * @param socket websocket
 * @returns {*}
 */
function loadData(geo, year, socket, event) {
    if (!event) {
        event = consts.WEBSOCKET_EVENTS.ASSURF.SunHours;
    }
    var clientSocket = new ClientSocket(socket, event);
    var startingDate = moment.utc();
    if (year) {
        startingDate = moment("" + year, "YYYY");
    }
    return loadDataImpl(geo, forecast, startingDate, clientSocket);
}

module.exports.loadData = loadData;
module.exports.calculateDaysForInterval = calculateDaysForInterval;
// for UT
module.exports.calculateSunHours = calculateSunHours;
module.exports.getAirMass = getAirMass;

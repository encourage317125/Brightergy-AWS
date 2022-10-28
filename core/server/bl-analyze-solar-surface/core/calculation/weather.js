"use strict";

var _                 = require("lodash");
var moment            = require("moment");
var weatherSrvc       = require("weather-service");
var log               = require("../../../libs/log")(module);
var consts            = require("../../../libs/consts");
var util              = require("../../../libs/utils");
var validationUtil    = require("../../../libs/validation-util");
var forecastConverter = require("../../../general/core/forecast/forecast-converter");

function _sendError(errOrMessage, socket, event) {
    var err = errOrMessage instanceof Error ? errOrMessage : new Error(errOrMessage);
    log.error(err);

    var result = new util.serverAnswer(false, err);
    socket.emit(event, result);
}

function _sendErrorFromWeather(errOrMessage, socket) {
    _sendError(errOrMessage, socket, consts.WEBSOCKET_EVENTS.ASSURF.Weather);
}

function _sendErrorFromWeatherHistory(errOrMessage, socket) {
    _sendError(errOrMessage, socket, consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory);
}

/** send client the weather info
 * using webSocket consts.WEBSOCKET_EVENTS.ASSURF.Weather event
 * @param clientObject for which weather data is required { latitude: x, longitude: y }
 * @param socket websocket
 * @param finalCallback function that should be called in the end, if exists
 */
function getWeather(clientObject, socket, finalCallback) {
    log.debug("getWeather");

    var ctz = clientObject.dateTimeUtils.getClientOffset();
    var latitude = clientObject.geo.latitude;
    var longitude = clientObject.geo.longitude;
    var city = clientObject.geo.city;

    if (!validationUtil.isValidLatitude(latitude)) {
        return _sendErrorFromWeather("Incorrect latitude parameter", socket);
    }
    if (!validationUtil.isValidLongitude(longitude)) {
        return _sendErrorFromWeather("Incorrect longitude parameter", socket);
    }

    var start = moment().startOf("day").subtract(7, "d").unix();
    var end = moment().startOf("day").unix();
    var includes = "icon,temperatureMax,temperatureMin,sunriseTime,sunsetTime,humidity,pressure,windSpeed,windBearing";

    Promise
        .all([
            weatherSrvc.getCurrent(latitude, longitude, ctz),
            weatherSrvc.getForecast(latitude, longitude, ctz),
            weatherSrvc.getForRange(latitude, longitude, start, end, ctz, includes)
        ])
        .then(function(results) {
            var weatherData = {
                current: results[0],
                forecast: results[1],
                history: results[2]
            };
            weatherData.current.latitude = latitude;
            weatherData.current.longitude = longitude;
            if (weatherData.forecast && weatherData.forecast.length > 0) {
                weatherData.current.sunriseTime = weatherData.forecast[0].sunriseTime;
                weatherData.current.sunsetTime = weatherData.forecast[0].sunsetTime;
                weatherData.current.sunriseDate = weatherData.forecast[0].sunriseDate;
                weatherData.current.sunsetDate = weatherData.forecast[0].sunsetDate;
            }
            if (city) {
                weatherData.current.city = city;
            }
            return weatherData;
        })
        .then(function(weatherData) {
            var result = new util.serverAnswer(true, weatherData);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Weather, result);
            if(finalCallback) {
                finalCallback(null);
            }
        })
        .catch(function(err) {
            _sendErrorFromWeather(err, socket);
        });
}

/** send client the weather history info
 * using webSocket consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory event
 * @param clientObject for which weather data is required { latitude: x, longitude: y }
 * @param dateRange the weather history date range
 * @param socket websocket
 */
function getWeatherHistory(clientObject, dateRange, socket) {
    log.debug("getWeatherHistory");

    var ctz = clientObject.dateTimeUtils.getClientOffset();
    var latitude = clientObject.geo.latitude;
    var longitude = clientObject.geo.longitude;
    var city = clientObject.geo.city;

    if (!validationUtil.isValidLatitude(latitude)) {
        return _sendErrorFromWeatherHistory("Incorrect latitude parameter", socket);
    }
    if (!validationUtil.isValidLongitude(longitude)) {
        return _sendErrorFromWeatherHistory("Incorrect longitude parameter", socket);
    }
    if (!validationUtil.isValidDateRange(dateRange)) {
        return _sendErrorFromWeatherHistory("Incorrect dateRange parameter", socket);
    }

    var start = moment.utc(dateRange.from).startOf("day").unix();
    var end = moment.utc(dateRange.to).startOf("day").unix();
    var includes = "icon,temperatureMax,temperatureMin,sunriseTime,sunsetTime,humidity,pressure,windSpeed,windBearing";

    weatherSrvc
        .getForRange(
            latitude, longitude, start, end, ctz, includes
        )
        .then(function(weatherData) {
            _.each(weatherData, function(weatherItem) {
                if (_.has(weatherItem, "icon")) {
                    weatherItem.icon = forecastConverter.replaceNightWithDay(weatherItem.icon);
                }
                if (city) {
                    weatherItem.city = city;
                }
            });
            return weatherData;
        })
        .then(function(weatherData) {
            var result = new util.serverAnswer(true, { history: weatherData });
            return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, result);
        })
        .catch(function(err) {
            _sendErrorFromWeatherHistory(err, socket);
        });
}

exports.getWeather = getWeather;
exports.getWeatherHistory = getWeatherHistory;
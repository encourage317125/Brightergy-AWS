"use strict";

var weatherSrvc       = require("weather-service");
var bvCalcUtils       = require("./calculator-utils");
var log               = require("../../../../libs/log")(module);
var utils             = require("../../../../libs/utils");
var _                 = require("lodash");
var forecastConverter = require("../../../../general/core/forecast/forecast-converter");
var moment            = require("moment");

/**
 * Function calculated widget data from forecast result
 * @access public
 * @param {object} results - forecast answer
 * @returns {object}
 */
function processForecastAnswers(currentData, weeklyData) {
    var commonData = {
        currently: {
            time: currentData.time,
            summary: currentData.summary,
            icon: currentData.icon,
            nearestStormDistance: null,
            nearestStormBearing: null,
            temperature: currentData.temperature,
            apparentTemperature: currentData.apparentTemperature,
            dewPoint: currentData.dewPoint,
            humidity: currentData.humidity,
            windSpeed: currentData.windSpeed,
            windBearing: currentData.windBearing,
            visibility: currentData.visibility,
            cloudCover: currentData.cloudCover,
            pressure: currentData.pressure,
            ozone: currentData.ozone
        },
        daily: {
            data: []
        }
    };

    for (var i = 0; i < weeklyData.length; i++) {
        commonData.daily.data.push({
            currentTime: weeklyData[i].time,
            icon: weeklyData[i].icon,
            temperatureMin: weeklyData[i].temperatureMin,
            temperatureMax: weeklyData[i].temperatureMax
        });
    }



    return commonData;
}

function getGeoItem(tempoIQItems) {
    var geoItems = _.filter(tempoIQItems, function(item) {
        return item.latitude !== null && item.longitude !== null;
    });
    return geoItems.length > 0 ? geoItems[0] : null;
}

function getWeatherWidgetData(widget, presentation, tempoIQItems, socket, finalCallback) {
    log.info("getWeatherWidgetData");

    var geoItem = getGeoItem(tempoIQItems);

    if (!geoItem) {
        var error = new Error("Please add latitude and longitude to at least one sensor");
        error.status = 422;
        return utils.presentationErrorHandler(error, socket, finalCallback);
    }

    Promise.all([
        weatherSrvc.getCurrent(geoItem.latitude, geoItem.longitude, 0),
        weatherSrvc.getForecast(geoItem.latitude, geoItem.longitude, 0)
    ])
        .then(function (results) {
            results[1] = _.sortBy(results[1], "time");
            var loadedData = processForecastAnswers(results[0], results[1]);

            if (socket) {
                bvCalcUtils.sendWidgetData(loadedData, presentation, widget, true, socket);
                //sendWeatherWidgetData(loadedData, presentation, true, socket);
            } else {
                finalCallback(null, loadedData);
            }
        })
        .catch(function (err) {
            return utils.presentationErrorHandler(err, socket, finalCallback);
        });

}

function combineWeatherByInterval(weatherData, interval) {
    var graphDataList = [];
    var i=0;

    if (weatherData.length > 0) {

        if(interval === "Daily") {
            for (i = 0; i < weatherData.length; i++) {
                graphDataList.push({
                    "currentTime": moment.unix(weatherData[i].time),
                    "temperature": (weatherData[i].temperatureMax - weatherData[i].temperatureMin) / 2,
                    "humidity": weatherData[i].humidity,
                    "pressure": weatherData[i].pressure,
                    "icon": weatherData[i].icon,
                    "iconNumber": forecastConverter.getForecastNumberByText(weatherData[i].icon)
                });
            }
        } else {

            //var startDay = new Date(tempodbAnswer.dataPoints[0].t).getDate();
            var startDate = moment.unix(weatherData[0].time);
            var start = utils.getDateByInterval(startDate, interval);

            var temperature = 0;
            var humidity = 0;
            var pressure = 0;
            var temperatureDayCount = 0;
            var humidityDayCount = 0;
            var pressureDayCount = 0;
            var totalIconNumber = 0;

            var iconsCountMap = {};
            var dateForecast = null;
            var max = 0, iconNumber = null, currentValue = null;
            for (i = 0; i < weatherData.length; i++) {

                var thisDate = moment.unix(weatherData[i].time);
                var currentTemp = (weatherData[i].temperatureMax - weatherData[i].temperatureMin) / 2;
                //hack, no temperature in response
                var currentHumidity = weatherData[i].humidity;
                var currentPressure = weatherData[i].pressure;
                var currentIconNumber = null;

                if (utils.compareDatesByInterval(start, thisDate, interval)) {
                    currentIconNumber = forecastConverter.getForecastNumberByText(weatherData[i].icon);
                    if (currentIconNumber === 1) {
                        currentIconNumber = null;
                    }

                    if (currentTemp) {
                        temperature += currentTemp;
                        temperatureDayCount++;
                    }
                    if (currentHumidity) {
                        humidity += currentHumidity;
                        humidityDayCount++;
                    }
                    if (currentPressure) {
                        pressure += currentPressure;
                        pressureDayCount++;
                    }
                    if (currentIconNumber) {
                        var iconCount = iconsCountMap[currentIconNumber];
                        if (iconCount) {
                            //log.info("increase %s", currentIconNumber);
                            iconsCountMap[currentIconNumber]++;
                        } else {
                            //log.info("added new %s", currentIconNumber);
                            iconsCountMap[currentIconNumber] = 1;
                        }
                    }

                    if (interval === "Daily") {
                        dateForecast = thisDate;
                    } else {
                        dateForecast = start;
                    }
                } else {
                    //startDay = new Date(tempodbAnswer.dataPoints[i].t).getDate()
                    start = utils.getDateByInterval(thisDate, interval);
                    if (temperatureDayCount !== 0) {
                        temperature = temperature / temperatureDayCount;
                    }
                    if (humidityDayCount !== 0) {
                        humidity = humidity / humidityDayCount;
                    }
                    if (pressureDayCount !== 0) {
                        pressure = pressure / pressureDayCount;
                    }

                    max = 0;
                    if (_.size(iconsCountMap) > 0) {
                        for (iconNumber in iconsCountMap) {
                            if (iconsCountMap[iconNumber]) {
                                currentValue = iconsCountMap[iconNumber];
                                if (currentValue > max) {
                                    max = currentValue;
                                    totalIconNumber = iconNumber;
                                }
                            }
                        }
                    }

                    graphDataList.push({
                        "currentTime": moment.utc(dateForecast),
                        "temperature": temperature,
                        "humidity": humidity,
                        "pressure": pressure,
                        "icon": forecastConverter.getForecastTextByNumber(totalIconNumber),
                        "iconNumber": totalIconNumber
                    });

                    if (currentTemp) {
                        temperature = currentTemp;
                        temperatureDayCount = 1;
                    }
                    if (currentHumidity) {
                        humidity = currentHumidity;
                        humidityDayCount = 1;
                    }
                    if (currentPressure) {
                        pressure = currentPressure;
                        pressureDayCount = 1;
                    }
                }

                weatherData[i] = null;
            }
            //log.info(iconsCountMap);

            //write last
            if (temperatureDayCount !== 0) {
                temperature = temperature / temperatureDayCount;
            }
            if (humidityDayCount !== 0) {
                humidity = humidity / humidityDayCount;
            }
            if (pressureDayCount !== 0) {
                pressure = pressure / pressureDayCount;
            }

            max = 0;
            if (_.size(iconsCountMap) > 0) {
                for (iconNumber in iconsCountMap) {
                    if (iconsCountMap[iconNumber]) {
                        currentValue = iconsCountMap[iconNumber];
                        if (currentValue > max) {
                            max = currentValue;
                            totalIconNumber = iconNumber;
                        }
                    }
                }
            }
            graphDataList.push({
                "currentTime": moment.utc(dateForecast),
                "temperature": temperature,
                "humidity": humidity,
                "pressure": pressure,
                "icon": forecastConverter.getForecastTextByNumber(totalIconNumber),
                "iconNumber": totalIconNumber
            });
        }

    }

    weatherData = null;
    return graphDataList;
}

/**
 * Function returns weather data in common format by interval
 * @access private
 * @param {object} tempodbAnswer
 * @param {string} interval
 * @returns {array}
 */
function getWeatherDataByInterval(widgetDTO, tempoIQItems, finalCallback) {
    log.info("getWeatherWidgetData");

    var geoItem = getGeoItem(tempoIQItems);

    var interval = widgetDTO.parameters.widgetGraphInterval;

    if (!geoItem) {
        var error = new Error("Please add latitude and longitude to at least one sensor");
        error.status = 422;
        return finalCallback(error);
    }

    if(interval === "Hourly") {
        return finalCallback(null, []);
    }

    var loadAllExistingData = widgetDTO.parameters.widgetGraphDateRange === "All";
    var start = geoItem.startDate;
    var end = geoItem.endDate;

    if (loadAllExistingData) {
        start.add(-3, "year");
    }

    weatherSrvc
        .getForRange(geoItem.latitude, geoItem.longitude, start.unix(), end.unix(), 0)
        .then(function (weatherItems) {
            weatherItems = _.sortBy(weatherItems, "time");
            var combinedData = combineWeatherByInterval(weatherItems, interval);
            finalCallback(null, combinedData);
        })
        .catch(function (err) {
            finalCallback(err);
        });

}

exports.getWeatherWidgetData = getWeatherWidgetData;
exports.getWeatherDataByInterval = getWeatherDataByInterval;
exports._combineWeatherByInterval = combineWeatherByInterval;
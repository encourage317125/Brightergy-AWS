/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = "../../../../../../../server/",
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts"),
        _ = require("lodash");

    chai.use(require('sinon-chai'));

    describe('weather wudget calculator test suite', function () {

        var weatherWidgetCalc = require(serverRoot + '/bl-brighter-view/core/calculation/widget/weather-widget-calculator');

        var inputWeatherResponse = [
            {
                "apparentTemperatureMaxTime": 1441224000,
                "sunsetTime": 1441240380,
                "pressure": 1016.66,
                "temperatureMinTime": 1441195200,
                "temperatureMax": 90.07,
                "apparentTemperatureMinTime": 1441195200,
                "precipType": "rain",
                "precipIntensity": 0.0006,
                "ozone": 292.54,
                "temperatureMin": 71.42,
                "dewPoint": 69.77,
                "visibility": 9.13,
                "cloudCover": 0.26,
                "apparentTemperatureMax": 94.53,
                "temperatureMaxTime": 1441224000,
                "precipIntensityMax": 0.0041,
                "windBearing": 196,
                "windSpeed": 3.59,
                "precipIntensityMaxTime": 1441238400,
                "icon": "partly-cloudy-night",
                "humidity": 0.72,
                "summary": "Partly cloudy in the morning.",
                "apparentTemperatureMin": 71.42,
                "sunriseTime": 1441193598,
                "precipProbability": 0.42,
                "time": 1441152000
            },
            {
                "apparentTemperatureMaxTime": 1441306800,
                "sunsetTime": 1441326688,
                "pressure": 1014.27,
                "temperatureMinTime": 1441278000,
                "apparentTemperatureMinTime": 1441278000,
                "temperatureMax": 90.77,
                "precipIntensity": 0,
                "ozone": 291.26,
                "temperatureMin": 70.56,
                "dewPoint": 66.77,
                "visibility": 8.44,
                "cloudCover": 0.05,
                "apparentTemperatureMax": 92.11,
                "temperatureMaxTime": 1441306800,
                "precipIntensityMax": 0,
                "windBearing": 198,
                "windSpeed": 4.71,
                "icon": "clear-day",
                "humidity": 0.66,
                "summary": "Clear throughout the day.",
                "apparentTemperatureMin": 70.56,
                "sunriseTime": 1441280050,
                "precipProbability": 0,
                "time": 1441238400
            },
            {
                "apparentTemperatureMaxTime": 1441396800,
                "sunsetTime": 1441412996,
                "pressure": 1014.93,
                "temperatureMinTime": 1441364400,
                "temperatureMax": 91.92,
                "apparentTemperatureMinTime": 1441364400,
                "precipType": "rain",
                "precipIntensity": 0.0016,
                "ozone": 293.22,
                "temperatureMin": 71.04,
                "dewPoint": 68.61,
                "visibility": 8.75,
                "cloudCover": 0.13,
                "apparentTemperatureMax": 95.68,
                "temperatureMaxTime": 1441396800,
                "precipIntensityMax": 0.013,
                "windBearing": 185,
                "windSpeed": 3.76,
                "precipIntensityMaxTime": 1441393200,
                "icon": "rain",
                "humidity": 0.68,
                "summary": "Light rain in the afternoon.",
                "apparentTemperatureMin": 71.04,
                "sunriseTime": 1441366503,
                "precipProbability": 0.53,
                "time": 1441324800
            },
            {
                "apparentTemperatureMaxTime": 1441483200,
                "sunsetTime": 1441499303,
                "pressure": 1016.87,
                "temperatureMinTime": 1441454400,
                "temperatureMax": 92.34,
                "apparentTemperatureMinTime": 1441454400,
                "precipType": "rain",
                "precipIntensity": 0.001,
                "ozone": 291.41,
                "temperatureMin": 70.53,
                "dewPoint": 69.85,
                "visibility": 8.34,
                "cloudCover": 0.14,
                "apparentTemperatureMax": 99.07,
                "temperatureMaxTime": 1441483200,
                "precipIntensityMax": 0.0132,
                "windBearing": 158,
                "windSpeed": 2.89,
                "precipIntensityMaxTime": 1441479600,
                "icon": "partly-cloudy-night",
                "humidity": 0.7,
                "summary": "Partly cloudy overnight.",
                "apparentTemperatureMin": 70.53,
                "sunriseTime": 1441452955,
                "precipProbability": 1,
                "time": 1441411200
            },
            {
                "apparentTemperatureMaxTime": 1441566000,
                "sunsetTime": 1441585610,
                "pressure": 1015.96,
                "temperatureMinTime": 1441540800,
                "apparentTemperatureMinTime": 1441540800,
                "temperatureMax": 93.59,
                "precipIntensity": 0,
                "ozone": 284.01,
                "temperatureMin": 71.36,
                "dewPoint": 69.03,
                "visibility": 9.63,
                "cloudCover": 0.39,
                "apparentTemperatureMax": 99.33,
                "temperatureMaxTime": 1441566000,
                "precipIntensityMax": 0,
                "windBearing": 162,
                "windSpeed": 3.55,
                "icon": "partly-cloudy-day",
                "humidity": 0.67,
                "summary": "Partly cloudy until afternoon.",
                "apparentTemperatureMin": 71.36,
                "sunriseTime": 1441539407,
                "precipProbability": 0,
                "time": 1441497600
            },
            {
                "apparentTemperatureMaxTime": 1441656000,
                "sunsetTime": 1441671916,
                "pressure": 1015.06,
                "temperatureMinTime": 1441623600,
                "temperatureMax": 94.5,
                "apparentTemperatureMinTime": 1441623600,
                "precipType": "rain",
                "precipIntensity": 0.0008,
                "ozone": 283.51,
                "temperatureMin": 71.55,
                "dewPoint": 67.97,
                "visibility": 9.45,
                "cloudCover": 0.4,
                "apparentTemperatureMax": 98.85,
                "temperatureMaxTime": 1441656000,
                "precipIntensityMax": 0.0063,
                "windBearing": 174,
                "windSpeed": 5.92,
                "precipIntensityMaxTime": 1441659600,
                "icon": "rain",
                "humidity": 0.64,
                "summary": "Drizzle starting in the afternoon, continuing until evening.",
                "apparentTemperatureMin": 71.55,
                "sunriseTime": 1441625859,
                "precipProbability": 0.1,
                "time": 1441584000
            },
            {
                "apparentTemperatureMaxTime": 1441738800,
                "sunsetTime": 1441758222,
                "pressure": 1012.21,
                "temperatureMinTime": 1441713600,
                "temperatureMax": 89.85,
                "apparentTemperatureMinTime": 1441713600,
                "precipType": "rain",
                "precipIntensity": 0.0269,
                "ozone": 282.06,
                "temperatureMin": 73.16,
                "dewPoint": 70.21,
                "visibility": 8.94,
                "cloudCover": 0.81,
                "apparentTemperatureMax": 95.88,
                "temperatureMaxTime": 1441738800,
                "precipIntensityMax": 0.1374,
                "windBearing": 195,
                "windSpeed": 6.41,
                "precipIntensityMaxTime": 1441771200,
                "icon": "rain",
                "humidity": 0.73,
                "summary": "Rain throughout the day.",
                "apparentTemperatureMin": 73.16,
                "sunriseTime": 1441712312,
                "precipProbability": 1,
                "time": 1441670400
            },
            {
                "apparentTemperatureMaxTime": 1441832400,
                "sunsetTime": 1441844528,
                "pressure": 1012.84,
                "temperatureMinTime": 1441803600,
                "temperatureMax": 81.7,
                "apparentTemperatureMinTime": 1441803600,
                "precipType": "rain",
                "precipIntensity": 0.0179,
                "ozone": 293.91,
                "temperatureMin": 70.5,
                "dewPoint": 70.04,
                "visibility": 7.33,
                "cloudCover": 0.78,
                "apparentTemperatureMax": 85.84,
                "temperatureMaxTime": 1441832400,
                "precipIntensityMax": 0.0447,
                "windBearing": 30,
                "windSpeed": 4.32,
                "precipIntensityMaxTime": 1441789200,
                "icon": "rain",
                "humidity": 0.86,
                "summary": "Light rain until evening.",
                "apparentTemperatureMin": 70.5,
                "sunriseTime": 1441798764,
                "precipProbability": 0.57,
                "time": 1441756800
            }
        ];

        var tempoIQParam = {
            sensor: "WR8KU002:2002126708",
            type: "Pac"
        };

        it('should be correct result from weather calculator', function () {

            var combinedDataDaily = weatherWidgetCalc._combineWeatherByInterval(_.cloneDeep(inputWeatherResponse), "Daily");
            expect(combinedDataDaily.length).to.equal(8);
            expect(combinedDataDaily[0].currentTime.toISOString()).to.equal("2015-09-02T00:00:00.000Z");

            var combinedDataWeekly = weatherWidgetCalc._combineWeatherByInterval(_.cloneDeep(inputWeatherResponse), "Weekly");
            expect(combinedDataWeekly.length).to.equal(2);
            expect(combinedDataWeekly[0].currentTime.toISOString()).to.equal("2015-08-30T00:00:00.000Z");
            expect(combinedDataWeekly[1].currentTime.toISOString()).to.equal("2015-09-06T00:00:00.000Z");

            var monthlySource = _.cloneDeep(inputWeatherResponse);
            var pressureSum = _.sum(monthlySource, function(day) {
                return day.pressure;
            });
            var calculatedPressure = Math.round((pressureSum / monthlySource.length) * 100) / 100;
            var combinedDataMonthly = weatherWidgetCalc._combineWeatherByInterval(monthlySource, "Monthly");
            expect(combinedDataMonthly.length).to.equal(1);
            expect(combinedDataMonthly[0].currentTime.toISOString()).to.equal("2015-09-01T00:00:00.000Z");
            expect(combinedDataMonthly[0].pressure).to.equal(calculatedPressure);

            var yearlySource = _.cloneDeep(inputWeatherResponse);
            var combinedDataYearly = weatherWidgetCalc._combineWeatherByInterval(yearlySource, "Yearly");
            expect(combinedDataYearly.length).to.equal(1);
            expect(combinedDataYearly[0].currentTime.toISOString()).to.equal("2015-01-01T00:00:00.000Z");
            expect(combinedDataYearly[0].pressure).to.equal(calculatedPressure);
        });


    });
}());

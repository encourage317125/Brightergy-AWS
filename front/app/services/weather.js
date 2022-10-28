angular.module('bl.analyze.solar.surface')
.factory('weatherService', ['$q', 'moment', 'SocketIO',
  function($q, moment, SocketIO) {
    var today, history, forecast;

    function getTodayWeather(rawWeather) {
      today = {
        temperature: {
          now: Math.round(rawWeather.current.temperature),
          min: Math.round(rawWeather.forecast[0].temperatureMin),
          max: Math.round(rawWeather.forecast[0].temperatureMax)
        },
        cityName: rawWeather.current.city,
        air: {
          humidity: Math.round(rawWeather.current.humidity * 100),
          pressure: Math.round(rawWeather.current.pressure),
          windSpeed: Math.round(rawWeather.current.windSpeed)
        },
        sunTime: {
          sunset: rawWeather.current.sunsetDate,
          sunrise: rawWeather.current.sunriseDate
        },
        weatherIcon: 'icon-weather-' + rawWeather.current.icon,
        summary: rawWeather.current.summary,
        lastReportedTime: rawWeather.current.date
      };
      return today;
    }

    function getForeWeather(rawWeather) {
      var limitCounts = 5;
      forecast = rawWeather.forecast.slice(1, limitCounts + 1).map(function (forecast) {
        return {
          date: forecast.date,
          temperature: {
            min: Math.round(forecast.temperatureMin),
            max: Math.round(forecast.temperatureMax)
          }
        };
      });
      return forecast;
    }

    function getHistoricalWeather(rawWeather) {
      var limitCounts = 5;
      history = rawWeather.history.reverse().slice(1, limitCounts + 1).map(function (history) {
        return {
          date: history.date,
          temperature: {
            min: Math.round(history.temperatureMin),
            max: Math.round(history.temperatureMax)
          }
        };
      });

      return history;
    }

    function getWeatherHistory (rawHistory) {
      return rawHistory.map(function (history) {
        return {
          temperature: {
            low: Math.round(history.temperatureMin),
            high: Math.round(history.temperatureMax)
          },
          air: {
            humidity: Math.round(history.humidity * 100),
            pressure: Math.round(history.pressure),
            windSpeed: Math.round(history.windSpeed)
          },
          sunTime: {
            sunset: history.sunsetDate,
            sunrise: history.sunriseDate
          },
          weatherIcon: 'icon-weather-' + history.icon,
          date: history.date,
          city: history.city
        };
      });
    }

    return {
      _getTodayWeather: getTodayWeather,
      _getForeWeather: getForeWeather,
      _getHistoricalWeather: getHistoricalWeather,
      _getWeatherHistory: getWeatherHistory,

      watchWeatherHistory: function (callback) {
        SocketIO.watch('assurf:weatherhistory', function (rawData) {
          callback(getWeatherHistory(rawData.history));
        });
      },

      watchWeather: function (callback) {
        SocketIO.watch('assurf:weather', function(weather) {
          callback({
            todayWeather: getTodayWeather(weather),
            foreWeather: getForeWeather(weather),
            historicalWeather: getHistoricalWeather(weather)
          });
        });
      },

      emitToWeatherHistory: function (startDate, endDate) {
        if (endDate < startDate) {
          endDate = [startDate, startDate = endDate][0]; // do swap
        }

        //console.log('Testing ivan:', startDate, endDate);

        SocketIO.emit('assurf:weatherhistory', {
          'dateRange': {
            'from': moment(startDate).format('YYYY-MM-DD'),
            'to': moment(endDate).format('YYYY-MM-DD')
          }
        });
      }
    };
  }
]);
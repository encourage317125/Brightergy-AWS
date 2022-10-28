describe('SERVICE - bl.analyze.solar.surface.weatherService', function () {
  var weatherService, SocketIO, stub, sampleCurrentWeather, sampleHistoricalWeather, sampleHistory;

  var regularExpressionForDateTime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d)/;
  // regular expression matches example: 2015-09-18T10:11:49+00:00

  sampleCurrentWeather = {
    'time':1442571109,
    'summary':'Drizzle',
    'icon':'rain',
    'nearestStormDistance':0,
    'precipIntensity':0.0061,
    'precipIntensityError':0.0013,
    'precipProbability':0.64,
    'precipType':'rain',
    'temperature':75.01,
    'apparentTemperature':75.01,
    'dewPoint':69.53,
    'humidity':0.83,
    'windSpeed':5.48,
    'windBearing':202,
    'visibility':8.67,
    'cloudCover':0.62,
    'pressure':1009.53,
    'ozone':273.33,
    'date':'2015-09-18T10:11:49+00:00',
    'latitude':38.988724,
    'longitude':-94.575432,
    'sunriseTime':1442577810,
    'sunsetTime':1442622256,
    'sunriseDate':'2015-09-18T12:03:30+00:00',
    'sunsetDate':'2015-09-19T00:24:16+00:00',
    'city':'Kansas City'
  };
  sampleHistoricalWeather = {
    'time':1442534400,
    'summary':'Rain in the morning and afternoon.',
    'icon':'rain',
    'sunriseTime':1442577810,
    'sunsetTime':1442622256,
    'moonPhase':0.17,
    'precipIntensity':0.0216,
    'precipIntensityMax':0.1245,
    'precipIntensityMaxTime':1442574000,
    'precipProbability':0.68,
    'precipType':'rain',
    'temperatureMin':65.03,
    'temperatureMinTime':1442635200,
    'temperatureMax':85.96,
    'temperatureMaxTime':1442606400,
    'apparentTemperatureMin':65.03,
    'apparentTemperatureMinTime':1442635200,
    'apparentTemperatureMax':93.97,
    'apparentTemperatureMaxTime':1442606400,
    'dewPoint':67.98,
    'humidity':0.79,
    'windSpeed':4.38,
    'windBearing':231,
    'visibility':9.18,
    'cloudCover':0.61,
    'pressure':1008.7,
    'ozone':273.53,
    'date':'2015-09-18T00:00:00+00:00',
    'sunriseDate':'2015-09-18T12:03:30+00:00',
    'sunsetDate':'2015-09-19T00:24:16+00:00'
  };
  sampleHistory = {
    city: 'Kansas City',
    date: '2015-09-03T00:00:00+00:00',
    humidity: 0.68,
    icon: 'partly-cloudy-day',
    pressure: 1012.14,
    sunriseDate: '2015-09-03T11:50:12+00:00',
    sunriseTime: 1441281012,
    sunsetDate: '2015-09-04T00:48:15+00:00',
    sunsetTime: 1441327695,
    temperatureMax: 90.6,
    temperatureMin: 71.82,
    time: 1441238400,
    windBearing: 187,
    windSpeed: 8.13
  };

  beforeEach(module('bl.analyze.solar.surface'));

  // Declare global values
  beforeEach(inject(function ($injector) {
    weatherService = $injector.get('weatherService');
    SocketIO = $injector.get('SocketIO');
  }));

  // Spy & Stub SocketIO function
  beforeEach(function () {
    sinon.spy(SocketIO, 'watch');
    stub = sinon.stub(SocketIO, 'emit', function () {
      return arguments;
    });
  });

  // Restore stub function
  afterEach(function () {
    stub.restore();
  });

  it('should be defined', function () {
    expect(weatherService).to.be.defined;
  });


  describe('#watchWeatherHistory public method', function () {
    var cbId, wsChannelName = 'assurf:weatherhistory';
    beforeEach(function () {
      cbId = weatherService.watchWeatherHistory(function () {});
    });

    afterEach(function () {
      SocketIO.unwatch(wsChannelName, cbId);
    });

    it('should watch `assurf:weatherhistory` ws channel', function () {
      expect(SocketIO.watch).to.have.been.called;
      expect(SocketIO.watch).to.have.been.calledWith(wsChannelName);
    });
  });

  describe('#emitToWeatherHistory public method', function () {

    it('should emit via `assurf:weatherhistory` ws channel', function () {
      var startDate = '2014-05-01', endDate = '2014-05-10';
      weatherService.emitToWeatherHistory(startDate, endDate);

      expect(SocketIO.emit).to.have.been.calledWith('assurf:weatherhistory', {
        'dateRange': {
          'from': startDate,
          'to': endDate
        }
      });

    });

    it('should swap the parameter if startDate is after than endDate', function () {
      var startDate = '2014-05-10', endDate = '2014-04-01';
      weatherService.emitToWeatherHistory(startDate, endDate);
      expect(SocketIO.emit).to.have.been.calledWith('assurf:weatherhistory', {
        'dateRange': {
          'from': endDate,
          'to': startDate
        }
      });
    });
  });

  describe('#watchWeather public method', function () {
    var cbId, wsChannelName = 'assurf:weather';
    beforeEach(function () {
      cbId = weatherService.watchWeather(function () {});
    });

    afterEach(function () {
      SocketIO.unwatch(wsChannelName, cbId);
    });

    it('should watch `assurf:weather` ws channel', function () {
      expect(SocketIO.watch).to.have.been.calledWith(wsChannelName);
    });
  });

  describe('#_getTodayWeather private method', function () {
    var todayWeatherResponse, returnValue;
    beforeEach(function () {
      todayWeatherResponse = {
        current: sampleCurrentWeather,
        forecast: [sampleHistoricalWeather]
      };
      returnValue = weatherService._getTodayWeather(todayWeatherResponse);
    });

    it('should return `temperature` after strip decimals by round', function () {
      expect(returnValue.temperature).to.have.keys(['now', 'min', 'max']);
      expect(returnValue.temperature.now).to.equal(Math.round(todayWeatherResponse.current.temperature));
      expect(returnValue.temperature.min).to.equal(Math.round(todayWeatherResponse.forecast[0].temperatureMin));
      expect(returnValue.temperature.max).to.equal(Math.round(todayWeatherResponse.forecast[0].temperatureMax));
    });

    it('should return `air` after strip decimals by round', function () {
      expect(returnValue.air).to.have.keys(['humidity', 'pressure', 'windSpeed']);
      expect(returnValue.air.pressure).to.equal(Math.round(todayWeatherResponse.current.pressure));
      expect(returnValue.air.windSpeed).to.equal(Math.round(todayWeatherResponse.current.windSpeed));
    });

    it('should return `air.humidity` in percentage', function () {
      expect(returnValue.air.humidity).to.equal(Math.round(todayWeatherResponse.current.humidity * 100));
    });

    it('should return `sunTime` with timezone', function () {
      expect(returnValue.sunTime).to.have.keys(['sunset', 'sunrise']);
      expect(returnValue.sunTime.sunset).to.match(regularExpressionForDateTime);
      expect(returnValue.sunTime.sunrise).to.match(regularExpressionForDateTime);
    });

    it('should return `lastReportedTime` with timezone', function () {
      expect(returnValue.lastReportedTime).to.match(regularExpressionForDateTime);
    });
  });

  describe('#_getWeatherHistory private method', function () {
    var historyResponse, returnValue;
    beforeEach(function () {
      historyResponse = [sampleHistory, sampleHistory];
      returnValue = weatherService._getWeatherHistory(historyResponse);
    });

    it('should return `temperature` after strip decimals by round', function () {
      expect(returnValue[0].temperature).to.have.keys(['low', 'high']);
      expect(returnValue[0].temperature.low).to.equal(Math.round(sampleHistory.temperatureMin));
      expect(returnValue[0].temperature.high).to.equal(Math.round(sampleHistory.temperatureMax));
    });

    it('should return `air` after strip decimals by round', function () {
      expect(returnValue[0].air).to.have.keys(['humidity', 'pressure', 'windSpeed']);
      expect(returnValue[0].air.pressure).to.equal(Math.round(sampleHistory.pressure));
      expect(returnValue[0].air.windSpeed).to.equal(Math.round(sampleHistory.windSpeed));
    });

    it('should return `air.humidity` in percentage', function () {
      expect(returnValue[0].air.humidity).to.equal(Math.round(sampleHistory.humidity * 100));
    });

    it('should return `date` with timezone', function () {
      expect(returnValue[0].date).to.match(regularExpressionForDateTime);
    });
  });
});
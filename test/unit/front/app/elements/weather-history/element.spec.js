describe('#WeatherHistory element - bl.analyze.solar.surface', function () {
  beforeEach(module('bl.analyze.solar.surface'));
  beforeEach(module('app/elements/weather-history/template.html'));

  var scope, element, socket;
  beforeEach(inject(function($rootScope, $compile, SocketIO) {
    scope = $rootScope;

    element = angular.element(
      '<element-weather-history></element-weather-history>'
    );
        
    $compile(element)(scope);
    scope.$digest();

    socket = SocketIO;
  }));

  it('should get data and call assignValues() to update weather history', function () {
    it('should be exist assignValues()', function () {
      expect(scope.assignValues).to.exist();
      expect(scope.assignValues).to.be.instanceOf(Function);
    });

    it('should be called assignValues() when data recieved in event "assurf:weatherhistory"', function () {
      beforeEach(function () {
        sinon.spy(scope, "assignValues");
      });
          
      scope.$apply();
      expect(scope.assignValues).to.have.been.called;
    });
  });

  it('should emit socket request when date range changed', function () {
    it('should be emit with event "assurf:weatherhistory" to receive realtime data', function () {
      beforeEach(function () {
        sinon.spy(socket, "emit");
      });
      
      var socketRequest = {
        request: 'assurf:weatherhistory', 
        data: { 
          'dateRange': {
              "from": "2015-01-23", 
              "to": "2015-02-12"
            }
        }
      };
      scope.$apply();
      scope.getDataByDateRange('month');

      expect(socket.emit).to.have.been.calledWith(socketRequest.request, socketRequest.data);
    });
  });

});
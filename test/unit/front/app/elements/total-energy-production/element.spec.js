describe('#TotalEnergyGeneration element - bl.analyze.solar.surface', function () {
  beforeEach(module('bl.analyze.solar.surface'));
  beforeEach(module('app/elements/total-energy-production/template.html'));
  beforeEach(module('app/partials/more-panels/total-energy-production.html'));

  var scope, element, socket;
  beforeEach(inject(function($rootScope, $compile, SocketIO) {
    scope = $rootScope;

    element = angular.element(
      '<element-total-energy-production></element-total-energy-production>'
    );
        
    $compile(element)(scope);
    scope.$digest();

    socket = SocketIO;
  }));

  it('should draw total-energy-production with angular-directive', function () {
    scope.$apply();
    expect($(element).find('.panel').hasClass('total-energy-production')).to.be.equal(true);
  });
  
  it('should have detailElement() to show detail contents when drilldown', function () {
    it('#detailElement()', function () {
      expect(scope.detailElement).to.exist();
      expect(scope.detailElement).to.be.instanceOf(Function);
    });
  });

  it('should get realtime data and call assignValues() to update chart points', function () {
    it('should be exist assignValues()', function () {
      expect(scope.assignValues).to.exist();
      expect(scope.assignValues).to.be.instanceOf(Function);
    });

    it('should be called assignValues() when realtime data recieved in event "assurf:totalenergygeneration"', function () {
      beforeEach(function () {
        sinon.spy(scope, "assignValues");
      });
          
      scope.$apply();
      expect(scope.assignValues).to.have.been.called;
    });
  });

  it('should emit socket request when date range changed', function () {
    it('should be exist getDataByDateRange()', function () {
      expect(scope.getDataByDateRange).to.exist();
      expect(scope.getDataByDateRange).to.be.instanceOf(Function);
    });

    it('should be emit with event "assurf:gettotalenergygeneration" to receive realtime data', function () {
      beforeEach(function () {
        sinon.spy(socket, "emit");
      });
      
      var socketRequest = {
        request: 'assurf:gettotalenergygeneration', 
        data: { 
          'dateRange': 'month',
          'selectedFacilities': [],
          'selectedScopes':[]
        }
      };
      scope.$apply();
      scope.getDataByDateRange('month');

      expect(socket.emit).to.have.been.calledWith(socketRequest.request, socketRequest.data);
    });
  });

});
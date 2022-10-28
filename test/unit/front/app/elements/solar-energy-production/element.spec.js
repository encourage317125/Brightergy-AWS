describe('#SolarEnergyGeneration element - bl.analyze.solar.surface', function () {
  beforeEach(module('bl.analyze.solar.surface'));
  beforeEach(module('app/elements/solar-energy-production/template.html'));
  beforeEach(module('app/partials/more-panels/solar-energy-production.html'));
  
  var scope, element, socket;
  beforeEach(inject(function($rootScope, $compile, SocketIO) {
    scope = $rootScope;
    element = angular.element(
        '<element-solar-energy-production></element-solar-energy-production>'
    );
        
    $compile(element)(scope);
    scope.$digest();

    socket = SocketIO;
  }));

    it('should draw solar-energy-production with angular-directive', function () {
        scope.$apply();
        expect($(element).find('.panel').attr('id')).to.be.equal('solar-energy-production');
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

    it('should be called assignValues() when realtime data recieved in event "assurf:solarenergygeneration"', function () {
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

    it('should be emit with event "assurf:getsolarenergygeneration" to receive realtime data', function () {
      beforeEach(function () {
        sinon.spy(socket, "emit");
      });
      
      var socketRequest = {
        request: 'assurf:getsolarenergygeneration', 
        data: { 
          'socketId' : 'mFj28qKrV43PxUVSAAAB',
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

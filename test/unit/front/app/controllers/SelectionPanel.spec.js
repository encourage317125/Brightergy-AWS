describe('bl.analyze.solar.surface.SelectionPanelController', function () {
  var rootScope, scope, solarTagService, powerService, energyService, SourceSelectionEventService, sandbox;

  beforeEach(module('bl.analyze.solar.surface'));

  beforeEach(inject(function ($injector) {
    sandbox = sinon.sandbox.create();
    var controller = $injector.get('$controller'),
      timeout = $injector.get('$timeout');

    SourceSelectionEventService = $injector.get('SourceSelectionEventService');
    rootScope = $injector.get('$rootScope');
    solarTagService = $injector.get('solarTagService');
    powerService = $injector.get('powerService');
    energyService = $injector.get('energyService');

    var modal = {
      isClosed: false,
      dismiss: function(arg) {}
    };

    scope = rootScope.$new();

    controller('SelectionPanelController', {
      $scope: scope,
      $modal: modal,
      $timeout: timeout,
      solarTagService: solarTagService,
      SourceSelectionEventService: SourceSelectionEventService,
      powerService: powerService,
      energyService: energyService
    });

  }));

  afterEach(function () {
    sandbox.restore();
  });

  describe('#Init load', function () {

    it('should expose initLoads method for loading', function () {
      expect(scope.initLoads).to.exist;
      expect(scope.initLoads).to.be.instanceOf(Function);
    });

    describe('#Load Facilities', function () {
      it('should load the facilities rendered in jade', function (done) {
        sinon.spy(solarTagService, 'getAll');
        scope.initLoads();

        var promise = solarTagService.getAll();
        expect(solarTagService.getAll).to.have.been.called;
        expect(promise).to.be.fulfilled.and.notify(done);

        rootScope.$digest();
      });

      it('should listen socket transfer to update Source power information in real time', function () {
        sinon.stub(solarTagService, 'getAll').returns({
          then: function() {
            return {
              then: function (callback) {
                callback();
              }
            };
          }
        });
        sinon.stub(solarTagService, 'watchAllSolarTags').returns(true);
//        scope.initLoads();
//        expect(solarTagService.watchAllSolarTags).to.have.been.called;
      });
    });

    describe('#Load Current Power', function () {
      it('should listen socket to update current Power element in real time', function () {
        sinon.spy(powerService, 'watchCurrentPower');
        scope.initLoads();
        expect(powerService.watchCurrentPower).to.have.been.called;
      });
    });

    describe('#Load Today Energy', function () {
      it('should listen socket to update Today Energy element in real time', function () {
        sinon.spy(energyService, 'watchCurrentEnergy');
        scope.initLoads();
        expect(energyService.watchCurrentEnergy).to.have.been.called;
      });
    });
  });

  describe('#Source Selection/Deselections', function () {
    beforeEach(function () {
      sinon.spy(SourceSelectionEventService, 'broadcast');
    });

    it('should expose toggleSelectSource method for source selection/deselections', function () {
      expect(scope.toggleSelectSource).to.exist;
      expect(scope.toggleSelectSource).to.be.instanceOf(Function);
    });
/*
    it('should emit "assurf:selectedsources" event from toggleSelectSource method', function () {
      var source = {selected: false, id: '123'};
      scope.toggleSelectSource(source, 'facility');
      expect(SourceSelectionEventService.broadcast).to.have.been.calledOnce;
    });
*/
  });

  describe('#Weather Load', function () {
    it('should get realtime data and call assignValues() to update weather datas', function () {
      it('should be exist assignValues()', function () {
        expect(scope.assignValues).to.exist();
        expect(scope.assignValues).to.be.instanceOf(Function);
      });

      it('should be called assignValues() when realtime data recieved in event "assurf:weather"', function () {
        beforeEach(function () {
          sinon.spy(scope, 'assignValues');
        });

        scope.$apply();
        expect(scope.assignValues).to.have.been.called;
      });
    });
  });
});
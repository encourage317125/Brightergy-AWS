describe('bl.analyze.solar.surface.elements.EquivalenciesDrilldownController', function () {

  beforeEach(module('bl.analyze.solar.surface'));

  var scope, lastEquiv, socketRequest;

  beforeEach(inject(function ($injector) {
    var rootScope = $injector.get('$rootScope'),
        controller = $injector.get('$controller');

    scope = rootScope.$new();

    lastEquiv = {
      'equivData' : {
          'carsRemoved': 522.8,
          'homePowered': 129,
          'seedlingsGrown': 112.3,
          'refrigerators': 104,
          'mobilePhones': 517,
          'batteries': 1250,
          'avoidedCarbon': 653,
          'gallonsGas': 1482,
          'tankersGas': 74.3,
          'railroadCarsCoal': 82,
          'barrelsOil': 576.3,
          'propaneCylinders': 189,
          'powserPlants': 100.3
      },
      'currentDimension' : 'month'
    };

    var modalInstance = {
        isClosed: false,
        dismiss: function(arg) {}
    };

    controller('EquivalenciesDrilldownController', {
      $scope: scope,
      $modalInstance: modalInstance,
      lastEquiv: lastEquiv,
      equivalenciesService: $injector.get('equivalenciesService'),
      SourceSelectionEventService: $injector.get('SourceSelectionEventService')
    });
  }));

  describe('close modal', function () {
    it('should call closeDrilldown method', function () {
        expect(function(){scope.closeDrilldown();}).to.not.throw(Error);
    });
  });
});
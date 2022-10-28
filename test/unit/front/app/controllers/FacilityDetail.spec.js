describe('bl.analyze.solar.surface.facilityDetailsController', function () {

  beforeEach(module('bl.analyze.solar.surface'));

  var scope;

  beforeEach(inject(function ($injector) {
    var rootScope = $injector.get('$rootScope'),
      controller = $injector.get('$controller');
    var modalInstance = {
        isClosed: false,
        dismiss: function(arg) {}
    };
    scope = rootScope.$new();

    controller('facilityDetailsController', {
      $scope: scope,
      $modalInstance: modalInstance,
      selectedFacility: {}
    });
  }));

  describe('#draw chart method', function () {
    it('should exist', function () {
      expect(scope.drawChart).to.exist;
      expect(scope.drawChart).to.be.instanceOf(Function);
    });
  });
});
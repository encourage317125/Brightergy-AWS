describe('bl.analyze.solar.surface.SavingsDrilldownController', function () {

  beforeEach(module('bl.analyze.solar.surface'));

  var scope;
  var modalInstanceProvider = {
    dismiss: function() {},
    close: function() {}
  };
  beforeEach(inject(function ($injector) {
    var rootScope = $injector.get('$rootScope'),
      controller = $injector.get('$controller');
    scope = rootScope.$new();

    controller('SavingsDrilldownController', {
      $scope: scope,
      $modalInstance: modalInstanceProvider,
      primaryElementData: {},
      dateRange: 'month'
    });
  }));

  describe('#updateComboChart', function () {
    it('should exist updateComboChart', function () {
      expect(scope.updateComboChart).to.exist;
      expect(scope.updateComboChart).to.be.instanceOf(Function);
    });
  });

  describe('#updateAreaChart', function () {
    it('should exist updateAreaChart', function () {
      expect(scope.updateAreaChart).to.exist;
      expect(scope.updateAreaChart).to.be.instanceOf(Function);
    });
  });

  describe('#updateTable', function () {
    it('should exist updateTable', function () {
      expect(scope.updateTable).to.exist;
      expect(scope.updateTable).to.be.instanceOf(Function);
    });
  });
});
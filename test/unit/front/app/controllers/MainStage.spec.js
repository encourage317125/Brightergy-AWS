describe('bl.analyze.solar.surface.MainStageController', function () {

  beforeEach(module('bl.analyze.solar.surface'));

  var scope;

  beforeEach(inject(function ($injector) {
    var rootScope = $injector.get('$rootScope'),
      controller = $injector.get('$controller');

    scope = rootScope.$new();

    controller('MainStageController', {
      $scope: scope
    });
  }));

  describe('#init method', function () {
    it('should exist', function () {
      expect(scope.init).to.exist;
      expect(scope.init).to.be.instanceOf(Function);
    });
  });
});
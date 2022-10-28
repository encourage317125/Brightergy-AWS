describe('bl.analyze.solar.surface.asCurrentTime', function () {
  beforeEach(module('bl.analyze.solar.surface'));
  describe('#asCurrentTime directive', function () {
    var scope, element, $filter;
    var format = 'MMM, d h:mm a';

    beforeEach(inject(function ($injector) {
      var $compile = $injector.get('$compile');
      scope = $injector.get('$rootScope');
      $filter = $injector.get('$filter');

      element = angular.element(
        '<as-current-time format="' + format + '">'
      );
      $compile(element)(scope);
      scope.$digest();
    }));

    it('should display the current time in correct format', function () {
      expect(element.html()).to.be.equal($filter('date')(new Date(), format));
    });

    it('should update the current time continuously', function (done) {
      setTimeout(function () {
        expect(element.html()).to.be.equal($filter('date')(new Date(), format));
        done();
      }, 1000);
    });
  });
});
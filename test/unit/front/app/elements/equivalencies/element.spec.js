describe('#Equivalencies element - bl.analyze.solar.surface', function () {

  beforeEach(module('bl.analyze.solar.surface'));
  beforeEach(module('app/elements/equivalencies/template.html'));
  beforeEach(module('app/partials/more-panels/equivalencies.html'));

  var el, scope, controller, socket, element;
  beforeEach(inject(function ($compile, $rootScope, SocketIO) {
    el = angular.element("<element-equivalencies></element-equivalencies>");
    $compile(el)($rootScope.$new());
    $rootScope.$digest();
    controller = el.controller();
    scope = el.isolateScope() || el.scope();
    socket = SocketIO;
  }));
});
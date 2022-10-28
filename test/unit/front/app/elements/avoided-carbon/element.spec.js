describe('#Avoid carbon element - bl.analyze.solar.surface', function () {

  beforeEach(module('bl.analyze.solar.surface'));
  beforeEach(module('app/elements/avoided-carbon/template.html'));
  beforeEach(module('app/partials/more-panels/equivalencies.html'));

  var el, scope, controller, socket;

  beforeEach(inject(function ($compile, $rootScope, SocketIO) {
    el = angular.element('<element-avoided-carbon></element-avoided-carbon>');
    $compile(el)($rootScope.$new());
    $rootScope.$digest();
    controller = el.controller();
    scope = el.isolateScope() || el.scope();
    socket = SocketIO;
  }));



});
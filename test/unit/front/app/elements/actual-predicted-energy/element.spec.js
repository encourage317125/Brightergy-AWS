describe('#Actual vs Predict Energy Comparison - bl.analyze.solar.surface.elements', function () {
    beforeEach(module('bl.analyze.solar.surface'));
    beforeEach(module('app/elements/actual-predicted-energy/template.html'));
    beforeEach(module('app/partials/more-panels/actual-predicted-energy.html'));

    var scope, element, actualPredictedEnergyService;
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope;
        
        element = angular.element(
            '<actual-predicted-energy></actual-predicted-energy>'
        );

        $compile(element)(scope);
        scope.$digest();
    }));

    it('should draw Actual vs Predict Energy Comparison Element with angular-directive', function () {
        scope.$apply();
        expect($(element).find('.panel').attr('id')).to.be.equal('actual-predicted-energy');
    });
});
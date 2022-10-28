describe('#Annual Energy Production Comparison element - bl.analyze.solar.surface', function () {
    beforeEach(module('bl.analyze.solar.surface'));
    beforeEach(module('app/elements/yield-comparison/template.html'));
    beforeEach(module('app/partials/more-panels/yield-comparison.html'));
    
    var scope, element;
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope;

        element = angular.element(
            '<element-yield-comparison></element-yield-comparison>'
        );
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should draw Annual Energy Production Comparison Element with angular-directive', function () {
        scope.$apply();
        expect($(element).find('.panel').attr('id')).to.be.equal('annual-comparison');
    });

    it('should draw highchart Combo graph', function () {
        scope.$apply();
        expect($(element).find('.highcharts-container').length).to.be.equal(1);
    });
});
describe('#Savings element - bl.analyze.solar.surface', function () {
    beforeEach(module('bl.analyze.solar.surface'));
    beforeEach(module('app/elements/savings/template.html'));
    beforeEach(module('app/partials/more-panels/savings.html'));

    var scope, element;
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope;

        element = angular.element(
            '<element-savings></element-savings>'
        );
        
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should draw Savings Element with angular-directive', function () {
        scope.$apply();
        expect($(element).find('.panel').attr('id')).to.be.equal('savings');
    });
    
    it('should have drillDown() method to show detail contents when drilldown', function () {
        it('#drillDown()', function () {
            expect(scope.drillDown).to.exist();
            expect(scope.drillDown).to.be.instanceOf(Function);
        });
    });

});
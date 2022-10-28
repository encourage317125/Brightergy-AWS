describe('#Real-Time Power element - bl.analyze.solar.surface', function () {
    beforeEach(module('bl.analyze.solar.surface'));
    beforeEach(module('app/elements/realtime-power/template.html'));
    beforeEach(module('app/partials/more-panels/real-time-power.html'));

    var scope, element;
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope;

        element = angular.element(
            '<element-realtime-power></element-realtime-power>'
        );
        
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should draw realtime-power with angular-directive', function () {
        scope.$apply();
        expect($(element).find('.panel').attr('id')).to.be.equal('realtime-power');
    });
    
    it('should have drawChart() to draw graph with HighCharts', function () {
        it('#drawChart()', function () {
            expect(scope.drawChart).to.exist();
            expect(scope.drawChart).to.be.instanceOf(Function);
        });
    });
});
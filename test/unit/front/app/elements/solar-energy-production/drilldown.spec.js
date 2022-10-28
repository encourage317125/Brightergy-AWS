describe('#SolarEnergyGeneration drilldown - bl.analyze.solar.surface', function () {

    beforeEach(module('bl.analyze.solar.surface'));

    var scope;
    var energyService, savingService;

    beforeEach(inject(function ($injector) {
        var rootScope = $injector.get('$rootScope'),
            controller = $injector.get('$controller');

        modalInstance = null;
        timeout = $injector.get('$timeout');

        scope = rootScope.$new();

        controller('EnergyGenerationDrilldownCtrl', {
            $scope: scope,
            $modalInstance: modalInstance,
            $timeout: timeout,
            lastSEG: {},
            currentDate: 1,
            dateRange: 'month'
        });
    }));

    it('should be exist function drawCandlestick to draw energy production with candlestick chart', function () {
        it('#drawCandlestick()', function() {
            expect(scope.drawCandlestick).to.exist();
            expect(scope.drawCandlestick).to.be.instanceOf(Function);
        });
        
    });

    it('should be exist function drawTable to draw generation per month with table', function () {
        it('#drawTable()', function() {
            expect(scope.drawTable).to.exist();
            expect(scope.drawTable).to.be.instanceOf(Function);
        });
        
    });

    it('should be exist function drawPieChart to draw generation per sources with pie chart', function () {
        it('#drawPieChart()', function() {
            expect(scope.drawPieChart).to.exist();
            expect(scope.drawPieChart).to.be.instanceOf(Function);
        });
        
    });

    it('should be exist function initCharts to initialize chart configuration', function () {
        it('#initCharts()', function() {
            expect(scope.initCharts).to.exist();
            expect(scope.initCharts).to.be.instanceOf(Function);
        });
    });

    it('should be exist function getCandlestickData to get candlestick data', function () {
        it('#getCandlestickData()', function() {
            expect(scope.getCandlestickData).to.exist();
            expect(scope.getCandlestickData).to.be.instanceOf(Function);
        });
    });

    it('should be exist function updateTable to update table in drilldown', function () {
        it('#updateTable()', function() {
            expect(scope.updateTable).to.exist();
            expect(scope.updateTable).to.be.instanceOf(Function);
        });
    });

    it('should be exist function closeDrilldown to close drilldown', function () {
        it('#closeDrilldown()', function() {
            expect(scope.closeDrilldown).to.exist();
            expect(scope.closeDrilldown).to.be.instanceOf(Function);
        });
    });

    it('should be exist function startWatchDrilldown to receive drilldown data from cloud side', function () {
        it('#startWatchDrilldown()', function() {
            expect(energyService.watchSEGDrilldown).to.have.been.called;
            expect(energyService.watchSEG).to.have.been.called;
            expect(savingService.watchTable).to.have.been.called;
        });
    });


});

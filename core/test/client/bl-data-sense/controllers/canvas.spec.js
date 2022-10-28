describe('blApp.dataSense.controllers.CanvasController', function () {

    beforeEach(module('blApp.dataSense.controllers', 'blApp.dataSense.services', 'blApp.dataSense'));

    /*var scope,
     CanvasController,
     DashboardService,
     WidgetService;*/

    /*var modalInstance = {
     result: {
     then: function (confirmCallback, cancelCallback) {
     this.confirmCallback = confirmCallback;
     this.cancelCallback = cancelCallback;
     }
     },
     close: function (item) {
     this.result.confirmCallback(item);
     },
     dismiss: function (type) {
     this.result.cancelCallback(type);
     }
     };
     beforeEach(inject(function($modal) {
     sinon.stub($modal, 'open').returns(modalInstance);
     }));

     beforeEach(inject(function ($injector) {
     var rootScope = $injector.get('$rootScope'),
     controller = $injector.get('$controller'),
     _$modal_ = $injector.get('$modal'),
     _ANALYZE_CONSTS_ = $injector.get('ANALYZE_CONSTS');

     DashboardService = $injector.get('dashboardService');
     WidgetService = $injector.get('widgetService');

     scope = rootScope.$new();
     rootScope.selectedDashboard = {
     _id: 'dummydashboard',
     widgets:[
     {
     "widget": {
     "_id":"dummywidget",
     "type":"Boilerplate",
     "title":"Communication Monitoring",
     "creator":"54135f90c6ab7c241e28095e",
     "metric":{
     "_id":"545906ddded7ea0f0079840c",
     "name":"Power (kW)"
     }
     }
     }
     ],
     segments: []
     };
     controller('CanvasController', {
     $scope: scope,
     $rootScope: rootScope,
     dashboardService: DashboardService,
     widgetService: WidgetService,
     $modal: _$modal_,
     ANALYZE_CONSTS: _ANALYZE_CONSTS_
     });
     }));*/

    /*describe('#legend status', function () {
     /*it('should expose toggleLegend() method to scope', function () {
     expect(scope.toggleLegend).to.exist();
     expect(scope.toggleLegend).to.be.instanceOf(Function);
     });

     it('should update the widget status', function () {
     var dummyWidget = {
     _id: 'dummy widget',
     legendVisible: false
     };
     sinon.spy(WidgetService, 'updateWidget');
     sinon.spy(scope, 'drawChart');
     //scope.toggleLegend(dummyWidget);
     expect(dummyWidget.legendVisible).to.be.equal(true);
     expect(WidgetService.updateWidget).to.have.been.calledWith(dummyWidget);
     expect(scope.drawChart).to.have.been.calledWith(dummyWidget);
     });
     });*/


    /*describe('#renderBarWidget', function () {

     describe('initialization', function () {

     it('should expose drawChart() method to scope', function () {
     expect(scope.drawChart).to.exist();
     expect(scope.drawChart).to.be.instanceOf(Function);
     });
     });

     describe('drawChart() method', function () {
     var mockedWidget = {
     type: 'Bar',
     singlePointAggregation: [],
     dataSource: [{
     "key":"Liberty Lofts - Solar Power Plant",
     "segmentName":"Liberty Lofts - Solar Power Plant",
     "isPrimaryDateRange":true,
     "isPrimaryMetric":true,
     "values":[{
     "date":"2014-10-01T00:00:00.000Z",
     "label":"October, 2014",
     "value":2488.3518757688316
     }]
     }]
     };

     it('should render the bar widget', function () {
     //expect(scope.drawChart).to.be.instanceOf(Function);
     //expect(function(){scope.drawChart(mockedWidget)}).to.not.throw(Error);
     });
     });
     });*/
});

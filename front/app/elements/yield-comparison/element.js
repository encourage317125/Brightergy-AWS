angular.module('bl.analyze.solar.surface')
.constant('yieldComparisonChartConfig', {
  chart: {
    height: 145, marginBottom: 40, spacingLeft: 0, spacingRight: 0,
    style: {
      fontSize: '10px', overflow: 'visible'
    }
  },
  tooltip: {
    useHTML: true, borderColor: null, borderWidth: 0, borderRadius: 3,
    shadow: false, spacing: [0,0,0,0], backgroundColor: 'rgba(35, 43, 57, 0.0)',
    style: { color: '#FFFFFF', fontSize: '11px', padding: '20px', whiteSpace: 'normal', zIndex: '99999' },
    shared: true
  },
  title: { text: '' },
  legend: { enabled: false },
  exporting: {enabled: false},
  credits: { enabled: false },
  loading: false,
  yAxis: [
    { opposite: true, title: {align: 'low', offset: 16, text: 'kWh', rotation: 0, y: 20},
      labels: {formatter: function () {return this.value.toLocaleString();}}
    }
  ],
  plotOptions: {
    series: { yAxis: 0, pointWidth: 8 },
    column: { color: '#ff6d2d' },
    spline: { color: '#6b9e67', lineColor: '#6b9e67', lineWidth: 0.6, allowPointSelect: false, marker: {enabled: false}}
  }
})
.controller('elementYieldComparisonController',
  ['$scope', '$interpolate', '$filter', 'moment', 'energyService',
    'SourceSelectionEventService', 'yieldComparisonChartConfig', 'solarTagService',
  function ($scope, $interpolate, $filter, moment, energyService,
    SourceSelectionEventService, chartConfig, solarTagService) {

    $scope.earliestInstallDate = null;

    $scope.isDataLoaded = false;
    $scope.lastYield = null;
    $scope.yieldChartInstance = null;
    $scope.yieldChartConfig = {
      options: chartConfig,
      xAxis: {
        categories: [],
        labels: {
          formatter: function () {
            return moment(this.value).format('MMM YY');
          }
        }
      },
      series: [],
      func: function(yieldChartInstance) {
        $scope.yieldChartInstance = yieldChartInstance;
      }
    };

    var infoPanelTemplate = $interpolate(
      ['<div class="yield-tooltip">',
        '<p class="heading">',
          '<span>{{ currentDate }}: </span>',
          '<span class="kpi">{{ currentKWh|number:0 }} kWh / ${{ current$|number:0 }} </span>',
          '{{infoTextEarliestDate}} <br/>',
          '<span>{{ previousDate }}: </span>',
          '<span class="kpi">{{ previousKWh|number:0 }} kWh / ${{ previous$|number:0 }} </span>',
          '{{infoTextEarliestDate}}',
        '</p>',
        '<p>',
          'Your solar-energy system produced <span class="kpi"> {{ currentKWh|number:0 }}kWh </span>',
          'in the month of {{ currentDate }}{{infoTextPrevious}}',
        '.</p>',
        '<p class="bottom">',
          'For the year so far, your solar-energy system has<br/> produced ',
          '<span class="kpi">{{currentKWhYTD|number:0}}kWh</span>',
          ' saving <span class="kpi">${{ current$YTD|number:0 }}</span>',
          '{{infoTextPreviousYTD}}',
        '.</p>',
        '</div>'
      ].join(''));

    var infoTextEarliestDate = $interpolate('<span class="kpi">Installed: {{earliestInstallDate}}</span>');

    var infoTextPrevious = $interpolate([
      ' which is <span class="kpi"> {{percentCurrVsPrev|number:0}}% ',
      '{{compareLabel}} </span>',
      'than the {{previousKWh|number:0}}kWh produced in the same month the previous year'
    ].join(''));

    var infoTextPreviousYTD = $interpolate([
      ', which is <span class="kpi">{{percentCurrYTDVsPrevYTD|number:0}}% ',
      '{{compareLabelYTD}}</span> than the ',
      '<span class="kpi">{{ previousKWhYTD|number:0 }}kWh</span> produced for the same time frame last year'
    ].join(''));

    $scope.yieldChartConfig.options.tooltip.positioner = function (labelWidth, labelHeight, point) {
      var chart = this.chart;
      var plotTop = chart.plotTop;
      var plotWidth = chart.plotWidth;
      var plotHeight = chart.plotHeight;
      var pointX = point.plotX;
      var pointY = point.plotY;
      var rightOverflow = pointX + labelWidth > plotWidth;
      var leftOverflow = pointX < labelWidth;
      var x, y;
      if (rightOverflow && leftOverflow) {
        x = (pointX > plotWidth / 2) ? plotWidth - labelWidth : 0;
      } else {
        x = rightOverflow ? pointX - labelWidth + 5 : pointX + 15;
      }
      y = Math.min(plotTop + plotHeight - labelHeight + 50,
          Math.max(plotTop, pointY - labelHeight + plotTop + labelHeight / 2));
      return { x: x, y: y };
    };

    $scope.yieldChartConfig.options.tooltip.formatter = function () {
      var index = $scope.lastYield.categories.indexOf(this.x);

      var tooltipContext = {
        currentDate: moment(this.x).format('MMM YYYY'),
        previousDate: moment(this.x).subtract(1, 'years').format('MMM YYYY'),
        infoTextPreviousYTD: '',
        infoTextPrevious: '',
        infoTextEarliestDate: ''
      };

      angular.forEach($scope.lastYield.series, function (serie, serieName) {
        tooltipContext[serieName] = serie.data[index] || 0;
      });

      if (tooltipContext.previousKWhYTD > 0 && tooltipContext.currentKWhYTD > 0) {
        tooltipContext.infoTextPreviousYTD = infoTextPreviousYTD(angular.extend(tooltipContext, {
          percentCurrYTDVsPrevYTD: Math.abs(1 - tooltipContext.currentKWhYTD / tooltipContext.previousKWhYTD) * 100,
          compareLabelYTD: tooltipContext.currentKWhYTD > tooltipContext.previousKWhYTD ? 'greater' : 'less'
        }));
      }

      if (tooltipContext.previousKWh > 0 && tooltipContext.currentKWh !== 0) {
        tooltipContext.infoTextPrevious = infoTextPrevious(angular.extend(tooltipContext, {
          percentCurrVsPrev: Math.abs(1 - tooltipContext.currentKWh / tooltipContext.previousKWh) * 100,
          compareLabel: tooltipContext.currentKWh > tooltipContext.previousKWh ? 'greater' : 'less'
        }));
      } else {
        tooltipContext.infoTextEarliestDate = infoTextEarliestDate({
          earliestInstallDate: $scope.earliestInstallDate
        });
      }

      return infoPanelTemplate(tooltipContext);
    };

    $scope.startWatchYieldComparison = function  () {
      energyService.watchYieldComparison(function (yieldData) {
        $scope.lastYield = yieldData;
        $scope.drawChart(yieldData);
      });

      SourceSelectionEventService.listen(function () {
        $scope.isDataLoaded = false;
        $scope.getEarliestInstallDate();
      });
    };

    $scope.drawChart = function (yieldData) {
      $scope.yieldChartConfig.xAxis.categories = yieldData.categories;
      $scope.yieldChartConfig.series = [
        angular.extend(yieldData.series.currentKWh, {type: 'column'}),
        angular.extend(yieldData.series.previousKWh, {type: 'column', color: '#ccc', allowPointSelect: false}),
        angular.extend(yieldData.series.averageKWh, {type: 'spline'})
      ];

      $scope.isDataLoaded = true;
    };

    $scope.getEarliestInstallDate = function() {
      var earliestInstallDate;
      angular.forEach(solarTagService.getLastUpdatedFacilityList(), function(facility) {
        if (facility.selected === true) {
          if (!earliestInstallDate) {
            earliestInstallDate = facility.commissioningDate;
          } else {
            earliestInstallDate = Math.min((new Date(facility.commissioningDate)).valueOf(),
              (new Date(earliestInstallDate)).valueOf());
          }
        }
      });
      $scope.earliestInstallDate = moment(earliestInstallDate).format('MMM YYYY');
    };
  }
])
.directive('elementYieldComparison',
  function() {
    return {
      restrict: 'E',
      scope: true,
      controller: 'elementYieldComparisonController',
      templateUrl: 'app/elements/yield-comparison/template.html',
      link : function (scope, element, attrs) {
        scope.startWatchYieldComparison();
        scope.getEarliestInstallDate();
      }
    };
});

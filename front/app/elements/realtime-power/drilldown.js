angular.module('bl.analyze.solar.surface')
  .constant('energyDrillDownChartConfig', {
    credits: {enabled: false},
    chart: {
      height: 740,
      marginTop: 25,
      marginBottom: 80,
      marginRight: 120
    },
    title: {text: null},
    plotOptions: {series: {marker: {enabled: false}}},
    exporting: {enabled: false},
    colors: ['#ff7935', '#6b9e67'],
    tooltip: {
      valueSuffix: 'kW', backgroundColor: 'rgba(35,43,57,0.9)',
      style: {color: '#fff'},
      borderRadius: 3, borderWidth: 0,
      shadow: false, shared: false, useHTML: true
    },
    legend: {enabled:false},
    xAxis: [{
      type: 'datetime', tickInterval: 1
    }, {
      type: 'datetime', opposite: true, lineWidth: 0, minorGridLineWidth: 0,lineColor: 'transparent',
      labels: {enabled: false}, minorTickLength: 0,tickLength: 0
    }],
    yAxis: [{
      title: {text: null}, labels: {format: '{value}kW', style: {color: '#6b9e67'}},
      min: 0, lineWidth: 0, opposite: true
    }, {
      title: {text: null}, labels: {format: '{value}kWh', style: {color: '#ff7935'}},
      min: 0, gridLineWidth: 0, lineWidth: 0, opposite: true
    }]
  })

  .controller('EnergyDrilldownController',
  ['$scope', '$timeout', '$modalInstance', '$filter', '$interpolate', 
    'energyService', 'energyDrillDownChartConfig', 'solarTagService',
    function ($scope, $timeout, $modalInstance, $filter, $interpolate,
              energyService, energyDrillDownChartConfig, solarTagService) {
      
      $scope.isDataLoaded = false;
      $scope.kpiData = {};
      $scope.chartConfig = angular.extend(energyDrillDownChartConfig, {
        series: []
      });

      $scope.chartConfig.xAxis[0].labels = {
        formatter : function () {
          return $filter('amDateFormat')(this.value, 'ha');
        }
      };

      $scope.chartConfig.tooltip.formatter = function () {
        var tooltipObject = {
          theDateTime: $filter('amDateFormat')(this.key, 'MMM D, h:mma'),
          infoLabel: this.series.name,
          infoValue: $filter('number')(this.y, 1),
          infoUnit: this.series.name === 'Energy Produced' ? 'kWh' : 'kW',
          infoColor: this.series.color
        };

        var tooltipString = [
          '<p>{{ theDateTime }}</p>',
          '<p class="no-margin">{{ infoLabel }}: &nbsp;&nbsp; ',
          '<span style="color: {{ infoColor }};">{{ infoValue }}{{ infoUnit }}</span></p>'/*,
          '<p>Last update {{ lastUpdatedTime }}</p></div></div>'*/
        ].join('');

        return $interpolate(tooltipString)(tooltipObject);
      };

      $scope.loadDrilldown = function (tedData) {
        console.log(tedData);
        $scope.kpiData = tedData.kpi;
        angular.extend($scope.chartConfig, {
          series: [
            angular.extend(tedData.chart.energy, {color: '#ff7935',type: 'column',yAxis: 1}),
            angular.extend(tedData.chart.power, {color: '#6b9e67',type: 'spline',xAxis: 1})
          ]
        });
        $timeout(function () {
          $scope.chartConfig.chart.height = $scope.getResponsiveChartHeight();
          $('#energy-drilldown-combochart').highcharts($scope.chartConfig);
        }, 50);

        $scope.isDataLoaded = true;
      };

      $scope.startWatchDrilldown = function () {
        energyService.emitEnergyDrillDown();
        energyService.watchEnergyDrillDown(function (tedData) {
          $scope.loadDrilldown(tedData);
        });
      };

      $scope.closeDrilldown = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.getResponsiveChartHeight = function () {
        var windowHeight = $(window).height();
        var chartHeight = 740;
        if(windowHeight > 898) {
          chartHeight += windowHeight - 904;
        }
        return chartHeight;
      };

      $(window).resize(function(){
        var chartHeight = $scope.getResponsiveChartHeight();
        var chartWidth = $('#energy-drilldown-combochart').width();
        var chart = $('#energy-drilldown-combochart').highcharts();
        if((chart !== null) && (typeof chart !== 'undefined')) {
          chart.setSize(chartWidth, chartHeight, true);
        }
      });

      $scope.startWatchDrilldown();
    }
  ]);
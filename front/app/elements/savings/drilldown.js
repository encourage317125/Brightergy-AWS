angular.module('bl.analyze.solar.surface')
  .constant('savingChartConfig', {
    legend: { enabled: false }, exporting: { enabled: false }, credits: { enabled: false },
    title: { text: null }, subtitle: { text: null },
    chart: { style:{fontFamily: 'HelveticaNeueW02-55Roma, Helvetica, Arial', fontSize: '11px', overflow: 'visible'}},
    xAxis: { title: { text: null }, categories: [], lineColor: '#adadad', tickColor: '#adadad',
      lineWidth: 1, tickPosition: 'inside' },
    tooltip: {
      useHTML:true,borderColor:null,borderWidth:0,borderRadius:3,shadow:false,shape:'callout',
      spacing:[0,0,0,0],shared:true,backgroundColor:'rgba(35, 43, 57, 0.9)',
      style:{padding: '20px',whiteSpace: 'normal',zIndex: '99999',color:'#fff'},
      valueDecimals: 2
    },
    series: []
  })
  .controller('SavingsDrilldownController',
  ['$scope', '$modalInstance', '$timeout', '$interpolate', '$filter', 'dateRange', 'primaryElementData',
    'savingService', 'solarTagService', 'savingChartConfig',
    function ($scope, $modalInstance, $timeout, $interpolate, $filter, dateRange, primaryElementData,
              savingService, solarTagService, chartConfig) {

      var getResponsiveChartHeight = function () {
        var windowHeight = $(window).height();
        var chartHeight = 320;
        if(windowHeight > 1048) {
          chartHeight += windowHeight - 1048;
        }
        return chartHeight;
      };

      var xAxisFormatter = function () {
        var format;

        if (dateRange === 'week') {
          format = 'MMM D ha';
        } else if (dateRange === 'month') {
          format = 'MMM D';
        } else {
          format = 'MMM YYYY'; // or 'MMM D YYYY`
        }

        return $filter('amDateFormat')(this.value, format);
      };

      $scope.savingData = primaryElementData;
      $scope.isDataLoaded = {
        comboChart: false,
        areaChart: false,
        table: true
      };
      $scope.tableChart = {
        'data': [],
        'columns': [],
        'loaded': false
      };

      $scope.initChart = function () {
        $scope.comboChart = {
          options: angular.extend(angular.copy(chartConfig), {
            yAxis: [
              {labels:{format:'${value}',style:{color:'#6b9e67'}},opposite:true,title:{text:null}},
              {labels:{enabled:false},opposite:true,title:{text:null}}
            ]
          }),
          xAxis: { categories: [], labels: { formatter: xAxisFormatter }},
          series: [],
          loading: false,
          size: { height: getResponsiveChartHeight() }
        };

        $scope.areaChart = {
          options: angular.extend(angular.copy(chartConfig), {
            chart: { type : 'areaspline' },
            plotOptions: {areaspline:{fillOpacity:0.3,marker:{enabled:false},states:{hover:{lineWidth:1}}}},
            yAxis: {title:{text:null}, opposite: true, labels: {format: '${value}',style:{color:'#6b9e67'}}}
          }),
          xAxis: { categories: [], labels: { formatter: xAxisFormatter } },
          series: [],
          loading: false,
          size: { height: 460 }
        };

        var comboChartLoaded = function () {$scope.isDataLoaded.comboChart = true;},
            areaChartLoaded = function () {$scope.isDataLoaded.areaChart = true;};

        $scope.comboChart.options.chart.events = {load: comboChartLoaded, redraw: comboChartLoaded};
        $scope.areaChart.options.chart.events = {load: areaChartLoaded, redraw: areaChartLoaded};
        $scope.areaChart.options.tooltip.crosshairs = {
          width: 2,
          color: 'gray',
          dashStyle: 'shortdot'
        };
      };

      $scope.startWatchDrilldown = function () {
        savingService
          .watchTable(function (data) {
            $scope.updateTable(data);
          })
          .watch(function (data) {
            $scope.updateDrilldown(data);
          });
      };

      $scope.updateDrilldown = function(data) {
        $scope.updateKPI(data);
        $scope.updateComboChart(data);
        $scope.updateAreaChart(data);
        if (data.table) {
          $scope.updateTable(data.table);
        }
      };

      $scope.updateKPI = function (savingData) {
        $scope.kpiData = savingData.kpi;
      };

      $scope.updateComboChart = function (savingData) {
        savingData.comboChart.series.map(function (serie) {
          if (serie.type === 'column') {
            serie.color = '#6b9e67';
            serie.pointWidth = 8;
            serie.yAxis = 0;
            serie.tooltip = {valuePrefix: '$'};
          } else {
            serie.color = '#ff6d2d';
            serie.allowPointSelect = false;
            serie.marker = {enabled: false};
            serie.yAxis = 1;
            serie.tooltip = {valueSuffix: 'kWh'};
          }
        });

        $scope.comboChart.xAxis.categories = savingData.comboChart.categories;
        $scope.comboChart.series = savingData.comboChart.series;
      };

      $scope.comboTooltipFormatter = function () {
//        var pointX = this.point ? this.point.x : this.points[0].point.x;
//        var colors = ['orange', 'blue', 'green'];
        var tootipContents = [
          '<div class="blue-box"><h5 class="title">Saving<br/>{{ dateX }}</h5>',
          '{{ infoTable }}',
          '</div>'
        ];
        /*for (var idx = 0; idx < )
        if(scope.mainChart.series.length > 2) {
          tootipContents += '<div class="row">' +
            '<div class="col-xs-12 text-right">' +
            '<span>' + changeDateLabel(scope.mainChart.categories[pointX], true) + '</span>' +
            '</div>' +
            '</div>';
          for(var i=2; i<scope.mainChart.series.length; i++) {
            if(i < 7) {
              tootipContents += '<div class="row">' +
                '<div class="col-xs-7">' +
                '<span class="wrap-text">' +
                  solarTagService.getDisplayName(scope.mainChart.series[i].name) + ':</span>' +
                '</div>' +
                '<div class="col-xs-5 text-right">' +
                '<span class="' + colors[(i-2) % 3] + '">' +
                  $filter('number')(scope.mainChart.series[i].data[pointX], 2) + 'kWh</span>' +
                '</div>' +
                '</div>';
            }
            if(i === 7){
              tootipContents += '<div class="row"><div class="col-xs-8">More...</div></div>';
            }
          }
        }
        if(scope.lastUpdated) {
          tootipContents += '<p class="bottom">Last update at ' + scope.lastUpdated + '.</p>';
        }
        tootipContents += '</div>';*/

        return tootipContents.join('');
      };

      $scope.updateAreaChart = function(savingData) {
        savingData.areaChart.series.map(function (serie) {
          serie.tooltip = {valuePrefix: '$'};
          serie.fillColor = {
            'linearGradient': [0,0,0,300],
            'stops': [
              [0, serie.color],
              [1, Highcharts.Color(serie.color).setOpacity(0).get('rgba')]
            ]
          };
        });

        $scope.areaChart.xAxis.categories = savingData.areaChart.categories;
        $scope.areaChart.series = savingData.areaChart.series;
      };

      $scope.updateTable = function(data) {
        $scope.tableChart = {
          data: data,
          columns: $scope.kpiData.totalProductionBySources.map(function (production) {
            return production.displayName;
          }),
          sourceNames: $scope.kpiData.totalProductionBySources.map(function (production) {
            return production.name;
          })
        };

        $scope.isDataLoaded.table = true;
      };

      /*$(window).resize(function(){
        var chartHeight = getResponsiveChartHeight();
        var chartWidth = $('#savingsComboChart').width();
        var chart = $('#savingsComboChart').highcharts();
        if((chart !== null) && (typeof chart !== 'undefined')) {
          chart.setSize(chartWidth, chartHeight, true);
        }
      });*/
      $scope.closeDrilldown = function () {
        $modalInstance.dismiss('cancel');
      };

      $timeout(function () {
        $scope.initChart();
        $scope.updateDrilldown(primaryElementData);
        $scope.startWatchDrilldown();
      }, 50);
  }]);
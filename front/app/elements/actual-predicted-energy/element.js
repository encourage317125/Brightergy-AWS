angular.module('bl.analyze.solar.surface')
  .constant('actualPredictedChartConfig', {
    chart: {
      type: 'column', height: 167, spacingLeft: 0, spacingRight: 0
    },
    tooltip: {
      // shared: true,
      useHTML: true, borderColor: null, borderWidth: 0, borderRadius: 3,
      shadow: false, spacing: [0,0,0,0], backgroundColor: 'rgba(35, 43, 57, 0.0)',
      style: { padding: '20px', whiteSpace: 'normal' },
      shared: true
    },
    title: { text: '' },
    legend: { enabled: false },
    exporting: {enabled: false},
    credits: { enabled: false },
    loading: false,
    colors: ['#ff6d2d', '#d5d9da'],
    yAxis: [{
      title: {text: ''}, opposite: true,
      labels: {
        formatter: function () { return this.value.toLocaleString() + 'kWh'; }
      }
    }]
  })
  .controller('elementActualPredictedController',
  ['$rootScope', '$scope', '$timeout', '$filter', 'moment', 'SourceSelectionEventService',
    'actualPredictedChartConfig', 'energyService', '$interpolate', 'asDateRangeSelectorConfig',
    function($rootScope, $scope, $timeout, $filter, moment, SourceSelectionEventService, chartConfig,
             energyService, $interpolate, asDateRangeSelectorConfig) {

      var windowWidth = $(window).width();
      if (windowWidth < 768) {
        chartConfig.yAxis[0].title = {align: 'low', offset: 16, text: 'kW', rotation: 0, y: 20};
        chartConfig.yAxis[0].labels = {formatter: function(){return this.value.toLocaleString();}};
      }
      var infoTextTemplate = $interpolate([
        '<div class="float-panel-info">',
        '<div class="row">',
        '<div class="col-xs-6"><h5 class="title">{{ currentDate }}</h5></div>',
        '<div class="col-xs-6"><span>Previous years\' data aids in ',
        '<br/>calculating the current year\'s<br/> predicted energy.</span></div>',
        '</div>',
        '<div class="row">',
        '<div class="col-xs-6"><span class="kpi">{{ currentCloudyDays }}</span></div>',
        '<div class="col-xs-6"></div>',
        '</div>',
        '<div class="row">',
        '<div class="col-xs-6"><span class="kpi">{{ currentSunnyDays }}</span></div>',
        '<div class="col-xs-6"><span><b>{{ prevYearDate }}:</b></span></div>',
        '</div>',
        '<div class="row">',
        '<div class="col-xs-6"></div>',
        '<div class="col-xs-6"><span>{{ prevYearCloudyDays }}</span></div>',
        '</div>',
        '<div class="row">',
        '<div class="col-xs-6"><span class="info-value kpi"><b>Actual: {{ actualEnergy }}</b></span></div>',
        '<div class="col-xs-6"><span>{{ prevYearSunnyDays }}</span></div>',
        '</div>',
        '<div class="row">',
        '<div class="col-xs-6"><span><b>Predicted: {{ predictedEnergy }}</b></span></div>',
        '<div class="col-xs-6"><span>Actual: {{ prevYearActualEnergy }}</span></div>',
        '</div></div>'
      ].join(''));

      $scope.isShowOnlyYear = false;
      $scope.isDataLoaded = false;
      $scope.dateRange = 'year';
      $scope.avpeChartInstance = null;

      $scope.avpeChartConfig = {
        options: chartConfig,
        xAxis: {
          categories: [],
          labels: {
            style: { fontSize: '10px' },
            formatter: function () {
              var format = $scope.isShowOnlyYear ? 'YYYY' : 'MMM YY';
              return moment.utc(this.value).format(format);
            }
          }
        },
        series: [],
        func: function(avpeChartInstance) {
          $scope.avpeChartInstance = avpeChartInstance;
        }
      };

      /*$scope.avpeChartConfig.options.chart.events = {
       load: function() {$scope.isDataLoaded = true;},
       redraw: function() {$scope.isDataLoaded = true;}
       };*/

      $scope.$watch('dateRange', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.dateRange = newVal;
          $scope.isDataLoaded = false;
          energyService.emitAvPE(newVal);
        }
      });

      SourceSelectionEventService.listen( function () {
        $scope.isDataLoaded = false;
      });

      function formatText(value, unit, total, strDays) {
        var str = '';
        if (!unit) {
          str = value < 0 ? 'No history': value;
        } else {
          str = value < 0 ? 'No history': $filter('number')(value, 2) + ' ' + unit;
        }

        if (total && parseInt(value) >= 0) {
          str = str + ' ' + (strDays || '') + '(' + parseInt(value*100/total) +'%)';
        }
        return str;
      }

      $scope.avpeChartConfig.options.tooltip.formatter = function () {
        //var xAxisDateFormat = isShowYear ? 'YYYY' : 'MMM YYYY';
        var xAxisDateFormat = $scope.isShowOnlyYear ? 'YYYY' : 'MMMM YYYY';

        var currentDate = moment.utc(this.x),
          prevYearDate = moment.utc(this.x).subtract(1, 'years'),
          index = $scope.lastAvPEnergy.categories.indexOf(this.x);

        var daysInCurrent, daysInPrevious;
        var tooltip = $scope.lastAvPEnergy.tooltips[index];

        if ($scope.isShowOnlyYear) {
          daysInCurrent = currentDate.endOf('year').format('DDD');
          daysInPrevious = prevYearDate.endOf('year').format('DDD');
        } else {
          daysInCurrent = currentDate.endOf('month').format('D');
          daysInPrevious = prevYearDate.endOf('month').format('D');
        }

        if (tooltip.cloudydays === -1 && tooltip.sunnydays !== -1) {
          tooltip.cloudydays = 0;
        }
        if (tooltip.sunnydays === -1 && tooltip.cloudydays !== -1) {
          tooltip.sunnydays = 0;
        }
        if (tooltip.prevYearCloudyDays === -1 && tooltip.prevYearSunnyDays !== -1) {
          tooltip.prevYearCloudyDays = 0;
        }
        if (tooltip.prevYearSunnyDays === -1 && tooltip.prevYearCloudyDays !== -1) {
          tooltip.prevYearSunnyDays = 0;
        }

        var infoPanel = {
          currentDate: currentDate.format(xAxisDateFormat),
          prevYearDate: prevYearDate.format(xAxisDateFormat),
          /*currentDate: currentDate.format('MMMM YYYY'),
           prevYearDate: prevYearDate.format('MMMM YYYY'),*/
          actualEnergy: formatText(this.points[0].y, 'kWh'),
          prevYearActualEnergy: formatText(tooltip.prevYearActualEnergy, 'kWh'),
          predictedEnergy: formatText(this.points[1].y, 'kWh'),
          prevYearPredictedEnergy: formatText(tooltip.prevYearPredictedEnergy, 'kWh'),
          currentCloudyDays: formatText(tooltip.cloudydays, false, daysInCurrent, 'Cloudy Days '),
          prevYearCloudyDays: formatText(tooltip.prevYearCloudyDays, false, daysInPrevious, 'Cloudy Days '),
          currentSunnyDays: formatText(tooltip.sunnydays, false, daysInCurrent, 'Sunny Days '),
          prevYearSunnyDays: formatText(tooltip.prevYearSunnyDays, false, daysInPrevious, 'Sunny Days ')
        };

        return infoTextTemplate(infoPanel);
      };

      $scope.startWatchEnergy = function  () {
        energyService.watchAvPE(function (AvPEnergy) {
          $scope.lastAvPEnergy = AvPEnergy;
          $scope.updateChart($scope.lastAvPEnergy);
        });
      };

      $scope.updateChart = function (data) {
        $scope.isShowOnlyYear = data['dimension'] === '1year';

        angular.forEach(data.series, function (serie) {
          if (serie.name === 'Actual Energy') {
            serie.color = '#ff6d2d';
          } else if (serie.name === 'Predicted Energy') {
            serie.color = '#d5d9da';
          }
        });

        $scope.avpeChartConfig.xAxis.categories = data.categories;
        $scope.avpeChartConfig.series = data.series;
        $scope.isDataLoaded = true;
      };

      $scope.startWatchEnergy();
    }
  ])
  .directive('actualPredictedEnergy',
  function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/elements/actual-predicted-energy/template.html',
      controller: 'elementActualPredictedController',
      link: function (scope, element, attrs, controller) {
      }
    };
  }
);

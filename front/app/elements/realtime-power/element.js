angular.module('bl.analyze.solar.surface')

  .constant('rtpPrimaryChartConfig', {
    credits: { enabled: false },
    chart: {
      type: 'spline',
      height: 335,
      marginTop: 35,
      marginBottom: 70
    },
    plotOptions: {series:{marker:{enabled: false}}},
    exporting: {enabled: false},
    tooltip: {
      valueSuffix: 'k', backgroundColor: 'rgba(35,43,57,0.0)',
      borderRadius: 3, borderWidth: 0,
      shadow: false, shared: true, useHTML: true,
      crosshairs: { width: 2, color: 'gray', dashStyle: 'shortdot' }
    },
    yAxis: [{
      title: { text: '' }, labels: { format: '{value}kW' },
      opposite: true, min: 0, plotLines: [{ value: 0, width: 0, color: '#808080'}]
    }, {
      gridLineWidth: 0, lineWidth: 0, lineColor: '#cccccc', title: { text: '' }
    }],
    title: { text: null }, loading: false,
    legend: { enabled: false }
  })

  .controller('elementRTPController',
  ['$rootScope', '$scope', '$interpolate', '$filter', '$timeout', '$modal', 'powerService', 'rtpPrimaryChartConfig',
    'energyService', 'solarTagService', 'SourceSelectionEventService', 'asDateRangeSelectorConfig',
    function ($rootScope, $scope, $interpolate, $filter, $timeout, $modal, powerService, rtpPrimaryChartConfig,
     energyService, solarTagService, SourceSelectionEventService, asDateRangeSelectorConfig) {

      $scope.isDataLoaded = false;
      $scope.dateRange = 'month';
      $scope.noDataRTP = false;
      $scope.lastRTPower = {};

      $scope.elementTitle = 'Max Power';
      var dateRangeToElementTitle = {
        'today': 'Real-Time Power',
        'week': 'Max Power',
        'month': 'Max Power'
      };

      $scope.totalKPITitle = 'Current Day\'s Max';
      var dateRangeToTotalKPITitle = {
        'today': 'Current Power',
        'week': 'Current Hour\'s Max',
        'month': 'Current Day\'s Max'
      };

      $scope.primaryChartInstance = null;
      var infoTextTemplate = $interpolate([
        '<div class="float-panel-info"><div class="info-title">Power Generation</div>',
        '<div class="info-title">{{ theDay }}</div><br/>',
        '<p>Total production for all selected sources {{ theTime }} is ',
        '<span class="kpi">{{ totalPower }}kW</span>.</p>',
        '<div class="info-table"><p>',
        '<span class="info-key">Total Generation</span><span class="info-value kpi">{{ totalPower }}kW</span>',
        '</p>{{ infoTable }}</div>',
        '<p class="bottom">Last update {{ lastUpdatedTime }}</p></div>'
      ].join(''));

      SourceSelectionEventService.listen(function () {
        $scope.isDataLoaded = false;
      });

      $scope.primaryChart = {
        options: rtpPrimaryChartConfig,
        series: [],
        xAxis: {
          categories: [],
          labels: {}
          /*startOnTick: true,
          endOnTick: true,*/ /* Do not uncomment this */
          /*labels: {
            formatter: function () {
              var format;
              if ($scope.dateRange === 'today') {
                format = 'h:mma';
              } else if ($scope.dateRange === 'week') {
                format = 'MMM D ha';
              } else {
                format = 'MMM D';
              }
              return $filter('amDateFormat')(this.value, format);
            }*/
        },
        func: function(primaryChartInstance) {
          $scope.primaryChartInstance = primaryChartInstance;
        }
      };


      $scope.$watch('dateRange', function(newVal,oldVal) {
        if (newVal !== oldVal) {
          $scope.isDataLoaded = false;
          powerService.emitRTPower(newVal);
          $scope.elementTitle = dateRangeToElementTitle[newVal];
          $scope.totalKPITitle = dateRangeToTotalKPITitle[newVal];
        }
      });

      $scope.primaryChart.options.tooltip.formatter = function () {
        var points = this.points,
          totalPower = 0;
        var index = this.point ? this.point.x : this.points[0].point.x,
          categories = $scope.lastRTPower.primary.xAxis;

        var datapoints = points.map(function (point, pidx) {
          if (point.series.name === 'Total Generation') {
            return '';
          } else {
            totalPower += Number(point.y.toFixed(1));
            return [
              '<p>',
              '<span class="info-key">' + $scope.lastRTPower.primary.datapoints[pidx].displayName + '</span>',
              '<span class="info-value" style="color:' + point.point.color + '">' + point.y.toFixed(1) + 'kW</span>',
              '</p>'
            ].join('');
          }
        });

        var theDayFormat = 'MMM D, h:mma',
          theTimeFormat = 'h:mma';

        if ($scope.dateRange === 'month') {
          theDayFormat = 'MMM D';
          theTimeFormat = '';
        } else if ($scope.dateRange === 'week') {
          theDayFormat = 'MMM D ha';
          theTimeFormat = 'ha';
        }

        var tooltipObject = {
          theDay: $filter('amDateFormat')(categories[index], theDayFormat),
          theTime: theTimeFormat ? 'at ' + $filter('amDateFormat')(categories[index], theTimeFormat) : '',
          totalPower: totalPower.toFixed(1),
          lastUpdatedTime: $filter('amCalendar')($rootScope.LAST_UPDATED_TIMETIME).toLowerCase(),
          infoTable: datapoints.slice(0, 5).join('') + (datapoints.length > 5 ? '<p>More...</p>' : '')
        };

        return infoTextTemplate(tooltipObject);
      };

      $scope.startWatchPower = function () {
        powerService.watchRTPower(function (RTPower) {
          if (RTPower.history === false) {
            $scope.lastRTPower = RTPower;
            $scope.drawPrimaryChart(RTPower.primary);
            $scope.isDataLoaded = true;
          } else {
            $scope.lastRTPower.kpiData = RTPower.kpiData || $scope.lastRTPower.kpiData;
            if (RTPower.primary) {
              $scope.addToPrimaryChart(RTPower.primary);
            }
          }
        });

        solarTagService.watchAllSolarTags(function () {
          if ($scope.dateRange === 'today') {
            powerService.pullLastPowerFromTags($scope.lastRTPower);
          }
        }, false);
      };

      $scope.drawPrimaryChart = function (chartData) {
        $scope.noDataRTP = chartData['xAxis'].length === 0;

        $scope.primaryChart.series = chartData['datapoints'];

        /*
        X Axis data decision algorithm
        -Variables
        nInterval: X Axis data showing interval.  nInterval = 3, e.g. 3AM 6M 9AM
        printedDays: store first data per day, no time.
        nCount: X Axis total data count, it will use for MOD operation with nInterval.
        showDays: number of data will show X Axis.
        flag: temporary flag variable for algorithm, it will be true when change next day.
        -Algorithm
          sample  input data:
            June 3th 2AM, 3AM, 4AM, 1PM, 2PM, 3PM, 4PM, 5PM, 6PM, 7PM, 8PM,
                  9PM, 10PM, 11PM, Jun 4th 12AM, 1AM, 2AM, 3AM, 4AM
          desired output data:
            June 3th 2AM, 1PM, 4PM, 7PM, 10PM, June 4th 1AM, 4AM
          content:
            X Axis shows data per every nInterval(3), if then, 1AM appear instead of Jun 4th 12AM,
              so flag variable will be used when change next day.
            showDays will push every nInterval(3), if flag is true or current data is first one per day,
                data showing format will be 'MMM D, h a', otherwise showing format is 'h a'.
        */
        var nCount = -1;
        $scope.printedDays = [];
        $scope.showDays = [];
        var flag = false;
        var nInterval = 3;

        $scope.primaryChart.xAxis.categories = chartData['xAxis'].map(function(value) {
            var format;
            nCount++;
            if ($scope.dateRange === 'week') {
              var day = $filter('amDateFormat')(value, 'MMM D');
              if ($scope.printedDays.indexOf(day) < 0) {
                $scope.printedDays.push(day);
                format = 'MMM D, h a';
                if(nCount % nInterval === 0) {
                    $scope.showDays.push(nCount);
                }else{
                    flag = true;
                }
              } else {
                format = 'h a';
                if(nCount % nInterval === 0) {
                  $scope.showDays.push(nCount);
                  if(flag === true) {
                    format = 'MMM D, h a';
                    flag = false;
                  }
                }
              }
            } else if ($scope.dateRange === 'today') {
              format = 'h:mma';
            } else {
              format = 'MMM D';
            }
            return $filter('amDateFormat')(value, format);
        });


        $scope.primaryChart.xAxis.tickPositioner = function() {
            if($scope.dateRange === 'week') {
              return $scope.showDays;
            }
        };

        if($scope.dateRange === 'week') {
            $scope.primaryChart.xAxis.tickInterval = 3;
            $scope.primaryChart.xAxis.labels.rotation = -45;
        }else{
            $scope.primaryChart.xAxis.tickInterval = 1;
            $scope.primaryChart.xAxis.labels.rotation = -45;
        }
      };

      $scope.addToPrimaryChart = function (chartData) {
        // $scope.lastRTPower.primary.xAxis
        // $scope.lastRTPower.primary.datapoints
        angular.forEach(chartData.xAxis, function (x, xIndex) {
          var matchIndex = $scope.lastRTPower.primary.xAxis.indexOf(x);

          if (matchIndex > -1) {  // if there is same x-axis
            $scope.lastRTPower.primary.datapoints.map(function (datapoint, serieIndex) {
              datapoint.data[matchIndex] = chartData.datapoints[serieIndex].data[xIndex];
            });

            /*$scope.lastRTPower.primary.datapoints.map(function (datapoint, sourceIndex) {
              datapoint.data[xIndex] = chartData.datapoints[sourceIndex].data[xIndex];
            });*/
          } else {  // if there isn't same xaxis
            $scope.lastRTPower.primary.xAxis.push(x);
            $scope.lastRTPower.primary.datapoints.map(function (datapoint, serieIndex) {
              datapoint.data.push(chartData.datapoints[serieIndex].data[xIndex]);
            });
          }
        });
        $timeout(function () {
          $scope.drawPrimaryChart($scope.lastRTPower.primary);
        }, 10);
      };

      $scope.openDrilldown = function () {
        $modal.open({
          templateUrl: 'app/elements/realtime-power/drilldown.html',
          controller: 'EnergyDrilldownController',
          windowClass: 'drilldown',
          size: 'lg',
          resolve: {
          }
        });
      };
      $scope.startWatchPower();
    }
  ])

  .directive('elementRealtimePower', function() {
    return {
      restrict: 'E',
      scope: true,
      controller: 'elementRTPController',
      templateUrl: 'app/elements/realtime-power/template.html',
      link : function (scope, element, attrs) {
        element.on('click', function () {
          //scope.openDrilldown();
        });
      }
    };
  });

angular
    .module('bl.analyze.solar.surface')

    .constant('segPrimaryChartConfig', {
      chart: {
        marginBottom: 30,
        spacingLeft: 0, spacingRight: 0,
        reflow: true, style: { fontSize: '11px', overflow: 'visible' }
      },
      tooltip: {
        useHTML: true, borderColor: null, borderWidth: 0, borderRadius: 3, shadow: false, shape: 'callout',
        spacing: [0, 0, 0, 0], shared: true, backgroundColor: 'rgba(35, 43, 57, 0.0)',
        style: {padding: '20px', whiteSpace: 'normal', zIndex: '99999'}
      },
      yAxis: [{
        title: null, opposite: true,
        labels: {formatter: function(){return this.value.toLocaleString() + ' kWh';}}
      }, {
        title: null, opposite: true,
        labels: {formatter: function(){return '$' + this.value.toLocaleString();}, style:{color:'#6b9e67'}},
        offset: 80, min: 0
      }],
      title: { text: null }, loading: false, credits: { enabled: false }
    })

    .controller('elementSolarEnergyProductionController',
    ['$rootScope', '$scope', '$interpolate', '$filter', '$modal', 'moment', 'energyService',
      'SourceSelectionEventService', 'segPrimaryChartConfig', 'asDateRangeSelectorConfig',
      function ($rootScope, $scope, $interpolate, $filter, $modal, moment, energyService,
                SourceSelectionEventService, primaryChartConfig, asDateRangeSelectorConfig) {

        var windowWidth = $(window).width();
        if (windowWidth < 768) {
          primaryChartConfig.yAxis[0].title = {align: 'low', offset: 16, text: 'kWh', rotation: 0, y: 20};
          primaryChartConfig.yAxis[0].labels = {formatter: function(){return this.value.toLocaleString();}};
          primaryChartConfig.yAxis[1].labels = {enabled: false, x: 0};
          primaryChartConfig.yAxis[1].offset = 0;
        }

        $scope.dateRange = 'month';
        $scope.currentDate = moment().month();
        $scope.currentDateLabel = moment().month($scope.currentDate).format('MMMM');
        $scope.prevDateLabel = moment().month($scope.currentDate-1).format('MMMM');
        $scope.nextDateLabel = moment().month($scope.currentDate+1).format('MMMM');
        $scope.isDataLoaded = false;
        $scope.segMainChartInstance = null;
        $scope.segMainChartConfig = {
          options: primaryChartConfig,
          xAxis: { categories: [], labels: {} },
          series: [],
          chart: { marginBottom: 30 },
          func: function(segMainChartInstance) {
            $scope.segMainChartInstance = segMainChartInstance;
          }
        };

        $scope.lastSEG = null;

        if($scope.currentDate === 0) {
          $('.date-range-nav .prev-nav').removeClass('active');
        } else {
          $('.date-range-nav .prev-nav').addClass('active');
        }

        $scope.printedDays = [];

        var infoTextTemplate = $interpolate([
          '<div class="float-panel-info">',
            '<h5 class="title">Energy Production</h5>',
            '<h5 class="title-date">{{ currentDate }}</h5>',
          '<p>Total production for all selected sources on {{ currentDate }} is ',
          '<span class="kpi">{{ totalEnergy|number:2 }} kWh</span>.<br/>',
          'Total Saving is <span class="green">${{totalSaving|number:2}}</span>.</p>',
          '<div class="row"><div class="col-xs-12 text-right">{{currentDate}}</div></div>',
          '{{ generationPerSources }}',
          '<p class="bottom">Last update at {{lastUpdatedTime}}.</p>',
          '</div>'
        ].join(''));

        $scope.segMainChartConfig.options.tooltip.formatter = function () {
          var index = this.point ? this.point.x : this.points[0].point.x,
              series = $scope.lastSEG.primary.series,
              categories = $scope.lastSEG.primary.categories;

          var generationPerSources = '';

          for(var idx = 2; idx < series.length; idx++) {
            if(idx < 7) {
              generationPerSources += '<div class="row"><div class="col-xs-7"><span class="wrap-text">' +
              series[idx].displayName + ':</span></div>' +
              '<div class="col-xs-5 text-right"><span style="color:' + series[idx].color + ';">' +
              $filter('number')(series[idx].data[index], 2) + 'kWh</span></div></div>';
            }
            if(idx === 7){
              generationPerSources += '<div class="row"><div class="col-xs-8">More...</div></div>';
            }
          }

          var dateFormat;
          if ($scope.dateRange === 'week') {
            dateFormat = 'MMM D, hA';
          } else if ($scope.dateRange === 'month') {
            dateFormat = 'MMM D';
          } else if ($scope.dateRange === 'year') {
            dateFormat = 'MMM, YYYY';
          } else if ($scope.dateRange === 'total') {
            if (categories[index]['type'] === 'year') {
              dateFormat = 'YYYY';
            } else {
              dateFormat = 'MMM, YYYY';
            }
          } else {
            dateFormat = 'MMM D, YYYY';
          }

          return infoTextTemplate({
            currentDate: $filter('amDateFormat')(categories[index]['value'], dateFormat),
            generationPerSources: generationPerSources,
            totalEnergy: series[0].data[index],
            totalSaving: series[1].data[index],
            lastUpdatedTime: $filter('amCalendar')($rootScope.LAST_UPDATED_TIMETIME).toLowerCase()
          });
        };

        $scope.$watch('dateRange', function (newValues, oldValues) {
          if (newValues !== oldValues) {
            $scope.changeDateRange(newValues);
          }
        });

        SourceSelectionEventService.listen(function () {
          $scope.isDataLoaded = false;
        });

        $scope.startWatchSEG = function () {
          energyService.watchSEG(function (segData) {
            $scope.lastSEG = segData;
            $rootScope.rootLastSegData = segData;
            if (segData.dateRange === $scope.dateRange) {
              $scope.drawPrimaryGraph(segData.primary);
              $scope.isDataLoaded = true;
            }
          });
          /*energyService.watchSEGDrilldown(function (drilldown) {
           console.log('SEG drilldown:', drilldown);
           });*/
        };

        $scope.getDataByDateRange = function (dateRange) {
          var requestData = {
            dateRange: dateRange || 'month'
          };

          switch(requestData.dateRange) {
            case 'month':
              if($scope.currentDate !== moment().month()) {
                angular.extend(requestData, {
                  month: $scope.currentDate,
                  year: moment().year()
                });
              }
              break;
            case 'year':
              if($scope.currentDate !== moment().year()) {
                requestData.year = $scope.currentDate;
              }
              break;
          }

          energyService.emitSEG(requestData);

          $scope.isDataLoaded = false;
        };

        $scope.changeDateRange = function(dateRange) {
          switch(dateRange) {
            case 'week':
              $scope.currentDate = $filter('date')(new Date(), 'w');
              $scope.currentDateLabel = '';
              $scope.prevDateLabel = '';
              $scope.nextDateLabel = '';
              $('.date-range-nav .prev-nav').removeClass('active');
              $('.date-range-nav .next-nav').removeClass('active');
              break;
            case 'month':
              $scope.currentDate = moment().month();
              $scope.currentDateLabel = moment().month($scope.currentDate).format('MMMM');
              $scope.prevDateLabel = moment().month($scope.currentDate-1).format('MMMM');
              $scope.nextDateLabel = moment().month($scope.currentDate+1).format('MMMM');
              if($scope.currentDate === 0) {
                $('.date-range-nav .prev-nav').removeClass('active');
              } else {
                $('.date-range-nav .prev-nav').addClass('active');
              }
              $('.date-range-nav .next-nav').removeClass('active');
              break;
            case 'year':
              $scope.currentDate = moment().year();
              $scope.currentDateLabel = 'Year ' + $scope.currentDate;
              $scope.prevDateLabel = ($scope.currentDate-1);
              $scope.nextDateLabel = ($scope.currentDate+1);
              $('.date-range-nav .prev-nav').addClass('active');
              $('.date-range-nav .next-nav').removeClass('active');
              break;
            case 'total':
              $scope.currentDate = 0;
              $scope.currentDateLabel = 'Total';
              $scope.prevDateLabel = '';
              $scope.nextDateLabel = '';
              $('.date-range-nav .prev-nav').removeClass('active');
              $('.date-range-nav .next-nav').removeClass('active');
              break;
          }

          $scope.getDataByDateRange(dateRange);
        };

        $scope.prevDate = function() {
          switch($scope.dateRange) {
            case 'month':
              $scope.currentDate = Math.max($scope.currentDate - 1, 0);
              $scope.currentDateLabel = moment().month($scope.currentDate).format('MMMM');
              $scope.prevDateLabel = moment().month($scope.currentDate-1).format('MMMM');
              $scope.nextDateLabel = moment().month($scope.currentDate+1).format('MMMM');
              if($scope.currentDate === 0) {
                $('.date-range-nav .prev-nav').removeClass('active');
              } else {
                $('.date-range-nav .prev-nav').addClass('active');
              }
              $('.date-range-nav .next-nav').addClass('active');
              break;
            case 'year':
              $scope.currentDate = Math.max($scope.currentDate - 1, 2014);
              $scope.currentDateLabel = 'Year ' + $scope.currentDate;
              $scope.prevDateLabel = ($scope.currentDate-1);
              $scope.nextDateLabel = ($scope.currentDate+1);
              if($scope.currentDate === 2014) {
                $('.date-range-nav .prev-nav').removeClass('active');
              } else {
                $('.date-range-nav .prev-nav').addClass('active');
              }
              $('.date-range-nav .next-nav').addClass('active');
              break;
          }

          $scope.getDataByDateRange($scope.dateRange);
        };

        $scope.nextDate = function() {
          switch($scope.dateRange) {
            case 'month':
              $scope.currentDate = Math.min($scope.currentDate + 1, moment().month());
              $scope.currentDateLabel = moment().month($scope.currentDate).format('MMMM');
              $scope.prevDateLabel = moment().month($scope.currentDate-1).format('MMMM');
              $scope.nextDateLabel = moment().month($scope.currentDate+1).format('MMMM');
              $('.date-range-nav .prev-nav').addClass('active');
              if($scope.currentDate === moment().month()) {
                $('.date-range-nav .next-nav').removeClass('active');
              } else {
                $('.date-range-nav .next-nav').addClass('active');
              }
              break;
            case 'year':
              $scope.currentDate = Math.min($scope.currentDate + 1, moment().year());
              $scope.currentDateLabel = 'Year ' + $scope.currentDate;
              $scope.prevDateLabel = ($scope.currentDate-1);
              $scope.nextDateLabel = ($scope.currentDate+1);
              if($scope.currentDate === moment().year()) {
                $('.date-range-nav .next-nav').removeClass('active');
              } else {
                $('.date-range-nav .next-nav').addClass('active');
              }
              $('.date-range-nav .prev-nav').addClass('active');
              break;
          }

          $scope.getDataByDateRange($scope.dateRange);
        };

        $scope.drawPrimaryGraph = function(primaryChart) {
          var newSeries = [],
              chartBottom = 30;
          var areaOptions = {
            type : 'areaspline', threshold : null, allowPointSelect: false, color: '#6b9e67',
            fillOpacity: '0.1', lineColor: '#6b9e67', trackByArea: false, stickyTracking: false,
            lineWidth: 2, marker: { enabled: false }, yAxis: 1
          };
          var columnOptions = {
            type: 'column', color: '#ff7935', pointWidth: 8, borderWidth: 0, borderColor: null
          };

          for (var idx = 0; idx < primaryChart.series.length; idx++) {
            if(primaryChart.series[idx].name === 'Total Generation') {
              angular.extend(columnOptions, primaryChart.series[idx]);
            } else if(primaryChart.series[idx].name === 'Savings') {
              angular.extend(areaOptions, primaryChart.series[idx]);
            }
          }

          switch($scope.dateRange) {
            case 'week':
              chartBottom = 80;
              break;
            case 'total':
              chartBottom = 70;
              break;
            default:
              chartBottom = 30;
              break;
          }

          newSeries.push(areaOptions);
          newSeries.push(columnOptions);

          $scope.printedDays = [];
          $scope.showDays = [];
          $scope.segMainChartConfig.options.chart.marginBottom = chartBottom;
          $scope.segMainChartConfig.chart.marginBottom = chartBottom;
          var nCount = -1;
          var flag = false;
          var nInterval = 3;

          $scope.segMainChartConfig.xAxis.categories = primaryChart.categories.map(function (value) {
            var format;
            nCount++;
            if ($scope.dateRange === 'week') {
              var day = $filter('amDateFormat')(value.value, 'MMM D');
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
            } else if ($scope.dateRange === 'month') {
              format = 'D';
              if ($filter('amDateFormat')(value.value, format) === '1') {
                format = 'MMM D';
              }
            } else if ($scope.dateRange === 'year') {
              format = 'MMM';
            } else if ($scope.dateRange === 'total') {
              if (value.type === 'year') {
                format = 'YYYY';
              } else {
                format = 'MMM, YYYY';
              }
            }

            return $filter('amDateFormat')(value.value, format);
          });

          $scope.segMainChartConfig.xAxis.tickPositioner = function() {
            if($scope.dateRange === 'week') {
              return $scope.showDays;
            }
          };

          if($scope.dateRange === 'week' || $scope.dateRange === 'total') {
            $scope.segMainChartConfig.xAxis.labels.rotation = -45;
          } else {
            $scope.segMainChartConfig.xAxis.labels.rotation = 0;
        }

        $scope.segMainChartConfig.series = newSeries;
      };

        $scope.openDrilldown = function () {
          $modal.open({
            templateUrl: 'app/elements/solar-energy-production/drilldown.html',
            controller: 'EnergyGenerationDrilldownCtrl',
            windowClass: 'drilldown',
            size: 'lg',
            resolve: {
              'lastSEG': function () {
                return $scope.lastSEG;
              },
              'currentDate': function () {
                return $scope.currentDate;
              },
              'dateRange': function() {
                return $scope.dateRange;
              }
            }
          });
        };
      }
    ])

    .directive('elementSolarEnergyProduction', function() {
      return {
        restrict: 'E',
        scope: true,
        controller: 'elementSolarEnergyProductionController',
        templateUrl: 'app/elements/solar-energy-production/template.html',
        link : function (scope, element, attrs) {
          scope.startWatchSEG();
          $(element).on('click', '.drilldown-picker', function() {
            scope.openDrilldown();
          });
        }
      };
    });

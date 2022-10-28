angular.module('bl.analyze.solar.surface')
  .directive('elementEnergyBySunhours', ['$rootScope', '$compile', '$modal', '$timeout', 'blSocket',
    function($rootScope, $compile, $modal, $timeout, blSocket) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/elements/sunhours-energy/template.html',
      link : function (scope, element, attrs, controller) {

        scope.init = function () {
          var d = new Date();
          scope.fullYear = d.getFullYear();
          scope.currentYear = scope.fullYear;
          scope.prevYear = scope.currentYear - 1;
          scope.nextYear = scope.currentYear + 1;
          scope.totalHours = 0;
        };

        blSocket.on('connected', function(data){
          if (data.socketId){
            $rootScope.socketId = data.socketId;
              scope.socketRequest = {
                request: 'assurf:sunhours',
                data: {
                  'socketId' : data.socketId,
                  'year': scope.currentYear
                }
            };
          }
        });

        blSocket.on('assurf:sunhours', function(data) {
          if(data.success) {
            scope.drawHeatmap(data);
          }
        });

        blSocket.on('assurf:sunhoursrealtime', function(data) {
          if(data.success) {
            scope.init();
            scope.drawHeatmap(data);
          }
        });

        scope.calendarChartConfig = {
           chart: {
            type: 'heatmap'
          },
          title: {
            text: 'Sun-Hours',
            floating: true,
            align: 'right',
            x: -45,
            y: 85,
            useHTML: true,
             style: {
                color: '#89969d',
                fontSize: '12px',
                fontFamily: 'HelveticaNeueW02-55Roma',
                transform: 'rotate(-90deg)',
                '-webkit-transform': 'rotate(-90deg)',
                '-moz-transform': 'rotate(-90deg)',
                '-ms-transform': 'rotate(-90deg)',
                '-o-transform': 'rotate(-90deg)',
                'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'
              }
          },
          xAxis: {
            opposite: true,
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            type: 'datetime',
            labels: {
              align: 'left',
              x: 5,
              format: '{value:%b}',
              style: {
                color: '#89969d',
                fontFamily: 'HelveticaNeueW02-75Bold'
              }
            }
          },
          yAxis: {
            categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            title: null,
            labels: {
              style: {
                color: '#5d6b87',
                fontFamily: 'HelveticaNeueW02-55Roma',
                'text-align' : 'center'
              }
            }
          },
          colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: '#fab8a0'
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            margin: 35,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 90
          },
          tooltip: {
            backgroundColor: 'rgba(35, 43, 57, 0.9)',
            borderColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            formatter: function () {
              var date = moment(this.point.x).format('ll');
              return '<span>' + date + '</span> <br><span class="kpi">' +
                this.point.value.toFixed(2) + ' Sun-hours</span>  <br><br>' +
                '<span>On ' + date + ', the sun rose at </span> <br>' +
                '<span>6:21am and set at 6:47pm, and it </span> <br>' +
                '<span>was a mostly sunny day. Due to the </span> <br>' +
                '<span>angle of the sun at this time of year, </span> <br>' +
                '<span>the sun’s maximum potential is </span> <br>' +
                '<span>relatively small, so there were only </span> <br>' +
                '<span class="kpi">' + this.point.value.toFixed(2) +
                '</span><span> Sun-Hours for the day.</span>';
            },
            style: {
              color: '#FFFFFF',
              fontSize: '11px',
              padding: '20px',
              fontFamily: 'HelveticaNeueW02-55Roma'
            }
          },
          series: [{
            borderWidth: 1,
            borderColor: '#e9e9e9',
            colsize: 24 * 7 * 3600 * 1000,
            data: []
          }],
          credits: {
            enabled: false
          },
          exporting: { enabled: false }

        };

        scope.drawHeatmap = function (data) {
          var seriesData = data.message;
          scope.totalHours = 0;
          angular.forEach(seriesData, function (val, key) {
             scope.totalHours += val[2];
          });
          scope.calendarChartConfig.series[0].data = data.message;
          $('#calendarChart').html('');
          $('#calendarChart').highcharts(scope.calendarChartConfig);
        };

        scope.goPrevYear = function() {
          scope.currentYear = scope.currentYear - 1;
          scope.prevYear = scope.currentYear - 1;
          scope.nextYear = scope.currentYear + 1;
          scope.socketRequest.data.year = scope.currentYear;

          blSocket.emit(scope.socketRequest.request, scope.socketRequest.data);
        };

        scope.goNextYear = function() {
          scope.currentYear = scope.currentYear + 1;
          scope.nextYear = scope.currentYear + 1;
          scope.prevYear = scope.currentYear - 1;

          scope.socketRequest.data.year = scope.currentYear;

          blSocket.emit(scope.socketRequest.request, scope.socketRequest.data);
        };

        scope.init();
      }
    };
  }]);
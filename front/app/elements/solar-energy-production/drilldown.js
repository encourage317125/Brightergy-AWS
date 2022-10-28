angular.module('bl.analyze.solar.surface')

.constant('candleStickChartConfig', {
  chart: {
    marginBottom: 60, marginRight: 60, spacingLeft: 0, spacingRight: 0, reflow: true, panning: false,
    height: 300, title: { text: null }, subtitle: { text: null },
    style: { fontSize: '11px', overflow: 'visible' }
  },
  navigator : {enabled:false}, navigation : {buttonOptions:{enabled : false}}, scrollbar : {enabled:false},
  rangeSelector : { enabled : false }, loading: false, credits: { enabled: false }, title : { text: null },
  tooltip: {
    useHTML: true, borderColor: null, borderWidth: 0, borderRadius: 3, shadow: false,
    spacing: [0,0,0,0], backgroundColor: 'rgba(35, 43, 57, 0.9)', style: {padding: '20px', whiteSpace: 'normal'}
  },
  yAxis: {
    title: null, opposite: true, offset: 50, min: 0,
    labels: { formatter: function() {return this.value.toLocaleString() + ' kWh';}}
  },
  plotOptions: {
    candlestick: {
      color: 'blue',
      upColor: 'red'
    }
  },
  xAxis: { startOnTick: true }
})

.constant('pieChartConfig', {
  chart: {
    borderColor: null, reflow: true, height: 494,
    style: { fontSize: '11px' }
  },
  plotOptions: {
    pie: { shadow: false, center: ['50%', '50%'], allowPointSelect: true, dataLabels: { useHTML: true }}
  },
  title: { text: null }, tooltip: {enabled: true}, loading: false, credits: {enabled: false}
})

.controller('EnergyGenerationDrilldownCtrl',
  ['$scope', '$interpolate', '$modalInstance', '$timeout', '$filter', 'moment', 'SourceSelectionEventService',
  'lastSEG', 'currentDate', 'dateRange', 'solarTagService', 'energyService', 'savingService', 'candleStickChartConfig',
  'pieChartConfig',
  function($scope, $interpolate, $modalInstance, $timeout, $filter, moment, SourceSelectionEventService, lastSEG,
           currentDate, dateRange, solarTagService, energyService, savingService, candleConfig, pieChartConfig) {
    $scope.lastSEG = lastSEG;
    $scope.lastSEGDrilldown = null;
    $scope.currentDate = currentDate;
    $scope.dateRange = dateRange;
    $scope.tableChart = {
      'data': [],
      'columns': []
    };
    $scope.isDataLoaded = {
      candle: false,
      pie: false,
      table: false
    };

    var tootipContents = $interpolate([
      '<div class="blue-box"><h5 class="title">Power Generation for the {{ period }}<br/> ',
        //'{{currentDate|amDateFormat:"MMMM, YYYY"}} </h5><br>',
        '{{currentDate}} </h5><br>',
      '<div class="row"><div class="col-xs-6"<span>{{ initialDate }} :</span></div>',
        '<div class="col-xs-6 text-right"><span class="orange">{{ initialValue|number:2 }}kWh</span></div></div>',
      '<div class="row"><div class="col-xs-6"><span>Min Day : {{ minDate }}</span></div>',
        '<div class="col-xs-6 text-right"><span class="green">{{ minValue|number:2 }}kWh</span></div></div>',
      '<div class="row"><div class="col-xs-6"><span>Max Day : {{ maxDate }}</span></div>',
        '<div class="col-xs-6 text-right"><span class="blue"> {{ maxValue|number:2 }}kWh</span></div></div>',
      '<div class="row"><div class="col-xs-6"><span>{{ finalDate }}</span></div>',
        '<div class="col-xs-6 text-right"><span class="orange"> {{ finalValue|number:2 }}kWh</span></div></div>',
      '</div>'].join(''));

    function getCandlestickData (data) {
      return data.map(function (item) {
        return [item.timestamp, item.initial, item.maximum, item.minimum, item.final, item.type];
      });
    }

    $scope.initCharts = function () {
      $scope.candleChartConfig = {
        options: candleConfig,
        useHighStocks: true,
        xAxis: {},
/*        xAxis: {
          labels: {formatter:function(){
            if ($scope.dateRange === 'total' && this.type === 'year') {
              return moment(this.value).format('YYYY');
            } else {
              return moment(this.value).format('MMM, YYYY');
            }
          }}
        },
*/        series: [{
          type: 'candlestick',
          name: 'Energy',
          color: 'rgba(255, 121, 64, 0.9)',
          lineColor: 'rgba(254, 189, 159, 0.9)',
          upColor: 'rgba(254, 189, 159, 0.9)',
          states: {hover: {enabled: false}},
          dataGrouping: {enabled: false},
          data: []
        }]
      };

      $scope.candleChartConfig.options.tooltip.formatter = function () {
        var index = this.points[0].point.index,
            minDate = $scope.lastSEGDrilldown.candlestick.series.data[index].minimumTimestamp,
            maxDate = $scope.lastSEGDrilldown.candlestick.series.data[index].maximumTimestamp,
            type = $scope.lastSEGDrilldown.candlestick.series.data[index].type;

        return tootipContents({
  //          currentDate: this.x, /// 1000,(new Date(this.x)).valueOf(),
          period: ($scope.dateRange === 'total' && type === 'year') ? 'Year' : 'Month',
          currentDate: ($scope.dateRange === 'total' && type === 'year') ? 
                    moment(this.x).format('YYYY') : moment(this.x).format('MMM, YYYY'),
          initialDate: ($scope.dateRange === 'total' && type === 'year') ? 
                    moment(this.x).startOf('year').format('MMM Do') : moment(this.x).startOf('month').format('MMM Do'),
          initialValue: this.points[0].point.open,
          minDate: moment(minDate).format('MMM Do'),
          minValue: this.points[0].point.low,
          maxDate: moment(maxDate).format('MMM Do'),
          maxValue: this.points[0].point.high,
          finalDate: ($scope.dateRange === 'total' && type === 'year') ? 
                    moment(this.x).endOf('year').format('MMM Do') : moment(this.x).endOf('month').format('MMM Do'),
          finalValue: this.points[0].point.close
        });
      };

      $scope.pieChartConfig = pieChartConfig;
      $scope.pieChartConfig.legend = {
        enabled: true,
        layout: 'vertical',
        align: 'center',
        width: 200,
        itemWidth: 200,
        verticalAlign: 'bottom',
        useHTML: true,
        labelFormatter: function() {
          return '<div style="text-align: left; white-space: pre-wrap; width: 200px">' + this.name + '</div>';
        }
      };
      $scope.pieChartConfig.series = [{
        type: 'pie',
        name: 'Total kWh',
        data: [],
        size: '40%',
        dataLabels: {
          formatter: function () {
            return '<div class="pie-datalabel-total"><b class="value">' +
                $filter('number')(this.y, 0) +
                '</b><br /><span>kWh Total</span></div>';
          },
          verticalAlign: 'middle', inside: true, overflow: 'justify',
          x: 0, distance: -80
        },
        tooltip: {pointFormat: '<b>{point.y:.1f} kWh</b>'}
      },{
        type: 'pie',
        data: [],
        innerSize: '50%',
        size: '80%',
        dataLabels: {
          formatter: function () {
            return '<div class="pie-datalabel-point">' + this.point.name + '<br />' +
                '<b class="value">' + $filter('number')(this.y, 1) + '%</b></div>';
          },
          crop: false,
          connectorColor: '#cccccc',
          distance: 0,
          enabled: false,
          allowPointSelect: true
        },
        tooltip: {pointFormat: '<b>{point.y:.1f}%</b>'},
        showInLegend: true
      }];
      /*
       $scope.pieChartConfig = {
       options: pieChartConfig,
       legend: {
       enabled: true,
       layout: 'vertical',
       align: 'right',
       width: 200,
       verticalAlign: 'middle',
       useHTML: true,
       labelFormatter: function() {
       return '<div style="text-align: left; width:130px;float:left;">' + this.name + '</div>';
       }
       },
       series: [{
       type: 'pie',
       name: 'Total kWh',
       data: [],
       size: '40%',
       dataLabels: {
       formatter: function () {
       return '<div class="pie-datalabel-total"><b class="value">' +
       $filter('number')(this.y, 0) +
       '</b><br /><span>kWh Total</span></div>';
       },
       verticalAlign: 'middle', inside: true, overflow: 'justify',
       x: 0, distance: -80
       },
       tooltip: {pointFormat: '<b>{point.y:.1f} kWh</b>'}
       },{
       type: 'pie',
       data: [],
       innerSize: '50%',
       size: '80%',
       dataLabels: {
       formatter: function () {
       return '<div class="pie-datalabel-point">' + this.point.name + '<br />' +
       '<b class="value">' + $filter('number')(this.y, 1) + '%</b></div>';
       },
       crop: false,
       connectorColor: '#cccccc',
       distance: 0,
       enabled: false,
       allowPointSelect: true
       },
       tooltip: {pointFormat: '<b>{point.y:.1f}%</b>'},
       showInLegend: true
       }]
       };*/
      };

      $scope.startWatchDrilldown = function () {
        energyService
            .watchSEGDrilldown(function (drilldownData) {
              $scope.lastSEGDrilldown = drilldownData;
              $scope.drawCandleStick(drilldownData);
            })
            .watchSEG(function (seg) {
              $scope.lastSEG = seg;
              $scope.drawPieChart(seg);
            });

        savingService
            .watchTable(function (table) {
              $scope.updateTable(table);
            });
      };

      SourceSelectionEventService.listen(function () {
        angular.extend($scope.isDataLoaded, {
          candle: false,
          pie: false,
          table: false
        });
      });

      $scope.drawCandleStick = function (segDrilldownData) {
        $scope.candleChartConfig.series[0].data = getCandlestickData(segDrilldownData.candlestick.series.data);
  //      $scope.candleChartConfig.xAxis.tickPositions = segDrilldownData.candlestick.series.data.map(function(row) {
  //        return row.timestamp;
  //      });
        $scope.candleChartConfig.xAxis.categories = segDrilldownData.candlestick.series.data.map(function(row) {
          if ($scope.dateRange === 'total' && row.type === 'year') {
            return moment(row.timestamp).format('YYYY');
          } else {
            return moment(row.timestamp).format('MMM, YYYY');
          }
        });
        $scope.isDataLoaded.candle = true;
      };

      $scope.drawPieChart = function (segData) {
        var newSeries = [],
            newTotal = [];
        angular.forEach(segData.pie.series[0].data, function (data) {
          newSeries.push({
            name: data[0],
            y: data[1],
            color: data[2]
          });
        });

        newTotal.push({
          name: 'Total kWh',
          y: segData.kpiData.totalProduction,
          color: '#fff'
        });

        $scope.pieChartConfig.series[0].data = newTotal;
        $scope.pieChartConfig.series[1].data = newSeries;
        console.log($scope.pieChartConfig);
        $('#gpsPieChart').highcharts($scope.pieChartConfig);
        $scope.isDataLoaded.pie = true;
      };

      $scope.updateTable = function(data) {
        $scope.tableChart = {
          data: data,
          columns: $scope.lastSEG.kpiData.totalProductionBySources.map(function (production) {
            return production.displayName;
          }),
          sourceIds: $scope.lastSEG.kpiData.totalProductionBySources.map(function (production) {
            return production.id;
          }),
          sourceNames: $scope.lastSEG.kpiData.totalProductionBySources.map(function (production) {
            return production.name;
          })
        };
        $scope.isDataLoaded.table = true;
      };

      $scope.closeDrilldown = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.emitSEGDrilldownData = function (dateRange) {
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

        energyService.emitSEGDrilldown(requestData);
      };

    $timeout(function () {
      $scope.initCharts();
      $scope.emitSEGDrilldownData($scope.dateRange);
      $scope.startWatchDrilldown();
      $scope.drawPieChart(lastSEG);
    }, 20);
}]);

angular.module('bl.analyze.solar.surface')
  .constant('fdChartConfigs', {
    'power': {
      title:{text:null}, credits: {enabled:false}, exporting:{enabled:false}, colors:['#ff7a41'],
      chart: {type:'areaspline', height:410, spacing:[0, 0, 0, 0], style:{width:'100%'}},
      tooltip:{
        valueSuffix:'kW', backgroundColor:'rgba(35,43,57,0.98)', borderRadius:3, borderWidth:0, shadow: false,
        shared: true,
        useHTML:true, lineWidth:1, crosshairs:{width:2, color:'gray', dashStyle:'shortdot'},
        style:{color:'#fff',padding: '0px'}
      },
      plotOptions: {
        series: {
          marker:{enabled:false}, states: {hover:{lineWidth: 1,lineWidthPlus: 0}}, lineWidth: 1,
          fillColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},
            stops : [
              [0, Highcharts.Color('#ff7a41').setOpacity(0.8).get('rgba')],
              [1, Highcharts.Color('#ff7a41').setOpacity(0.1).get('rgba')]
            ]
          }
        }
      },
      yAxis: {
        min:0, title:{text: null}, gridLineColor:'#cccccc', plotLines: [{value:0, width:1, color:'#808080'}],
        labels:{enabled: false}
      },
      loading: false
    },
    'energy': {
      chart: {
        marginBottom: 60, marginRight: 60, spacingLeft: 0, spacingRight: 0, reflow: true, panning: false,
        height: 300,
        style: { fontSize: '11px', overflow: 'visible' }
      },
      navigator : {enabled:false}, navigation : {buttonOptions:{enabled : false}}, scrollbar : {enabled:false},
      rangeSelector : { enabled : false }, loading: false, credits: { enabled: false }, title : { text: null },
      tooltip: {
        useHTML: true, borderColor: null, borderWidth: 0, borderRadius: 3, shadow: false,
        spacing: [0,0,0,0], backgroundColor: 'rgba(35, 43, 57, 0.98)', style: {padding: '0px', whiteSpace: 'normal'}
      },
      yAxis: {
        title: null, opposite: true, offset: 50, min: 0, labels: {format:'{value} kWh'}
      },
      plotOptions: {
        candlestick: {
          color: 'blue',
          upColor: 'red'
        }
      },
      xAxis: { startOnTick: true }
    }
  })
  /*.controller('facilityDetailsController', ['$scope', '$modalInstance', '$timeout', 'facilityDetailsService',
   function ($scope, $modalInstance, $timeout, facilityDetailsService) {*/
  .controller('facilityDetailsController',
  ['$scope', '$modalInstance', '$timeout', '$filter', '$interpolate', '$http',
    'moment', 'solarTagService', 'selectedFacility', 'fdChartConfigs',
    function ($scope, $modalInstance, $timeout, $filter, $interpolate, $http,
              moment, solarTagService, selectedFacility, fdChartConfigs) {
      var fdCallbackId;
      $scope.currentYear = $scope.selectedYear = moment().year();
      $scope.lastFacilityInfo = {
        'operator': 'Brightergy LLC',
        'predictedAnnualGeneration': 0,
        'predictedAnnualCarbon': 0,
        'description': '',
        'location': {
          availability: !!selectedFacility.latitude && !!selectedFacility.longitude,
          latitude: selectedFacility.latitude,
          longitude: selectedFacility.longitude
        },
        'address': selectedFacility.address,
        'installAddress': selectedFacility.installAddress,
        'potentialPower': selectedFacility.potentialPower,
        'commissioningDate': selectedFacility.commissioningDate === '-'
                            ? 'N/A'
                            : moment(selectedFacility.commissioningDate).format('MMMM D, YYYY')
      };

      $scope.isDataLoaded = false;
      $scope.isEnergyChartDataLoaded = false;
      $scope.isPowerChartDataLoaded = false;

      var tootipContents = $interpolate([
        '<div class="float-panel-info"><h5 class="title-energy">Energy Production for <br/> ',
        '{{currentDate|amDateFormat:"MMMM, YYYY"}} </h5>',
        '<div class="row"><div class="col-xs-6"<span>{{ initialDate }} :</span></div>',
        '<div class="col-xs-6 text-right"><span class="orange">{{ initialValue|number:2 }}kWh</span></div></div>',
        '<div class="row"><div class="col-xs-6"><span>Min Production :</span></div>',
        '<div class="col-xs-6 text-right"><span class="green">{{ minValue|number:2 }}kWh</span></div></div>',
        '<div class="row"><div class="col-xs-6"><span>Max Production :</span></div>',
        '<div class="col-xs-6 text-right"><span class="blue"> {{ maxValue|number:2 }}kWh</span></div></div>',
        '<div class="row"><div class="col-xs-6"><span>{{ finalDate }} :</span></div>',
        '<div class="col-xs-6 text-right"><span class="orange"> {{ finalValue|number:2 }}kWh</span></div></div>',
        '</div>'].join(''));

      $scope.powerChartConfig = {
        options: fdChartConfigs.power,
        xAxis: {
          llineColor: 'transparent', categories: [],
          labels:{formatter: function(){return $filter('amDateFormat')(this.value, 'MMM D');}}
        },
        series: [{ data: [] }],
        func: function (powerChartInstance) {
          $scope.powerChartInstance = powerChartInstance;
        }
      };

      $scope.powerChartConfig.options.tooltip.formatter = function () {
        var tooltipTxt = '<div class="float-panel-info">';
        tooltipTxt += '<h4 class="kpi">' + $filter('number')(this.points[0].y, 1) + ' kW</h4>';
        tooltipTxt += '<span>Power Generated on ' + $filter('amDateFormat')(this.x, 'MMM D') + '</span>';
        tooltipTxt += '</div>';
        return tooltipTxt;
      };

      $scope.energyChartInstance = null;
      $scope.powerChartInstance = null;

      $scope.energyChartConfig = {
        options: fdChartConfigs.energy, useHighStocks: true,
        xAxis: { labels: {formatter:function(){return moment(this.value).format('MMM');}} },
        series: [{
          type: 'candlestick',
          name: 'Energy',
          color: 'rgba(255, 121, 64, 0.9)',
          lineColor: 'rgba(254, 189, 159, 0.9)',
          upColor: 'rgba(254, 189, 159, 0.9)',
          states: {hover: {enabled: false}},
          dataGrouping: {enabled: false},
          data: []
        }],
        func: function (energyChartInstance) {
          $scope.energyChartInstance = energyChartInstance;
        }
      };

      $scope.energyChartConfig.options.tooltip.formatter = function () {
        return tootipContents({
          currentDate: this.x,
          initialDate: moment(this.x).startOf('month').format('MMMM Do'),
          initialValue: this.points[0].point.open,
          minValue: this.points[0].point.low,
          maxValue: this.points[0].point.high,
          finalDate: (moment(this.x).endOf('month').valueOf() < moment().valueOf()) ?
              moment(this.x).endOf('month').format('MMMM Do') : moment().format('MMMM Do'),
          finalValue: this.points[0].point.close
        });
      };

      $scope.startWatchFacilityDrilldown = function () {
        fdCallbackId = solarTagService.getFacilityDrilldown(function (fdData) {
          angular.extend($scope.lastFacilityInfo, fdData);
          //console.log($scope.lastFacilityInfo);
          $scope.drawChart();
          if (!$scope.lastFacilityInfo.location.availability) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='
                + $scope.lastFacilityInfo.installAddress)
                .success(function(resp) {
                  $scope.lastFacilityInfo.location = {
                    'latitude': resp.results[0].geometry.location.lat,
                    'longitude': resp.results[0].geometry.location.lng,
                    'availability': true
                  };
                  $scope.drawMap();
                })
                .error(function(resp) {
                  $scope.lastFacilityInfo.location = {
                    'latitude': resp.results[0].geometry.location.lat,
                    'longitude': resp.results[0].geometry.location.lng,
                    'availability': true
                  };
                  $scope.drawMap();
                });
          }
          $scope.drawMap();
          $scope.isDataLoaded = true;
          $scope.isEnergyChartDataLoaded = true;
          $scope.isPowerChartDataLoaded = true;
        });
      };

      $scope.closeDrilldown = function () {
        solarTagService.unwatchFacilityDrilldown(fdCallbackId);
        $modalInstance.dismiss('cancel');
      };

      $scope.selectYear = function (year) {
        $scope.selectedYear = year;
        solarTagService.emitFetchFacilityForDrilldown(selectedFacility.id, $scope.selectedYear);
        $scope.isEnergyChartDataLoaded = false;
      };

      $scope.onPowerTabOpen = function () {
        $scope.isPowerChartDataLoaded = false;
        $timeout(function () {
          $scope.powerChartInstance.redraw();
          $scope.powerChartInstance.reflow();
          $scope.isPowerChartDataLoaded = true;
        }, 300);
      };

      $scope.onEnergyTabOpen = function () {
        $scope.isEnergyChartDataLoaded = false;
        $timeout(function () {
          $scope.energyChartInstance.redraw();
          $scope.energyChartInstance.reflow();
          $scope.isEnergyChartDataLoaded = true;
        }, 300);
      };

      $scope.drawMap = function () {
        if ($scope.lastFacilityInfo.location.availability) {
          var facilityMapWidth = Math.ceil($('.ppd-mapphoto').width() / 2),
              facilityPosition = [ $scope.lastFacilityInfo.location.latitude,
                $scope.lastFacilityInfo.location.longitude ].join(',');
          var ppdmapHtml = '<img src="https://maps.googleapis.com/maps/api/staticmap?center=';
          ppdmapHtml += facilityPosition + '&markers=' + facilityPosition + '&zoom=14&size=';
          ppdmapHtml += facilityMapWidth + 'x410">';
          $('#ppdmap_container').html(ppdmapHtml);
        }
      };

      $scope.drawChart = function () {
        $scope.powerChartConfig.xAxis.categories = $scope.lastFacilityInfo.powerChart.categories;
        $scope.powerChartConfig.series[0].data = $scope.lastFacilityInfo.powerChart.series;

        $scope.energyChartConfig.xAxis.categories = $scope.lastFacilityInfo.energyChart.categories;
        $scope.energyChartConfig.series[0].data = $scope.lastFacilityInfo.energyChart.series;
      };

      $scope.startWatchFacilityDrilldown();
    }
  ]);

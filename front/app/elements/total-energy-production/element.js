angular.module('bl.analyze.solar.surface')

  .controller('elementTEGController',
  ['$rootScope', '$scope', '$filter', '$interpolate', 'energyService', 'SourceSelectionEventService',
    'asDateRangeSelectorConfig', '$modal',
  function($rootScope, $scope, $filter, $interpolate, energyService, SourceSelectionEventService,
           asDateRangeSelectorConfig, $modal) {
    $scope.isDataLoaded = false;
    $scope.dateRange = 'month';
    $scope.currentDate = moment().month();
    $scope.lastTEG = {
      'value' : 0,
      'unit': 'kWh'
    };

    $scope.extraInfo = 'A Megawatt-hour is equal to 1,000 kilowatt hours, ' +
        'or 1,000 kilowatts of electricity used continuously for one hour';

    var infoPanelTextSrc = 'Your system produced <span class="kpi">' +
        '{{ TEG }} {{TEGUnit}}</span> {{ dateRange }}{{ extraInfo }}.';

    $scope.infoPanelText = infoPanelTextSrc;

    $scope.$watch('dateRange', function(newVal,oldVal) {
      if (newVal !== oldVal) {
        $scope.isDataLoaded = false;
        energyService.emitTEG(newVal);
      }
    });

    $scope.startWatchTEG = function () {
      energyService.watchTEG(function (TEG) {
        $scope.lastTEG = TEG;
        $scope.infoPanelText = $interpolate(infoPanelTextSrc)({
          TEG: TEG < 1000 ? $filter('number')(TEG.value, 1) : $filter('number')(TEG.value/1000, 1),
          TEGUnit:TEG < 1000 ? 'KWh' : 'MWh',
          dateRange: $scope.dateRange === 'total' ? 'as total' : 'over the last ' + $scope.dateRange,
          extraInfo: TEG < 1000 ? '' : ', or '+$filter('number')(TEG.value, 0)+' kWh. '+ $scope.extraInfo
        });
        $scope.isDataLoaded = true;
        $scope.lastTEG.value = TEG < 1000 ? $filter('number')(TEG.value, 1) : $filter('number')(TEG.value/1000, 1);
        $scope.lastTEG.unit = TEG < 1000 ? 'KWh' : 'MWh';
      });
    };

    SourceSelectionEventService.listen(function () {
      $scope.isDataLoaded = false;
    });

    $scope.startWatchTEG();

    $scope.openDrilldown = function () {
      return $modal.open({
        templateUrl: 'app/elements/solar-energy-production/drilldown.html',
        controller: 'EnergyGenerationDrilldownCtrl',
        windowClass: 'drilldown',
        size: 'lg',
        resolve: {
          'lastSEG': function () {
            return $rootScope.rootLastSegData;
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
  }])
  .directive('elementTotalEnergyProduction', ['$modal', function ($modal) {
    return {
      restrict: 'E',
      scope: true,
      controller: 'elementTEGController',
      templateUrl: 'app/elements/total-energy-production/template.html',
      link : function ($scope, element) {
        $(element).on('click', '.numeric-data-wrapper', function() {
          $scope.openDrilldown();
        });
      }
    };
  }]);

angular.module('bl.analyze.solar.surface')

.controller('ElementEquivalenciesController',
  ['$scope', '$filter', 'equivalenciesService', 'SourceSelectionEventService', 'asDateRangeSelectorConfig',
  function ($scope, $filter, equivalenciesService, SourceSelectionEventService, asDateRangeSelectorConfig) {
    $scope.isDataLoaded = false;
    $scope.dateRange = 'month';
    $scope.lastEquiv = {
      'carsRemoved': 0.0,
      'homePowered': 0.0,
      'seedlingsGrown': 0,
      'refrigerators': 0,
      'mobilePhones': 0,
      'batteries': 0,
      'avoidedCarbon': 0,
      'gallonsGas': 0,
      'tankersGas': 0,
      'railroadCarsCoal': 0,
      'barrelsOil': 0,
      'propaneCylinders': 0,
      'powerPlants': 0,
      'kwh': 0
    };

    $scope.$watch('dateRange', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.isDataLoaded = false;
        equivalenciesService.emitEquivalencies(newVal);
      }

      if (newVal === 'total') {
        $scope.dateRangeLabels = '';
      } else {
        $scope.dateRangeLabels = ' in the past ' + asDateRangeSelectorConfig.labels[newVal].toLowerCase();
      }
    });

    $scope.watchEquiv = function () {
      equivalenciesService.watchEquivalencies(function (equiv) {
        $scope.lastEquiv = equiv;
        $scope.isDataLoaded = true;
      });
    };


    SourceSelectionEventService.listen(function () {
      $scope.isDataLoaded = false;
    });
    $scope.watchEquiv();
  }])
  .directive('elementEquivalencies', ['$modal', function($modal) {
    var openDrilldown = function (lastEquiv) {
      return $modal.open({
        templateUrl: 'app/elements/equivalencies/drilldown.html',
        controller: 'EquivalenciesDrilldownController',
        windowClass: 'drilldown',
        size: 'lg',
        resolve: {
          'lastEquiv': function () {
            return lastEquiv;
          }
        }
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'app/elements/equivalencies/template.html',
      controller: 'ElementEquivalenciesController',
      replace: true,
      scope: true,
      link : function (scope, element, attrs) {
        $(element).on('click', '.panel-body', function () {
          openDrilldown(scope.lastEquiv);
        });
      }
    };
  }]);

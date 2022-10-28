angular.module('bl.analyze.solar.surface')
  .controller('ElementAvoidedCarbonController',
    ['$scope', '$filter', '$interpolate', 'equivalenciesService', 'SourceSelectionEventService',
      'asDateRangeSelectorConfig',
    function ($scope, $filter, $interpolate, equivalenciesService, SourceSelectionEventService,
              asDateRangeSelectorConfig) {
      $scope.isDataLoaded = false;
      $scope.dateRange = 'month';
      $scope.lastCarbonAvoided =  {
        carbonAvoided: 0,
        carbonAvoidedTotal: 0
      };


      var iPanelTextSrc = 'Your system avoided <span class="kpi">{{ Carbon }}lbs</span> of carbon '
                                    + 'dioxide {{ dateRange }}.';
      $scope.infoPanelText = iPanelTextSrc;

      $scope.$watch('dateRange', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.isDataLoaded = false;
          equivalenciesService.emitCarbonAvoided(newVal);
        }
      });

      $scope.watchCarbon = function () {
        equivalenciesService
          .watchCarbonAvoided(function (CA) {
            $scope.lastCarbonAvoided = CA;
            $scope.infoPanelText = $interpolate(iPanelTextSrc)({
              Carbon: $filter('number')(CA.carbonAvoided, 0),
              dateRange: $scope.dateRange === 'total' ? 'as total' : 'over the last ' + $scope.dateRange
            });
            $scope.isDataLoaded = true;
          });
      };

      SourceSelectionEventService.listen(function (event, selectedSources) {
        $scope.isDataLoaded = false;
      });

      $scope.watchCarbon();
    }
  ])
  .directive('elementAvoidedCarbon', ['$q', '$modal',
    function($q, $modal) {
      /*var openDrilldown = function (lastEquiv) {
        return $modal.open({
          templateUrl: 'app/elements/equivalencies/drilldown.html',
          controller: 'EquivalenciesDrilldownController',
          windowClass: 'drilldown',
          size: 'lg',
          resolve: {
          }
        });
      };*/

      return {
        restrict: 'E',
        templateUrl: 'app/elements/avoided-carbon/template.html',
        scope: true,
        controller: 'ElementAvoidedCarbonController',
        replace: true,
        link : function (scope, element, attrs) {
        }
      };
    }
  ]);

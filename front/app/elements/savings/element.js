angular.module('bl.analyze.solar.surface')
  .controller('ElementSavingController', ['$scope', 'savingService', 'SourceSelectionEventService',
    'asDateRangeSelectorConfig',
    function($scope, savingService, SourceSelectionEventService, asDateRangeSelectorConfig) {
      $scope.isDataLoaded = false;
      $scope.dateRange = 'month';
      $scope.lastSavingData = {
        kpi: {
          totalSavingPerDateRange: 0,
          totalSavings: 0
        }
      };

      SourceSelectionEventService.listen(function () {
        $scope.isDataLoaded = false;
      });

      $scope.$watch('dateRange', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          savingService.emit($scope.dateRange);
          $scope.isDataLoaded = false;
        }
      });

      $scope.startWatchSavings = function () {
        savingService
          .watch(function (savingData) {
            angular.extend($scope.lastSavingData, savingData);
            $scope.isDataLoaded = true;
          });
      };

      $scope.startWatchSavings();
    }])
  .directive('elementSavings', ['$modal',
    function($modal) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/elements/savings/template.html',
        controller: 'ElementSavingController',
        link : function (scope, element) {
          /*element.on('click', '.widget', function () {
            $modal.open({
              templateUrl: 'app/elements/savings/drilldown.html',
              controller: 'SavingsDrilldownController',
              windowClass: 'drilldown',
              size: 'lg',
              resolve: {
                primaryElementData: function () {
                  return scope.lastSavingData;
                },
                dateRange: function () {
                  return scope.dateRange;
                }
              }
            });
          });*/
        }
      };
    }]);

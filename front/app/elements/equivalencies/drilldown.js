angular.module('bl.analyze.solar.surface')

.controller('EquivalenciesDrilldownController',
  ['$scope', '$modalInstance', 'lastEquiv', 'equivalenciesService', 'SourceSelectionEventService',
  function ($scope, $modalInstance, lastEquiv, equivalenciesService, SourceSelectionEventService) {
    $scope.isDataLoaded = true;
    $scope.lastEquiv = lastEquiv;

    $scope.closeDrilldown = function () {
      $modalInstance.dismiss('cancel');
    };

    SourceSelectionEventService.listen(function () {
      $scope.isDataLoaded = false;
    });
  }
]);
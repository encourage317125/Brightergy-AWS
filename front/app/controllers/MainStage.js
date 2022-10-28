angular.module('bl.analyze.solar.surface')
  .controller('MainStageController', ['$scope',
    function ($scope) {
      //console.log('unknown:', Unknown);
      $scope.init = function () {
        console.log('Main Stage init');
      };
    }
  ]);
'use strict';

angular.module('blComponents.Settings')

  .controller('sourceManagementController', ['$scope',
    function ($scope) {

      $scope.init = function () {
        console.log('Source Managegment page is going here');
      };

      $scope.init();
    }
  ]);
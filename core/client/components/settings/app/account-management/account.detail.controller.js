'use strict';

angular.module('blComponents.Settings')

  .controller('accountDetailController', ['$scope', '$state', 'currentUser',
    function ($scope, $state, currentUser) {
      $scope.currentUser = currentUser;
    }
  ]);
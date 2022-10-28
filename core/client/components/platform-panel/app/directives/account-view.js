'use strict';

angular.module('blComponents.platformPanel')
.controller('accountViewController', ['$scope', 'AccountService',
  function ($scope, AccountService) {
    // $scope.currentAccount contains Current User's account information

    $scope.accountModifiable = $scope.currentUser.role === 'BP' || $scope.currentUser.role === 'Admin';

    $scope.updateCurrentAccount = function () {
      if (!$scope.accountModifiable) {
        alert('You are not allowed to modify account information');
        return ;
      }

      return AccountService
        .updateAccount($scope.currentAccount);
    };
  }
])

.directive('accountView',
  function () {
    return {
      restrict: 'E',
      templateUrl: '/components/platform-panel/app/templates/account-view.html',
      controller: 'accountViewController',
      link: function(scope, element, attrs) {

      }
    };
  }
);
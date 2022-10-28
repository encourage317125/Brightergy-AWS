'use strict';

angular.module('blComponents.Settings')

.controller('profileManagementController', ['$scope', '$state', 'UserService',
  function ($scope, $state, UserService) {
    $scope.tabs = [
      { heading: 'User Details', route:'settings.profile.detail', active:true },
      { heading: 'Social Networks', route:'settings.profile.social', active:false }
    ];

    $scope.init = function () {
      UserService.getCurrentUser().then(function (me) {
        $scope.currentUser = me;
      });
    };

    $scope.$on('currentUserChanged', function () {
      $scope.init();
    });

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tabs.forEach(function(tab) {
        tab.active = $state.is(tab.route);
      });
    });

    $scope.init();
  }
]);

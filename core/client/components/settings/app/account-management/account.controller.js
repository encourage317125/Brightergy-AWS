'use strict';

angular.module('blComponents.Settings')

.controller('accountManagementController', ['$scope', '$state', 'currentUser',
  function ($scope, $state, currentUser) {
    $scope.currentUser = currentUser;
    $scope.tabs = [
      { heading: 'Account Details', route:'settings.account.detail', active:true },
      { heading: 'Subscription', route:'settings.account.subscription', active:false },
      { heading: 'Team Members', route:'settings.account.team', active:false },
      { heading: 'Settings', route:'settings.account.settings', active:false }
    ];

    $scope.init = function () {
      console.log('Profile is going here');
    };

    //$scope.$on('$stateChangeSuccess', function() {
    //  $scope.tabs.forEach(function(tab) {
    //    tab.active = $state.is(tab.route);
    //  });
    //});

    $scope.init();
  }
]);
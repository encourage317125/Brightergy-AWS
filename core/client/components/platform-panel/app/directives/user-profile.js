'use strict';

angular.module('blComponents.platformPanel')
.controller('userProfileController', ['$scope', '$interpolate', '$timeout', 'UserService',
  function ($scope, $interpolate, $timeout, UserService) {
    var infoTextTemplate = {
      'BP': ['You are part of the Brightergy Organization.',
             'As Brightergy Personnel, you have full administrative access to the entire platform.'].join(' '),
      'Admin': ['You are an Admin for the {{ accountName}} account.',
              'As an Admin, you can manage data sources, other users, and all other aspects of the account.'].join(' '),
      'TM': ['You are a member of the {{ accountName }} team.',
            'As a Team Member, you can view data sources and use them in your apps.'].join(' ')
    };
    $scope.infoTextOfRole = infoTextTemplate.TM;

    $scope.loadInfoText = function (role) {
      $scope.infoTextOfRole = $interpolate(infoTextTemplate[role])({
        accountName: $scope.currentAccount ? $scope.currentAccount.name : '<i>{ Loading... }</i>'
      });
    };

    $scope.initLoad = function () {
      $scope.$watch('currentAccount', function (n, o) {
        if (n) {
          var role = $scope.currentUser.role;
          $scope.loadInfoText(role);
        }
      });
    };

    $scope.updateCurrentUser = function () {
      alert ('saving');
      return UserService.updateUser({user: $scope.currentUser});
    };
  }
])
.directive('userProfile', function() {
  return {
    restrict: 'E',
    controller: 'userProfileController',
    templateUrl: '/components/platform-panel/app/templates/user-profile.html',
    link: function(scope, element, attrs) {
      scope.isAvatarLoading = true;
      scope.initLoad();

      $(element).find('.profile-img').bind('load', function(e) {
        scope.$apply(function() {
          scope.isAvatarLoading = false;
        });
      });
    }
  };
});

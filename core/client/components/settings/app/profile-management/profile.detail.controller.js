'use strict';

angular.module('blComponents.Settings')

.controller('profileDetailController', ['$scope', '$rootScope', '$state', '$uibModal', 'UserService',
  function ($scope, $rootScope, $state, $uibModal, UserService) {
    var infoTextTemplate = {
      'BP': ['You are part of the Brightergy Organization.',
        'As Brightergy Personnel, you have full administrative access to the entire platform.'].join(' '),
      'Admin': ['You are an Admin for the {{ accountName}} account.',
        'As an Admin, you can manage data sources, other users, and all other aspects of the account.'].join(' '),
      'TM': ['You are a member of the {{ accountName }} team.',
        'As a Team Member, you can view data sources and use them in your apps.'].join(' ')
    };

    $scope.infoTextOfRole = infoTextTemplate.TM;

    $scope.init = function () {
      UserService.getCurrentUser().then(function (me) {
        $scope.currentUser = me;
      });
    };

    $scope.updateCurrentUser = function () {
      return UserService
        .updateUser({user: $scope.currentUser})
        .then(function (updated) {
          UserService.setCurrentUser(updated);
          $rootScope.$broadcast('currentUserChanged');
          return updated;
        });
    };

    $scope.showResetPwdModal = function () {
      $uibModal.open({
        templateUrl: 'app/profile-management/partials/reset-pwd.template.html',
        controller: 'profileResetPwdModalController',
        //animation: 'fade',
        keyboard: false,
        backdrop: false,
        windowClass: 'modal-style',
        resolve: {
          currentUser: function () {
            return $scope.currentUser;
          }
        }
      });
    };

    $scope.showDeleteMeModal = function () {
      $uibModal.open({
        templateUrl: 'app/profile-management/partials/delete-me.template.html',
        controller: 'profileDeleteMeModalController',
        //animation: true,
        keyboard: false,
        backdrop: false,
        windowClass: 'modal-style',
        resolve: {
          currentUser: function () {
            return $scope.currentUser;
          }
        }
      });
    };

    $scope.init();
  }
]);

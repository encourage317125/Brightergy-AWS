'use strict';

angular.module('blComponents.platformPanel').controller('deleteAccountModalController',
  ['$scope', '$uibModalInstance', 'UserService', 'currentUser', 'globalConfig',
    function($scope, $uibModalInstance, UserService, currentUser, globalConfig) {
      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.isRemoving = false;
      $scope.deleteUser = function () {
        $scope.isRemoving = true;
        UserService
          .deleteUser(currentUser._id || currentUser.id)
          .then(function () {
            UserService
              .logout()
              .then(function () {
                window.location.href = globalConfig['REDIRECT-URL-AFTER-LOGOUT'];
              });
          }, function (errorMessage) {
            $scope.errorMessage = errorMessage;
          })
          .finally(function () {
            $scope.isRemoving = false;
          });
      };
    }
  ]);

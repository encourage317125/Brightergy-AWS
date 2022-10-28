'use strict';
angular.module('blComponents.platformPanel')
  .controller('resetPasswdModalController', ['$scope', '$uibModalInstance', 'UserService', 'currentUser',
    function($scope, $uibModalInstance, UserService, currentUser){
      $scope.errorMessage = '';
      $scope.isSaving = false;
      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.resetPassword = function () {
        $scope.isSaving = true;
        UserService
          .sendResetPwdLink(currentUser.email)
          .then(function(resp) {
            console.log(resp);
            $scope.isSucceeded = true;
            $scope.isFailure = false;
          }, function(error){
            $scope.isFailure = true;
            $scope.isSucceeded = false;
            $scope.errorMessage = error;
          })
          .finally(function () {
            $scope.isSaving = false;
          });
      };
    }
  ]);

'use strict';
angular.module('blComponents.platformPanel')
  .controller('deleteTMModalController', ['$scope', '$uibModalInstance', 'UserService', 'selectedUser',
    function($scope, $uibModalInstance, UserService, selectedUser) {
      $scope.isRemoving = false;
      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.deleteUser = function () {
        $scope.isRemoving = true;
        UserService
          .deleteUser(selectedUser._id)
          .then(function (resp) {
              $uibModalInstance.close(selectedUser);
          },
          function (error){
            alert('Failure in removing user: ', error);
          })
          .finally(function () {
            $scope.isRemoving = false;
          });
      };
    }
  ]);

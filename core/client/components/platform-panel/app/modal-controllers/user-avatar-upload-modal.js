'use strict';
angular.module('blComponents.platformPanel')
  .controller('userAvatarUploadModalController', ['$scope', '$rootScope', '$uibModalInstance', 'UserService',
    function($scope, $rootScope, $uibModalInstance, UserService) {
      $scope.bUploading = false;
      $scope.uploadPercent = 0;
      $scope.bUploadFailed = false;

      $scope.avatar = {
        file: null,
        myOriginalImage: null,
        myCroppedImage: null
      };

      $scope.isFileSelected = false;

      $scope.closeModal = function() {
        if ($scope.bUploading) {
          return;
        }

        $scope.uploadPercent = 0;
        $scope.isFileSelected = false;
        $scope.bUploadFailed = false;
        $uibModalInstance.dismiss('cancel');
      };

      $scope.startUpload = function () {
        if ($scope.bUploading) {
          return;
        }

        $scope.bUploading = true;
        $scope.bUploadFailed = false;

        UserService
          .uploadLoggedInUserPhoto($scope.avatar.file, $scope.avatar.myCroppedImage)
          .then(function (updatedUser) {
            //success
            $scope.isFileSelected = false;
            $uibModalInstance.close(updatedUser);
          }, function (error) {
            //error
            $scope.uploadPercent = 0;
            $scope.bUploadFailed = true;
          }, function (evt) {
            //progress
            $scope.uploadPercent = parseInt(100.0 * evt.loaded / evt.total);
          })
          .finally(function () {
            $scope.bUploading = false;
          });
      };

      $scope.loadImagePreview = function () {
        var reader = new FileReader();
        reader.onload = function (evt) {
          if (!$scope.$$phase) {
            $scope.$apply(function () {
              $scope.avatar.myOriginalImage = evt.target.result;
            });
          }
        };
        reader.readAsDataURL($scope.avatar.file);
      };

      $scope.loadAvatar = function (files) {
        if (!files.length) {
          return false;
        }

        $scope.isFileSelected = true;
        $scope.avatar.file = files[0];

        $scope.loadImagePreview();
      };
    }
  ]);

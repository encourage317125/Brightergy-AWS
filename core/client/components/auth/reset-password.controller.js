angular
  .module('blApp.components.auth')
  .controller('ResetPasswordController',
  ['$scope', '$window', '$http', '$interval',
    function ($scope, $window, $http, $interval) {
    $scope.update = {
      new: '',
      confirm: '',
      strength: -1
    };
    $scope.timeCountDown = 10;

    $scope.updatePasswordSucceeded = false;

    $scope.doValidation = function () {
      if ($scope.updatePasswordForm.$invalid) {
        $scope.updatePasswordForm.submitted = true;
        return false;
      }

      $scope.isPasswordDisMatch = $scope.update.new !== $scope.update.confirm;

      return !$scope.isPasswordDisMatch && $scope.update.strength > 3;
    };

    $scope.backToLogin = function () {
      if (angular.isDefined($scope.intervalStop)) {
        $interval.cancel($scope.intervalStop);
        $scope.intervalStop = undefined;
      }

      $window.location.href = '/login';
    };

    $scope.startCountDown = function () {
      $scope.intervalStop = $interval(function () {
        if ($scope.timeCountDown < 1) {
          return $scope.backToLogin();
        }

        $scope.timeCountDown--;
      }, 1000);
    };

    $scope.updatePassword = function () {

      if (!$scope.doValidation()) {
        return false;
      }

      $scope.isDoingUpdate = true;
      var apiUrl = '/users/password/',
        requestData = {
          token: window.atob($window.token),
          password: angular.copy($scope.update.new),
        };

      $http.post(apiUrl, requestData).
        then(function () {
          $scope.updatePasswordSucceeded = true;
          $scope.updatePasswordErrorMessage = null;
          $scope.startCountDown();
        }, function (errorResp) {
          $scope.updatePasswordErrorMessage = errorResp.data.message;
          $scope.updatePasswordSucceeded = false;
        }).
        finally(function () {
          $scope.isPasswordMatch = false;
          $scope.isPasswordUppercase = false;
          $scope.isDoingUpdate = false;
        });
    };
  }]);
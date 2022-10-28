angular
  .module('blApp.components.auth')
  .controller('AuthController', ['$scope', '$http',
    function ($scope, $http) {

      function getParameterByName(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
          results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      }

      function getCookie(cookiename) {
        var cookiestring = new RegExp('' + cookiename + '[^;]+').exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '');
      }

      $scope.selectedForm = 'login';
      $scope.socialLoginErrorMessage = getCookie('status');
      $scope.login = {
        email: '',
        password: '',
        rememberMe: false
      };

      $scope.forgot = {
        email: ''
      };

      $scope.switchForm = function (targetForm) {
        if (targetForm === 'login') {
          $scope.forgotErrorMessage = null;
          $scope.resetForm.$setPristine();
          $scope.resetPasswordSucceeded = false;
        } else {
          $scope.loginErrorMessage = null;
          $scope.loginForm.$setPristine();
        }
        $scope.selectedForm = targetForm;
      };

      $scope.doLogin = function () {
        if ($scope.loginForm.$invalid) {
          $scope.loginForm.submitted = true;
          return false;
        }
        var apiUrl = '/users/login',
          requestData = angular.copy($scope.login);
        var redirectTo = getParameterByName('redirect');
        if (redirectTo) {
          requestData.redirect = redirectTo;
        }

        $scope.isDoingLogin = true;
        $http.post(apiUrl, requestData).
          then(function (data) {
            // Login success
            window.location.href = data.response/*redirectUrl*/;
          }, function (errorResp) {
            $scope.loginErrorMessage = errorResp.data.message;
            $scope.isDoingLogin = false;
          });
      };

      $scope.doResetPassword = function () {
        if ($scope.resetForm.$invalid) {
          $scope.resetForm.submitted = true;
          return false;
        }

        var apiUrl = '/users/password/' + $scope.forgot.email,
          requestData = angular.copy($scope.forgot);

        $scope.isDoingReset = true;
        $http.post(apiUrl, requestData).
          then(function () {
            // reset password success
            $scope.forgotErrorMessage = null;
            $scope.resetPasswordSucceeded = true;
          }, function (errorResp) {
            $scope.forgotErrorMessage = errorResp.data.message;
            $scope.resetPasswordSucceeded = false;
          }).
          finally(function () {
            $scope.isDoingReset = false;
          });
      };

      $scope.init = function(errors) {
        $scope.loginErrorMessage = errors;
      };
      $scope.init(renderErrors);

    }]);
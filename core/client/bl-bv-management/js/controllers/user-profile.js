'use strict';

angular.module('blApp.management.controllers')
    .controller('UserProfileCtrl', ['$scope', '$rootScope', '$timeout', '$http', 'utilService',
        function ($scope, $rootScope, $timeout, $http, utilService) {
            $scope.showUserProfile = false;
            $scope.editUser = $rootScope.currentUser;
            $scope.passwordError = '';
            $scope.showError = false;
            $scope.editUser.userPassword = '';
            $scope.editUser.userConfirmPassword = '';
            $scope.showToolTip = false;

            $scope.cLog = function() {
                console.log($scope.editUser.userPassword);
            };

            $scope.toggleShow = function() {
                if ($scope.showUserProfile) {
                    $scope.showUserProfile = false;
                } else {
                    $scope.showUserProfile = true;
                    $scope.editUser = $rootScope.currentUser;
                }
            };

            $scope.uploadUserPhoto = function () {
                //I am so sorry
                var uploader = document.getElementById('profileImageUpload');
                uploader.click();
            };

            $scope.uploadFiles = function() {
                var files = event.target.files;
                var data = new FormData();
                var apiUrl = '/users/assets/userprofile';

                $.each(files, function(key, value) {
                    data.append('assetsFile', value);
                });

                $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type':undefined}
                }).then(function (resp) {
                    console.log('[USER PROFILE] Image uploaded.');
                    console.log(resp);
                });
            };


            $scope.saveUser = function () {
                console.log('[USER PROFILE] Saving User data...');
                $rootScope.ajaxLoading = true;
                var commitUser = $scope.editUser;
                //$.grep($rootScope.all_members, function(e){ return e._id == userId;})[0];
                var userNames = utilService.parseName($scope.editUser.name);
                var userEmails = utilService.parseEmail($scope.editUser.email);
                commitUser.firstName = userNames[0];
                commitUser.middleName = userNames[1];
                commitUser.lastName = userNames[2];
                commitUser.email = userEmails[0];
                commitUser.emailUser = userEmails[1];
                commitUser.emailDomain = userEmails[2];
                commitUser.phone = utilService.parsePhoneNum($scope.editUser.phone);
                commitUser.nodes = $scope.editUser.nodes;

                if ($scope.validatePassword()) {
                    commitUser.password = $scope.editUser.userPassword;
                }

                var apiUrl = '/users/' + commitUser._id;
                var inputJson = {user: commitUser};

                $http.put(apiUrl, inputJson).then(function() {
                    console.log('[USER PROFILE] User data successfully saved.');
                    console.log($rootScope.currentUser);
                    $rootScope.ajaxLoading = false;
                    $scope.showUserProfile = false;
                }, function () {
                    console.log('[USER PROFILE] [!] User data not saved.');
                    $rootScope.ajaxLoading = false;
                    $rootScope.$apply();
                    $scope.showUserProfile = false;
                });
            };

            $scope.validatePassword = function () {
                console.log($scope.editUser.userPassword + ':' + $scope.editUser.userConfirmPassword);
                var validated = true;
                $scope.passwordError = ['Password must contain all of the following:',
                                        '<p/>8 characters, 1 capital letter, 1 lower case letter, 1 number.'].join('');

                if (!$scope.editUser.userPassword.match(/([A-Z])/)) {
                    validated = false;
                }
                if (!$scope.editUser.userPassword.match(/([a-z])/)) {
                    validated = false;
                }
                if (!$scope.editUser.userPassword.match(/([0-9])/)) {
                    validated = false;
                }
                if ($scope.editUser.userPassword.length < 8) {
                    validated = false;
                }
                if (validated) {
                    $scope.passwordError = '';
                }

                if (validated && $scope.editUser.userPassword !== $scope.editUser.userConfirmPassword) {
                    validated = false;
                    $scope.passwordError = 'Passwords do not match.';
                }

                if (validated || $scope.editUser.userPassword === '') {
                    $scope.showError = false;
                } else {
                    $scope.showError = true;
                }

                if (validated) {
                    console.log('Valid password combination - ',
                        $scope.editUser.userPassword + ':' + $scope.editUser.userConfirmPassword);
                }

                return validated;
            };

        }
    ]);

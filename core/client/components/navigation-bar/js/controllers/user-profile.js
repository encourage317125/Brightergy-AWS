angular.module('blApp.components.navigationBar')
    .controller('UserProfileCtrl', ['$scope', '$rootScope', '$timeout', '$uibModal', '$http', 'utilService',
        function ($scope, $rootScope, $timeout, $uibModal, $http, utilService) {

            $scope.showUserProfile = false;
            $scope.editUser = angular.copy($rootScope.currentUser);
            $scope.passwordError = '';
            $scope.showError = false;
            $scope.editUser.userPassword = '';
            $scope.editUser.userConfirmPassword = '';
            $scope.showToolTip = false;
            $scope.toolTipText = 'Change your profile picture!';
            $scope.imageUploading = false;
            $scope.activePanel = false;
            $scope.submitted = false;

            var defaultPictureUrl = $rootScope.baseCDNUrl + '/assets/img/mm-picture.png';
            var defaultBpPictureUrl = $rootScope.baseCDNUrl + '/assets/img/icon_SF_large.png';

            $scope.setDefaultPicture = function () {
                if($rootScope.currentUser.profilePictureUrl === '' || 
                    $rootScope.currentUser.profilePictureUrl === null) {
                    $rootScope.currentUser.profilePictureUrl = defaultPictureUrl;
                }

                if($rootScope.currentUser.role === 'BP' && 
                    $rootScope.currentUser.profilePictureUrl === defaultPictureUrl) {
                    $rootScope.currentUser.profilePictureUrl = defaultBpPictureUrl;
                }

            };

            $scope.cLog = function() {
                console.log($scope.editUser.userPassword);
            };

            $scope.toggleShow = function(form) {
                if (typeof form !== 'undefined') {
                    form.$setPristine();
                }
                $scope.submitted = false;

                console.log('Toggle User Profile');

                if ($scope.showUserProfile) {
                    $scope.close();
                } else {
                    $scope.showUserProfile = true;
                    $scope.editUser = angular.copy($rootScope.currentUser);
                    $( '#navigation-bar-main' ).css( 'z-index', '1005' );
                }
            };

            $scope.close = function() {
                $scope.showUserProfile = false;
                //$scope.activePanel = false;
                $( '#navigation-bar-main' ).css( 'z-index', '999' );
            };

            $scope.setShowToolTip = function(bool) {

                if (bool) {
                    $scope.showToolTip = true;
                } else if (!$scope.imageUploading) {
                    $scope.showToolTip = false;
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

                $scope.toolTipText = 'Uploading...';
                $scope.imageUploading = true;
                $scope.showToolTip = true;

                $http
                    .post(apiUrl, data, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type':undefined}
                    })
                    .then(function(resp) {
                            console.log('[USER PROFILE] Image uploaded.');
                            $scope.currentUser.profilePictureUrl = resp.profilePictureUrl;

                            $scope.toolTipText = 'Change your profile picture!';
                            $scope.imageUploading = false;
                            $scope.showToolTip = false;
                        }, function(resp) {
                            $scope.toolTipText = 'Change your profile picture!';
                            $scope.imageUploading = false;
                            $scope.showToolTip = false;
                            console.log('ERRORS: ' + resp);
                        });

            };

            $scope.saveUser = function (form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                form.$setPristine();
                $scope.submitted = false;

                console.log('[USER PROFILE] Saving User data...');
                $rootScope.ajaxLoading = true;
                var commitUser = $scope.editUser;
                var userNameArray = utilService.parseName($scope.editUser.name);
                var userEmailArray = utilService.parseEmail($scope.editUser.email);
                commitUser.firstName = userNameArray[0];
                commitUser.middleName = userNameArray[1];
                commitUser.lastName = userNameArray[2];
                commitUser.email = userEmailArray[0];
                commitUser.emailUser = userEmailArray[1];
                commitUser.emailDomain = userEmailArray[2];
                commitUser.phone = utilService.parsePhoneNum($scope.editUser.phone);
                commitUser.nodes = $scope.editUser.nodes;
                /*
                if ($scope.validatePassword()) {
                    commitUser.password = $scope.editUser.userPassword;
                }*/
                var apiUrl = '/users/' + commitUser._id;
                var inputJson = {user: commitUser};

                $http
                    .put(apiUrl, inputJson)
                    .then(function(resp) {
                        $rootScope.currentUser = angular.copy(resp);
                        console.log('[USER PROFILE] User data successfully saved.');
                        console.log($rootScope.currentUser);
                        $rootScope.ajaxLoading = false;
                        $scope.showUserProfile = false;
                    }, function () {
                        console.log('[USER PROFILE] [!] User data not saved.');
                        $rootScope.ajaxLoading = false;
                        //$rootScope.$apply(); << What does this do in this context, specifically?
                        // Message me if you know. - WJ
                        $scope.showUserProfile = false;
                    });
            };

            $scope.newPassword = function () {
                console.log('new password click');
                $rootScope.ajaxLoading = true;
                var apiUrl = '/users/password/' + $scope.editUser.email;
                var inputJson = {email: $scope.editUser.email};
                $http
                    .post(apiUrl, inputJson)
                    .then(function() {
                        console.log($rootScope.currentUser);
                        $rootScope.ajaxLoading = false;
                    }, function () {
                        $rootScope.ajaxLoading = false;
                        $rootScope.$apply();
                    });
            };
            /*
            $scope.validatePassword = function () {
                console.log($scope.editUser.userPassword + ':' + $scope.editUser.userConfirmPassword);
                var validated = true;
                $scope.passwordError = 'Password must contain all of the following: ' +
                    '8 characters, 1 capital letter, 1 lower case letter, 1 number.';

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
                    console.log('Valid password combination - ' + $scope.editUser.userPassword + ':' + 
                        $scope.editUser.userConfirmPassword);
                }


                return validated;
            };
            */
            $scope.toggleUserPanel = function () {
                var userPanel = $('#user-panel-controls');
                var managerPanel = $('.manager_panel');
                $scope.showUserProfile = false;
                if (userPanel.is(':visible')) {
                    userPanel.slideUp(300, function() {
                        managerPanel.removeClass('shadow');
                    });
                } else {
                    managerPanel.css('z-index', 999);
                    userPanel.slideDown(300);
                    managerPanel.addClass('shadow');
                }
            };

            $scope.openUploadPhotoDialog = function() {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalUploadPhoto.html',
                    controller: 'UploadPhotoController',
                    size: 'lg'
                });

                modalInstance.result.then(function(croppedImage) {
                    var data = new FormData();
                    var apiUrl = '/users/assets/userprofile';
                    data.append('hasCropped', true);
                    data.append('imageBinary', croppedImage);

                    $scope.toolTipText = 'Uploading...';
                    $scope.imageUploading = true;
                    $scope.showToolTip = true;

                    $http
                        .post(apiUrl, data, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type':undefined}
                        })
                        .then(function(resp) {
                            console.log('[USER PROFILE] Image uploaded.');
                            console.log(resp);
                            $scope.currentUser.profilePictureUrl = resp.profilePictureUrl;
                            $scope.toolTipText = 'Applying changes...';

                            $timeout (function() {
                                $scope.toolTipText = 'Change your profile picture!';
                                $scope.imageUploading = false;
                                $scope.showToolTip = false;
                            }, 2000);
                        }, function (error) {
                            $scope.toolTipText = 'Change your profile picture!';
                            $scope.imageUploading = false;
                            $scope.showToolTip = false;
                            console.log('ERRORS: ' + error);
                        });
                }, function() {
                    console.log('[DATA SENSE] Modal dismissed');
                });
            };

            $scope.logout = function () {
                var apiUrl = '/users/logout';
                $http.post(apiUrl, {}).then(function() {
                    location.href = '/login';
                });
            };

            $scope.getCurrentBaseURL = function() {

                return  utilService.getCurrentBaseURL();
            };
            $scope.setDefaultPicture();
        }
    ]);

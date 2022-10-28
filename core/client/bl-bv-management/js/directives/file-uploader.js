'use strict';

angular.module('blApp.management.directives')
    .directive('fileUploader', ['$rootScope', '$http',
        function($rootScope,$http) {
            return {
                restrict: 'E',
                scope: {
                    uploaderInfo: '=info'
                },
                link: function (scope, element, attrs) {
                    console.log(scope.uploaderInfo);

                    scope.togglePleaseWait = function () {
                        if ($('.blockUI').length === 0) {
                            $.blockUI({
                                message: '<div id=\'loader\'></div>',
                                css: {
                                    cursor: 'arrow',
                                    height: 'auto',
                                    width: 'auto',
                                    margin: '-85px 0 0 -85px',
                                    padding: '0',
                                    top: '50%',
                                    left: '50%',
                                    border: '0',
                                    background: 'transparent'
                                },
                                applyPlatformOpacityRules: false,
                                fadeIn: 0,
                                fadeOut: 150
                            });
                        }
                        else {
                            $.unblockUI();
                        }
                    };

                    scope.getApiURL = function (uploadType) {
                        var apiUrl = '';

                        if (uploadType === 'uploadBtnGeneralAssets') {
                            apiUrl = '/general/assets';
                        } else if (uploadType === 'uploadBtnClientAssets') {
                            apiUrl = '/accounts/' + $rootScope.selectedAccountId + '/assets';
                        } else { // uploadBtnPresentationAssets
                            apiUrl = '/general/assets/presentation/' +
                                $rootScope.presentationId;
                        }

                        return apiUrl;
                    };

                    scope.changeUploadStatus = function (uploadType, status) {
                        var color = '#000';
                        var text = 'Previous file has been uploaded';
                        if (status.toString() === '1') {//uploading
                            text = 'Uploading...';
                            color = 'rgb(0, 128, 0)';
                        } else if (status.toString() === '3') {//error uploading
                            text = 'An error occured while uploading';
                            color = 'rgb(128, 0, 0)';
                        }

                        element.find('#uploading_assets_panel').css('color', color).html(text);
                    };

                    scope.refreshAssets = function (uploadType) {
                        if (uploadType === 'uploadBtnGeneralAssets') {
                            $rootScope.retrieveAllImagesInFolder(null, 'general');
                        } else if (uploadType === 'uploadBtnClientAssets') {
                            $rootScope.retrieveAllImagesInFolder($rootScope.selectedAccountId, 'client');
                        } else { // uploadBtnPresentationAssets
                            $rootScope.retrieveAllImagesInFolder($rootScope.presentationId, 'presentation');
                        }
                    };

                    scope.uploadFiles = function () {
                        var files = event.target.files;
                        var data = new FormData();
                        var uploadType = event.target.id;
                        var apiUrl = scope.getApiURL(uploadType);

                        $.each(files, function (key, value) {
                            data.append('assetsFile', value);
                        });

                        scope.changeUploadStatus(uploadType, 1);
                        scope.togglePleaseWait();

                        $http
                            .post(apiUrl, data, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            })
                            .then(function () {
                                scope.changeUploadStatus(uploadType, 2);
                                scope.refreshAssets(uploadType);
                                scope.togglePleaseWait();

                            }, function () {
                                //notifyService.errorNotify(resp.message);
                                //scope.ajaxLoading = false;
                                scope.changeUploadStatus(uploadType, 3);
                                scope.togglePleaseWait();
                            });
                    };
                },
                templateUrl: '/bl-bv-management/views/components/file-uploader.html'
            };
        }
    ]);
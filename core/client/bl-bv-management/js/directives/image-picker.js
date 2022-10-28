'use strict';

angular.module('blApp.management.directives')
    .directive('imagePicker', ['$rootScope',
        function($rootScope) {
            return {
                restrict: 'E',
                scope: {
                    pickerInfo: '=info'
                },
                controller: function($scope,$element,$attrs,$transclude){
                    $scope.onImagePick = function() {
                        //$('#' + $scope.pickerInfo.inputField).val(this.image.embedSource);
                        //$('#assets' + $scope.pickerInfo.inputField).modal('hide');
                        var inputObj = $element.prev();
                        inputObj.val(this.image.sourceCDNURL);

                        var inputObjId = $('#' + $scope.pickerInfo.inputField).attr('id');
                        if(inputObjId === 'presentation_logo') {
                            $rootScope.tempLogo = this.image.sourceCDNURL;
                            $rootScope.tempPresentationDetails.Logo = this.image.sourceCDNURL;
                        }
                        else if(inputObjId === 'backgroungImage_presentation') {
                            $rootScope.tempBackground = this.image.sourceCDNURL;
                            $rootScope.tempPresentationDetails.parameters.backgroundImage = this.image.sourceCDNURL;
                        }
                        
                        $scope.closeModal();
                    };

                },
                link: function(scope) {
                    scope.selectGoogleImage = function (inputField) {
                        $('#assets' + inputField).modal();
                    };
                    scope.closeModal = function(inputField) {
                        $('#assets' + scope.pickerInfo.inputField).modal('hide');
                    };
                },
                templateUrl: '/bl-bv-management/views/components/image-picker.html'
            };
        }
    ]);

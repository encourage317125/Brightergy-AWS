'use strict';

angular.module('blApp.management.directives')
    .directive('colorpicker', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                require : 'ngModel',
                link : function (scope, element, attrs, ngModelCtrl) {
                    $timeout(function() {
                        var selectedColor = ngModelCtrl.$modelValue;
                        element.find('div').css('background-color', '#'+selectedColor);
                        element.colpick({
                           color: selectedColor,
                           onShow: function (colpkr) {
                                $(colpkr).fadeIn(500);
                                return false;
                            },
                            onHide: function (colpkr) {
                                $(colpkr).fadeOut(500);
                                return false;
                            },
                            onChange: function (hsb, hex/*, rgb*/) {
                                ngModelCtrl.$setViewValue(hex);
                                element.find('div').css('background-color', '#'+hex);
                                scope.$apply();
                            },
                            onSubmit:function(hsb,hex/*,rgb*/) {
                                ngModelCtrl.$setViewValue(hex);
                                element.find('div').css('background-color', '#'+hex);
                                element.colpickHide();
                                scope.$apply();
                            }
                        });
                    });
                }
            };
        }
    ]);
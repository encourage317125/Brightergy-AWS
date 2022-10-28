'use strict';

angular.module('blApp.management.directives')
    .directive('fontpicker', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                require : 'ngModel',
                template: ['<span class=\'spantext\'></span><div class=\'arrow-down\'></div><ul>',
                           '<li>BentonSans, sans-serif</li><li>Arial, Helvetica, sans-serif</li>',
                           '<li>Arial Black,Arial Black,Gadget,sans-serif</li>',
                           '<li>Comic Sans MS,Comic Sans MS,cursive</li>',
                           '<li>Courier New,Courier New,Courier,monospace</li>',
                           '<li>Georgia,Georgia,serif</li><li>Impact,Charcoal,sans-serif</li>',
                           '<li>Lucida Sans Unicode, Lucida Grande, sans-serif</li>',
                           '<li>Tahoma, Geneva, sans-serif</li><li>Times New Roman, Times, serif</li>',
                           '<li>Trebuchet MS, Helvetica, sans-serif</li>',
                           '<li>Verdana, Geneva, sans-serif</li></ul>'].join(''),
                link : function (scope, element, attrs, ngModelCtrl) {
                    $timeout(function() {
                        console.log(ngModelCtrl.$modelValue);
                        element.fontSelector({
                            'hide_fallbacks': true,
                            'initial': ngModelCtrl.$modelValue,
                            'callback': function(text, css) {
                                ngModelCtrl.$setViewValue(css);
                                scope.$apply();
                            }
                        });
                    });
                }
            };
        }
    ]);
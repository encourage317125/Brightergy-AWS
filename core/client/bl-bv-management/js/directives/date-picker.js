'use strict';

angular.module('blApp.management.directives')
    .directive('datepicker', function () {
        return {
            restrict: 'A',
            require : 'ngModel',
            link : function (scope, element, attrs, ngModelCtrl) {
                $(function(){
                    /*var date = ngModelCtrl.$viewValue;*/
                    element.datetimepicker({
                        dateFormat:'yy-mm-dd',
                        timeFormat: 'HH:mm',
                        addSliderAccess: true,
                        sliderAccessArgs: { touchonly: false },
                        onSelect:function (date) {
                            ngModelCtrl.$setViewValue(date);
                            scope.$apply();
                        }
                    });
                });
            }
        };
    });

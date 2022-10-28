/**
 * Created by kornel on 1/19/15.
 */
'use strict';

angular.module('blApp.components.directives')
    .directive('blDatePicker',
    ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                controller: function($scope,$element,$attrs,$transclude){

                },
                link: function(scope, element, attrs, ctrl) {
                    element.datepicker({
                        format: attrs.blDatePicker,
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', function (evt) {
                        /*
                        if(typeof evt.date !== 'undefined' || evt.date !== null) {
                        }
                        */
                    });
                    element.on('focusout', function() {
                    });
                    element.on('focusin', function() {

                    });
                }
            };
        }]);

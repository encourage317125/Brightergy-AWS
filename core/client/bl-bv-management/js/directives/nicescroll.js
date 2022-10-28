'use strict';

angular.module('blApp.management.directives')
    .directive('nicescroll', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, content) {
                element.niceScroll({autohidemode:'scroll', horizrailenabled:false});
            }
        };
    });
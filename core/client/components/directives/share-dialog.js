angular.module('blApp.components.directives')
    .directive('shareDialog', function($compile) {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
              return attr.templateUrl;
            },
            link : function (scope, element, attrs, controller) {
            }
        };
    });
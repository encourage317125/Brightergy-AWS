'use strict';

angular.module('blApp.dataSense.directives')
    .directive('equivalenciesIcon', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            scope: {
                offset: '=',
                drawColor: '='
            },
            link: function(scope, element, attrs) {
                scope.selectedColor = scope.drawColor;
                scope.offset = scope.offset;
            },
            templateUrl: '/bl-data-sense/assets/img/equivalencies-icon.svg'
        };
    }]);
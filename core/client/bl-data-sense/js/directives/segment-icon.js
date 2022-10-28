'use strict';

angular.module('blApp.dataSense.directives')
    .directive('segmentIcon', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
            	var colorArray = d3.scale.category10().range();
                scope.selectedColor = colorArray[scope.$index % 10];
            },
            templateUrl: '/bl-data-sense/assets/img/newseg.svg'
        };
    }]);
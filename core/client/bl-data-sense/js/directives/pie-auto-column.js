/**
 * Created by Kornel on 11/13/14.
 */
'use strict';

angular.module('blApp.dataSense.directives')
    .directive('pieAutoColumn', [function(){
    return {
        restrict: 'A',
        scope: {
            pieAutoColumn: '='
        },
        link: function(scope, element, attrs, controller) {
            scope.minWidth = 300;
            scope.columnCount = 1;
            scope.$watch(function() {return element.parent().width(); }, function(newValue) {
                if ( scope.pieAutoColumn === 5) {
                    scope.pieAutoColumn = 6;
                }
                if ( scope.pieAutoColumn > 6) {
                    scope.pieAutoColumn = 12;
                }
                if ( (newValue / scope.pieAutoColumn) < scope.minWidth) {
                    scope.columnCount = Math.floor( newValue / scope.minWidth );
                    scope.columnCount = Math.min(scope.columnCount, 4);
                    scope.columnCount = Math.max(scope.columnCount, 1);
                } else {
                    scope.columnCount = scope.pieAutoColumn;
                }
                console.log('-- pie widget width--', element.width(), scope.pieAutoColumn);
                element.removeClass('col-md-12 col-md-6 col-md-4 col-md-3')
                    .addClass('col-md-' + Math.round(12 / scope.columnCount) );
            });
        }
    };
}]);

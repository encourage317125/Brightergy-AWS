'use strict';

angular.module('blApp.management.directives')
    .directive('resizable', ['$window',
        function ($window) {
            return function($scope) {
                var gridWidth;
                var gridHeight;
                $scope.initializeWindowSize = function() {
                    console.log('is mobile');
                    console.log($scope.isMobile);
                    if($scope.isMobile){
                        gridWidth = $('.presentationBody').width() / 8;
                        $scope.GridWidth = gridWidth;
                        $scope.GridHeight = gridWidth;
                        //return $scope.windowWidth = $window.innerWidth;
                    } else{
                        gridWidth = $('.presentationBody').width() / 16;
                        gridHeight = $('.presentationBody').height() / 7;
                        $scope.GridWidth = gridWidth;
                        $scope.GridHeight = gridHeight;
                    }
                    //$scope.getWidgetsInfo($scope.widgets);
                };
                //$scope.initializeWindowSize();
                return angular.element($window).bind('resize', function() {
                    $scope.initializeWindowSize();
                    console.log('grid width');
                    console.log($scope.GridWidth);
                    return $scope.$apply();
                });
            };
        }
    ]);

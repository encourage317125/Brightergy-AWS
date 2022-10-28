'use strict';

angular.module('blApp.helpAndUpdates.controllers').controller('HelpAndUpdatesController',
    ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$location', '$stateParams', 
    function ($scope, $rootScope, $compile, $http, $timeout, $location, $stateParams) {
        $scope.currentSection = null;
        
        $scope.init = function(section) {
            $scope.currentSection = section;
        };

        $scope.goBack = function() {
            $scope.currentSection = null;
        };

    }
]);
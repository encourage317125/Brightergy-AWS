'use strict';

angular.module('blApp.dataSense.controllers')
    .controller('DatasenseRouterCtrl', ['$scope', '$rootScope', '$stateParams', 
        function ($scope, $rootScope, $stateParams) {
            $rootScope.selectedDashboardId = $stateParams.dashboardId;
            $rootScope.$broadcast('renderDashboard', {dashboardId: $stateParams.dashboardId});
        }
]);
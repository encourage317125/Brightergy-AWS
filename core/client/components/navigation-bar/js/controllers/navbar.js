//var navigationBarComponent = angular.module('blApp.components.navigationBar', ['blApp.components.services']);

angular.module('blApp.components.navigationBar')
    .controller('NavigationBarController', ['$scope', '$rootScope',
        function ($scope, $rootScope) {
        	$rootScope.Applications = renderApps;
        }
    ]);
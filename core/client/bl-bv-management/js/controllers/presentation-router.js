'use strict';

angular.module('blApp.management.controllers')
    .controller('PresentationRouterCtrl', ['$scope', '$rootScope', '$stateParams', 
        function ($scope, $rootScope, $stateParams) {
            console.log(' ** stateParams presentationId ** ', $stateParams.presentationId);
            $rootScope.urlSelectedPresentationId = $stateParams.presentationId;
            $rootScope.$broadcast('renderPresentation', {presentationId: $stateParams.presentationId});
        }
]);
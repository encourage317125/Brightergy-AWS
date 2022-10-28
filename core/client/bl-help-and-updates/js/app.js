'use strict';

// Define Controller
angular.module('blApp.helpAndUpdates.controllers', []);
// Define Directive
angular.module('blApp.helpAndUpdates.directives', []);
// Define Services
angular.module('blApp.helpAndUpdates.services', ['blApp.components.services']);

var dependencies = [
    'ngRoute',
    'blApp.helpAndUpdates.controllers',
    'blApp.helpAndUpdates.directives',
    'blApp.helpAndUpdates.services',
    'ui.router'
];

var blHelpAndUpdatesModule = angular.module('blApp.helpAndUpdates', dependencies)
    .config(function ($routeProvider, $provide, $stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        //$locationProvider.hashPrefix('!');

        $stateProvider
            .state('help-and-updates', {
                url: '/',
                template: '<div></div>'
            })
            .state('app-overview', {
                url: '/app-overview',
                templateUrl: '/bl-help-and-updates/views/app-overview.html'
            })
            .state('recent-updates', {
                url: '/recent-updates',
                templateUrl: '/bl-help-and-updates/views/recent-updates.html'
            })
            .state('help-center', {
                url: '/help-center',
                templateUrl: '/bl-help-and-updates/views/help-center.html'
            })
            .state('provide-feedback', {
                url: '/provide-feedback',
                templateUrl: '/bl-help-and-updates/views/provide-feedback.html'
            });
    });

blHelpAndUpdatesModule.run(function ($rootScope, configuration) {
    $rootScope.baseCDNUrl = configuration('cdn').env === 'production' ? '//' + configuration('cdn').domain : '';
});

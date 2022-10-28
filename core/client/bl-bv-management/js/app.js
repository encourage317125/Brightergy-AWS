'use strict';
// Define Controller
angular.module('blApp.management.controllers', ['blApp.components.services']);

// Define Directive
angular.module('blApp.management.directives', ['blApp.components.services']);

var dependencies = [
    'ui.select',
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'ngImgCrop',
    'ngClipboard',
    'treeControl',
    'blApp.management.controllers',
    'blApp.management.directives',
    'blApp.components.companyPanel',
    'blApp.components.directives',
    'blApp.components.navigationBar',
    'blApp.components.services',
    'ui.router',
    'ui.bootstrap',
    'ui.autocomplete',
    'highcharts-ng',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'info.vietnamcode.nampnq.videogular.plugins.youtube'
];

angular.module('blApp.management', dependencies)

.constant('PRESENT_CONFIG', {
    'GridColCnt': 16,
    'GridRowCnt': 7,
    'GridWidth': 69,
    'GridHeight': 69,
    'WidgetInstancePadding': 3,
    'WidgetStyleArray': [
        {'row':'1', 'fontSize': 17, 'fontTop': 0, 'imgTop': 0},
        {'row':'2', 'fontSize': 28, 'fontTop': 10, 'imgTop': 26},
        {'row':'3', 'fontSize': 28, 'fontTop': 10, 'imgTop': 60},
        {'row':'4', 'fontSize': 28, 'fontTop': 10, 'imgTop': 94},
        {'row':'5', 'fontSize': 28, 'fontTop': 10, 'imgTop': 129},
        {'row':'6', 'fontSize': 28, 'fontTop': 10, 'imgTop': 163},
        {'row':'7', 'fontSize': 28, 'fontTop': 10, 'imgTop': 198}
    ],
    'ResponsiveValue': {
        'energy': {
            'title': 0.0013579,
            'inveterValue': 0.0013953,
            'inveterName': 0.001363636,
            'topName': 0.0025,
            'lineFont': 0.002,
            'poundFont': 0.00167
        },
        'verticalEnergy': {
            'title1': 0.0027727,
            'title2': 0.002454545,
            'title3': 0.00190909,
            'inveterValue': 0.00276744,
            'inveterName': 0.0027727,
            'topName': 0.005,
            'lineFont': 0.004,
            'poundFont': 0.003
        },
        'weather': 0.002040816,
        'generation': 0.001470558,
        'generationVertical': 0.00333333333
    }
})

.config(
    ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'uiSelectConfig',
    function($stateProvider, $urlRouterProvider, $locationProvider, uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.theme = 'select2';

    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode(true);
    $stateProvider
        .state('presentation', {
            url: '/:presentationId',
            views: {
                'routerView': {
                    template: '<div></div>',
                    controller: 'PresentationRouterCtrl'
                }
            }
        });
}])

.run(function ($rootScope, configuration) {
    $rootScope.baseCDNUrl = configuration('cdn').env === 'production' ? '//' + configuration('cdn').domain : '';
});

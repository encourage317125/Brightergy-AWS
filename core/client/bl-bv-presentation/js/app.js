'use strict';

// Define Controller
angular.module('blApp.presentation.controllers', ['blApp.components.services']);
// Define Directive
angular.module('blApp.presentation.directives', ['blApp.components.services']);
// Define Services
angular.module('blApp.presentation.services', ['blApp.components.services']);

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'blApp.presentation.controllers',
    'blApp.presentation.directives',
    'blApp.presentation.services',
    'blApp.components.services',
    'btford.socket-io',
    'highcharts-ng',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'info.vietnamcode.nampnq.videogular.plugins.youtube'
];

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
            .exec(location.search)||['',''])[1]
            .replace(/\+/g, '%20'))
        || 0;
}

angular.module('blApp.presentation', dependencies)

.constant('PRESENT_CONFIG', {
    'PreviewWidth': parseInt(window.innerWidth / 16),
    'PreviewHeight': parseInt(window.innerHeight / 9),
    /*'gridWidth': angular.element('.presentationBody').width() / 16,
     'gridHeight': angular.element('.presentationBody').height() / 7,*/
    'StartPointSec': parseInt(getURLParameter('start_sec')),
    'StartPointMin': parseInt(getURLParameter('start_min')),
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
            'inveterName': 0.001163636,
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

.factory('blSocket', function (socketFactory) {
    return socketFactory();
})

.run(function ($rootScope, configuration) {
    $rootScope.baseCDNUrl = configuration('cdn').env === 'production' ? '//' + configuration('cdn').domain : '';
});

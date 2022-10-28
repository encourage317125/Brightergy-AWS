angular.module('bl.analyze.solar.surface', [
  'ngTable',
  'mgcrea.ngStrap',
  'ui.bootstrap',
  'highcharts-ng',
  'btford.socket-io',
  'angularMoment',
  'ngAnimate',
  'blComponents.platformPanel',
  'toastr'
])

.constant('wsEntryPoint', window.apiDomain)

.constant('wsConfig', {
  'reconnection delay': 1000,
  'reconnection limit': 1000,
  'max reconnection attempts': 'Infinity',
  'transports': [
    'websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling'
  ]
})

.constant('firstLoadEventList', ['assurf:power', 'assurf:energy', 'assurf:weather'])

.constant('mainStageEventList', ['assurf:solarenergygeneration', 'assurf:savings',
  'assurf:totalenergygeneration', 'assurf:equivalencies', 'assurf:realtimepower',
  'assurf:yieldcomparator', 'assurf:actualpredictedenergy', 'assurf:carbonavoided', 'assurf:sources'])

.constant('tagColors', ['#c654d3', '#9bc02a', '#36d31c', '#468d4f', '#ff7940', '#f44e52', '#fdc35e',
  '#5b74f3', '#60c0ed', '#f183c1'])


.config(['$locationProvider', function ($locationProvider) {
  $locationProvider
    .html5Mode(false)
    .hashPrefix('!');
  /*$routeProvider.
    when('/main', {
      templateUrl: 'app/partials/main-stage.html',
      controller: 'MainStageController'
    }).
    when('/help', {
      templateUrl: 'app/partials/help.html',
      controller: 'HelpCenterController'
    }).
    otherwise({
        redirectTo: '/main'
    });*/
}])

.run(['$rootScope', '$window', '$location', 
  function ($rootScope, $window, $location) {
    $rootScope.panelData = {
      user: $window.renderCurrentUser
    };
    $rootScope.closePlatformPanel = function () {
      $rootScope.isShowPlatformPanel = false;
      setTimeout(function(){
        $(window).trigger('resize');
      }, 10);
      $location.hash('');
    };

    $rootScope.openPlatformPanel = function(menu) {
      $rootScope.isShowPlatformPanel = true;
      $rootScope.panelData.menu = menu;
    };

    if ($location.hash().indexOf('ppanel-') > -1) {
      $rootScope.isShowPlatformPanel = true;
    }

    switch ($location.hash()) {
      case 'ppanel-user':
        $rootScope.panelData.menu = 'user';
        break;
      case 'ppanel-account':
        $rootScope.panelData.menu = 'account';
        break;
    }

    $rootScope.LAST_UPDATED_TIMETIME = (new Date()).valueOf();
}]);

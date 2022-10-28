'use strict';

angular.module('blComponents.Settings')

.constant('globalConfig', {
  'USER-ROLE': [{id: 'BP', name: 'BP '}, {id: 'Admin', name: 'Admin '}, {id: 'TM', name: 'Team Member '}],
  'APIDOMAIN': window.apiDomain,
  'PLATFORMDOMAIN': window.platformDomain,
  'REDIRECT-URL-AFTER-LOGOUT': window.platformDomain + '/login'
})

.constant('routerConfig', function ($urlRouterProvider, $stateProvider) {
  $stateProvider
    .state('settings', {
      abstract: true,
      url: '/settings',
      template: '<div ui-view></div>'
    })
    .state('settings.account', {
      url: '/account',
      controller: 'accountManagementController',
      templateUrl: 'app/account-management/account.template.html',
      resolve: {
        currentUser: function () {
          return window.renderCurrentUser;
        }
      }
    })
    .state('settings.account.detail', {
      url: '/detail',
      controller: 'accountDetailController',
      templateUrl: 'app/account-management/partials/detail.template.html'
    })
    .state('settings.account.subscription', {
      url: '/subscription',
        templateUrl: 'app/account-management/partials/subscription.template.html'
    })
    .state('settings.account.team', {
      url: '/team',
      controller: 'accountTeamMemberController',
      templateUrl: 'app/account-management/partials/team member.template.html'
    })
    .state('settings.account.settings', {
      url: '/settings',
      templateUrl: 'app/account-management/partials/settings.template.html'
    })
    .state('settings.profile', {
      url: '/profile',
      controller: 'profileManagementController',
      templateUrl: 'app/profile-management/profile.template.html'
    })
    .state('settings.profile.detail', {
      url: '/detail',
      controller: 'profileDetailController',
      templateUrl: 'app/profile-management/partials/detail.template.html'
    })
    .state('settings.profile.social', {
      url: '/social',
      controller: 'profileSocialController',
      templateUrl: 'app/profile-management/partials/social.template.html'
    })
    .state('settings.source', {
      url: '/source',
      controller: 'sourceManagementController',
      templateUrl: 'app/sources-management/list.template.html'
    });



  $urlRouterProvider.otherwise('/settings/account');

})

.provider('url', ['globalConfig', function (globalConfig) {
  this.$get = function () {
    return {
      get: function () {
        return globalConfig.APIDOMAIN + '/v1';
      }
    };
  };
}])

.config(['$httpProvider', 'ngClipProvider', '$stateProvider', '$urlRouterProvider', 'routerConfig',
  function ($httpProvider, ngClipProvider, $stateProvider, $urlRouterProvider, routerConfig) {

    // Register Interceptors
    //$httpProvider.interceptors.push('httpRequestInterceptor');
    //$httpProvider.interceptors.push('httpResponseInterceptor');

    ngClipProvider.setPath('//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf');

    // Register routing
    routerConfig($urlRouterProvider, $stateProvider);
  }
]);
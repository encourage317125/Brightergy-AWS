/*!
 * platform-panel
 * http://github.com/BrighterLink/Core/components/platform-panel
 * Version: 0.1.0 - 2015-04-03
 * License: MIT
 */

'use strict';

angular.module('blComponents.platformPanel', ['ngImgCrop', 'ngFileUpload'])
  .constant('globalConfig', {
    'USER-ROLE': [{id: 'BP', name: 'BP '}, {id: 'Admin', name: 'Admin '}, {id: 'TM', name: 'Team Member '}],
    'APIDOMAIN': window.apiDomain,
    'PLATFORMDOMAIN': window.platformDomain,
    'REDIRECT-URL-AFTER-LOGOUT': window.platformDomain + '/login'
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
  .factory('httpRequestInterceptor', function (url) {
    var appendApiEntryPoint = function (originalUrl) {
      if (originalUrl.search(/(.html|.js|.css|.png|.svg|.jpg|.gif|.swf)/i) === -1) {
        return url.get() + originalUrl;
      } else {
        return originalUrl;
      }
    };
    return {
      appendApiEntryPoint: appendApiEntryPoint,
      request: function (config) {
        // Insert api entry point if request is api call
        config.url = appendApiEntryPoint(config.url);
        if (config.url.search(/(.html|.js|.css|.png|.svg|.jpg|.gif|.swf)/i) === -1) {
          config.withCredentials = true;
        }
        return config;
      }
    };
  })
  .factory('httpResponseInterceptor', ['$q',
    function ($q) {
      return {
        response: function (response) {
          if (typeof response.data === 'object' && response.data.success !== 1) {
            // if call is api call && call is failed
            return $q.reject(response);
          } else if (typeof response.data === 'object' && response.data.message) {
            return $q.when(response.data.message);
          } else {
            return $q.when(response);
          }
        },
        responseError: function (rejection) {
          console.error('[PlatformPanel ERROR] - ' + rejection.data.message);
          if (typeof rejection.data === 'object' && rejection.data.success === 0) {
            return $q.reject(rejection.data.message);
          } else {
            return $q.reject(rejection);
          }
        }
      };
    }])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $httpProvider.interceptors.push('httpResponseInterceptor');
  }])

  .controller('platformPanelController', ['$scope', '$uibModal', 'AccountService', 'globalConfig',
    function ($scope, $uibModal, AccountService, globalConfig) {
      $scope.showResetPasswdModal = function () {
        $uibModal.open({
          templateUrl: '/components/platform-panel/app/templates/change-passwd-modal.html',
          controller: 'resetPasswdModalController',
          //animation: 'fade',
          keyboard: false,
          backdrop: false,
          windowClass: 'modal-style',
          resolve: {
            currentUser: function () {
              return $scope.currentUser;
            }
          }
        });
      };
      $scope.showDeleteAccountModal = function () {
        $uibModal.open({
          templateUrl: '/components/platform-panel/app/templates/del-account-modal.html',
          controller: 'deleteAccountModalController',
          //animation: true,
          keyboard: false,
          backdrop: false,
          windowClass: 'modal-style',
          resolve: {
            currentUser: function () {
              return $scope.currentUser;
            }
          }
        });
      };
      $scope.showProfileAvatarUploadModal = function () {
        $uibModal
          .open({
            templateUrl: '/components/platform-panel/app/templates/user-avatar-upload-modal.html',
            controller: 'userAvatarUploadModalController',
            //animation: true,
            keyboard: false,
            backdrop: false,
            backdropClass: 'modal-backdrop',
            windowClass: 'profile-modal-style'
          })
          .result.then(function (updatedUser) {
            $scope.isAvatarLoading = true;
            $scope.currentUser.profilePictureUrl = updatedUser.profilePictureUrl;
          });
      };

      $scope.showDeleteTMModal = function () {
        var modalInstance = $uibModal.open({
          templateUrl: '/components/platform-panel/app/templates/del-tm-modal.html',
          controller: 'deleteTMModalController',
          //animation: true,
          keyboard: false,
          backdrop: false,
          backdropClass: 'modal-backdrop',
          windowClass: 'modal-style',
          resolve: {
            selectedUser: function () {
              return $scope.selectedUser;
            }
          }
        });

        modalInstance.result.then(function (removedUser) {
          var index = $scope.availableUsers.indexOf(removedUser);
          if (index > -1) {
            $scope.availableUsers.splice(index, 1);
            $scope.selectedTeamPanel = 'list';
          }
        }, function () {
          // Todo: handle for the error
        });
      };

      // Current User Data is in $scope.currentUser
      $scope.currentAccount = null;
      $scope.allAccounts = null;

      $scope.accountListForSelectBox = null;  // It will be used in Select box
      $scope.userRoleForSelectBox = globalConfig['USER-ROLE'];

      $scope.loadCurrentAccountById = function (accountId) {
        AccountService
          .getAccount(accountId)
          .then(function (account) {
              $scope.currentAccount = account;
          });
      };

      $scope.loadAllAccounts = function () {
        AccountService
          .getAllAccounts()
          .then(function (accounts) {
            $scope.allAccounts = accounts;

            $scope.accountListForSelectBox = $scope.allAccounts.map(function (account) {
              return {
                id: account._id,
                name: account.name
              };
            });
          });
      };

      $scope.initLoads = function () {

        var currentAccountId;
        if ($scope.currentUser.accounts.constructor === Array
          && $scope.currentUser.accounts.length) {
          currentAccountId = $scope.currentUser.accounts[0];
        }

        if (currentAccountId) {
          $scope.currentAccountId = currentAccountId;
          $scope.loadCurrentAccountById(currentAccountId);
        }

        // When User is BP, he can get read all accounts information
        if ($scope.currentUser.role === 'BP') {
          $scope.loadAllAccounts();
        }

      };
    }
  ])

  .directive('platformPanel', function () {
      return {
        restrict: 'E',
        controller: 'platformPanelController',
        scope: {
          selected: '=',
          currentUser: '=',
          onClose: '&'
        },
        templateUrl: '/components/platform-panel/app/templates/platform-panel.html',
        link: function (scope, element, attrs) {

          scope.initLoads();

          $(document).mouseup(function (e) {
            var container = $('.ppanel-form-field-input-wrapper:visible').parents('ppanel-form-field-live');
            /*$('.ppanel-form-field-input-wrapper')*/
            if (!container.is(e.target) && container.has(e.target).length === 0) {
              $('.ppanel-form-field-input-wrapper:visible').hide().trigger('hidden.ppanel-field');
              //container.trigger('hidden.ppanel-field').hide();
            }
          });
        }
      };
    }
  )

  .controller('topNavController', ['$scope', '$alert', '$sce', '$window', 'UserService',
    function($scope, $alert, $sce, $window, UserService) {
      
      $scope.appsPanelDropdown = [];
      $scope.userInfo = {};

      $scope.loadUserInfo = function() {
        UserService
          .getMyInfo()
          .then(function(user) {
            $scope.userInfo = user;
          });

        UserService
          .getAccessibleApps()
          .then(function(accessibleApps) {
            $scope.getAppsPanelDropdown(accessibleApps);
          });
      };

      $scope.doLogOut = function() {
        UserService
          .logout()
          .then(function(redirectUrl) {
            $window.location.href = redirectUrl;
          });
      };

      $scope.doLoginToEnergyCap = function() {
        UserService
          .energyCapAuth()
          .then(function(res) { $window.open(res.redirectUrl); })
          .catch(function() {
            $alert({
              title: 'Failure!',
              content: 'An unknown error occurred while trying to log you into Utilities.',
              placement: 'top-right',
              type: 'danger',
              show: true,
              duration: 3,
            });
          });
      };

      $scope.getAppsPanelDropdown = function(accessibleApps) {
        if (!Object.keys(accessibleApps).length) {
          return $scope.appsPanelDropdown.push({
            href: '#',
            text: 'No accessible applications',
          });
        }

        for (var appName in accessibleApps) {
          if (accessibleApps.hasOwnProperty(appName)) {
            var text = $sce.trustAsHtml('<span class="app-icon ' + appName.toLowerCase()
                    + '"></span><span class="app-label">' + appName + '</span>');

            if (appName.toLowerCase() === 'utilities') {
              $scope.appsPanelDropdown.push({
                click: 'doLoginToEnergyCap()',
                text: text,
              });
            } else {
              $scope.appsPanelDropdown.push({
                href: accessibleApps[appName],
                target: '_blank',
                text: text,
              });
            }
          }
        }
      };
    }
  ])

  .directive('rsMobileNavDropDown', function() {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
          $(element).mmenu({
            offCanvas: {
              position: attrs.rsMobileNavDropDown,
            },
            isMenu: false,
          });
        }
      };
  })

  .directive('topNav', function() {
    return {
        restrict: 'E',
        controller: 'topNavController',
        scope: {
          application: '=',
        },
        templateUrl: '/components/platform-panel/app/templates/top-nav.html',
        link: function (scope, element, attrs) {
          scope.loadUserInfo();
        }
      };
  });

// Polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length ? list.length : 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

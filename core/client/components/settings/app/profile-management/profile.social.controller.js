'use strict';

angular.module('blComponents.Settings')

.controller('profileSocialController', ['$scope', '$window', 'globalConfig', 'UserService',
  function ($scope, $window, globalConfig, UserService) {

    function renderOneAllWidget(user) {
      var gridXSize = 3;

      var oneallSubdomain = 'brightergy';
      if (!window._oneall) {
        var oa = document.createElement('script');
        oa.type = 'text/javascript';
        oa.async = true;
        oa.src = '//' + oneallSubdomain + '.api.oneall.com/socialize/library.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(oa, s);
      }

      /* Replace #your_callback_uri# with the url to your own callback script */
      var redirectUrl = $window.location.toString();
      var yourCallbackScript = globalConfig.APIDOMAIN + '/v1/sociallogin?redirect=' + encodeURIComponent(redirectUrl);
      var setCustomCssUri = globalConfig.APIDOMAIN + '/components/settings/dist/settings.min.css';

      /* Dynamically add the user_token of the currently logged in user. */
      /* If the user has no user_token then leave the field blank. */
      var userToken = user.socialToken;

      /* Embeds the buttons into the container oa_social_link_container */
      var _oneall = window._oneall || [];
      _oneall.push(['social_link', 'set_providers', ['google', 'facebook', 'twitter', 'amazon', 'yahoo',
        'windowslive', 'linkedin', 'github', 'openid']]);
      _oneall.push(['social_link', 'set_grid_sizes', [gridXSize, 5]]);
      _oneall.push(['social_link', 'set_callback_uri', yourCallbackScript]);
      _oneall.push(['social_link', 'set_custom_css_uri', setCustomCssUri]);
      _oneall.push(['social_link', 'set_user_token', userToken]);
      _oneall.push(['social_link', 'do_render_ui', 'oa_social_link_container']);
      window._oneall = _oneall;
    }

    $scope.init = function () {
      UserService
        .getCurrentUser()
        .then(function (me) {
          $scope.currentUser = me;
          renderOneAllWidget($scope.currentUser);
        });
    };

    $scope.init();
  }
]);
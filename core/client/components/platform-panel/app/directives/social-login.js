'use strict';

angular.module('blComponents.platformPanel')
  .directive('socialLogin', ['globalConfig', function (globalConfig) {
    var oneAllRendered = false;
    function renderOneAllWidget(user) {
      var documentWidth = $(document).width();
      var gridXSize = (documentWidth < 480) ? 3 : 2;

      var oneallSubdomain = 'brightergy';
      /* The library is loaded asynchronously */
      var oa = document.createElement('script');
      oa.type = 'text/javascript';
      oa.async = true;
      oa.src = '//' + oneallSubdomain + '.api.oneall.com/socialize/library.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(oa, s);
      /* Replace #your_callback_uri# with the url to your own callback script */
      var redirectUrl = location.href.indexOf('#ppanel-user') > -1 ? location.href : location.href + '#ppanel-user';
      var yourCallbackScript = globalConfig.APIDOMAIN + '/v1/sociallogin?redirect=' + encodeURIComponent(redirectUrl);
      var setCustomCssUri = globalConfig.PLATFORMDOMAIN + '/components/platform-panel/dist/platform.min.css';
      /* Dynamically add the user_token of the currently logged in user. */
      /* If the user has no user_token then leave the field blank. */
      var userToken = user.socialToken;
      /* Embeds the buttons into the container oa_social_link_container */
      var _oneall = _oneall || [];
      _oneall.push(['social_link', 'set_providers', ['google', 'facebook', 'twitter', 'amazon', 'yahoo',
        'windowslive', 'linkedin', 'github', 'openid']]);
      _oneall.push(['social_link', 'set_grid_sizes', [gridXSize, 5]]);
      _oneall.push(['social_link', 'set_callback_uri', yourCallbackScript]);
      _oneall.push(['social_link', 'set_custom_css_uri', setCustomCssUri]);
      _oneall.push(['social_link', 'set_user_token', userToken]);
      _oneall.push(['social_link', 'do_render_ui', 'oa_social_link_container']);
      window._oneall = _oneall;
      oneAllRendered = true;
    }

    return {
      restrict: 'E',
      templateUrl: '/components/platform-panel/app/templates/social-login.html',
      link: function(scope, element, attrs) {
        scope.$watch('selected', function (newVal, oldVal) {
          if (newVal !== oldVal && newVal === 'user') {
            if (!oneAllRendered) {
              renderOneAllWidget(scope.currentUser);
            }
          }
        });
      }
    };
  }]);
/*jslint node: true */
/*global ZeroClipboard */

(function(window, angular, undefined) {
  'use strict';

  angular.module('ngClipboard', []).
    provider('ngClip', function() {
      var self = this;
      this.path = '/lib/angular-clipboard/ZeroClipboard.swf';
      return {
        setPath: function(newPath) {
         self.path = newPath;
        },
        setConfig: function(config) {
          self.config = config;
        },
        $get: function() {
          return {
            path: self.path,
            config: self.config
          };
        }
      };
    }).
    run(['ngClip', function(ngClip) {
      var config = {
        swfPath: ngClip.path,
        trustedDomains: ["*"],
        allowScriptAccess: "always",
        forceHandCursor: true
      };
      ZeroClipboard.config(angular.extend(config,ngClip.config || {}));
    }]).
    directive('clipCopy', ['ngClip', function (ngClip) {
      return {
        scope: {
          clipCopy: '&',
          clipClick: '&',
          clipClickFallback: '&'
        },
        restrict: 'A',
        link: function (scope, element, attrs) {

          var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;          // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
          var isFirefox = typeof InstallTrigger !== 'undefined';                              // Firefox 1.0+
          var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;   // At least Safari 3+: "[object HTMLElementConstructor]"
          var isChrome = !!window.chrome && !isOpera;                                         // Chrome 1+
          var isIE = /*@cc_on!@*/false || !!document.documentMode;                            // At least IE6

          // Do not bind this directive if the browser is not chrome
          if (!isChrome) {
            return;
          }

          // Create the client object
          var client = new ZeroClipboard(element);
          if (attrs.clipCopy === "") {
            scope.clipCopy = function(scope) {
              return element[0].previousElementSibling.innerText;
            };
          }
          client.on( 'ready', function(readyEvent) {

            client.on('copy', function (event) {
              var clipboard = event.clipboardData;
              clipboard.setData('text/plain', scope.$eval(scope.clipCopy));
            });

            client.on( 'aftercopy', function(event) {
              if (angular.isDefined(attrs.clipClick)) {
                scope.$apply(scope.clipClick);
              }
            });

            scope.$on('$destroy', function() {
              client.destroy();
            });
          });
        }
      };
    }]);
})(window, window.angular);

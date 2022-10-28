'use strict';

angular.module('blComponents.Settings')
.factory('httpRequestInterceptor', ['url', function (url) {
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
}])
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
        console.error('[Setting ERROR] - ' + rejection.data.message);
        if (typeof rejection.data === 'object' && rejection.data.success === 0) {
          return $q.reject(rejection.data.message);
        } else {
          return $q.reject(rejection);
        }
      }
    };
  }
]);
angular.module('blApp.components.services')

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


.factory('httpResponseInterceptor',
['$q', 'notifyService', 'toggleService', '$window',
    function ($q , ns, ts, $window) {
        return {
            response: function (response) {
                if (typeof response.data === 'object' && response.data.success !== 1) {
                    // if call is api call && call is failed
                    return $q.reject(response);
                } else if (typeof response.data === 'object' && response.data.message) {
                    var responseBody = response.data.message || {};
                    if (typeof response.data.message === 'string') {
                        responseBody = {
                            response: response.data.message
                        };
                    }
                    return $q.when(angular.extend(responseBody, {_responseHeader_: response.headers()}));
                } else {
                    return $q.when(response);
                }
            },
            responseError: function (rejection) {
                if (!rejection.data.success && rejection.data.message === 'INCORRECT_SESSION') {
                    $window.location.href = '/login';
                } else if (rejection.status === 422 || rejection.status === 503) {
                    ns.errorNotify(rejection.data.message);
                } else {
                    console.log('[API Error] - ' + rejection.data);
                }
                ts.hidePleaseWait();
                return $q.reject(rejection);
            }
        };
}]);
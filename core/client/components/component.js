var configuration = function (section) {
    var config = JSON.parse(window.atob(window.config));

    if (section && config[section]) {
        return config[section];
    } else {
        return config;
    }
};

// blApp.components.services
angular.module('blApp.components.services', [])
    .provider('configuration', function () {
        return {
            'config': configuration,

            $get: function configFactory () {
                return configuration;
            }
        };
    })
    .provider('url', function () {
        var me = this;

        this.host = '';
        this.version = '';
        this.secure = false;
        this.urls = {};

        this.$get = function () {
            return {
                host: me.host,
                version: me.version,
                secure: me.secure,
                urls: me.urls,

                hostName: function () {
                    var protocol = this.secure ? 'https://' : 'http://',
                        version = this.version ? '/' + this.version : '';

                    if (!this.host) { return version; }

                    return protocol + this.host + version;
                },

                get: function (key) {
                    var url = this.urls[key] || '';

                    if (angular.isFunction(url)) {
                        var args = Array.prototype.slice.call(arguments);
                        args.splice(0,1);
                        url = url.apply(null, args);
                    }

                    return this.hostName() + url;
                }
            };
        };
    })
    .config(function($httpProvider, $provide, urlProvider, configurationProvider) {
        var apiConfig = configurationProvider.config('api'),
            env = configurationProvider.config('env');

        // if WB/BB, api entry point should be WB/BB
        if (env === 'production') {
            urlProvider.host = apiConfig.host;
        }

        urlProvider.secure = apiConfig.secure;
        urlProvider.version = apiConfig.version;

        $httpProvider.interceptors.push('httpRequestInterceptor');
        $httpProvider.interceptors.push('httpResponseInterceptor');
    });

// blApp.components.directives
angular.module('blApp.components.directives', []);
// angular.components.companyPanel
angular.module('blApp.components.companyPanel',
    ['ngAnimate', 'ngTagsInput', 'blApp.components.services', 'blApp.components.directives', 'ngCookies', 'ui.select']);
// angular.components.navigationBar
angular.module('blApp.components.navigationBar', ['blApp.components.services']);

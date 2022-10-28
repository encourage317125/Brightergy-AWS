// Karma configuration

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai'],


        // list of files / patterns to load in the browser
        files: [
            'client/lib/angular/angular.js',
            'client/lib/angular-socket-io/socket.js',
            'client/lib/angular-socket-io/mock/socket-io.js',
            'client/lib/angular/angular-route.js',
            'client/lib/angular/angular-mocks.js',
            'client/lib/angular/angular-animate.min.js',
            'client/lib/angular-ui-bootstrap/ui-bootstrap-tpls-1.2.5.min.js',
            'client/lib/angular-ui-router/angular-ui-router.min.js',
            'client/lib/angular-file-upload/ng-flow-standalone.js',
            'client/lib/angular-socket-io/socket.min.js',
            'client/lib/angular-socket-io/mock/socket-io.js',
            'client/lib/angular-table/ng-table.js',
            'client/lib/angular-clipboard/ng-clip.min.js',
            'client/lib/angular-clipboard/ZeroClipboard.min.js',
            'client/lib/angular-cookies/angular-cookies.min.js',
            'client/lib/jquery/jquery.js',
            'client/lib/moment/moment.min.js',
            'client/lib/ng-tags-input/ng-tags-input.js',
            'client/lib/d3/d3.js',
            /*'client/lib/d3/nv.d3.js',
            'client/lib/d3/nv.d3.ext.js',*/


            'test/client/config.js',
            'test/client/mocks/*.js',
            'client/components/component.js',
            'client/components/**/*.js',
            'client/bl-bv-management/**/*.js',
            'client/bl-bv-presentation/**/*.js',
            'client/bl-data-sense/**/*.js',

            'test/client/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [
            'client/dist/*.js',
            'client/components/auth/**/*.js',
            'client/components/**/dist/**/*.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'client/components/**/*.js': 'coverage',
            'client/bl-bv-management/**/*.js': 'coverage',
            'client/bl-bv-presentation/**/*.js': 'coverage',
            'client/bl-data-sense/**/*.js': 'coverage'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        reportSlowerThan: 50,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-sinon-chai',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage'
        ],

        coverageReporter: {
            type : 'html',
            dir : 'client-coverage/'
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        client: {
            captureConsole: true
        }
    });
};

// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised',  'sinon-chai', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'front/dist/js/vendor.min.js',
      'front/vendor/angular-mocks/angular-mocks.js',

      /*'test/unit/front/config.js',*/
      'front/app/**/*.js',
      'front/app/**/*.html',
      'test/unit/front/mocks/*.js',
      'test/unit/front/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
      'front/app/directives/tooltip.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'front/app/**/*.html': 'html2js',
      'front/**/*.js': 'coverage'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'front/'
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
      'karma-chai-as-promised',
      'karma-chai',
      'karma-sinon-chai',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],

    coverageReporter: {
         type: 'html',
         dir: 'client-coverage/'
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

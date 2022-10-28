'use strict';

var gulp = require('gulp');

// Define scss, minifycss, rename, ...
var sass = require('gulp-ruby-sass'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync').create(),
/*plumber = require('gulp-plumber'),*/
  util = require('gulp-util'),
  promise = require('bluebird'),
  fs = promise.promisifyAll(require('fs'));

// run command as production mode
// `gulp css --env=production`

var environment = util.env.env || 'development';

var paths = {
  localEnv: __dirname + '/../.docker/envvars',
  styles: {
    globalLoad: [
      'front/vendor/bootstrap-sass/assets/stylesheets'
    ],
    watch: 'front/assets/scss/**/*.scss',
    srcPath: 'front/assets/scss/',
    srcFile: 'front/assets/scss/main.scss',
    dstPath: 'front/dist/css'
  }
};

var displayError = function (error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin + ']';
  errorString += ' ' + error.message.replace('\n', ''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if (error.fileName) {
    errorString += ' in ' + error.fileName;
  }

  if (error.lineNumber) {
    errorString += ' on line ' + error.lineNumber;
  }

  // This will output an error like the following:
  // [gulp-scss] error message in file_name on line 1
  console.error(errorString);
};

var getPortFromEnv = function () {
  if (process.env.PORT) {
    return promise.resolve(process.env.PORT);
    // throw 'Need PLATFORMDOMAIN environment variable';
  }

  return fs
    .readFileAsync(paths.localEnv, 'utf8')
    .then(function (envFileContent) {
      var regex = /PORT=(\S+)[\s]/;
      var rawPort = regex.exec(envFileContent)[0].replace(/\s/g, '').replace('PORT=', '');

      return rawPort;
    })
    .catch(function (e) {
      // Unable to read .docker/envvar
      console.log(e);
      throw 'Need PORT from environment variable or .docker/envvar';
    });
};

var scssBuild = function (path) {
  return sass(path.srcFile, {
    compass: true,
    loadPath: path.globalLoad,
    noCache: false,
    style: 'compressed',
    sourcemap: true
  })
    .on('error', displayError)
    .pipe(rename({basename: 'assurf', suffix: '.min'}))
    .pipe(sourcemaps.write(paths.dstPath, {
      sourceRoot: paths.srcPath,
      includeContent: false
    }))
    .pipe(gulp.dest(path.dstPath))
    .pipe(environment === 'development' ? browserSync.stream() : util.noop());
};

// Define task for build scss
gulp.task('css', function () {
  return scssBuild(paths.styles);
});

gulp.task('css:watch', ['css'], function () {
  getPortFromEnv().then(function (port) {
    browserSync.init({
      proxy: 'http://localhost:' + port
    });

    gulp.watch(paths.styles.watch, ['css']);
  });
});

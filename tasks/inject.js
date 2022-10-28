'use strict';

var gulp = require('gulp'),
  inject = require('gulp-inject'),
  es = require('event-stream'),
  angularFilesort = require('gulp-angular-filesort'),
  util = require('gulp-util');

var env = util.env.env || 'development',
    distJsPath = 'front/dist/js/app.min*.js';
    
var app = function () {
  return env === 'production'
    ? gulp.src(distJsPath, {read: false})
    : gulp.src('front/app/**/*.js').pipe(angularFilesort());
};

var vendor = function () {
  return gulp.src(['front/dist/js/vendor.min.js','front/dist/css/vendor.min.css'], { read: false });
};

var jade = function() { 
  return gulp.src('cloud/views/index.jade')
    // Include local cdn
    .pipe(inject(vendor(), {name: 'vendor', ignorePath: 'front/',
      transform: function (filepath) {
        return '!= CDN(\'' + filepath + '\')';
      }
    }))

    // Inject configurable data
    .pipe(inject(es.merge(gulp.src('front/dist/css/assurf.min.css', { read: false }), app()), { ignorePath: 'front/',
      transform: function (filepath) {
        if (filepath.slice(-4) === '.css') {
          return '!= CDN(\'' + filepath + '\')';
        }
        // Use the default transform as fallback:
        return inject.transform.apply(inject.transform, arguments);
      }
    }))
    .pipe(gulp.dest('cloud/views'));
};

gulp.task('inject', function() {
  return jade();
});
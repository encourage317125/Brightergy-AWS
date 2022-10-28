var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    karma = require('gulp-karma');

var JS_PATH_SERVER = 'cloud/';
var TEST_PATH_SERVER = 'test/server/unit/';

gulp.task('cover-server-unit', function(cb) {
  gulp.src([JS_PATH_SERVER + '**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
        gulp.src([TEST_PATH_SERVER + '**/*.spec.js'], { read: false })
          .pipe(mocha({
            reporter: 'spec',
            globals: {
              /*should: require('should')*/
            }
          }))
          .once('error', function (err) {
            throw err;
          })
          .pipe(istanbul.writeReports({dir: './server-coverage', reporters: ['html', 'text-summary', 'text']}))
          //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 }}));   //not important for now
          .on('end', cb);
    });
});

gulp.task('cover-client-unit', ['vendor'], function() {
  return gulp.src([ /* use files in config */])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['progress', 'coverage']
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

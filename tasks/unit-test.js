var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    karma = require('gulp-karma');


gulp.task('test-server-unit', function() {
  return gulp.src(['test/server/unit/**/*.spec.js'], { read: false })
    .pipe(mocha({
      reporter: 'dot',
      globals: {
        /*should: require('should')*/
      }
    }))
    .once('error', function (err) {
      throw err;
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('test-client-unit', ['vendor'], function() {
  return gulp.src([ /* use files in config */])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['progress']
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
'use strict';

var fs = require('fs'),
    gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence');

fs.readdirSync(__dirname + '/tasks').forEach(function(module) {
    require(__dirname + '/tasks/' + module);
});

gulp.task('clean:dist', function () {
  return gulp.src( 'front/dist/**/*.*', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('build', function (cb) {
  runSequence('clean:dist', 'jshint', 'vendor', 'css', 'js', 'files', 'inject', cb);
});

gulp.task('test', function (cb) {
  runSequence('test-client-unit', 'test-server-unit', cb);
});

gulp.task('coverage', function (cb) {
  runSequence('cover-server-unit', 'cover-client-unit', cb);
});

gulp.task('default', [ 'build', 'watch' ]);

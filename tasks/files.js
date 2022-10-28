'use strict';

var gulp = require('gulp');

gulp.task('files', [ 'fonts', 'images', 'components' ]);

gulp.task('fonts', function () {
  return gulp.src('front/assets/fonts/**')
    .pipe(gulp.dest('front/dist/fonts'));
});

gulp.task('images', function () {
  return gulp.src('front/assets/img/**')
    .pipe(gulp.dest('front/dist/img'));
});

gulp.task('components', function () {
  /*gulp.src('core/client/components/platform-panel/dist/fonts/!**')
    .pipe(gulp.dest('front/components/platform-panel/fonts'));*/

  return gulp.src('core/client/components/platform-panel/dist/**')
    .pipe(gulp.dest('front/components/platform-panel/dist'));
});
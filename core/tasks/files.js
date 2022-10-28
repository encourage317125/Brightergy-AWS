'use strict';

module.exports = function(gulp) {

    gulp.task('files', [ 'fonts', 'images' ]);

    gulp.task('fonts', function () {
      return gulp.src('client/components/platform-panel/fonts/**')
        .pipe(gulp.dest('client/components/platform-panel/dist/fonts'));
    });

    gulp.task('images', function () {
      return gulp.src('client/components/platform-panel/img/**')
        .pipe(gulp.dest('client/components/platform-panel/dist/img'));
    });
};
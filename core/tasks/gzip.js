/*
 * Author: Samar.Acharya@Brightergy.Com
 * Desc: Uses gulp-gzip to gzip css and javascript files
 */

module.exports = function(gulp) {
  'use strict';

  var gulp = require('gulp');
  var gzip = require('gulp-gzip');

  var opts = {threshold: 1024, extension: 'gz'};
  var distSrcs = 'client/dist/*.js';
  var distPath = 'client/dist/';
  var clientImgAssets = 'client/assets/img/*';
  var clientImgAssetsDestPath = 'client/assets/img/';
  var platformPanelSrcs = 'client/components/platform-panel/dist/*';
  var platformPanelDestPath = 'client/components/platform-panel/dist/';

  gulp.task('compress-dist', function() {
    gulp.src(distSrcs)
      .pipe(gzip(opts))
      .pipe(gulp.dest(distPath));
  });

  gulp.task('compress-img', function() {
    gulp.src(clientImgAssets)
      .pipe(gzip(opts))
      .pipe(gulp.dest(clientImgAssetsDestPath));
  });

  gulp.task('compress-ppanel', function() {
    gulp.src(platformPanelSrcs)
      .pipe(gzip(opts))
      .pipe(gulp.dest(platformPanelDestPath));
  });

  gulp.task('compress', ['compress-dist', 'compress-img', 'compress-ppanel']);
};

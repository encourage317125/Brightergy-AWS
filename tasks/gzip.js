/*
 * Author: Samar.Acharya@Brightergy.Com
 * Desc: Uses gulp-gzip to gzip css and javascript files
 */

'use strict';

var gulp = require('gulp');
var gzip = require('gulp-gzip');

var opts = {threshold: 1024, extension: 'gz'};
var jsSrcs = 'front/dist/js/*.js';
var jsDestPath = 'front/dist/js/';
var cssSrcs = 'front/dist/css/*.css';
var cssDestPath = 'front/dist/css/';
var imgSrcs = 'front/assets/img/*';
var imgDestPath = 'front/assets/img/';

gulp.task('compress-js', function() {
  gulp.src(jsSrcs)
    .pipe(gzip(opts))
    .pipe(gulp.dest(jsDestPath));
});

gulp.task('compress-css', function() {
  gulp.src(cssSrcs)
    .pipe(gzip(opts))
    .pipe(gulp.dest(cssDestPath));
});

gulp.task('compress-img', function() {
  gulp.src(imgSrcs)
    .pipe(gzip(opts))
    .pipe(gulp.dest(imgDestPath));
});

gulp.task('compress', ['compress-js', 'compress-css', 'compress-img']);

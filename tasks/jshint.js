'use strict';

var gulp = require('gulp'),
    ignore = require('gulp-ignore'),
    jshint = require('gulp-jshint');

var paths = {
  'front': {
    'files': ['./front/app/**/*.js'],
    'log': './logs/jshint-front-output.html',
    'jshintrc': './front/.jshintrc'
  },
  'cloud': {
    'files': './cloud/**/*.js',
    'log': './logs/jshint-cloud-output.html',
    'jshintrc': './cloud/.jshintrc'
  }
};

function doJShint(path) {
  return gulp.src(path.files)
    .pipe(ignore.exclude(/HelpCenter.js/))
    .pipe(jshint(path.jshintrc))
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: path.log
    }))
    .pipe(jshint.reporter('fail'));
}

gulp.task('jshint:cloud', function(){
  return doJShint(paths.cloud);
});

gulp.task('jshint:front', function(){
  return doJShint(paths.front);
});

gulp.task('jshint', ['jshint:front', 'jshint:cloud']);

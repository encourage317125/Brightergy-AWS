var gulp = require('gulp'),
  templateCache = require('gulp-angular-templatecache'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  angularFilesort = require('gulp-angular-filesort'),
  uglify = require('gulp-uglify'),
  util = require('gulp-util'),
  bust = require('gulp-buster'),
  merge = require('merge-stream'),
  rename = require('gulp-rename'),
  rimraf = require('gulp-rimraf');


var environment = util.env.env || 'development',
  files = {
    html: 'front/app/**/*.html',
    js: 'front/app/**/*.js',
    distJs: 'front/dist/js/app.min.js'
  },
  distPath = 'front/dist/js/';

var template = function() {
  return gulp.src(files.html)
    .pipe(templateCache({ module: 'bl.analyze.solar.surface', root: 'app/' }))
    .pipe(gulp.dest(distPath));
};

var js = function() {
  return gulp.src([ distPath + 'templates.js', files.js ])
    .pipe(angularFilesort())
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('app.min.js'))
    .pipe(environment === 'production' ? uglify() : util.noop())
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: distPath
    }))
    .pipe(gulp.dest(distPath))
    .pipe(bust({ length: 8 }))
    .pipe(gulp.dest('front/dist/'));
};

var appendFingerPrint = function () {
  var busters = require('../front/dist/busters.json'),
      fingerprint = busters[files.distJs];
      
  gulp.src(files.distJs)
    .pipe(rename({basename: 'app.min.', suffix: fingerprint}))
    .pipe(gulp.dest('front/dist/js/'));
};

var removeTemplate = function () {
  return gulp.src( distPath + 'templates.js', { read: false })
    .pipe(rimraf({ force: true }));
};

var removeApp = function () {
  return gulp.src( 'front/dist/js/app.min*js', { read: false })
    .pipe(rimraf({ force: true }));
}

gulp.task('js:template', function () {
  return template();
});

gulp.task('js:app', ['js:template'], function () {
  return js();
});

gulp.task('js:fingerprint', ['js:app'], function () {
  return appendFingerPrint();
});

gulp.task('js', ['js:fingerprint'], function () {
  return merge(removeTemplate(), removeApp());
});

gulp.task('js:watch', ['js'], function () {
  gulp.watch([ files.js, files.html ], ['js']);
});
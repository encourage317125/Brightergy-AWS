'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    /*sourcemaps = require('gulp-sourcemaps'),*/
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    plumber = require('gulp-plumber'),
    util = require('gulp-util'),
    ignore = require('gulp-ignore'),
    path = require('path'),
    bowerFiles = require('main-bower-files'),
    _ = require('lodash');

var env = util.env.env || 'development',
    missing = [
      'front/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'front/vendor/highstock-release/modules/heatmap.js',
      'front/assets/css/*.css'
    ],
    ignoreFiles = [ '**/_bootstrap.scss' , '**/bootstrap.js', '**/angular-mocks.js' ],
    distPath = 'front/dist';

var filterByExtension = function(extension) {
    return filter(function(file) {
        return file.path.match(new RegExp('.' + extension + '$'));
    }, {restore: true});
};


var vendor = function() {
    var filters = filterByExtension('js');

    return gulp.src(bowerFiles().concat(_.map(missing, function (s) {return path.join(process.cwd(), s);})))
        .pipe(ignore.exclude(ignoreFiles))
        .pipe(filters)
        /*.pipe(sourcemaps.init())*/
        .pipe(plumber())
        .pipe(concat('vendor.min.js'))
        .pipe(env === 'production' ? uglify() : util.noop())
        /*.pipe(sourcemaps.write('maps', {
          includeContent: false,
          sourceRoot: distPath
        }))*/
        .pipe(gulp.dest(distPath + '/js'))

        .pipe(filters.restore)
        .pipe(filterByExtension('css'))
        .pipe(concat('vendor.min.css'))
        .pipe(env === 'production' ? csso() : util.noop())
        .pipe(gulp.dest(distPath + '/css'))

        .pipe(filters.restore)
        .pipe(filterByExtension('(eot|svg|ttf|woff)'))
        .pipe(gulp.dest(distPath + '/fonts'));
};

gulp.task('vendor', function() {
    return vendor();
});

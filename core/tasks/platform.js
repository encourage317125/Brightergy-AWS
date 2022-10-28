module.exports = function(gulp) {
  var templateCache = require('gulp-angular-templatecache'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    angularFilesort = require('gulp-angular-filesort'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    clean = require('gulp-clean');


  var environment = util.env.env || 'development',
    files = {
      html: ['client/components/platform-panel/app/templates/*.html'],
      js: 'client/components/platform-panel/app/**/*.js'
    },
    distPath = 'client/components/platform-panel/dist/';


  var template = function () {
    return gulp.src(files.html)
      .pipe(templateCache({module: 'blComponents.platformPanel', root: '/components/platform-panel/app/templates/'}))
      .pipe(gulp.dest(distPath));
  };

  var js = function () {
    return gulp.src([distPath + 'templates.js', files.js])
      .pipe(angularFilesort())
      .pipe(plumber())
      .pipe(concat('component-platformpanel.js'))
      .pipe(environment === 'production' ? uglify() : util.noop())
      .pipe(gulp.dest(distPath));
  };

  var removeTemplate = function () {
    return gulp.src(distPath + 'templates.js', {read: false})
      .pipe(clean());
  };

  gulp.task('ppanel:template', function () {
    return template();
  });

  gulp.task('ppanel:app', ['ppanel:template'], function () {
    return js();
  });

  gulp.task('build-component-platformpanel', ['ppanel:app'], function () {
    return removeTemplate();
  });
};
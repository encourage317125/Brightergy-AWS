module.exports = function(gulp) {

  var templateCache = require('gulp-angular-templatecache'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    angularFilesort = require('gulp-angular-filesort'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    clean = require('gulp-clean'),
    sass = require('gulp-ruby-sass'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create('blComponents.Settings');


  var environment = util.env.env || 'development',
    moduleName = 'blComponents.Settings',
    path = {
      base: 'client/components/settings/',
      dist: 'client/components/settings/dist/'
    },
    files = {
      html: '/app/**/*.html',
      js: {
        src: '/app/**/*.js',
        dist: 'settings.min.js'
      },
      sandbox: '/sandbox/sandbox.html',
      style: {
        watch: '/assets/scss/**/*.scss',
        global: ['client/assets/scss/globals', 'client/assets/scss/default/partials'],
        src: '/assets/scss/main.scss',
        dist: 'settings.min.css'
      }
    };


  var template = function () {
    return gulp.src(path.base + files.html)
      .pipe(templateCache({module: moduleName, root: 'app/'}))
      .pipe(gulp.dest(path.dist));
  };

  var js = function () {
    return gulp.src([path.dist + 'templates.js', path.base + files.js.src])
      .pipe(angularFilesort())
      .pipe(plumber())
      .pipe(concat(files.js.dist))
      .pipe(uglify())
      .pipe(gulp.dest(path.dist));
  };

  var removeTemplate = function () {
    return gulp.src(path.dist + 'templates.js', {read: false})
      .pipe(clean());
  };

  // define tasks for js

  gulp.task('settings:js:template', function () {
    return template();
  });

  gulp.task('settings:js:app', ['settings:js:template'], function () {
    return js();
  });

  gulp.task('settings:js', ['settings:js:app'], function () {
    return removeTemplate();
  });

  gulp.task('settings:js:watch', ['settings:js'], browserSync.reload);

  // define task for stylesheet

  var displayError = function (error) {
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace('\n', '');

    if (error.fileName) { errorString += ' in ' + error.fileName;}
    if (error.lineNumber) { errorString += ' on line ' + error.lineNumber; }

    console.error(errorString);
  };

  var scssBuild = function () {
    return sass(path.base + files.style.src, {
        compass: true,
        loadPath: files.style.global,
        noCache: false,
        style: 'compressed'
      })
      .on('error', displayError)
      .pipe(rename({basename: 'settings', suffix: '.min'}))
      .pipe(gulp.dest(path.dist))
      .pipe(browserSync.stream())
  };

  gulp.task('settings:css', function () {
    return scssBuild();
  });

  gulp.task('settings:build', [ 'settings:css', 'settings:js' ]);

  // define tasks for sandbox

  var openUrl = function () {
    var options = {
      server: {
        baseDir: [path.base + 'sandbox/assurf', path.base],
        index: 'sandbox/sandbox.html'
      }
    };

    browserSync.init(options);
  };

  gulp.task('settings:sandbox:server', function () {
    openUrl();

    // watch js, css files
    console.log('Start watching js, css files');
    gulp.watch([path.base + files.js.src, path.base + files.html], ['settings:js']);
    gulp.watch(path.dist + '*.js').on('change', browserSync.reload);
    gulp.watch(path.base + files.style.watch, ['settings:css']);
    gulp.watch(path.base + 'sandbox/sandbox.html').on('change', browserSync.reload);
  });

  gulp.task('settings:sandbox:start', [ 'settings:build', 'settings:sandbox:server']);
};
/**
 * Compiles SCSS files into CSS.
 *
 * ---------------------------------------------------------------
 * Invoke compass for scss file of each apps in BrighterLink platform.
 *
 *
 * For usage docs see:
 *    https://github.com/sindresorhus/gulp-ruby-sass
 *
 */

module.exports = function (gulp) {
  // Define sass, minifycss, rename, ...
  var sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence');

  var paths = {
    globalLoad: [
      'client/assets/scss/globals',
      'client/assets/scss/default/partials'
    ],
    general: {
      srcFiles: 'client/assets/scss/default/main.scss',
      dstPath: './client/assets/css'
    },
    components: {
      srcFiles: 'client/assets/scss/default/components.scss',
      dstPath: './client/assets/css'
    },
    datasense: {
      srcFiles: 'client/bl-data-sense/assets/scss/main.scss',
      dstPath: './client/bl-data-sense/assets/css'
    },
    presentation: {
      srcFiles: 'client/bl-bv-presentation/assets/scss/main.scss',
      dstPath: './client/bl-bv-presentation/assets/css'
    },
    management: {
      srcFiles: 'client/bl-bv-management/assets/scss/main.scss',
      dstPath: './client/bl-bv-management/assets/css'
    },
    helpandupdates: {
      srcFiles: 'client/bl-help-and-updates/assets/scss/main.scss',
      dstPath: './client/bl-help-and-updates/assets/css'
    },
    platform: {
      srcFiles: 'client/components/platform-panel/assets/scss/main.scss',
      dstPath: './client/components/platform-panel/dist'
    }
  };

  // A display error function, to format and make custom errors more uniform
  // Could be combined with gulp-util or npm colors for nicer output
  var displayError = function (error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n", ''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if (error.fileName)
      errorString += ' in ' + error.fileName;

    if (error.lineNumber)
      errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
  };

  function getSassStreamByApp(app) {
    return sass(paths[app].srcFiles, {
      compass: true,
      loadPath: paths.globalLoad,
      noCache: false,
      style: 'compressed'
    })
      .on('error', displayError)
      .pipe(rename({basename: app, suffix: '.min'}))
      .pipe(gulp.dest(paths[app].dstPath));
  }

  gulp.task('styles-general', ['clean-general'], function () {
    return getSassStreamByApp('general');
  });

  gulp.task('styles-components', ['clean-components'], function () {
    return getSassStreamByApp('components');
  });

  gulp.task('styles-datasense', ['clean-datasense'], function () {
    return getSassStreamByApp('datasense');
  });

  gulp.task('styles-presentation', ['clean-presentation'], function () {
    return getSassStreamByApp('presentation');
  });

  gulp.task('styles-management', ['clean-management'], function () {
    return getSassStreamByApp('management');
  });

  gulp.task('styles-helpandupdates', ['clean-helpandupdates'], function () {
    return getSassStreamByApp('helpandupdates');
  });

  gulp.task('styles-platform', ['clean-platform'], function () {
    return getSassStreamByApp('platform');
  });

  gulp.task('styles', function (cb) {
    runSequence('styles-general', 'styles-components', 'styles-datasense', 'styles-presentation', 'styles-management', 'styles-helpandupdates', 'styles-platform', cb);
  });
};
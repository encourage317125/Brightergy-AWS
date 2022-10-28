/**
 * Concat JS files
 *
 * ---------------------------------------------------------------
 * Concat JS files into one minified & uglified js file per each app in BrightLink platform.
 * Also it does strip console, alert, debugger statement from Javascript code
 *
 * IMPORTANT NOTE: Not READY yet. Ivan is working on it.
 *
 */

module.exports = function(gulp) {
    // Define concat, uglify, stripDebug, ...
    var concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        plumber = require('gulp-plumber'),
        stripDebug = require('gulp-strip-debug'),
        cachebust = new (require('gulp-cachebust'))(),
        replace = require('gulp-replace'),
        gulpsync = require('gulp-sync')(gulp);

    var componentJsFilesPath = ['client/components/component.js',
                                'client/components/services/**/*.js',
                                'client/components/directives/**/*.js',
                                'client/components/company-panel/**/*.js',
                                'client/components/navigation-bar/**/*.js'
                                ];

    var paths = {
            'source': {
                datasense: componentJsFilesPath.concat(['client/bl-data-sense/js/**/*.js']),
                presentation: componentJsFilesPath.concat(['client/bl-bv-presentation/js/**/*.js']),
                management: componentJsFilesPath.concat(['client/bl-bv-management/js/**/*.js']),
                helpandupdates: componentJsFilesPath.concat(['client/bl-help-and-updates/js/**/*.js']),
                jade: 'server/views/*.jade'
            },
            'dest': {
                'js': 'client/dist',
                'jade': 'server/views/'
            }
        };

    function getConcatStreamByApp(app) {
        return gulp.src(paths.source[app])
            .pipe(plumber())
            .pipe(concat(app + '.js'))
            .pipe(stripDebug())
            .pipe(uglify({mangle: false}))
            .pipe(rename('app-' + app + '.min.js'))
            .pipe(cachebust.resources())
            .pipe(gulp.dest(paths.dest.js));
    }

    gulp.task('build-datasense', function () {
        return getConcatStreamByApp('datasense');
    });

    gulp.task('build-presentation', function () {
        return getConcatStreamByApp('presentation');
    });

    gulp.task('build-management', function () {
        return getConcatStreamByApp('management');
    });

    gulp.task('build-helpandupdates', function () {
        return getConcatStreamByApp('helpandupdates');
    });

    gulp.task('reference-jade', function () {
        return gulp.src(paths.source.jade)
            .pipe(replace(/.min.[A-Za-z0-9_]{8}\.js/g, ".min.js"))
            .pipe(cachebust.references())
            .pipe(gulp.dest(paths.dest.jade));
    });

    gulp.task('concat', gulpsync.sync([
        'clean-dist:app', 
        'build-datasense', 
        'build-presentation', 
        'build-management', 
        'build-helpandupdates', 
        'build-component-platformpanel', 
        'reference-jade']));

};
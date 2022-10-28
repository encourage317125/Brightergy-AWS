/**
 * Do Unit Test/Integration Test
 *
 * ---------------------------------------------------------------
 * [Description]
 *
 *
 * For usage docs see: [link]
 *
 */

module.exports = function(gulp) {
    var istanbul = require('gulp-istanbul');
    var mocha = require('gulp-mocha');
    var karma = require('gulp-karma');
    var gutil = require('gulp-util');
    var runSequence = require('run-sequence');
    var filesClientUnit = [
        'client/lib/angular/angular.js',
        'client/lib/angular-socket-io/socket.js',
        'client/lib/angular-socket-io/mock/socket-io.js',
        'client/lib/angular/angular-route.js',
        'client/lib/angular/angular-mocks.js',
        'client/lib/angular/angular-animate.min.js',
        'client/lib/angular-ui-bootstrap/ui-bootstrap-tpls-1.2.5.min.js',
        'client/lib/angular-ui-router/angular-ui-router.min.js',
        'client/lib/angular-file-upload/ng-flow-standalone.js',
        'client/lib/angular-socket-io/socket.min.js',
        'client/lib/angular-socket-io/mock/socket-io.js',
        'client/lib/angular-table/ng-table.js',
        'client/lib/angular-clipboard/ng-clip.min.js',
        'client/lib/angular-clipboard/ZeroClipboard.min.js',
        'client/lib/jquery/jquery.js',
        'client/lib/moment/moment.min.js',
        'client/lib/ng-tags-input/ng-tags-input.js',
        'client/lib/d3/d3.js',
        'client/lib/d3/nv.d3.js',
        'client/lib/d3/nv.d3.ext.js',

        'test/client/config.js',
        'test/client/mocks/*.js',
        'client/components/component.js',
        'client/components/**/*.js',
        'client/bl-bv-management/**/*.js',
        'client/bl-bv-presentation/**/*.js',
        'client/bl-data-sense/**/*.js',

        'test/client/**/*.spec.js'
    ];
    var JS_PATH_SERVER = 'server/';
    var TEST_PATH_SERVER = 'test/server/unit/';

    gulp.task('cover-server-unit', function(cb) {
        gulp
            .src([JS_PATH_SERVER + '**/*.js', 'app.js'])
            .pipe(istanbul({includeUntested: true}))
            .pipe(istanbul.hookRequire())
            .on('finish', function() {
                gulp.src(['test/server/unit/**/*.spec.js'])
                    .pipe(mocha({
                        reporter: 'dot'
                    }))
                    .on('error', function(error) {
                        throw error;
                    })
                    .pipe(istanbul.writeReports({dir: './server-coverage', reporters: ['html', 'text-summary', 'text']}))
                    //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 }}))
                    .on('end', cb);
            })
            /*.on('error', gutil.log)*/
    });

    gulp.task('cover-client-unit', function() {
        return gulp
            .src(filesClientUnit)
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run',
                reporters: ['progress', 'coverage']
            }))
            .on('error', function(err) {
                throw err;
            });
    });

    gulp.task('coverage', function (cb) {
        runSequence('cover-client-unit', 'cover-server-unit', cb);
    });
};

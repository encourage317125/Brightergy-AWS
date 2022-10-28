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
    var mocha = require('gulp-mocha');
    var karma = require('gulp-karma');
    var gutil = require('gulp-util');
    var runSequence = require('run-sequence');
    var argv = require("minimist")(process.argv.slice(2));

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
        'client/lib/angular-cookies/angular-cookies.min.js',
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

    gulp.task('test-server-unit', function() {
        return gulp
            .src(['test/server/unit/**/*.spec.js'], { read: false })
            .pipe(mocha({
                grep: argv.grep,
                reporter: "dot"
            }))
            .once('error', function (err) {
                throw err;
            })
            .once('end', function () {
                //process.exit();
            });
    });

    gulp.task('test-client-unit', function() {
        return gulp
            .src(filesClientUnit)
            .pipe(karma({
                configFile: 'karma.conf.js',
                action: 'run',
                reporters: ['progress']
            }))
            .on('error', function(err) {
                throw err;
            });
    });

    gulp.task('test-unit', function (cb) {
        runSequence('test-client-unit', 'test-server-unit', cb);
    });
};

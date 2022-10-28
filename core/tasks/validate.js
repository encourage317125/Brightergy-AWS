/**
 * Validate Javascript Files
 *
 * ---------------------------------------------------------------
 * This task is configured to validate all javascript files across codebase
 * JSHint for detect errors and potential problems in javascript files
 *      , and make reports files with beautiful html markups
 *
 * JSCS for enforce coding rules in team
 *
 * For more information:
 *      https://www.npmjs.org/package/gulp-jshint
 * 		https://github.com/jscs-dev/gulp-jscs
 *
 */

var jshint = require('gulp-jshint');
var argv   = require("minimist")(process.argv.slice(2));

module.exports = function(gulp) {
    var opts = {
        'client': {
            'files': ['./client/**/*.js', '!./client/lib/**/*.js', '!./client/dist/*.js','!./client/components/**/dist/**/*.js'],
            'log': './logs/jshint-frontend-output.html',
            'jshintrc': './client/.jshintrc'
        },
        'server': {
            'files': ['./server/**/*.js', './module/**/*.js', '!./server/scripts/**/*.js',],
            'log': './logs/jshint-backend-output.html',
            'jshintrc': './server/.jshintrc'
        }
    };
    var reporter = argv.reporter || 'gulp-jshint-html-reporter';

    gulp.task('jshint-client', function(){
        return gulp.src(opts.client.files)
            .pipe(jshint(opts.client.jshintrc))
            .pipe(jshint.reporter(reporter, {
                filename: opts.client.log
            }))
            .pipe(jshint.reporter('fail'));
    });

    gulp.task('jshint-server', function(){
        return gulp.src(opts.server.files)
            .pipe(jshint(opts.server.jshintrc))
            .pipe(jshint.reporter(reporter, {
                filename: opts.server.log
            }))
            .pipe(jshint.reporter('fail'));
    });

    gulp.task('jshint', ['jshint-client', 'jshint-server']);
};

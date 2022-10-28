/*
 * Author: Samar.Acharya@Brightergy.Com
 * Desc: Checks nodesecurity.io for vulnerabilities in node modules
 */

'use strict';

var gulp = require('gulp');
var gulpNSP = require('gulp-nsp');

gulp.task('secaudit', function (cb) {
  gulpNSP({
    package: __dirname + '/../package.json',
    output: 'summary',
    stopOnError: false
  }, cb);
});

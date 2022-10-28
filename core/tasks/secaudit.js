/*
 * Author: Samar.Acharya@Brightergy.Com
 * Desc: Checks nodesecurity.io for vulnerabilities in node modules
 */

module.exports = function(gulp) {
  'use strict';

  var gulpNSP = require('gulp-nsp');

  gulp.task('secaudit', function (cb) {
  gulpNSP({
    package: __dirname + '/../package.json',
    output: 'summary',
    stopOnError: false
  }, cb);
});
};

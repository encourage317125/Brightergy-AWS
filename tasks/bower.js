'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');

var displayError = function (error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin + ']';
  errorString += ' ' + error.message.replace('\n', ''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if (error.fileName)
    errorString += ' in ' + error.fileName;

  if (error.lineNumber)
    errorString += ' on line ' + error.lineNumber;

  console.error(errorString);
};

gulp.task('bower', function(cb) {
  return bower()
    .on('error', displayError)
    .pipe(gulp.dest('front/vendor/'));
});
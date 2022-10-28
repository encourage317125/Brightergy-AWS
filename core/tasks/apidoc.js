/**
 * Description: generates apidocs API documentation
 * Author: Samar Acharya
 */
var apidoc = require('gapidoc');
var clean = require('gulp-clean');

module.exports = function(gulp) {
    gulp.task('clean-apidoc', function() {
        return gulp.src('docs/*', {read: false})
            .pipe(clean());
    });
    gulp.task('apidoc', ['clean-apidoc'], function() {
    apidoc.exec({
        src: "server/",
        dest: "docs/",
        template: "templates/apidoc"
    })}
    );
};
/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 * This task is configured to clean out the contents in the .sass-cache
 *
 * For usage docs see:
 * 		[will come soon]
 */

module.exports = function(gulp) {
    var clean = require('gulp-clean');
    var removeWanted = ['.sass-cache'];

    var individualPaths  = {
        general: './client/assets/css/general.min.*',
        components: './client/assets/css/components.min.*',
        datasense: './client/bl-data-sense/assets/css/datasense.min.*',
        presentation: './client/bl-bv-presentation/assets/css/presentation.min.*',
        management: './client/bl-bv-management/assets/css/management.min.*',
        helpandupdates: './client/bl-help-and-updates/assets/css/help-and-updates.min.*',
        platform: './client/components/platform-panel/dist/platform.min.*',
        'dist:app': './client/dist/app-*.js',
        'dist:tmpl': './client/dist/tmpl-*.js'
    };

    var individualComponentPaths = {
        'platformpanel': './client/components/platform-panel/dist/tmpl-*.js'
    };

    function getCleanIndividuals(app) {
        gulp.task('clean-' + app, function () {
            return gulp.src(individualPaths[app], {read: false}).pipe(clean());
        });
    }

    for (var app in individualPaths) {
        getCleanIndividuals(app);
    }

    function getCleanComponents(component) {
        gulp.task('clean-' + component, function () {
            return gulp.src(individualComponentPaths[component], {read: false}).pipe(clean());
        });
    }

    for (var component in individualComponentPaths) {
        getCleanComponents(component);
    }

    gulp.task('clean', function () {
        return gulp.src(removeWanted, {read: false})
                   .pipe(clean());
    });
};
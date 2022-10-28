/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 *
 */

module.exports = function(gulp) {
    // Define sass, minifycss, rename, ...
    var files = {
        notfound: './client/assets/scss/default/notfound.scss',
        general:['./client/assets/scss/default/partials/*.scss', './client/assets/scss/default/main.scss'],
        components: ['./client/assets/scss/default/components/*.scss', './client/assets/scss/default/components.scss'],
        datasense: './client/bl-data-sense/assets/scss/**/*.scss',
        presentation: './client/bl-bv-presentation/assets/scss/**/*.scss',
        management: './client/bl-bv-management/assets/scss/**/*.scss',
        platform: './client/components/platform-panel/assets/scss/**/*.scss'
    };

    gulp.task('watch', function() {

        function log(evt) {
            console.log('[Watcher] File %s was %s, compiling...', evt.path.replace(/.*(?=sass)/,''), evt.type);
        }

        gulp.watch(files.notfound, ['styles-notfound']).on('change', log);
        gulp.watch(files.general, ['styles-general']).on('change', log);
        gulp.watch(files.components, ['styles-components']).on('change', log);
        gulp.watch(files.datasense, ['styles-datasense']).on('change', log);
        gulp.watch(files.presentation, ['styles-presentation']).on('change', log);
        gulp.watch(files.management, ['styles-management']).on('change', log);
        gulp.watch(files.platform, ['styles-platform']).on('change', log);
    });
};
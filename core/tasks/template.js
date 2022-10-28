/**
 * Concat Html Partials/Template files
 *
 * ---------------------------------------------------------------
 * Concat partials/template(.html) files one minified & uglified js file per each app in BrightLink platform.
 *
 * For more info: https://www.npmjs.com/package/gulp-minify-html
 */

module.exports = function(gulp) {
    var templateCache = require('gulp-angular-templatecache'),
        runSequence = require('run-sequence'),
        uglify = require('gulp-uglify'),
        replace = require('gulp-replace'),
        minifyHTML = require('gulp-minify-html'),
        cachebust = new (require('gulp-cachebust'))({checksumLength: 5});

    var tmplCacheInfos = {
        'helpandupdates': {
            tplPath: ['client/bl-help-and-updates/views/**/*.html'],
            moduleName: 'blApp.helpAndUpdates'
        },
        'datasense': {
            tplPath: ['client/bl-data-sense/views/**/*.html', 'client/components/**/*.html'],
            moduleName: 'blApp.dataSense'
        },
        'presentation': {
            tplPath: ['client/bl-bv-presentation/views/**/*.html'],
            moduleName: 'blApp.presentation'
        },
        'management': {
            tplPath: ['client/bl-bv-management/views/**/*.html', 'client/components/**/*.html'],
            moduleName: 'blApp.management'
        }
    };

    
    var tmplComponentCacheInfos = {
        'platformpanel': {
            tplPath: ['client/components/platform-panel/templates/*.html'],
            moduleName: 'blComponents.platformPanel',
            dest: 'client/components/platform-panel/templates/dist'
        }
    };
    

    function getTemplateCacheStreamByApp(app) {
        return gulp.src(tmplCacheInfos[app].tplPath)
            .pipe(minifyHTML({empty:true, spare:true, quotes: true}))
            .pipe(templateCache('tmpl-' + app + '.min.js', {
                module: tmplCacheInfos[app].moduleName,
                base: function (file) {
                    return file.path.replace(file.cwd + '/client', '');
                }
            }))
            .pipe(uglify())
            .pipe(cachebust.resources())
            .pipe(gulp.dest('client/dist'));

    }

    
    function getTemplateCacheStreamByComponent(component) {
        return gulp.src(tmplComponentCacheInfos[component].tplPath)
            .pipe(minifyHTML({empty:true, spare:true, quotes: true}))
            .pipe(templateCache('tmpl-component-' + component + '.min.js', {
                module: tmplComponentCacheInfos[component].moduleName,
                base: function (file) {
                    return file.path.replace(file.cwd + '/client', '');
                }
            }))
            .pipe(uglify())
            //.pipe(cachebust.resources())
            .pipe(gulp.dest(tmplComponentCacheInfos[component].dest));
    }
    

    for (var app in tmplCacheInfos) {
        if (tmplCacheInfos.hasOwnProperty(app)) {
            (function (appName) {
                gulp.task('tmpl-' + appName, function () {
                    return getTemplateCacheStreamByApp(appName);
                });
            })(app);
        }
    }

    
    for (var component in tmplComponentCacheInfos) {
        if (tmplComponentCacheInfos.hasOwnProperty(component)) {
            (function (componentName) {
                gulp.task('tmpl-component-' + componentName, function () {
                    return getTemplateCacheStreamByComponent(componentName);
                });
            })(component);
        }   
    }
    

    gulp.task('reference', function () {
        return gulp.src('server/views/*.jade')
            .pipe(replace(/.min.[A-Za-z0-9_]{5}\.js/g, ".min.js"))
            .pipe(cachebust.references())
            .pipe(gulp.dest('server/views'));
    });

    gulp.task('template', function (cb) {
        runSequence(
            'clean-dist:tmpl', 
            'clean-platformpanel',
            'tmpl-helpandupdates',
            'tmpl-datasense',
            'tmpl-presentation',
            'tmpl-management', 
            'tmpl-component-platformpanel', 
            'reference', cb);
    });
};
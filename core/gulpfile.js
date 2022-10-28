/**
 * Gulpfile
 *
 * This Node script is executed when you run `gulp` or `gulp [task name]`.
 * It's purpose is to load the Gulp tasks in your project's `tasks`
 * folder, and allow you to add and remove tasks as you see fit.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Reach to Ivan Vesely(ivan.vesely@brightergy.com) instead.
 */

var gulp = require('gulp');

// Load the include-all library in order to require all of our gulp task registrations dynamically.
var includeAll;
try {
    includeAll = require('include-all');
} catch (e0) {
    console.error('Could not find `include-all` module.');
    console.error('Skipping gulp tasks...');
    console.error('To fix this, please run:');
    console.error('npm install include-all --save-dev');
    console.error();

    gulp.task('default', []);
    return ;
}

/**
 * Loads Gulp tasks from the specified
 * relative path. These modules should export a function
 * that, when run, should either load/configure or register
 * a Gulp task.
 */
function loadTasks(relPath) {
    return includeAll({
        dirname: require('path').resolve(__dirname, relPath),
        filter: /(.+)\.js$/
    }) || {};
}

/**
 * Invokes the tasks function
 */
function invokeTasksFn(tasks) {
    for (var taskName in tasks) {
        if (tasks.hasOwnProperty(taskName)) {
            tasks[taskName](gulp);
        }
    }
}

// Load task functions
var registerdTasks = loadTasks('./tasks');

// (ensure that a default task exists)
if (!registerdTasks.default) {
    registerdTasks.default = function (gulp) { gulp.task('default', []); };
}

// Run task functions
invokeTasksFn(registerdTasks);
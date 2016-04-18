const gulp = require('gulp');

const del = require('del');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');

requireDir('./gulp');

let cleanDir = './build';

function cleanAll() {
    return del([`${cleanDir}/**`, `!${cleanDir}`]);
}

function clean() {
    runSequence(
        ['clean-css', 'clean-png', 'clean-console', 'clean-hbs', 'clean-js', 'clean-html'],
        callback
    );
}

function build(callback) {
    runSequence(
        ['build-css', 'build-png', 'build-console', 'build-hbs'],
        'build-js',
        'build-html',
        callback
    );
}

function watch(callback) {
    runSequence(
        ['watch-css', 'watch-png', 'watch-console', 'watch-hbs', 'watch-js', 'watch-html'],
        callback
    );
}

function dev(callback) {
    runSequence(
        'cleanAll',
        'build',
        'watch',
        callback
    );
}

gulp.task('cleanAll', cleanAll);

gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('dev', dev);

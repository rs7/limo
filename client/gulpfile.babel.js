'use strict';

const gulp = require('gulp');

const del = require('del');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');

//const isProduction = process.env.NODE_ENV == 'production';

requireDir('./gulp');

require('events').EventEmitter.defaultMaxListeners = 0;

let cleanDir = './build';

function cleanForce() {
    return del([`${cleanDir}/**`, `!${cleanDir}`]);
}

function cleanAll() {
    runSequence(
        ['clean-css', 'clean-png', 'clean-console', 'clean-hbs', 'clean-js', 'clean-html'],
        callback
    );
}

function buildAll(callback) {
    runSequence(
        ['build-css', 'build-png', 'build-console', 'build-hbs'],
        'build-js',
        'build-html',
        callback
    );
}

function watchAll(callback) {
    runSequence(
        ['watch-css', 'watch-png', 'watch-console', 'watch-hbs', 'watch-js', 'watch-html'],
        callback
    );
}

function dev(callback) {
    runSequence(
        'clean:all',
        'build:all',
        'watch:all',
        callback
    );
}

function buildClean(callback) {
    runSequence(
        'clean:force',
        'build:all',
        callback
    );
}

gulp.task('clean:force', cleanForce);
gulp.task('build:all', buildAll);
gulp.task('watch:all', watchAll);
gulp.task('clean:all', cleanAll);
gulp.task('dev', dev);
gulp.task('build:clean', buildClean);

'use strict';

const gulp = require('gulp');

const babel = require('gulp-babel');
const batch = require('gulp-batch');
const debug = require('gulp-debug');
const del = require('del');
const eol = require('gulp-eol');
const merge = require('gulp-merge-json');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');

let source = './src/**/*.js';
let outputDir = './build';

let cleanPath = [`${outputDir}/**`, `!${outputDir}`];

function build() {
    return gulp
        .src(source)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(plumber({errorHandler: notify.onError("Сервер: ошибка\n<%= error.message %>")}))
        .pipe(gulp.dest(outputDir))
        .pipe(notify({message: "Сервер: собран", "onLast": true}))
    ;
}

function watching() {
    watch(source, batch((events, done) => gulp.start('build', done)));
}

function clean() {
    return del(cleanPath);
}

function dev(callback) {
    runSequence(
        'clean',
        'build',
        'watch',
        callback
    );
}

function buildClean(callback) {
    runSequence(
        'clean',
        'build',
        callback
    );
}

gulp.task('build', build);
gulp.task('build:clean', buildClean);
gulp.task('watch', watching);
gulp.task('clean', clean);
gulp.task('dev', dev);

let configSource = './src/config.sample.json';
let configOutputDir = './..';
let configOutputFile = 'config.json';
let configOutputPath = `${configOutputDir}/${configOutputFile}`;

function config() {
    return gulp.src([configSource, configOutputPath])
        .pipe(merge({
            fileName: configOutputFile,
            jsonSpace: ' '.repeat(2)
        }))
        .pipe(eol())
        .pipe(gulp.dest(configOutputDir))
    ;
}

gulp.task('config', config);

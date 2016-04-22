'use strict';

const gulp = require('gulp');

const babel = require('gulp-babel');
const batch = require('gulp-batch');
const del = require('del');
const eol = require('gulp-eol');
const merge = require('gulp-merge-json');
const watch = require('gulp-watch');

let source = './src/**/*.js';
let outputDir = './build';

let configSource = './src/config.sample.json';
let configOutputDir = './build';
let configOutputFile = 'config.json';
let configOutputPath = `${configOutputDir}/${configOutputFile}`;

let cleanPath = [`${outputDir}/**`, `!${outputDir}`, `!${configOutputPath}`];

function build() {
    return gulp
        .src(source)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    watch(source, batch((events, done) => gulp.start('js', done)));
}

function clean() {
    return del(cleanPath);
}

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

gulp.task('build', build);
gulp.task('watch', watching);
gulp.task('clean', clean);
gulp.task('config', config);

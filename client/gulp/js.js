'use strict';

const gulp = require('gulp');

const babelify = require('babelify');
const batch = require('gulp-batch');
const browserify = require('browserify');
const del = require('del');
const gulpif = require('gulp-if');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const isProduction = process.env.NODE_ENV == 'production';

let sourceDir = './src/js';
let sourcePath = `${sourceDir}/app.js`;
let watchPath = `${sourceDir}/**/*.js`;
let outputDir = './build';
let outputFile = 'script.js';
export let outputPath = `${outputDir}/${outputFile}`;

function build() {
    return browserify(sourcePath, {debug: !isProduction})
        .transform(babelify, {presets: ['es2015'], sourceMaps: !isProduction})
        .bundle()
        .pipe(plumber({errorHandler: notify.onError("Клиент: ошибка\n<%= error.message %>")}))
        .pipe(source(outputFile))
        .pipe(gulpif(isProduction, streamify(uglify())))
        .pipe(gulp.dest(outputDir))
        .pipe(notify({message: "Клиент: собран"}))
    ;
}

function watching() {
    watch(watchPath, batch((events, done) => gulp.start('build-js', done)));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-js', build);
gulp.task('watch-js', watching);
gulp.task('clean-js', clean);

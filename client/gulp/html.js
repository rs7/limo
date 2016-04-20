'use strict';

const gulp = require('gulp');

const batch = require('gulp-batch');
const del = require('del');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const watch = require('gulp-watch');

const isProduction = process.env.NODE_ENV == 'production';

let sourcePath = './src/html/index.html';
let watchPath = './src/html/*.html';
let outputDir = './build';
let outputFile = 'index.html';
let outputPath = `${outputDir}/${outputFile}`;

import {outputPath as consolePath} from './console';
import {outputPath as jsPath} from './js';
import {outputPath as cssPath} from './css';

const injectPaths = [consolePath, jsPath, cssPath];

function build() {
    return gulp
        .src(sourcePath)
        .pipe(rigger())
        .pipe(gulpif(isProduction, htmlmin({collapseWhitespace: true})))
        .pipe(rename(outputFile))
        .pipe(gulp.dest(outputDir))
        .pipe(inject(
            gulp.src(injectPaths, {read: false}), {relative: true}
        ))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    watch(watchPath, batch((events, done) => gulp.start('build-html', done)));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-html', build);
gulp.task('build:html:prod', build);
gulp.task('watch-html', watching);
gulp.task('clean-html', clean);

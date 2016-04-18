'use strict';

const gulp = require('gulp');

const del = require('del');
const rename = require('gulp-rename');

let sourcePath = './assets/feedback_color.png';
let outputDir = './build/images';
let outputFile = 'feedback_color.png';
let outputPath = `${outputDir}/${outputFile}`;

function build() {
    return gulp
        .src(sourcePath)
        .pipe(rename(outputFile))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    gulp.watch(sourcePath, () => gulp.start('build-png'));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-png', build);
gulp.task('watch-png', watching);
gulp.task('clean-png', clean);

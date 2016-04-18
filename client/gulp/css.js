'use strict';

const gulp = require('gulp');

const del = require('del');
const rename = require('gulp-rename');

let source = './src/css/vk_override.css';
let outputDir = './build';
let outputFile = 'style.css';
export let outputPath = `${outputDir}/${outputFile}`;

function build() {
    return gulp
        .src(source)
        .pipe(rename(outputFile))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    gulp.watch(source, () => gulp.start('build-css'));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-css', build);
gulp.task('watch-css', watching);
gulp.task('clean-css', clean);

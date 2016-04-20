'use strict';

const gulp = require('gulp');

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const gulpif = require('gulp-if');
const git = require('git-rev-sync');
const replace = require('gulp-replace');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

const isProduction = process.env.NODE_ENV == 'production';

let sourcePath = './src/console/console.js';
let outputDir = './build';
let outputFile = 'console.js';
export let outputPath = `${outputDir}/${outputFile}`;
let gitHead = './.git/HEAD';

function build() {
    return browserify({entries: sourcePath, debug: !isProduction})
        .transform(babelify, {presets: ['es2015'], sourceMaps: !isProduction})
        .bundle()
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(replace('{{git}}', git.long()))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    gulp.watch([sourcePath, gitHead], () => gulp.start('build-console'));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-console', build);
gulp.task('watch-console', watching);
gulp.task('clean-console', clean);

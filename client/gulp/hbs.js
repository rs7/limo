'use strict';

const gulp = require('gulp');

const batch = require('gulp-batch');
const del = require('del');
const File = require('vinyl');
const gulpif = require('gulp-if');
const handlebars = require('gulp-handlebars');
const htmlmin = require('gulp-htmlmin');
const HBS = require('handlebars');
const path = require('path');
const plumber = require('gulp-plumber');
const through2 = require('through2');
const watch = require('gulp-watch');

const isProduction = process.env.NODE_ENV == 'production';

let source = './src/hbs/*.hbs';
let outputDir = './src/js/templates';
let outputFile = 'templates.js';
let outputPath = `${outputDir}/${outputFile}`;

let outputFileTemplate = HBS.compile(
`'use strict';

const Handlebars = require('handlebars');

{{#each this}}
export let {{name}} = Handlebars.template({{{code}}});

{{/each}}`
);

function build() {
    let templates = [];

    return gulp
        .src(source)
        .pipe(plumber())
        .pipe(gulpif(isProduction, htmlmin({collapseWhitespace: true})))
        .pipe(handlebars({handlebars: HBS}))
        .pipe(through2.obj(
            function (file, enc, cb) {
                templates.push({
                    name: path.basename(file.path, '.js'),
                    code: String(file.contents)
                });
                cb();
            },
            function (cb) {
                let file = new File({
                    contents: new Buffer(outputFileTemplate(templates)),
                    path: outputFile
                });
                this.push(file);
                cb();
            }
        ))
        .pipe(gulp.dest(outputDir))
    ;
}

function watching() {
    watch(source, batch((events, done) => gulp.start('build-hbs', done)));
}

function clean() {
    return del(outputPath);
}

gulp.task('build-hbs', build);
gulp.task('watch-hbs', watching);
gulp.task('clean-hbs', clean);

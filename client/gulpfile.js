var output = './build';

var hbsDir = './src/hbs';
var hbs = hbsDir + '/*.hbs';
var html = './src/html/*.html';
var css = './src/css/*.css';
var jsDir = './src/js';
var js = jsDir + '/**/*.js';

var appjs = './src/js/app.js';

//common

var gulp = require('gulp');

function errorHandler(err) {
    console.log(err.toString());
    this.emit('end');
}

//clean

var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp
        .src(output + '/**/*', {read: false})
        .pipe(clean())
    ;
});

//js

var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('js', function () {
    browserify({entries: appjs, debug: true})
        .transform(babelify, {presets: ['es2015'], sourceMaps: true})
        .bundle()
        .on('error', errorHandler)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(output))
    ;
});

//hbs

var concat = require('gulp-concat');
var declare = require('gulp-declare');
var handlebars = require('gulp-handlebars');
var path = require('path');
var wrap = require('gulp-wrap');

gulp.task('hbs', function () {
    gulp
        .src(hbs)
        .pipe(handlebars({handlebars: require('handlebars')}))
        .on('error', errorHandler)
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            root: 'exports',
            noRedeclare: true,
            processName: function(filePath) {
                return declare.processNameByPath(filePath.replace(path.normalize(hbsDir), ''));
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
        .pipe(gulp.dest(jsDir))
    ;
});

//html

var rigger = require('gulp-rigger');

gulp.task('html', function () {
    gulp
        .src('./src/html/index.html')
        .pipe(rigger())
        .pipe(gulp.dest(output))
    ;
});

//css

gulp.task('css', function () {
    gulp
        .src(css)
        .pipe(gulp.dest(output))
    ;
});

//system

gulp.task('update', ['clean', 'hbs', 'js', 'html', 'css']);

gulp.task('watch', function () {
    gulp.watch(js, ['js']);
    gulp.watch(hbs, ['hbs']);
    gulp.watch(html, ['html']);
    gulp.watch(css, ['css']);
});

gulp.task('default', ['update', 'watch']);

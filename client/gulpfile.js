var output = './build';

var hbs = './src/hbs/*.hbs';
var html = './src/html/*.html';
var css = './src/css/*.css';
var js = './src/js/**/*.js';

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
var defineModule = require('gulp-define-module');
var handlebars = require('gulp-handlebars');

gulp.task('hbs', function () {
    gulp
        .src(hbs)
        .pipe(handlebars({handlebars: require('handlebars')}))
        .on('error', errorHandler)
        .pipe(defineModule('node'))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./src/js'))
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

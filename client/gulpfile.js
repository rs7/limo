var output = './build';

var hbs = './src/hbs/*.hbs';
var html = './src/html/*.html';
var css = './src/css/*.css';
var js = './src/js/**/*.js';

var appjs = './src/js/app.js';

//common

var gulp = require('gulp');

function errorHandler(err) { console.log(err.toString()); this.emit('end'); }

//build

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourceMap = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {
    browserify({entries: appjs, debug: false})
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', errorHandler)
        .pipe(source('bundle.js'))
        //.pipe(streamify(sourceMap.init({loadMaps: true})))
        //.pipe(streamify(uglify()))
        //.pipe(streamify(sourceMap.write()))
        .pipe(gulp.dest(output))
    ;
});

//templates

var concat = require('gulp-concat');
var defineModule = require('gulp-define-module');
var handlebars = require('gulp-handlebars');

gulp.task('templates', function () {
    gulp
        .src(hbs)
        .pipe(handlebars({handlebars: require('handlebars')}))
        .on('error', errorHandler)
        .pipe(defineModule('node'))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./src/js'))
    ;
});

var rigger = require('gulp-rigger');

gulp.task('html', function () {
    gulp
        .src('./src/html/index.html')
        .pipe(rigger())
        .pipe(gulp.dest(output));
});

gulp.task('css', function () {
    gulp
        .src(css)
        .pipe(rigger())
        .pipe(gulp.dest(output));
});

//system

gulp.task('update', ['templates', 'browserify', 'html', 'css']);

gulp.task('watch', function () {
    gulp.watch(js, ['browserify']);
    gulp.watch(hbs, ['templates']);
    gulp.watch(html, ['html']);
    gulp.watch(css, ['css']);
});

gulp.task('default', ['update', 'watch']);

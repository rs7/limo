//common

var gulp = require('gulp');

//browserify

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourceMap = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {
    browserify({entries: './src/js/app.js', debug: false})
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
        .pipe(source('bundle.js'))
        //.pipe(streamify(sourceMap.init({loadMaps: true})))
        //.pipe(streamify(uglify()))
        //.pipe(streamify(sourceMap.write()))
        .pipe(gulp.dest('./public'))
    ;
});

//templates

var concat = require('gulp-concat');
var defineModule = require('gulp-define-module');
var handlebars = require('gulp-handlebars');

gulp.task('templates', function () {
    gulp
        .src('./src/hbs/*.hbs')
        .pipe(handlebars({handlebars: require('handlebars')}))
        .pipe(defineModule('node'))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./src/js'))
    ;
});

//system

gulp.task('update', ['templates', 'browserify']);

gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['browserify']);
    gulp.watch('./src/hbs/**/*.hbs', ['templates']);
});

gulp.task('default', ['update', 'watch']);

//common

var gulp = require('gulp');

//browserify

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {
    browserify({entries: './src/js/app.js', debug: true})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./public'));
});

//templates

var concat = require('gulp-concat');
var declare = require('gulp-declare');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');

gulp.task('templates', function () {
    gulp
        .src('templates/*.html')
        .pipe(handlebars({handlebars: require('handlebars')}))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Template',
            noRedeclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./public'))
    ;
});

//system

gulp.task('update', ['templates', 'third-party']);

gulp.task('watch', function () {
    gulp.watch('bower.json', ['third-party']);
    gulp.watch('templates/*.html', ['templates']);
});

gulp.task('default', ['update', 'watch']);

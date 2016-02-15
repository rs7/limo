var gulp = require('gulp');

//bower

var wiredep = require('wiredep').stream;

gulp.task('bower', function () {
    gulp
        .src('./public/index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./public'))
    ;
});

//templates

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
 
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

gulp.task('update', ['bower', 'templates']);

gulp.task('watch', function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch('templates/*.html', ['templates']);
});

gulp.task('default', ['update', 'watch']);

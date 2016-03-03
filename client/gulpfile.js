//common

var gulp = require('gulp');
var concat = require('gulp-concat');

//third-party

var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');

gulp.task('third-party', function() {  
    gulp
        .src(mainBowerFiles())
        .pipe(concat('third-party.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

//templates

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

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

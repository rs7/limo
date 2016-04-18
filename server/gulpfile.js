var gulp = require('gulp');

var babel = require('gulp-babel');
var clean = require('gulp-clean');
var eol = require('gulp-eol');
var merge = require('gulp-merge-json');

var PATH = {
    js: {
        source: './src/**/*.js',
        build: {
            dir: './build'
        },
        clean: './build/**/*.js'
    },
    config: {
        source: './src/config.sample.json',
        build: {
            dir: './build',
            file: 'config.json',
            path: './build/config.json'
        }
    }
};

gulp.task('js', function () {
    return gulp.src(PATH.js.source)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(PATH.js.build.dir))
    ;
});

gulp.task('watch', ['js'], function () {
    return gulp.watch(PATH.js.source, ['js']);
});

gulp.task('clean', function () {
    return gulp.src(PATH.js.clean, {read: false}).pipe(clean());
});

gulp.task('config', function () {
    return gulp.src([PATH.config.source, PATH.config.build.path])
        .pipe(merge({
            fileName: PATH.config.build.file,
            jsonSpace: '  '
        }))
        .pipe(eol())
        .pipe(gulp.dest(PATH.config.build.dir))
    ;
});

gulp.task('build', ['js']);

gulp.task('default', ['build']);

var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var declare = require('gulp-declare');
var handlebars = require('gulp-handlebars');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var rigger = require('gulp-rigger');
var wrap = require('gulp-wrap');

var babelify = require('babelify');
var browserify = require('browserify');
var hbs = require('handlebars');
var path = require('path');
var source = require('vinyl-source-stream');

function errorHandler(err) {
    console.error(err);
    this.emit('end');
}

var TASK = {
    css: 'css',
    hbs: 'hbs',
    html: 'html',
    js: 'js',
    watch: function (task) {
        return task + '-watch';
    },
    clean: function (task) {
        return task + '-clean';
    }
};

var PATH = {
    css: {
        source: './src/css/*.css',
        build: {
            dir: './build',
            file: 'style.css',
            path: './build/style.css'
        },
        watch: './src/css/*.css',
        clean: './build/style.css'
    },
    html: {
        source: './src/html/index.html',
        build: {
            dir: './build',
            file: 'index.html',
            path: './build/index.html'
        },
        watch: './src/html/*.html',
        clean: './build/index.html'
    },
    js: {
        source: './src/js/app.js',
        build: {
            dir: './build',
            file: 'script.js',
            path: './build/script.js'
        },
        watch: './src/js/**/*.js',
        clean: './build/script.js'
    },
    hbs: {
        dir: './src/hbs',
        source: './src/hbs/*.hbs',
        build: {
            dir: './src/js/templates',
            file: 'templates.js',
            path: './src/js/templates/templates.js'
        },
        watch: './src/hbs/*.hbs',
        clean: './src/js/templates/templates.js'
    }
};

//css

gulp.task(TASK.css, function () {
    return gulp
        .src(PATH.css.source)
        .pipe(concat(PATH.css.build.file))
        .pipe(gulp.dest(PATH.css.build.dir))
    ;
});

//hbs

gulp.task(TASK.hbs, function () {
    return gulp
        .src(PATH.hbs.source)
        .pipe(handlebars({handlebars: hbs}))
        .on('error', errorHandler)
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            root: '\nmodule.exports',
            noRedeclare: true,
            processName: function (filePath) {
                return declare.processNameByPath(filePath.replace(path.normalize(PATH.hbs.dir), ''));
            }
        }))
        .pipe(concat(PATH.hbs.build.file))
        .pipe(wrap('const Handlebars = require(\'handlebars\');\n<%= contents %>'))
        .pipe(gulp.dest(PATH.hbs.build.dir))
    ;
});

//js

gulp.task(TASK.js, [TASK.hbs], function () {
    return browserify({entries: PATH.js.source, debug: true})
        .transform(babelify, {presets: ['es2015'], sourceMaps: true})
        .bundle()
        .on('error', errorHandler)
        .pipe(source(PATH.js.build.file))
        .pipe(gulp.dest(PATH.js.build.dir))
    ;
});

//html

var HTML_TASK = {
    build: 'html-build',
    inject: 'html-inject'
};

gulp.task(HTML_TASK.build, [TASK.css, TASK.js], function () {
    return gulp
        .src(PATH.html.source)
        .pipe(rigger())
        .pipe(rename(PATH.html.build.file))
        .pipe(gulp.dest(PATH.html.build.dir))
    ;
});

gulp.task(HTML_TASK.inject, [HTML_TASK.build], function () {
    return gulp
        .src(PATH.html.build.path)
        .pipe(inject(
            gulp.src([PATH.js.build.path, PATH.css.build.path], {read: false}), {relative: true}
        ))
        .pipe(gulp.dest(PATH.html.build.dir))
    ;
});

gulp.task(TASK.html, [HTML_TASK.inject]);

//system

var ALL = [TASK.hbs, TASK.js, TASK.css, TASK.html];

function watchTask(task) {
    return gulp.task(TASK.watch(task), function () {
        gulp.watch(PATH[task].watch, [task]);
    });
}

ALL.forEach(watchTask);

function cleanTask(task) {
    return gulp.task(TASK.clean(task), function () {
        return gulp.src(PATH[task].clean, {read: false}).pipe(clean());
    });
}

ALL.forEach(cleanTask);

gulp.task('watch', ALL.map(TASK.watch));

gulp.task('clean', ALL.map(TASK.clean));

gulp.task('build', ALL);

gulp.task('default', ['clean', 'build', 'watch']);

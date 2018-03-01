/**
 * Created by Administrator on 2017/8/15.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-clean-css'),
    // concat = require('gulp-concat'),
    minifyhtml = require('gulp-html-minifier');

var paths = {
    // 需要打包的所有JS文件
    js: [
        'upEditor/**/*.js',
        'lib/*.js'
    ],
    concat:[
        'upEditor/lib/jquery.min.js',
        'upEditor/lib/jquery.minicolors.js',
        'upEditor/lib/drag.js',
        'upEditor/lib/qrcode.js',
        'upEditor/lib/require.js',
        // 'upEditor/module/main/control.js',
        'upEditor/common/commonUI.js'
        // 'upEditor/module/main/main.js',
    ],
    css: [
        'upEditor/**/*.css',
        'lib/*.css'
    ],
    html: [
        'upEditor/**/*.html',
    ],
    file: [
        'upEditor/**/*.jpg',
        'upEditor/**/*.png',
        'upEditor/**/*.gif',
        'upEditor/**/*.json',
        'upEditor/**/*.eot',
        'upEditor/**/*.svg',
        'upEditor/**/*.ttf',
        'upEditor/**/*.woff'
    ]
};

var destDir = 'dist/upEditor';
var concatDir = 'dist/upEditor/lib';

gulp.task('release', function () {
    // 打包所有JS文件
    // gulp.src(paths.concat)
    //     .pipe(concat('index.js'))
    //     .pipe(gulp.dest(concatDir));
    gulp.src(paths.js)
        .pipe(uglify({
            compress: {
                // 移除console语句
                drop_console: true
            },
            mangle: {except: ['require', 'exports', 'module', '$']}
        }))
        .pipe(gulp.dest(destDir));

    // 打包所有CSS文件
    gulp.src(paths.css)
        .pipe(minifycss({
            compatibility: '*',
            advanced: false
        }))
        .pipe(gulp.dest(destDir));

    gulp.src(paths.html)
        .pipe(minifyhtml({
            // 压缩空格
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true,
            removeComments: true
        }))
        .pipe(gulp.dest(destDir));

    // 打包所有无需预处理的文件
    gulp.src(paths.file)
        .pipe(gulp.dest(destDir));
});


gulp.task('default', ['release']);

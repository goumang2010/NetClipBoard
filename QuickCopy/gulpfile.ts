/// <reference path="./Scripts/typings/tsd.d.ts" />
import gulp = require('gulp');
var minifycss = require('gulp-clean-css');
import concat = require('gulp-concat');
import uglify = require('gulp-uglify');
import rename = require('gulp-rename');
import del = require('del');
var spriter = require('gulp-css-spriter');


gulp.task('minifycss', function() {
    return gulp.src('public/stylesheets/*.css')      //压缩的文件
        .pipe(minifycss())  //执行压缩
        .pipe(gulp.dest('public/minified/css'));  //输出文件夹
});
gulp.task('minifyjs', function() {
    return gulp.src('public/javascripts/*.js')
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('public/minified/js'))    //输出main.js到文件夹
        .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('public/minified/js'));  //输出
});

gulp.task('clean', function(cb) {
    del(['public/minified/css/*', 'public/minified/js/*'], cb)
});
gulp.task('sprite', function() {

    var timestamp = +new Date();
    del(['public/minified/css/*', 'public/minified/image/*'])
    //需要自动合并雪碧图的样式文件
     return gulp.src('public/stylesheets/*.css')
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': 'public/minified/image/sprite' + timestamp + '.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../image/sprite' + timestamp + '.png'
        }))
        .pipe(minifycss())  //执行压缩
        .pipe(gulp.dest('public/minified/css')); 
	
});

gulp.task('default',  function() {
	gulp.start('clean');
    gulp.start('minifycss', 'minifyjs');
});


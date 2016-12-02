var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    jade = require('gulp-jade');

gulp.task('jade', function(){
  return gulp.src('app/jade/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('app/'));
});

gulp.task('autoprefixer', function(){
  return gulp.src('app/css/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/cssauto'));
})

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('clean', function(){
  return del.sync('dist');
});

gulp.task('clear', function(){
  return cache.clearAll();
});

gulp.task('img', function(){
  return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
  })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync'], function(){
  gulp.watch('app/jade/*.jade', ['jade']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/css/*.css', browserSync.reload);
});

gulp.task('build',['clean', 'autoprefixer', 'img'], function(){
  
  var buildCss = gulp.src([
      'app/cssauto/base.css',
      'app/cssauto/reset.css',
    ])
    .pipe(gulp.dest('dist/css'));
  
  var buildFonts = gulp.src('app/fonts/**/*')
                  .pipe(gulp.dest('dist/fonts'));
  
  var buildHtml = gulp.src('app/**/*.html')
                  .pipe(gulp.dest('dist/'));
});
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
  return gulp
    .src([
      'node_modules/bootstrap/scss/bootstrap.scss',
      'public/src/scss/*.scss'
    ])
    .pipe(sass())
    .pipe(gulp.dest('public/src/css'))
    .pipe(browserSync.stream());
});

// Move JS Files to public/src/js
gulp.task('js', function() {
  return gulp
    .src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(gulp.dest('public/src/js'))
    .pipe(browserSync.stream());
});

// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './public/src'
  });

  gulp.watch(
    ['node_modules/bootstrap/scss/bootstrap.scss', 'public/src/scss/*.scss'],
    ['sass']
  );
  gulp.watch('public/src/*.html').on('change', browserSync.reload);
});

// Move Fonts to public/src/fonts
gulp.task('fonts', function() {
  return gulp
    .src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('public/src/fonts'));
});

// Move Font Awesome CSS to public/src/css
gulp.task('fa', function() {
  return gulp
    .src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('public/src/css'));
});

gulp.task('default', ['js', 'serve', 'fa', 'fonts']);

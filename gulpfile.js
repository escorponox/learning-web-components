// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  bs = require('browser-sync'),
  reload = bs.reload;
del = require('del');

gulp.task('styles', function () {
  return sass('src/styles/main.scss', {style: 'expanded'})
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('styles-dev', function () {
  return sass('src/styles/main.scss', {style: 'expanded'})
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('src/styles'))
    .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'HTML task complete'}));
});

gulp.task('images', function () {
  return gulp.src('src/assets/**/*')
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/assets'))
    .pipe(notify({message: 'Images task complete'}));
});

gulp.task('clean', function () {
  return del(['dist/', 'src/styles/main.css']);
});

gulp.task('default', ['clean'], function () {
  gulp.start('html', 'styles', 'scripts', 'images');
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/assets/**/*', ['images']);
});

gulp.task('serve', function () {
  gulp.watch('src/styles/**/*.scss', ['styles-dev']);

  bs({
    server: 'src',
    browser: 'google-chrome-stable'
  });

  gulp.watch(['src/**/*.html', 'src/styles/**/*.css', 'src/scripts/**/*.js', 'src/assets/**/*'], reload);
});

gulp.task('serve-only', function () {
  bs({
    server: 'src',
    browser: 'google-chrome-stable'
  });

  gulp.watch(['src/**/*.html', 'src/styles/**/*.css', 'src/scripts/**/*.js', 'src/assets/**/*'], reload);
});

// Load plugins
var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  bs = require('browser-sync'),
  reload = bs.reload,
  del = require('del'),
  minimist = require('minimist'),
  tapdiff = require('tap-diff');

var knownOptions = {
  string: ['env', 'bump'],
  default: {
    env: process.env.NODE_ENV || 'dev',
    bump: 'patch'
  }
};

var options = minimist(process.argv.slice(2), knownOptions),
  development = options.env === 'dev';

var browsers = development ? 'last 1 chrome version' :
    ['>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9'],
  outputPath = development ? 'public' : 'dist';

gulp.task('bump', function(){
  gulp.src('./package.json')
    .pipe(plugins.bump({type: options.bump}))
    .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
  return plugins.rubySass('src/styles/main.scss', {style: 'expanded'})
    .pipe(plugins.autoprefixer(browsers))
    .pipe(gulp.dest(outputPath + '/styles'))
    .pipe(plugins.if(!development, plugins.rename({suffix: '.min'})))
    .pipe(plugins.if(!development, plugins.cssnano()))
    .pipe(gulp.dest(outputPath + '/styles'))
    .pipe(plugins.notify({message: 'Styles task complete'}));
});

gulp.task('eslint', function () {
  return gulp.src(['src/scripts/**/*.js', '!node_modules/**'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
    .pipe(plugins.notify({message: 'ESLint task complete'}));
});

gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plugins.if(!development, plugins.uglify()))
    .pipe(gulp.dest(outputPath + '/scripts'))
    .pipe(plugins.notify({message: 'Scripts task complete'}));
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(plugins.if(!development, plugins.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(outputPath))
    .pipe(plugins.notify({message: 'HTML task complete'}));
});

gulp.task('images', function () {
  return gulp.src('src/assets/**/*')
    .pipe(plugins.if(!development, plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))))
    .pipe(gulp.dest(outputPath + '/assets'))
    .pipe(plugins.if(!development, plugins.notify({message: 'Images task complete'})));
});

gulp.task('clean', function () {
  return del(['dist/', 'public/', 'src/styles/main.css']);
});

gulp.task('test', function () {
  return gulp.src('test/**/*.test.js')
    .pipe(plugins.tape({
        bail: true,
        reporter: tapdiff()
      })
    )
});


function init(cb) {
  plugins.sequence('clean', ['images', 'scripts'], ['html', 'styles'], cb);
}

gulp.task('dev-init', init);

gulp.task('dev', ['dev-init'], function () {

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/assets/**/*', ['images']);

  bs({
    server: 'public',
    browser: 'google-chrome-stable'
  });

  gulp.watch(['public/**/*.html', 'public/styles/**/*.css', 'public/scripts/**/*.js', 'public/assets/**/*'], reload);
});

gulp.task('default', function () {
  console.log(plugins);
});

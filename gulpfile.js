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

gulp.task('styles', function () {
  return plugins.rubySass('src/styles/main.scss', {
    style: 'expanded',
    sourcemap: true,
    emitCompileError: !development,
    stopOnError: !development
  })
    .pipe(plugins.autoprefixer(browsers))
    .pipe(plugins.if(!development, plugins.cssnano()))
    .pipe(plugins.if(development, plugins.sourcemaps.write()))
    .pipe(gulp.dest(outputPath + '/styles'))
    .pipe(plugins.notify({message: 'Styles task complete'}));
});

gulp.task('eslint', function () {
  return gulp.src(['src/scripts/**/*.js', '!node_modules/**'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
});

gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plugins.if(!development, plugins.uglify()))
    .pipe(gulp.dest(outputPath + '/scripts'))
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(plugins.if(!development, plugins.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(outputPath))
});

gulp.task('images', function () {
  return gulp.src('src/assets/**/*')
    .pipe(plugins.if(!development, plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))))
    .pipe(gulp.dest(outputPath + '/assets'))
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


function devInit(cb) {
  plugins.sequence('clean', ['images', 'scripts'], ['html', 'styles'], cb);
}

function buildInit(cb) {
  plugins.sequence('clean', 'eslint', 'test', ['images', 'scripts'], ['html', 'styles'], cb);
}

gulp.task('dev-init', devInit);

gulp.task('build-init', buildInit);

function devel() {

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/assets/**/*', ['images']);

  bs({
    server: 'public',
    browser: 'google-chrome-stable'
  });

  gulp.watch(['public/**/*.html', 'public/styles/**/*.css', 'public/scripts/**/*.js', 'public/assets/**/*'], reload);
}

gulp.task('dev', ['dev-init'], devel);

gulp.task('rev', ['build-init'], function () {
  return gulp.src(['dist/**/*', '!dist/**/*.html'])
    .pipe(plugins.rev())
    .pipe(plugins.revDeleteOriginal())
    .pipe(gulp.dest('dist'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('rev-replace', ['rev'], function () {
  var manifest = gulp.src('./dist/rev-manifest.json');

  return gulp.src('dist/**/*+(html|css|js)')
    .pipe(plugins.revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['rev-replace'], function () {
  bs({
    server: 'dist',
    browser: 'google-chrome-stable'
  });
});

gulp.task('deploy', ['rev-replace'], function () {
  gulp.src('./package.json')
    .pipe(plugins.bump({type: options.bump}))
    .pipe(gulp.dest('./'));

  return gulp.src(['./dist/**/*', '!./dist/rev-manifest.json'])
    .pipe(plugins.ghPages());
});

gulp.task('default', devel);

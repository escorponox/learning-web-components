// Load plugins
var gulp = require('gulp'),
  bs = require('browser-sync'),
  reload = bs.reload;


// Watch
gulp.task('serve', function () {

  bs({
    server: {
      baseDir: "src"
    },
    browser: "google-chrome-stable"
  });


  // Watch any files in dist/, reload on change
  gulp.watch(['src/**/*.html','src/styles/**/*.css','src/scripts/**/*.css','src/assets/**/*'], reload);

});
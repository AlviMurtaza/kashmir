module.exports = function (gulp, config, bs) {
  'use strict';

  var utils = require('./_utils');
  var sass = require('gulp-sass');
  var postcss = require('gulp-postcss');
  var sourcemaps = require('gulp-sourcemaps');
  var gutil = require('gulp-util');
  var plumber = require('gulp-plumber');
  var stylelint = require('gulp-stylelint');
  var autoprefixer = require('autoprefixer');
  var sassVariables = require('gulp-sass-variables');
  var rename = require('gulp-rename');


  var processors = [
    autoprefixer(config.autoprefixer)
  ];

  gulp.task('styles-lint', function () {
    return gulp.src(config.styles.source)
      .pipe(plumber({errorHandler: utils.errorHandler}))
      .pipe(gutil.env.type === config.env.dev ? stylelint(config.stylelint.options) : stylelint(config.stylelint.optionsTest))
      .pipe(plumber.stop());
  });

  gulp.task('styles', function () {
    return gulp.src(config.styles.source)
      .pipe(plumber({errorHandler: utils.errorHandler}))
      .pipe(gutil.env.type === config.env.dev ? sourcemaps.init() : gutil.noop())
      .pipe(sass(config.styles.options).on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(gutil.env.type === config.env.dev ? sourcemaps.write() : gutil.noop())
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.styles.destination))
      .pipe(gulp.src(config.styles.directionalSource))
      .pipe(sassVariables(config.styles.variables))
      .pipe(sass(config.styles.options).on('error', sass.logError))
      .pipe(rename(utils.renameFile('.ltr', '.rtl')))
      .pipe(gulp.dest(config.styles.destination))
      .pipe(utils.onDev(bs.stream()));
  });
};
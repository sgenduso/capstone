var gulp = require('gulp');
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rimraf = require('gulp-rimraf');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

var config = {
    bootstrapDir: './app/bower_components/bootstrap-sass',
    sassDir: './app/sass',
    bowerDir: './app/bower_components',
    publicDir: './app',
};

gulp.task('css', function () {
  return gulp.src(config.sassDir + '/app.scss')
  .pipe(sass({
    includePaths: [
      config.bootstrapDir + '/assets/stylesheets',
      config.sassDir,
      config.bowerDir + '/font-awesome/scss'
    ],
  }))
  .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('fonts', function () {
  return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
  .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('icons', function () {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*') 
  .pipe(gulp.dest(config.publicDir + '/fonts')); 
});

//compile index.jade to index.html
var jadeIndex = './app/jade/*jade';
gulp.task('jadeIndex', function () {
  var YOUR_LOCALS = {};

  gulp.src(jadeIndex)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app'));
});

//compile jade partials to html partials
var jadePartials = './app/jade/partials/*jade';
gulp.task('jadePartials', function () {
  var YOUR_LOCALS = {};

  gulp.src(jadePartials)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/partials'));
});

//output errors in all js files to console if build fails
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

//remove build folder to start fresh on every build
gulp.task('clean', function() {
    gulp.src('./dist/*', {read: false})
      .pipe(rimraf({force: true}));
});

//minify css
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'));
});

//minify js
gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'));
});

//copy bower components to dist
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

//copy html files to dist
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

//serve app on port 8888
gulp.task('connect', function () {
  connect.server({
    root: 'app',
    port: 8888
  });
});

//serve dist on port 9999
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('watchout', function () {
  gulp.watch(jadeIndex, ['jadeIndex']);
  gulp.watch(jadePartials, ['jadePartials']);
  gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
});

gulp.task('default', ['watchout', 'css', 'fonts', 'icons', 'jadeIndex', 'jadePartials', 'lint', 'connect']);

gulp.task('build', [
  'clean',
  'jadeIndex',
  'jadePartials',
  'lint',
  'minify-css',
  'minify-js',
  'copy-html-files',
  'copy-bower-components',
  'connectDist'
]);

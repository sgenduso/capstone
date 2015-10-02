var gulp = require('gulp');
var connect = require('gulp-connect');
var jade = require('gulp-jade');

var jadeFiles = './app/jade/*jade';

gulp.task('jadeFiles', function () {
  var YOUR_LOCALS = {};

  gulp.src(jadeFiles)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/html'));
});

gulp.task('watchout', function () {
  gulp.watch(jadeFiles, ['jadeFiles']);
});

gulp.task('default', ['watchout', 'jadeFiles','connect']);

gulp.task('connect', function () {
  connect.server({
    root: 'app/html/',
    port: 8888
  });
});

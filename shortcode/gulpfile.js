const gulp = require('gulp');
const ftp = require('vinyl-ftp');
const shell = require('gulp-shell');

gulp.task('deploy-ftp', () => {
  const conn = ftp.create({
    host: 'grol55wy.beget.tech',
    user: 'grol55wy_traffic',
    password: 'R8Y&iukj',
    parallel: 10,
  });

  const path = '/wp-content/plugins/cargo-calc2/shortcode';

  const globs = [
    'dist/**',
  ];

  return gulp.src(
    globs,
    {
      base: '.',
      buffer: false,
    },
  )
    .pipe(conn.newer(path)) // only upload newer files
    .pipe(conn.dest(path));
});

gulp.task('vue', () => gulp.src(['./src/*.vue'])
  .pipe(shell('vue-cli-service build --target lib --name cargo')));

gulp.task('vue-build-task', gulp.series('vue', 'deploy-ftp'));

gulp.task('deploy-ftp-prod', () => {
  const conn = ftp.create({
    host: 'masterlg.beget.tech',
    user: 'masterlg_user',
    password: 'KE1F*Wq6',
    parallel: 10,
  });

  const path = '/public_html/wp-content/plugins/cargo-calc2/shortcode';

  const globs = [
    'dist/**',
  ];

  return gulp.src(
    globs,
    {
      base: '.',
      buffer: false,
    },
  )
    .pipe(conn.newer(path)) // only upload newer files
    .pipe(conn.dest(path));
});

gulp.task('vue-build-task-prod', gulp.series('vue', 'deploy-ftp-prod'));

gulp.task('watch', () => {
  gulp.watch(
    ['./src/*.*', './src/components/!*.*', './src/css/base/*.*', './src/css/modules/*.*', './src/fonts/*.*', './src/js/*.*'],
    gulp.series('vue-build-task'),
  );
});

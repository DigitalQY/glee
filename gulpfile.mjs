import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import uglifyes from 'gulp-uglify-es';
import gulpconcat from 'gulp-concat';
import autoprefix from 'gulp-autoprefixer';
import browsersync from 'browser-sync';
import gulpclean from 'gulp-clean';
import imagemin from 'gulp-imagemin';

const { src, dest, watch, parallel, series } = gulp;
const scss = gulpSass(dartSass);
const concat = gulpconcat;
const uglyfy = uglifyes.default;
const autoprefixer = autoprefix;
const browserSync = browsersync.create();
const clean = gulpclean;
const images = imagemin;

function styles() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer({
      overrideBrowserslist: 'last 2 versions',
      grid: true
    }))
    .pipe(concat('style.min.css'))
    .pipe(scss(/*{ outputStyle: 'compressed' }*/))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}
function scripts() {
  return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglyfy())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}
function browserwatcher() {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
}
function watcher() {
  watch(['app/index.html']).on('change', browserSync.reload);
  watch(['app/scss/**/*.scss'], styles)
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
}
function build() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/index.html'
  ], { base: 'app' })
    .pipe(dest('dist'))
}
function imagesmin() {
  return src('app/images/**/*.*', { encoding: false })
    .pipe(images())
    .pipe(dest('dist/images/'))
}
function cleaner() {
  return src('dist/*')
    .pipe(clean())
}
export { styles, scripts, watcher, browserwatcher, build, cleaner, imagesmin };
export default parallel(styles, scripts, browserwatcher, watcher);

export const builder = series(cleaner, imagesmin, build)
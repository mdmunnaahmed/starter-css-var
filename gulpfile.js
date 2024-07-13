const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();

function style() {
  return gulp.src("./src/assets/sass/main.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./src/assets/css")).pipe(browserSync.stream());
}

function htmlfileinclude() {
  return gulp
    .src("./src/pages/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./src/")) // Export HTML files directly to the src folder
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
  });

  gulp.watch("./src/pages/*.html", htmlfileinclude);
  gulp.watch("./src/partial/*.html", htmlfileinclude);
  gulp.watch("./src/assets/sass/**/*.scss", style);

  gulp.watch("./src/*.html").on("change", browserSync.reload);
}

exports.watch = watch;
exports.build = series(htmlfileinclude, style);

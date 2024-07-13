const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function style() {
  return gulp
    .src("./src/assets/sass/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        autoprefixer({
          cascade: false,
        }),
      ])
    )
    .pipe(gulp.dest("./src/assets/css"))
    .pipe(browserSync.stream());
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
    .pipe(gulp.dest("./src/"))
    .pipe(browserSync.stream({ once: true }));
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
}

exports.watch = watch;
exports.build = series(htmlfileinclude, style);

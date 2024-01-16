const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();

function style() {
    return gulp
        .src("./src/assets/sass/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/assets/css"))
        .pipe(browserSync.stream());
}

function htmlfileinclude() {
    return gulp
        .src("./src/html/*.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest("./dist/"))
        .pipe(browserSync.stream());
}

function copyAssets() {
    return gulp
        .src(["./src/**/*", "!./src/**/*.html", "!./src/html", "!./src/partial"])
        .pipe(gulp.dest("./dist/"));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist/",
        },
    });

    gulp.watch("./src/html/*.html", series(htmlfileinclude, copyAssets));
    gulp.watch("./src/partial-html/*.html", series(htmlfileinclude, copyAssets));
    gulp.watch("./src/assets/sass/**/*.scss", style);

    gulp.watch("./dist/*.html").on("change", browserSync.reload);
}

exports.watch = watch;
exports.build = series(htmlfileinclude, style, copyAssets);

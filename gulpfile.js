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
        .pipe(gulp.dest("./src/assets/css"))
        .pipe(gulp.dest("./dist/assets/css"))
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
        .pipe(gulp.dest("./dist/"))
        .pipe(browserSync.stream());
}

function copyAssets() {
    return gulp
        .src(["./src/**/*", "!./src/**/*.html", "!./src/pages", "!./src/partial", "!./src/assets/sass/**"])
        .pipe(gulp.dest("./dist/"));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist/",
        },
    });

    gulp.watch("./src/pages/*.html", series(htmlfileinclude, copyAssets));
    gulp.watch("./src/partial/*.html", series(htmlfileinclude, copyAssets));
    gulp.watch("./src/assets/sass/**/*.scss", style); // Include this line to watch Sass files

    gulp.watch("./dist/*.html").on("change", browserSync.reload);
}

exports.watch = watch;
exports.build = series(htmlfileinclude, style, copyAssets);

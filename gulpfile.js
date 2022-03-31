const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const cssbeautify = require("gulp-cssbeautify");
const fileinclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

function style() {
	return gulp.src("./src/assets/sass/main.scss").pipe(sourcemaps.init()).pipe(sass().on("error", sass.logError)).pipe(sass()).pipe(sourcemaps.write(".")).pipe(cssbeautify()).pipe(gulp.dest("./src/assets/css")).pipe(browserSync.stream());
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
		.pipe(gulp.dest("./src/"))
		.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./src/",
		},
	});

	gulp.watch("./src/html/*.html", htmlfileinclude);
	gulp.watch("./src/partial-html/*.html", htmlfileinclude);
	gulp.watch("./src/assets/sass/**/*.scss", style);

	gulp.watch("./src/html/*.html").on("change", browserSync.reload);
	gulp.watch("./src/partial-html/*.html").on("change", browserSync.reload);
	gulp.watch("./src/assets/sass/**/*.scss").on("change", browserSync.reload);
}

exports.watch = watch;

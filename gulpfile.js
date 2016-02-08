const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const watch = require('gulp-watch');
const insert = require('gulp-insert');
 
const paths = {
	src : "src",
	dist : "dist",
	maps : "maps"
}
 
//map tasks to globs
const globs = {
	baseJS : paths.src+"/js/base/**/*.js",
	coreJS : [paths.src+"/js/**/*.js", "!"+paths.src + "/js/base/"],
	libsJS : paths.src+"/libsJS/**/*.js",
	index  : paths.src+"/index.html" 
}
 
gulp.task('default', ['libsJS', 'baseJS', 'coreJS', 'index'], () => {
	return;
});

//create a seperate file with only the base classes 
gulp.task('baseJS', () => {
	return gulp.src( globs.baseJS)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('base.js'))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dist));

});

//create a seperate file with only the base classes 
gulp.task('coreJS', () => {
	return gulp.src(globs.coreJS)
		.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
		.pipe(concat('core.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dist));

});

//concat libs
gulp.task("libsJS", () => { 
	return gulp.src(globs.libsJS)
		.pipe(concat("libs.js"))
		.pipe(gulp.dest(paths.dist));
});

//parse html 
gulp.task("index", () => {
	return gulp.src(globs.index)
		//insert path to jslibs
		 .pipe(replace(/%%REPLACE_JSLIBSPATH%%/g, "/"+ paths.dist))
		 //insert path to jsCore
		 .pipe(replace(/%%REPLACE_JSCOREPATH%%/g, "/"+ paths.dist))
		 .pipe(gulp.dest(paths.dist));
});

//watch all globs
gulp.task("watch", () => {
	for( var task in globs) gulp.watch(globs[task], [task]);
});
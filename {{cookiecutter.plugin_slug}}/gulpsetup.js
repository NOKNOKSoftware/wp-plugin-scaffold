

/** ----------------------------------------------------------------------------------------
 * 
 *  SETUP
 * 
 * -------------------------------------------------------------------------------------- */

/**
 * Dependencies
 */
const gulp        = require('gulp');
const sourcemaps  = require('gulp-sourcemaps');
const concat      = require('gulp-concat-util');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const tagVersion  = require('gulp-tag-version');
const git         = require('gulp-git');
const bump        = require('gulp-bump');
const filter      = require('gulp-filter');

const { parallel } = gulp;

/** 
 * Parallel watch tasks for 'watch', 'watch-js', 'watch-css'
 */ 
const watchTasksJS = [];
const watchTasksCSS = [];
const watchTasksAll = [];
 
exports.initWatchTasks = () => {
    if( watchTasksAll.length ) gulp.task( 'watch',     parallel( ...watchTasksAll ) );
    if( watchTasksJS.length )  gulp.task( 'watch-js',  parallel( ...watchTasksJS  ) );
    if( watchTasksCSS.length ) gulp.task( 'watch-css', parallel( ...watchTasksCSS ) );
}

exports.addWatchTask = ( task ) => {
    watchTasksAll.push( task );
}
 
/**
 * Series build tasks for 'watch', 'watch-js', 'watch-css'
 */ 
const buildTasksJS = [];
const buildTasksCSS = [];
const buildTasksAll = [];

exports.initBuildTasks = () => {
    if( buildTasksAll.length ) gulp.task( 'build',     parallel( ...buildTasksAll ) );
    if( buildTasksJS.length )  gulp.task( 'build-js',  parallel( ...buildTasksJS  ) );
    if( buildTasksCSS.length ) gulp.task( 'build-css', parallel( ...buildTasksCSS ) );
}


exports.addBuildTask = ( task ) => {
    buildTasksAll.push( task );
}

/**
 * Helper for creating automated Javascript Build / Watch Tasks
 */
exports.createJSBuildTask = ( { 
    name,
    src, 
    filename, 
    outputFile, 
    outputDir,
    header = '(function() {', 
    footer = '})();', 
    babelSettings = { 
        presets: [ '@babel/preset-env' ] 
    }

} ) => {

    // Task Names
    const buildTask = 'build-js:' + name;
    const watchTask = 'watch-js:' + name;

    // Create Task
    gulp.task( buildTask, () => {
        return gulp.src( src )
            .pipe( sourcemaps.init() )
            .pipe( concat( outputFile ) )
            .pipe( concat.header( header ) )
            .pipe( concat.footer( footer ) )
            .pipe( babel( babelSettings ) )
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest( outputDir ) )
    } );

    // Create Watch Task
    gulp.task( watchTask, () => gulp.watch( src, parallel( buildTask ) ) );

    // Register for Global Build / Watch
    buildTasksAll.push( buildTask );
    buildTasksJS.push( buildTask);

    watchTasksAll.push( watchTask );
    watchTasksJS.push( watchTask );
}


/**
 * Helper for creating automated Sass Build / Watch Tasks
 */
exports.createSassBuildTask = ({
    name,
    src,
    outputDir
} ) => {

    // Task Names
    const buildTask = 'build-css:' + name;
    const watchTask = 'watch-css:' + name;

    // Create Task to Build Frontend CSS
    gulp.task( buildTask, () => {
        return gulp.src( src )
            .pipe( sourcemaps.init() )
            .pipe( sass.sync().on( 'error', sass.logError ) )
            .pipe( sourcemaps.write('./') )
            .pipe( gulp.dest( outputDir ) )
    });

    // Create Watch Task
    gulp.task( watchTask, () => gulp.watch( src, parallel( buildTask ) ) );

    // Register for Global Build / Watch
    buildTasksAll.push( buildTask );
    buildTasksCSS.push( buildTask);

    watchTasksAll.push( watchTask );
    watchTasksCSS.push( watchTask );
}
 
/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 */

exports.bumpVersion = ( importance, commit, versionFiles ) => {

    // get all the files to bump version in
    var task = gulp.src( versionFiles )
        // bump the version number in those files
        .pipe( bump( { 
            type: importance,
            prefix: '',
            preid: 'alpha'
        } ) )
        // save it back to filesystem
        .pipe( gulp.dest('./') );

    if( commit ) {
        // commit the changed version number
        task = task.pipe( git.commit( 'Bumped theme version (' + importance + ')') );
    }

    // read only one file to get the version number
    task = task.pipe( filter( 'package.json' ) );

    if( commit ) {
        // **tag it in the repository**
        task = task.pipe( tagVersion({
            prefix: ''
        }) );
    }

    return task;
}
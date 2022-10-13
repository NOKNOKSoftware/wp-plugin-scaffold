const gulp       = require( 'gulp' );
const wpPot      = require( 'gulp-wp-pot' );
const bump       = require( 'gulp-bump' );
const filter     = require( 'gulp-filter' );
const shell      = require( 'gulp-shell' );
const gettext    = require( 'gulp-gettext' );
const git        = require( 'gulp-git' );
const tagVersion = require( 'gulp-tag-version' );

const { config } = require('./gulpconfig');

/** ----------------------------------------------------------------------------------------
 * 
 *  Versioning
 * 
 * -------------------------------------------------------------------------------------- */

function bumpVersion( importance, commit, versionFiles ) {

    // get all the files to bump version in
    var task = gulp.src( versionFiles )
        // bump the version number in those files
        .pipe( bump( { 
            type: importance,
            prefix: '',
            preid: 'prerelease'
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

gulp.task('prerelease',       () => bumpVersion( 'prerelease', true, config.versionFiles ) );
gulp.task('prerelease:nogit', () => bumpVersion( 'prerelease', false, config.versionFiles ) );

gulp.task('patch',            () => bumpVersion( 'patch', true, config.versionFiles ) );
gulp.task('patch:nogit',      () => bumpVersion( 'patch', false, config.versionFiles ) );
gulp.task('prepatch',         () => bumpVersion( 'prepatch', true, config.versionFiles ) );
gulp.task('prepatch:nogit',   () => bumpVersion( 'prepatch', false, config.versionFiles ) );

gulp.task('minor',            () => bumpVersion( 'minor', true, config.versionFiles ) );
gulp.task('minor:nogit',      () => bumpVersion( 'minor', false, config.versionFiles ) );
gulp.task('preminor',         () => bumpVersion( 'preminor', true, config.versionFiles ) );
gulp.task('preminor:nogit',   () => bumpVersion( 'preminor', false, config.versionFiles ) );

gulp.task('major',            () => bumpVersion( 'major', true, config.versionFiles ) );
gulp.task('major:nogit',      () => bumpVersion( 'major', false, config.versionFiles ) );
gulp.task('premajor',         () => bumpVersion( 'premajor', true, config.versionFiles ) );
gulp.task('premajor:nogit',   () => bumpVersion( 'premajor', false, config.versionFiles ) );


/** ----------------------------------------------------------------------------------------
 * 
 *  I18n (WP Pot)
 * 
 * -------------------------------------------------------------------------------------- */


 gulp.task( 'build:wp-pot', function() {
    return gulp.src( config.wpPotSrc )
        .pipe( wpPot( {
            domain: config.projectName,
            gettextFunctions: config.gettextFunctions,
            package: config.projectName
        } ) )
        .pipe(
            gulp.dest( config.languagesDest )
        )
});

/** ----------------------------------------------------------------------------------------
 * 
 *  I18n (gettext)
 * 
 * -------------------------------------------------------------------------------------- */


 gulp.task( 'build:gettext', () => {
    return gulp.src( [ 'languages/*.po' ] )
        .pipe( gettext() )
        .pipe( gulp.dest( 'languages/' ) );
} );


gulp.task( 'watch:gettext', () => gulp.watch( [ 'languages/*.po' ], gulp.parallel( 'build:gettext' ) ) );

/** ----------------------------------------------------------------------------------------
 * 
 *  Mapping package projects, bundling commands, other
 * 
 * -------------------------------------------------------------------------------------- */

 config.subPackages.forEach( name => {
    gulp.task( 'build:' + name, shell.task([
        'gulp build'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    gulp.task( 'watch:' + name, shell.task([
        'gulp watch'
    ], {
        cwd: './packages/' + name + '/'
    }) );
} )

gulp.task( 'build', gulp.parallel( [
    'build:wp-pot', 
    'build:gettext', 
    ...config.subPackages.map( name => 'build:' + name ) 
] ) );

gulp.task( 'watch', gulp.parallel( [
    'watch:gettext', 
    ...config.subPackages.map( name => 'watch:' + name ) 
] ) );
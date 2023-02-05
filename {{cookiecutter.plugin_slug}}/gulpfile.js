const gulp                  = require( 'gulp' );
const tagVersion            = require( 'gulp-tag-version' );
const git                   = require( 'gulp-git' );
const bump                  = require( 'gulp-bump' );
const filter                = require( 'gulp-filter' );
const shell                 = require( 'gulp-shell' );
const fetch                 = require( 'node-fetch' );
const AdmZip                = require( 'adm-zip' );
const fs                    = require( 'fs' );

const { task, parallel }    = gulp;
const { glob }              = require( 'glob' );

// Load Typescript & SCSS bundles


/** ----------------------------------------------------------------------------------------
 * 
 *  External Build & Watch Packages
 * 
 * -------------------------------------------------------------------------------------- */

const bundles               = JSON.parse( fs.readFileSync( 'gulpfile.bundles.json' ) );

// Map in external build / watch js
bundles.packages.forEach( name => {
    
    // Build task
    task( 'build:script:' + name, shell.task([
        'gulp build'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Watch task
    task( 'watch:script:' + name, shell.task([
        'gulp watch'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Install task
    task( 'install:script:' + name, shell.task([
        'npm install'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Update task
    task( 'update:script:' + name, shell.task([
        'npm update'
    ], {
        cwd: './packages/' + name + '/'
    }) );

} );

// Map in external build / watch css
bundles.scss.forEach( name => {
    
    // Build task
    task( 'build:scss:' + name, shell.task([
        'gulp build'
    ], {
        cwd: './assets/scss/' + name + '/'
    }) );

    // Watch task
    task( 'watch:scss:' + name, shell.task([
        'gulp watch'
    ], {
        cwd: './assets/scss/' + name + '/'
    }) );

    // Install task
    task( 'install:scss:' + name, shell.task([
        'npm install'
    ], {
        cwd: './assets/scss/' + name + '/'
    }) );

    // Update task
    task( 'update:scss:' + name, shell.task([
        'npm update'
    ], {
        cwd: './assets/scss/' + name + '/'
    }) );

} );


/** ----------------------------------------------------------------------------------------
 * 
 *  Versioning
 * 
 * -------------------------------------------------------------------------------------- */

const VERSION_FILES = [
    'version.php',
    'package.json',
    'package-lock.json',
    'style.css'
];


function bumpVersion( importance, commit, versionFiles ) {

    // get all the files to bump version in
    var task = gulp.src( versionFiles )
        // bump the version number in those files
        .pipe( bump( { 
            type: importance,
            prefix: '',
            preid: 'pre'
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


task( 'prerelease',       () => bumpVersion( 'prerelease', true, VERSION_FILES ) );
task( 'prerelease:nogit', () => bumpVersion( 'prerelease', false, VERSION_FILES ) );

task( 'patch',            () => bumpVersion( 'patch', true, VERSION_FILES ) );
task( 'patch:nogit',      () => bumpVersion( 'patch', false, VERSION_FILES ) );
task( 'prepatch',         () => bumpVersion( 'prepatch', true, VERSION_FILES ) );
task( 'prepatch:nogit',   () => bumpVersion( 'prepatch', false, VERSION_FILES ) );

task( 'minor',            () => bumpVersion( 'minor', true, VERSION_FILES ) );
task( 'minor:nogit',      () => bumpVersion( 'minor', false, VERSION_FILES ) );
task( 'preminor',         () => bumpVersion( 'preminor', true, VERSION_FILES ) );
task( 'preminor:nogit',   () => bumpVersion( 'preminor', false, VERSION_FILES ) );

task( 'major',            () => bumpVersion( 'major', true, VERSION_FILES ) );
task( 'major:nogit',      () => bumpVersion( 'major', false, VERSION_FILES ) );
task( 'premajor',         () => bumpVersion( 'premajor', true, VERSION_FILES ) );
task( 'premajor:nogit',   () => bumpVersion( 'premajor', false, VERSION_FILES ) );


/** ----------------------------------------------------------------------------------------
 * 
 *  Packs current repository into zip file with only dist files
 * 
 * -------------------------------------------------------------------------------------- */


const PACK_GLOBS = [ 
    'assets/!(scss)/**',
    'src/',
    'vendor/',
    '*.php',
    'style.css',
    'screenshot.png'
].concat( 
    ...bundles.packages.map( project => {
        return 'packages/' + project + '/+(dist|src)'
    } ) 
.concat( 
    ...bundles.scss.map( project => {
        return 'assets/scss/' + project + '/+(dist|src)'
    } ) 
));

gulp.task( 'pack', ( cb ) => {

    // Create zip instance
    var zip = new AdmZip();
    zip.addFile()
    
    for( var i in PACK_GLOBS ) {
        var globPattern = PACK_GLOBS[ i ];

        try {
            // Match glob files
            var files = glob.sync( globPattern ); 

            // Add files to zip
            files.forEach( file => {

                if( fs.lstatSync( file ).isDirectory() ) {
                    zip.addLocalFolder( file, '{{cookiecutter.plugin_slug}}/' + file );
                    return;
                }

                zip.addLocalFile( file, '{{cookiecutter.plugin_slug}}/' );
            } );  
        }
        catch( e ) {
            cb( e );
            return;
        }
    }

    
    if( !fs.existsSync( 'dist' ) ){
        fs.mkdirSync( 'dist' );
    }

    zip.writeZip( 'dist/{{cookiecutter.plugin_slug}}.zip' );
    cb();

} );

/** ----------------------------------------------------------------------------------------
 * 
 *  Grouped tasks
 * 
 * -------------------------------------------------------------------------------------- */

gulp.task( 'build', gulp.parallel( [ 
    ...bundles.packages.map( name => 'build:script:' + name ),
    ...bundles.scss.map( name => 'build:scss:' + name ) 
] ) );

gulp.task( 'watch', gulp.parallel( [ 
    ...bundles.packages.map( name => 'watch:script:' + name ),
    ...bundles.scss.map( name => 'watch:scss:' + name ) 
] ) );

gulp.task( 'install', gulp.parallel( [ 
    ...bundles.packages.map( name => 'install:script:' + name ),
    ...bundles.scss.map( name => 'install:scss:' + name ) 
] ) );

gulp.task( 'update', gulp.parallel( [ 
    ...bundles.packages.map( name => 'update:script:' + name ),
    ...bundles.scss.map( name => 'update:scss:' + name ) 
] ) );

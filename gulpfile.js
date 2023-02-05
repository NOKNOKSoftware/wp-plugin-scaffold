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

var config = {}

try {
    config = require( './gulpfile.config' )
}
catch( e ) {}


/** ----------------------------------------------------------------------------------------
 * 
 *  Build Scripts
 * 
 * -------------------------------------------------------------------------------------- */

const PACKAGE_PROJECTS = [
    '{{cookiecutter.plugin_slug}}-scripts'
];

PACKAGE_PROJECTS.forEach( name => {
    
    // Build task
    task( 'build:' + name, shell.task([
        'gulp build'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Watch task
    task( 'watch:' + name, shell.task([
        'gulp watch'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Install task
    task( 'install:' + name, shell.task([
        'npm install'
    ], {
        cwd: './packages/' + name + '/'
    }) );

    // Update task
    task( 'update:' + name, shell.task([
        'npm update'
    ], {
        cwd: './packages/' + name + '/'
    }) );

} );


/** ----------------------------------------------------------------------------------------
 * 
 *  Build Sass Bundle
 * 
 * -------------------------------------------------------------------------------------- */

const SASS_SRC = [
    './assets/scss/*.scss',
    './assets/scss/**/*.scss',
];


function remoteBuild( url, auth ) {
    return ( cb ) => {

        if( !config.remoteBuildEnabled ) {
            console.log( 'Skipping remote scss build as remote build is not configured.' )
            cb();
            return;
        }

        var body = JSON.stringify( {
            'auth': auth
        } );

        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        
        fetch( url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json'
            },
            body
        } )
        .then( resp => resp.json() )
        .then( data => {

            if( data.success ) {
                cb();
                return;
            }

            cb( data.data.error );
        } );
    }
}

task( 'build:css', remoteBuild( config?.remoteBuildUrl, config?.remoteBuildAuth ) ); // false = all modules
task( 'watch:css', () => gulp.watch( SASS_SRC, parallel( 'build:css' ) ) );



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
        task = task.pipe( git.commit( 'Bumped plugin version (' + importance + ')') );
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
    'assets/',
    'includes/',
    'node_modules/bootstrap',
    'node_modules/swiper',
    'partials/',
    'src/',
    'templates/',
    'vendor/',
    'woocommerce/',
    '*.php',
    'style.css',
    'screenshot.png'
].concat( ...PACKAGE_PROJECTS.map( project => {
    return 'packages/' + project + '/+(dist|src)'
} ) );

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
    'build:css', 
    ...PACKAGE_PROJECTS.map( name => 'build:' + name ) 
] ) );

gulp.task( 'watch', gulp.parallel( [ 
    'watch:css',
    ...PACKAGE_PROJECTS.map( name => 'watch:' + name ) 
] ) );

gulp.task( 'install', gulp.parallel( [ 
    ...PACKAGE_PROJECTS.map( name => 'install:' + name ) 
] ) );

gulp.task( 'update', gulp.parallel( [ 
    ...PACKAGE_PROJECTS.map( name => 'update:' + name ) 
] ) );


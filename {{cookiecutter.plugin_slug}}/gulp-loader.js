const gulp          = require('gulp'),
      wpPot         = require('gulp-wp-pot'),
      bump          = require('gulp-bump'),
      sass          = require('gulp-sass')(require('sass'))
      gettext       = require('gulp-gettext')
      sourcemaps    = require('gulp-sourcemaps')
      concat        = require('gulp-concat-util')
      babel         = require('gulp-babel')


exports.taskloader = ({
    pluginName = 'plugin',
    textDomain = 'plugin',
}) => {

    const buildTasksAll = [];
    const watchTasksAll = [];

    function setup( setupCallback ) {
        setupCallback( _this() );
        
        if( watchTasksAll.length ) gulp.task( 'watch', gulp.parallel( ...watchTasksAll ) );
        if( buildTasksAll.length ) gulp.task( 'build', gulp.series( ...buildTasksAll ) );
    }

    function buildTask( taskName, taskCallback ) {
        gulp.task( 'build:' + taskName, taskCallback );
        buildTasksAll.push( 'build:' + taskName );
        return _this();
    }

    function watchTask( taskName, taskCallback ) {
        gulp.task( 'watch:' + taskName, taskCallback );
        watchTasksAll.push( 'watch:' + taskName );
        return _this();
    }

    function addWpPot( {
        taskName = 'wp-pot',
        src = [ 'src/**/*.php', 'templates/**/*.php', pluginName + '-plugin.php' ],
        dest = 'languages/' + pluginName + '.pot',
        domain = textDomain,
        gettextFunctions = []
    } = {} ) {

        buildTask( taskName, function() {
            return gulp.src( src )
                .pipe( wpPot( { domain, gettextFunctions } ) )
                .pipe( gulp.dest( dest ) )
        } )

        watchTask( taskName, () => {
            return gulp.watch( src, gulp.parallel( 'build:' + taskName ) )
        } )

        return _this();
    }

    function addGettext({
        src = 'languages/*.po',
        dest = 'languages/',
        taskName = 'gettext'
    } = {}) {

        buildTask( taskName, () => {
            return gulp.src( src )
                .pipe( gettext() )
                .pipe( gulp.dest( dest ) )
        } )

        watchTask( taskName, () => {
            return gulp.watch( src, gulp.parallel( 'build:' + taskName ) )
        } )
        
        return _this();
    }

    function addBabelJSProject( {
        taskName,
        src,
        outputFile,
        outputDir,
        header = '(function($) {',
        footer = '})();', 
        babelConfig = { 
            presets: [ '@babel/preset-env' ] 
        }
    } ) {

        buildTask( taskName, () => {
            return gulp.src( src )
                .pipe( sourcemaps.init() )
                .pipe( concat( outputFile ) )
                .pipe( concat.header( header ) )
                .pipe( concat.footer( footer ) )
                .pipe( babel( babelConfig ) )
                .pipe( sourcemaps.write('.') )
                .pipe( gulp.dest( outputDir ) )
        } )

        watchTask( taskName, () => {
            return gulp.watch( src, gulp.parallel( 'build:' + taskName ) )
        } )

        return _this();
    }

    function addSassProject( {
        taskName,
        src,
        outputDir
    } ) {

        buildTask( taskName, () => {
            return gulp.src( src )
                .pipe( sourcemaps.init() )
                .pipe( sass().on( 'error', sass.logError ) )
                .pipe( sourcemaps.write( './' ) )
                .pipe( gulp.dest( outputDir ) )
        } )

        watchTask( taskName, () => {
            return gulp.watch( src, gulp.parallel( 'build:' + taskName ) )
        } )

        return _this();
    }


    function addBumpVersion( {
        versionFiles = [
            'version.php',
            'package.json',
            'package-lock.json',
            'composer.json',
            pluginName + '-plugin.php'
        ]
    } = {} ) {

        gulp.task('prerelease',       () => bumpVersion( 'prerelease', true, versionFiles ) );
        gulp.task('prerelease:nogit', () => bumpVersion( 'prerelease', false, versionFiles ) );
        
        gulp.task('patch',            () => bumpVersion( 'patch', true, versionFiles ) );
        gulp.task('patch:nogit',      () => bumpVersion( 'patch', false, versionFiles ) );
        gulp.task('prepatch',         () => bumpVersion( 'prepatch', true, versionFiles ) );
        gulp.task('prepatch:nogit',   () => bumpVersion( 'prepatch', false, versionFiles ) );
        
        gulp.task('minor',            () => bumpVersion( 'minor', true, versionFiles ) );
        gulp.task('minor:nogit',      () => bumpVersion( 'minor', false, versionFiles ) );
        gulp.task('preminor',         () => bumpVersion( 'preminor', true, versionFiles ) );
        gulp.task('preminor:nogit',   () => bumpVersion( 'preminor', false, versionFiles ) );
        
        gulp.task('major',            () => bumpVersion( 'major', true, versionFiles ) );
        gulp.task('major:nogit',      () => bumpVersion( 'major', false, versionFiles ) );
        gulp.task('premajor',         () => bumpVersion( 'premajor', true, versionFiles ) );
        gulp.task('premajor:nogit',   () => bumpVersion( 'premajor', false, versionFiles ) );

        return _this();
    }

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

    function _this() {
        return { setup, buildTask, watchTask, addBumpVersion, addWpPot, addGettext, addBabelJSProject, addSassProject };
    }

    return _this();
}
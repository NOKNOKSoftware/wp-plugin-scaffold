const {
    createJSBuildTask,
    createSassBuildTask,
    initWatchTasks,
    initBuildTasks,
    bumpVersion,
    addBuildTask,
    addWatchTask
} = require( './gulpsetup.js' );

var wpPot       = require('gulp-wp-pot');
var gettext     = require('gulp-gettext');

const gulp = require('gulp');

/** ----------------------------------------------------------------------------------------
 * 
 *  JAVASCRIPT
 * 
 * -------------------------------------------------------------------------------------- */

// Output Directory for Combined JS
const JS_OUTPUT_DIR = './assets/dist/js/';

{%- for name, settings in cookiecutter.js_projects|dictsort %}

// Create Build / Watch Tasks for JS {{name}}
const JS_{{name|upper}}_SUB_TASK = '{{ name }}';
const JS_{{name|upper}}_SRC = [
    './assets/js/{{ name }}/*.js',
    './assets/js/{{ name }}/**/*.js'
];
const JS_{{name|upper}}_OUTPUT_FILE = '{{ name }}.js';

/**
 * Task Build / Watch invoked using
 * - gulp build
 * - gulp watch
 * - gulp build-js
 * - gulp watch-js
 * - gulp build-js:{{ name }}
 * - gulp watch-js:{{ name }}
 */
createJSBuildTask( { 
    name: JS_{{name|upper}}_SUB_TASK,
    src: JS_{{name|upper}}_SRC,
    outputFile: JS_{{name|upper}}_OUTPUT_FILE,
    outputDir: JS_OUTPUT_DIR
} );

{%- endfor %}

/** ----------------------------------------------------------------------------------------
 * 
 *  SASS
 * 
 * -------------------------------------------------------------------------------------- */

// Output Directory for Compiled CSS
const SASS_FRONTEND_OUTPUT_DIR = './assets/dist/css';

{%- for name, settings in cookiecutter.js_projects|dictsort %}

// Create Build / Watch Tasks for CSS {{name}}
const SASS_{{name|upper}}_SUB_TASK = '{{name}}';
const SASS_{{name|upper}}_SRC = [
    './assets/sass/{{name}}/*.scss',
    './assets/sass/{{name}}/**/*.scss'
];

/**
 * Task Build / Watch invoked using
 * - gulp build
 * - gulp watch
 * - gulp build-css
 * - gulp watch-css
 * - gulp build-css:{{ name }}
 * - gulp watch-css:{{ name }}
 */
createSassBuildTask( {
    name: SASS_{{name|upper}}_SUB_TASK,
    src: SASS_{{name|upper}}_SRC,
    outputDir: SASS_FRONTEND_OUTPUT_DIR
} );

{%- endfor %}


/** ----------------------------------------------------------------------------------------
 * 
 *  Versioning
 * 
 * -------------------------------------------------------------------------------------- */

const VERSION_FILES = [
    'version.php',
    'package.json',
    'package-lock.json',
    'composer.json',
    '{{cookiecutter.plugin_slug}}-plugin.php'
];

gulp.task('prerelease',       () => bumpVersion( 'prerelease', true, VERSION_FILES ) );
gulp.task('prerelease:nogit', () => bumpVersion( 'prerelease', false, VERSION_FILES ) );

gulp.task('patch',            () => bumpVersion( 'patch', true, VERSION_FILES ) );
gulp.task('patch:nogit',      () => bumpVersion( 'patch', false, VERSION_FILES ) );
gulp.task('prepatch',         () => bumpVersion( 'prepatch', true, VERSION_FILES ) );
gulp.task('prepatch:nogit',   () => bumpVersion( 'prepatch', false, VERSION_FILES ) );

gulp.task('minor',            () => bumpVersion( 'minor', true, VERSION_FILES ) );
gulp.task('minor:nogit',      () => bumpVersion( 'minor', false, VERSION_FILES ) );
gulp.task('preminor',         () => bumpVersion( 'preminor', true, VERSION_FILES ) );
gulp.task('preminor:nogit',   () => bumpVersion( 'preminor', false, VERSION_FILES ) );

gulp.task('major',            () => bumpVersion( 'major', true, VERSION_FILES ) );
gulp.task('major:nogit',      () => bumpVersion( 'major', false, VERSION_FILES ) );
gulp.task('premajor',         () => bumpVersion( 'premajor', true, VERSION_FILES ) );
gulp.task('premajor:nogit',   () => bumpVersion( 'premajor', false, VERSION_FILES ) );


/** ----------------------------------------------------------------------------------------
 * 
 *  Lang
 * 
 * -------------------------------------------------------------------------------------- */

// Evaluates PHP source code and generates a "languages/{{ cookiecutter.plugin_slug }}.pot" template file
 gulp.task( 'build:wp-pot', function() {
    return gulp.src( [ 'src/**/*.php', '{{ cookiecutter.plugin_slug }}-plugin.php' ] )
        .pipe(wpPot( {
            gettextFunctions: [
                { name: '{{ cookiecutter.function_prefix }}__' },
                { name: '{{ cookiecutter.function_prefix }}_esc_attr__' },
                { name: '{{ cookiecutter.function_prefix }}_esc_html__' },
                { name: '{{ cookiecutter.function_prefix }}_e' },
                { name: '{{ cookiecutter.function_prefix }}_esc_attr_e' },
                { name: '{{ cookiecutter.function_prefix }}_esc_html_e' },
                { name: '{{ cookiecutter.function_prefix }}__x', context: 2 },
                { name: '{{ cookiecutter.function_prefix }}_ex', context: 2 },
                { name: '{{ cookiecutter.function_prefix }}_esc_attr_x', context: 2 },
                { name: '{{ cookiecutter.function_prefix }}_esc_html_x', context: 2 },
                { name: '{{ cookiecutter.function_prefix }}_n', plural: 2, context: 4 },
                { name: '{{ cookiecutter.function_prefix }}_nx', plural: 2, context: 4 }
            ]
        } ))
        .pipe(gulp.dest('languages/{{ cookiecutter.plugin_slug }}.pot'));
} );

// Compile .po files to .mo
const PO_SRC = 'languages/*.po';

gulp.task( 'build:gettext', () => {
    return gulp.src( PO_SRC )
        .pipe( gettext() )
        .pipe( gulp.dest( 'languages/' ) )
});

gulp.task( 'watch:gettext', () => gulp.watch( PO_SRC, gulp.parallel( 'build:gettext' ) ));

// Register tasks for global build / watch tasks
addBuildTask( 'build:gettext' );
addWatchTask( 'watch:gettext' );


/** ----------------------------------------------------------------------------------------
 * 
 *  Init Tasks
 * 
 * -------------------------------------------------------------------------------------- */

 initWatchTasks();
 initBuildTasks();
const { taskloader } = require( './gulp-loader.js' );

taskloader( {
    pluginName: '{{cookiecutter.plugin_slug}}',
    textDomain: '{{cookiecutter.text_domain}}'
} ).setup( loader => {
    loader.addWpPot()
        .addGettext()
        .addBumpVersion()
        
{%- for name, settings in cookiecutter.js_projects|dictsort %}
        .addBabelJSProject({
            taskName: 'js:{{name}}',
            src: [
                './assets/js/{{ name }}/*.js',
                './assets/js/{{ name }}/**/*.js'
            ],
            outputFile: '{{ name }}.js',
            outputDir: './assets/dist/js/'
        })
{%- endfor %}

{%- for name, settings in cookiecutter.js_projects|dictsort %}
        .addSassProject({
            taskName: 'css:{{name}}',
            src: [
                './assets/sass/{{name}}/*.scss',
                './assets/sass/{{name}}/**/*.scss'
            ],
            outputDir: './assets/dist/css/'
        })
{%- endfor %}

} )



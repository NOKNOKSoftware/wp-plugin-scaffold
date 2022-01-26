# {{ cookiecutter.plugin_name }}
{{ cookiecutter.plugin_description }}

## Sass Tasks
Build or Watch sass projects with the following commands;
- gulp build
- gulp build:css
- gulp watch
- gulp watch:css
{%- for name, settings in cookiecutter.sass_projects|dictsort %}
- gulp build:css:{{name}}
- gulp watch:css:{{name}}
{%- endfor %}

## Gulp JS - Babel Compilation
Build or Watch JS projects using the @babel/preset-env preset with the following commands:
- gulp build
- gulp build:js
- gulp watch
- gulp watch:js
{%- for name, settings in cookiecutter.js_projects|dictsort %}
- gulp build:js:{{name}}
- gulp watch:js:{{name}}
{%- endfor %}


## Versioning - Gulp Bump
{{ cookiecutter.plugin_name }} uses [symantic versioning](https://semver.org/). The following commands will auto-bump version numbers amoung files and commit / tag the changes.

| Command | Example | Description |
| ------- | ------- | ----------- |
| gulp prerelease | 0.0.1-alpha.1 -> 0.0.1-pre.2 | Bump version number by a new prerelease version |
| gulp prepatch | 0.0.1 -> 0.0.2-pre.0 | Bump version number to a new patch number with prerelease version |
| gulp patch | 0.0.2-pre.4 -> 0.0.2 | Bump version number to a new patch number |
| gulp preminor | 0.0.4 -> 0.1.0-pre.0 | Bump version number to a new minor prerelease number |
| gulp minor | 0.2.4 -> 0.3.0 | Bump version number to a new minor release number |
| gulp premajor | 0.7.3 ->  1.0.0-pre.0 | Bump version number to a new major prerelease number |
| gulp major | 1.2.2 -> 2.0.0 | Bump version number to a new major release |

### Git Intergration
By default, each auto-versioning command will make the version changes to each file, commit the changes and tag the commit with the new release number. If you'd prefer to manage this yourself or you're only bumping numbers for testing purposes you can append ":nogit" to each of the commands above to omit this.


## Internationalization, Pot Files and Compiling gettext
Internationalization support is baked in to this project.

Here's an expected set of translation functions supported by this project

| Scaffolded Function | WP Function | Description |
| -------- | ----------- | ----------- |
| {{ cookiecutter.function_prefix }}__( $text ) | [__( $text, $domain )](https://developer.wordpress.org/reference/functions/__/) | Retrieve the translation of $text. |
| {{ cookiecutter.function_prefix }}_esc_attr__( $text ) | [esc_attr__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr__/) | Retrieve the translation of $text and escapes it for safe use in an attribute. |
| {{ cookiecutter.function_prefix }}_esc_html__( $text ) | [esc_html__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html__/) | Retrieve the translation of $text and escapes it for safe use in HTML output. |
| {{ cookiecutter.function_prefix }}_e( $text ) | [_e( $text, $domain )](https://developer.wordpress.org/reference/functions/_e/) | Display translated text. |
| {{ cookiecutter.function_prefix }}_esc_attr_e( $text ) | [esc_attr_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_e/) | Display translated text that has been escaped for safe use in an attribute. |
| {{ cookiecutter.function_prefix }}_esc_html_e( $text ) | [esc_html_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html_e/) | Display translated text that has been escaped for safe use in HTML output. |
| {{ cookiecutter.function_prefix }}_x( $text, $context ) | [_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_x/) | Retrieve translated string with gettext context. |
| {{ cookiecutter.function_prefix }}_ex( $text, $context ) | [_ex( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_ex/) | Display translated string with gettext context. |
| {{ cookiecutter.function_prefix }}_esc_attr_x( $text, $context ) | [esc_attr_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_x/) | Translate string with gettext context, and escapes it for safe use in an attribute. |
| {{ cookiecutter.function_prefix }}_esc_html_x( $text, $context ) | [esc_html_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_html_x/) | Translate string with gettext context, and escapes it for safe use in HTML output. |
| {{ cookiecutter.function_prefix }}_n( $single, $plural, $number ) | [_n( $single, $plural, $number, $domain )](https://developer.wordpress.org/reference/functions/_n/) | Translates and retrieves the singular or plural form based on the supplied number. |
| {{ cookiecutter.function_prefix }}_nx( single, plural, $number, $context ) | [_nx( $single, $plural, $number, $context, $domain )](https://developer.wordpress.org/reference/functions/_nx/) | Translates and retrieves the singular or plural form based on the supplied number, with gettext context. |


### Building your plugins POT file.
Generate the .POT file for this plugin using the following command.

| Command | Description |
| ------- | ----------- |
| gulp build:wp-pot | Scans plugin for translations and generates .POT file under languages/{{ cookiecutter.plugin_slug }}.pot |
| gulp watch:wp-pot | Watches for changes to translations in PHP files and automatically generates .POT file under languages/{{ cookiecutter.plugin_slug }}.pot |

### Compiling your translations
Use the following commands to build / watch translations (.PO file) for compilation (.MO file). These commands are also included in the global gulp build / watch commands.
| Command | Description | 
| ------- | ----------- | 
| gulp build:gettext | Compile MO files for all PO files contained in "/languages" |
| gulp watch:gettext | Watch PO files in "/languages" and compile when changes are made |
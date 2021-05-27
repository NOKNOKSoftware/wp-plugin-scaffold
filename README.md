# WP Plugin Scaffold
WordPress plugin scaffolding done the NOKNOK way.

# Prerequisites
- [cookiecutter](https://github.com/cookiecutter/cookiecutter)
- [git-scm](https://git-scm.com/downloads)
- [Node Package Manager](https://git-scm.com/downloads)
- [Composer](https://getcomposer.org/download/)

# Getting Started
WP Plugin Scaffold uses [cookiecutter](https://github.com/cookiecutter/cookiecutter) to generate plugins. 

Use the following command to get started.
``` SHELL
python -m cookiecutter https://github.com/NOKNOKSoftware/wp-plugin-scaffold
```

## Gulp Sass
Sass Compilation is made easy through the use of gulp. The following gulp commands have been added to help build and watch sass files for live compilation.
- gulp build
- gulp build-css
- gulp build-css:<project_name>
- gulp watch
- gulp watch-css
- gulp watch-css:<project_name>

The following JSON file is used to generate a blank source project, gulp tasks and WordPress loader for each project. 

``` JSON
    "sass_projects": {
        "frontend": {
            "hooks": [ "wp_enqueue_scripts" ],
            "depends": []
        },
        "backend": {
            "hooks": [ "admin_enqueue_scripts" ],
            "depends": []
        }
    },
```
A breakdown of each arg is as follows.

| Param | Description |
| ----- | ----------- |
| Hooks | Defines on which WordPress hooks this projects css file should be enqueued |
| Depends | Defines an array of dependencies that will be passed to the deps argument for [wp_enqueue_style](https://developer.wordpress.org/reference/functions/wp_enqueue_style/) |

### Sass Paths
| Name | Path | Notes | 
| ---- | ---- | ----------- |
| Source Path | assets/sass/{project_name}/ | Sass source location for build commands. Making any changes here while a watch command is active will trigger build this projects css file |
| Output File | assets/dist/css/{project_name}.css | Output file produced from watch / build commands |


## Gulp JS - Babel Compilation
Similarily to the Sass implementation above. JS building is also made easy through the use of gulp and babel. We use the @babel/preset-env preset to allow you to write structured multi-file JavaScript projects in the latest JavaScript version without worrying too much about browser compatability or polyfils. All project files are combined and compiled down to a minimum required version of JavaScript ES5.

The following gulp commands have been added to help build and watch your JS project files for live compilation.
- gulp build
- gulp build-js
- gulp build-js:<project_name>
- gulp watch
- gulp watch-js
- gulp watch-js:<project_name>

The following JSON file is used to generate a blank source project, gulp tasks and WordPress loader for each project. 

``` JSON
    "js_projects": {
        "frontend": {
            "hooks": [ "wp_enqueue_scripts" ],
            "depends": [ "jquery" ],
            "footer": true
        },
        "backend": {
            "hooks": [ "admin_enqueue_scripts" ],
            "depends": [ "jquery" ],
            "footer": true
        }
    }
```
A breakdown of each arg is as follows.

| Param | Description |
| ----- | ----------- |
| Hooks | Defines on which WordPress hooks this projects compiled js file should be enqueued |
| Depends | Defines an array of dependencies that will be passed to the deps argument for [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/) |
| Footer | Whether this script should be enqueued in the footer (true) or header (false). Passed to [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/) |


### JS Paths
| Name | Path | Notes | 
| ---- | ---- | ----------- |
| Source Path | assets/js/{project_name}/ | JS source location for build commands. Making any changes here while a watch command is active will trigger build this projects js file |
| Output File | assets/dist/js/{project_name}.js | Output file produced from watch / build commands |

## Auto Symantic Versioning
WP Plugin Scaffold uses [symantic versioning](https://semver.org/). For this reason, we can use [gulp bump](https://www.npmjs.com/package/gulp-bump) to automatically bump version numbers amoung our files.

The list of files affected by this bump can be found in your gulpfile.js
``` JavaScript

/** ----------------------------------------------------------------------------------------
 * 
 *  Versioning
 * 
 * ---------------------------

const VERSION_FILES = [
    'version.php',
    'package.json',
    'package-lock.json',
    'composer.json',
    '{{cookiecutter.plugin_slug}}-plugin.php'
];

```

Gulp Bump will look for version numbers in these files and automatically increment them based on the command used. A breakdown of available bump commands in chronological order are as follows.

| Command | Example | Description |
| ------- | ------- | ----------- |
| gulp prerelease | 0.0.1-alpha.1 -> 0.0.1-alpha.2 | Bump version number by a new prerelease version |
| gulp prepatch | 0.0.1 -> 0.0.2-alpha.0 | Bump version number to a new patch number with prerelease version |
| gulp patch | 0.0.2-alpha.4 -> 0.0.2 | Bump version number to a new patch number |
| gulp preminor | 0.0.4 -> 0.1.0-alpha.0 | Bump version number to a new minor prerelease number |
| gulp minor | 0.2.4 -> 0.3.0 | Bump version number to a new minor release number |
| gulp premajor | 0.7.3 ->  1.0.0-alpha.0 | Bump version number to a new major prerelease number |
| gulp major | 1.2.2 -> 2.0.0 | Bump version number to a new major release |
 
 ## Git Intergration
By default, each auto-versioning command will make the version changes to each file, commit the changes and tag the commit with the new release number. If you'd prefer to manage this yourself or you're only bumping numbers for testing purposes you can append ":nogit" to each of the commands above to omit this.

## Internationalization, Pot Files and Compiling gettext
Internationalization support is baked into each project. Each project will have it's own set of shorthand translation functions that wrap WordPress' own offical translation functions in your text domain.

Here's an expected set of translation functions (Replace "ps" with your projects function prefix)

| Scaffolded Function | WP Function | Description |
| -------- | ----------- | ----------- |
| ps__( $text ) | [__( $text, $domain )](https://developer.wordpress.org/reference/functions/__/) | Retrieve the translation of $text. |
| ps_esc_attr__( $text ) | [esc_attr__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr__/) | Retrieve the translation of $text and escapes it for safe use in an attribute. |
| ps_esc_html__( $text ) | [esc_html__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html__/) | Retrieve the translation of $text and escapes it for safe use in HTML output. |
| ps_e( $text ) | [_e( $text, $domain )](https://developer.wordpress.org/reference/functions/_e/) | Display translated text. |
| ps_esc_attr_e( $text ) | [esc_attr_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_e/) | Display translated text that has been escaped for safe use in an attribute. |
| ps_esc_html_e( $text ) | [esc_html_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html_e/) | Display translated text that has been escaped for safe use in HTML output. |
| ps_x( $text, $context ) | [_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_x/) | Retrieve translated string with gettext context. |
| ps_ex( $text, $context ) | [_ex( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_ex/) | Display translated string with gettext context. |
| ps_esc_attr_x( $text, $context ) | [esc_attr_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_x/) | Translate string with gettext context, and escapes it for safe use in an attribute. |
| ps_esc_html_x( $text, $context ) | [esc_html_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_html_x/) | Translate string with gettext context, and escapes it for safe use in HTML output. |
| ps_n( $single, $plural, $number ) | [_n( $single, $plural, $number, $domain )](https://developer.wordpress.org/reference/functions/_n/) | Translates and retrieves the singular or plural form based on the supplied number. |
| ps_nx( single, plural, $number, $context ) | [_nx( $single, $plural, $number, $context, $domain )](https://developer.wordpress.org/reference/functions/_nx/) | Translates and retrieves the singular or plural form based on the supplied number, with gettext context. |

### Building your plugins POT file.
A pot file is template for your plugins translations. By using the functions detailed above you can automatically generate your plugins pot file with the following gulp command.
| Command | Description |
| ------- | ----------- |
| gulp build:wp-pot | Scans plugin for translations and generates .POT file under languages/[plugin-name].pot |

### Compiling your translations
Use the following commands to build / watch your translation file (.PO file) for compilation (.MO file). These commands are also included in the global gulp build / watch commands.
| Command | Description | 
| ------- | ----------- | 
| gulp build:gettext | Compile MO files for all PO files contained in "/languages" |
| gulp watch:gettext | Watch PO files in "/languages" and compile when changes are made |

## Addressing Dependency Conflicts with PHP Scoper
Dependency Management with WordPress is a nightmare. While we could discuss why, Yoast SEO present an [incredibly good article](https://developer.yoast.com/blog/safely-using-php-dependencies-in-the-wordpress-ecosystem/) detailing the problem already. While our solution differs slightly from Yoast's (that being that Yoast prefer to prefix just their dependencies and we prefer to scope the entire project) both solutions offer an "okay-ish" method of addressing this problem. Our solution is a more hands off approach. We let you add / remove dependencies and generally use composer however you want in a development environment where conflicts aren't really to be expected. Then when you push a new version of your plugin after using the gulp versioning commands above, your plugin's github workflow file will take on the responsibility of building out all your plugin assets, scoping the entire project under your defined prefix, and removing dev dependencies from composer and node. It will then package your now built plugin into a tidy zip file and tag it under a new github release automatically.

### Setting Prefixer Namespace Prefix
It's recommended you use a prefixer namespace unique to your plugin. This is to prevent a dependency conflict between plugins that share the same prefix.
``` JSON
    "use_prefixer": 1,
    "prefixer_namespace": "MyUniquePluginNamespace",
```

### Disabiling PHP-Scoper
You can remove PHP-Scoper from your plugin's build process during setup by specifying "0" in your cookiecutter.json
``` JSON
    "use_prefixer": 0,
    "prefixer_namespace": "",
```

### Addressing bugs caused by scoper process
Occasionally some dependencies will reference classnames by statically coded strings which can't be interperated correctly by PHP Scoper. This often causes problems with PHP code refering to classes that don't exist. Often you can resolve this by adding a [custom patcher](https://github.com/humbug/php-scoper#patchers) to your scoper.inc.php file.

If you're having issues with PHP Scoper prefixing global functions provided by other plugins, you can look at your existing scoper.inc.php file for examples on how to add external plugin stubs to PHP Scoper.




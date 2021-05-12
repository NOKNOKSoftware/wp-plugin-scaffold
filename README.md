# WP Plugin Scaffold
WordPress plugin scaffolding done the NOKNOK way.

# Prerequisites
- [cookiecutter](https://github.com/cookiecutter/cookiecutter)
- [git-scm](https://git-scm.com/downloads)
- [Node Package Manager](https://git-scm.com/downloads)
- [Composer](https://getcomposer.org/download/)

# Getting Started
WP Plugin Scaffold uses [cookiecutter](https://github.com/cookiecutter/cookiecutter) to generate themes. 

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




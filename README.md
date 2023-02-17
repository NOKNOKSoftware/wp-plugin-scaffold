# WP Plugin Scaffold
WordPress plugin scaffolding done the NOKNOK way.

- [WP Plugin Scaffold](#wp-plugin-scaffold)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Cookiecutter args breakdown](#cookiecutter-args-breakdown)
  - [Plugin stylesheet projects - SCSS bundling](#plugin-stylesheet-projects---scss-bundling)
    - [Adding a new SCSS project](#adding-a-new-scss-project)
    - [Removing a SCSS project](#removing-a-scss-project)
  - [Typescript bundles](#typescript-bundles)
    - [Adding a new typescript project](#adding-a-new-typescript-project)
    - [Removing a typescript project](#removing-a-typescript-project)
  - [Symantic versioning \& bump commands](#symantic-versioning--bump-commands)
  - [Git Intergration](#git-intergration)
    - [Plugin bundling workflow](#plugin-bundling-workflow)
  - [Internationalization, Pot Files and Compiling gettext](#internationalization-pot-files-and-compiling-gettext)
    - [Building your plugins POT file.](#building-your-plugins-pot-file)
    - [Compiling your translations](#compiling-your-translations)
  - [Avoiding dependency conflicts with other plugins by using Mozart](#avoiding-dependency-conflicts-with-other-plugins-by-using-mozart)


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

## Cookiecutter args breakdown
- ```plugin_name```: The name of your plugin in plain text
- ```plugin_slug```: The slug for your plugin ```in-snake-case```
- ```plugin_description```: Plain text description of what your plugin does.
- ```plugin_namespace```: ```ACamelCase``` default namespace for you PHP classes
- ```author_name```: The authors name
- ```author_uri```: The authors website url
- ```text_domain```: The default text domain for your plugin
- ```constants_prefix```: A prefix used for any automatically generated constants e.g ```MY_PLUGIN_VERSION```
- ```function_prefix``` A prefix used for any automatically generated functions e.g ```mp__( 'Some text' )```
- ```github_plugin_url``` The URL for your plugins repository. Also adds direct support for the [Github Updater Plugin](prefixer_namespace)
- ```frontend_scripts_jsx_scheme``` Chooses the JSX scheme for the frontend scripts project. If you don't plan to use React / JSX you can just specify none (0) or if you want to use wordpress' built in react for gutenberg specify wp-element (4). For more information see Typescript bundling below.
- ```frontend_scripts_jsx_scheme``` Chooses the JSX scheme for the wp-admin scripts project. If you don't plan to use React / JSX you can just specify none (0) or if you want to use wordpress' built in react for gutenberg specify wp-element (4). For more information see Typescript bundling below.

## Plugin stylesheet projects - SCSS bundling
For custom / plugin styles. Two scss projects have been configured by default. For documentation on the scss bundler used see the [scss-web-bundler-scaffold](https://github.com/NOKNOKSoftware/scss-web-bundler-scaffold) repo.

These two scss projects are setup in the following directories.
- For global frontend styles: assets/scss/your-plugin-name
- For global wp-admin styles: assets/scss/your-plugin-name-admin

To run automated builds when scss source files change run:
- ```gulp watch```
  
To invoke a one time build of these scss projects run:
- ```gulp build```

### Adding a new SCSS project
To add a new SCSS project, run the setup commands for [scss-web-bundler-scaffold](https://github.com/NOKNOKSoftware/scss-web-bundler-scaffold) under assets/scss. Then register the new stylesheet project under ```gulpfile.bundles.json```

``` JSON
{
    "packages": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold"
    ],
    "scss": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold",
        "wp-custom-styles" // Added new
    ]
}
```

Finally make sure you enqueue your new stylesheet as nessasary within your plugin using [wp_enqueue_style](https://developer.wordpress.org/reference/functions/wp_enqueue_style/).

### Removing a SCSS project
To remove a unused SCSS project, delete the project directory and comment out or delete the project name from ```gulpfile.bundles.json```. Finally make sure you remove any ```wp_enqueue_style``` calls to the projects dist/*.css file.

``` JSON
{
    "packages": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold"
    ],
    "scss": [
        "wp-plugin-scaffold-admin",
        // "wp-plugin-scaffold", <---- removed
    ]
}
```


## Typescript bundles
Similarily to the scss implementation above. For custom plugin scripts, this project is preconfigured with two typescript projects aswell. For documentation on the typescript bundler used see the [typescript-web-bundler-scaffold](https://github.com/NOKNOKSoftware/typescript-web-bundler-scaffold) repo. 


These two scss projects are setup in the following directories.
- For global frontend scripts: packages/your-plugin-name
- For global wp-admin scripts: packages/scss/your-plugin-name-admin

To run automated builds when typescript source files change run:
- ```gulp watch```
  
To invoke a one time build of these typescript projects run:
- ```gulp build```

### Adding a new typescript project
To add a new typescript project, run the setup commands for [typescript-web-bundler-scaffold](https://github.com/NOKNOKSoftware/typescript-web-bundler-scaffold) under packages/. Then register the new typescript project under ```gulpfile.bundles.json```

``` JSON
{
    "packages": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold",
        "wp-custom-scripts" // Added new
    ],
    "scss": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold",
    ]
}
```

Finally make sure you enqueue your new script as nessasary within your plugin using [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).

### Removing a typescript project
To remove a unused typescript project, delete the project directory and comment out or delete the project name from ```gulpfile.bundles.json```. Finally make sure you remove any ```wp_enqueue_script``` calls to the projects dist/*.js file.

``` JSON
{
    "packages": [
        // "wp-plugin-scaffold-admin", <---- removed
        "wp-plugin-scaffold"
    ],
    "scss": [
        "wp-plugin-scaffold-admin",
        "wp-plugin-scaffold"
    ]
}
```



## Symantic versioning & bump commands
Each scaffolded plugin uses [symantic versioning](https://semver.org/). this allows us to use[gulp bump](https://www.npmjs.com/package/gulp-bump) to automatically bump version numbers amoung our files.

The list of default files affected by this bump can be found in your ```gulpfile.js```
``` JavaScript

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

```

Gulp Bump will look for version numbers in these files and automatically increment them based on the command used. A breakdown of available bump commands in chronological order are as follows.

| Command | Example | Description |
| ------- | ------- | ----------- |
| gulp prerelease | 0.0.1-pre.1 -> 0.0.1-pre.2 | Bump version number by a new prerelease version |
| gulp prepatch | 0.0.1 -> 0.0.2-pre.0 | Bump version number to a new patch number with prerelease version |
| gulp patch | 0.0.2-pre.4 -> 0.0.2 | Bump version number to a new patch number |
| gulp preminor | 0.0.4 -> 0.1.0-pre.0 | Bump version number to a new minor prerelease number |
| gulp minor | 0.2.4 -> 0.3.0 | Bump version number to a new minor release number |
| gulp premajor | 0.7.3 ->  1.0.0-pre.0 | Bump version number to a new major prerelease number |
| gulp major | 1.2.2 -> 2.0.0 | Bump version number to a new major release |
 
## Git Intergration
By default, each auto-versioning command will make the version changes to each file, commit the changes and tag the commit with the new release number. If you'd prefer to manage this yourself or you're only bumping numbers for testing purposes you can append ":nogit" to each of the commands above to omit this.

### Plugin bundling workflow
If you're using GitHub to host your project. A workflow has already been added when a new version tag is committed to build, bundle and create a new release on your plugins github page. 

After using one of the gulp versioning commands above. You can start this workflow by pushing to origin with the new tag created by the workflow.
``` shell
git push origin master --tags 
```

You can modify this workflow under ```.github/workflows/main.yml```

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

## Avoiding dependency conflicts with other plugins by using Mozart
Dependency Management with WordPress is a nightmare. The following [article by yoast seo](https://developer.yoast.com/blog/safely-using-php-dependencies-in-the-wordpress-ecosystem/) goes into incredible detail about some of the issues the WordPress ecosystem has with plugins that use package managers.

To resolve these problems we use [mozart](https://github.com/coenjacobs/mozart) to automatically prefix all dependencies on installation. So don't be alarmed if imported namespaces seem a little off. For more information and configuration options for mozart see the link above.
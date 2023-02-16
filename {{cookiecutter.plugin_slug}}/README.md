
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
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}"
    ],
    "scss": [
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}",
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
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}"
    ],
    "scss": [
        "{{cookiecutter.plugin_slug}}-admin",
        // "{{cookiecutter.plugin_slug}}", <---- removed
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
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}",
        "wp-custom-scripts" // Added new
    ],
    "scss": [
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}",
    ]
}
```

Finally make sure you enqueue your new script as nessasary within your plugin using [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).

### Removing a typescript project
To remove a unused typescript project, delete the project directory and comment out or delete the project name from ```gulpfile.bundles.json```. Finally make sure you remove any ```wp_enqueue_script``` calls to the projects dist/*.js file.

``` JSON
{
    "packages": [
        // "{{cookiecutter.plugin_slug}}-admin", <---- removed
        "{{cookiecutter.plugin_slug}}"
    ],
    "scss": [
        "{{cookiecutter.plugin_slug}}-admin",
        "{{cookiecutter.plugin_slug}}"
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
| {{cookiecutter.function_prefix}}__( $text ) | [__( $text, $domain )](https://developer.wordpress.org/reference/functions/__/) | Retrieve the translation of $text. |
| {{cookiecutter.function_prefix}}_esc_attr__( $text ) | [esc_attr__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr__/) | Retrieve the translation of $text and escapes it for safe use in an attribute. |
| {{cookiecutter.function_prefix}}_esc_html__( $text ) | [esc_html__( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html__/) | Retrieve the translation of $text and escapes it for safe use in HTML output. |
| {{cookiecutter.function_prefix}}_e( $text ) | [_e( $text, $domain )](https://developer.wordpress.org/reference/functions/_e/) | Display translated text. |
| {{cookiecutter.function_prefix}}_esc_attr_e( $text ) | [esc_attr_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_e/) | Display translated text that has been escaped for safe use in an attribute. |
| {{cookiecutter.function_prefix}}_esc_html_e( $text ) | [esc_html_e( $text, $domain )](https://developer.wordpress.org/reference/functions/esc_html_e/) | Display translated text that has been escaped for safe use in HTML output. |
| {{cookiecutter.function_prefix}}_x( $text, $context ) | [_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_x/) | Retrieve translated string with gettext context. |
| {{cookiecutter.function_prefix}}_ex( $text, $context ) | [_ex( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/_ex/) | Display translated string with gettext context. |
| {{cookiecutter.function_prefix}}_esc_attr_x( $text, $context ) | [esc_attr_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_attr_x/) | Translate string with gettext context, and escapes it for safe use in an attribute. |
| {{cookiecutter.function_prefix}}_esc_html_x( $text, $context ) | [esc_html_x( $text, $context, $domain )](https://developer.wordpress.org/reference/functions/esc_html_x/) | Translate string with gettext context, and escapes it for safe use in HTML output. |
| {{cookiecutter.function_prefix}}_n( $single, $plural, $number ) | [_n( $single, $plural, $number, $domain )](https://developer.wordpress.org/reference/functions/_n/) | Translates and retrieves the singular or plural form based on the supplied number. |
| {{cookiecutter.function_prefix}}_nx( single, plural, $number, $context ) | [_nx( $single, $plural, $number, $context, $domain )](https://developer.wordpress.org/reference/functions/_nx/) | Translates and retrieves the singular or plural form based on the supplied number, with gettext context. |

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
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
python -m cookiecutter https://github.com/NOKNOKdesign/wp-plugin-scaffold
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
| Depends | Defines an array of dependencies that will be passed to the deps argument for [wp_enqueue_style](https://developer.wordpress.org/reference/functions/wp_enqueue_style/) 

### Sass Paths
| Name | Path | Notes | 
| ---- | ---- | ----------- |
| Source Path | assets/sass/{project_name/ | Sass source location for build commands. Making any changes here while a watch command is active will trigger build this projects css file |
| Output File | assets/css/{project_name}.css | Output file produced from watch / build commands 



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
| Depends | Defines an array of dependencies that will be passed to the deps argument for [wp_enqueue_style](https://developer.wordpress.org/reference/functions/wp_enqueue_style/) 

### Gulp JS - Babel Compilation
Similarily to the Sass implementation above. JS building is also made easy through the use of gulp and babel. We use the @babel/preset-env preset to allow you to write structured multi-file JavaScript projects in the latest JavaScript version without worrying too much about browser compatability or polyfils. All project files are combined and compiled down to a minimum required version of JavaScript ES5.

The following gulp commands have been added to help build and watch your JS project files for live compilation.
- gulp build
- gulp build-js
- gulp build-js:<project_name>
- gulp watch
- gulp watch-js
- gulp watch-js:<project_name>

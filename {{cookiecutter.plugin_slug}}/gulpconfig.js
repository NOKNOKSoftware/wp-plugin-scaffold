exports.config = {
    projectName: '{{cookiecutter.plugin_name}}',
    textDomain: '{{cookiecutter.text_domain}}',
    languagesDest: 'languages/{{cookiecutter.plugin-slug}}.pot',
    subPackages: [
        // {
        //     packageId: 'example',
        // }
    ],
    versionFiles: [
        'version.php',
        '{{cookiecutter.plugin_slug}}-plugin.php',
        'package-lock.json',
        'package.json'
    ],
    wpPotSrc: [ 
        'src/*.php', 
        'templates/*.php', 
        '{{cookiecutter.plugin_slug}}-plugin.php',
    ],
    gettextFunctions: [
        { name: '{{cookiecutter.function_prefix}}__' },
        { name: '{{cookiecutter.function_prefix}}_esc_attr__' },
        { name: '{{cookiecutter.function_prefix}}_esc_html__' },
        { name: '{{cookiecutter.function_prefix}}_e' },
        { name: '{{cookiecutter.function_prefix}}_esc_attr_e' },
        { name: '{{cookiecutter.function_prefix}}_esc_html_e' },
        { name: '{{cookiecutter.function_prefix}}__x', context: 2 },
        { name: '{{cookiecutter.function_prefix}}_ex', context: 2 },
        { name: '{{cookiecutter.function_prefix}}_esc_attr_x', context: 2 },
        { name: '{{cookiecutter.function_prefix}}_esc_html_x', context: 2 },
        { name: '{{cookiecutter.function_prefix}}_n', plural: 2, context: 4 },
        { name: '{{cookiecutter.function_prefix}}_nx', plural: 2, context: 4 }
    ]
}
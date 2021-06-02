<?php
namespace {{ cookiecutter.plugin_namespace }};

if( !defined( 'ABSPATH' ) ) exit;

class PluginScripts {

    function __construct() {
        // Enqueue CSS
        {%- for name, settings in cookiecutter.sass_projects|dictsort -%}
            {%- for hook in settings.hooks %}
        add_action( "{{hook}}", [ $this, "enqueue_{{name}}_css" ] );
            {%- endfor -%}
        {%- endfor %}

        // Enqueue JS
        {%- for name, settings in cookiecutter.js_projects|dictsort -%}
            {%- for hook in settings.hooks %}
        add_action( "{{hook}}", [ $this, "enqueue_{{name}}_js" ] );
            {%- endfor -%}
        {%- endfor %}

    }

    {%- for name, settings in cookiecutter.sass_projects|dictsort %}

    function enqueue_{{name}}_css() {
        $handle = "{{cookiecutter.plugin_slug}}-{{name}}";
        wp_enqueue_style( $handle,
            {{ cookiecutter.constant_prefix }}_URL . "assets/dist/css/{{name}}.css",
            [
                {%- for depend in settings.depends|default([], true) -%}
                "{{depend}}",
                {%- endfor -%}
            ],
            {{ cookiecutter.constant_prefix }}_VERSION
        );
    }

    {%- endfor %}

    
    {%- for name, settings in cookiecutter.js_projects|dictsort %}

    function enqueue_{{name}}_js() {
        $handle = "{{cookiecutter.plugin_slug}}-{{name}}";
        wp_enqueue_script( $handle,
            {{ cookiecutter.constant_prefix }}_URL . "assets/dist/js/{{name}}.js",
            [
                {%- for depend in settings.depends|default([], true) -%}
                "{{depend}}",
                {%- endfor -%}
            ],
            {{ cookiecutter.constant_prefix }}_VERSION,
            {{ settings.footer|default( true, true ) }}
        );
    }

    {%- endfor %}

}



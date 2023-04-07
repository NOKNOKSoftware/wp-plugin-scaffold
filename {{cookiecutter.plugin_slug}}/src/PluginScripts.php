<?php
namespace {{ cookiecutter.plugin_namespace }};

if( !defined( 'ABSPATH' ) ) exit;

class PluginScripts {

    function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
    }

    function enqueue_scripts() {
        wp_register_script(
            '{{cookiecutter.plugin_slug}}',
            {{ cookiecutter.constant_prefix }}_URL . '/packages/{{cookiecutter.plugin_slug}}/dist/bundle.js',
            [],
            {{ cookiecutter.constant_prefix }}_VERSION
        );


        wp_register_style(
            '{{cookiecutter.plugin_slug}}',
            {{ cookiecutter.constant_prefix }}_URL . '/assets/scss/{{cookiecutter.plugin_slug}}/dist/{{cookiecutter.plugin_slug}}.css',
            [],
            {{ cookiecutter.constant_prefix }}_VERSION
        );


        wp_enqueue_script( '{{cookiecutter.plugin_slug}}' );
        wp_enqueue_style( '{{cookiecutter.plugin_slug}}' );
    }

    function admin_enqueue_scripts() {
        wp_register_script(
            '{{cookiecutter.plugin_slug}}-admin',
            {{ cookiecutter.constant_prefix }}_URL . '/packages/{{cookiecutter.plugin_slug}}-admin/dist/bundle.js',
            [],
            {{ cookiecutter.constant_prefix }}_VERSION
        );


        wp_register_style(
            '{{cookiecutter.plugin_slug}}-admin',
            {{ cookiecutter.constant_prefix }}_URL . '/assets/scss/{{cookiecutter.plugin_slug}}-admin/dist/{{cookiecutter.plugin_slug}}-admin.css',
            [],
            {{ cookiecutter.constant_prefix }}_VERSION
        );


        wp_enqueue_script( '{{cookiecutter.plugin_slug}}-admin' );
        wp_enqueue_style( '{{cookiecutter.plugin_slug}}-admin' );
    }

}

<?php

if( !defined( 'ABSPATH' ) ) exit;

function {{ cookiecutter.function_prefix }}__( $text ) {
    return __( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
} 

function {{ cookiecutter.function_prefix }}_esc_attr__( $text ) {
    return esc_attr__( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_esc_html__( $text ) {
    return esc_html__( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_e( $text ) {
    _e( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_esc_attr_e( $text ) {
    esc_attr_e( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_esc_html_e( $text ) {
    esc_html_e( $text, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_x( $text, $context ) {
    return _x( $text, $context, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
} 

function {{ cookiecutter.function_prefix }}_ex( $text, $context ) {
    _ex( $text, $context, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_esc_attr_x( $text, $context ) {
    return esc_attr_x( $text, $context, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_esc_html_x( $text, $context ) {
    return esc_html_x( $text, $context, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_n( $single, $plural, $number ) {
    return _n( $single, $plural, $number, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_nx( $single, $plural, $number, $context ) {
    return _nx( $single, $plural, $number, $context, {{ cookiecutter.constant_prefix }}_TEXT_DOMAIN );
}

function {{ cookiecutter.function_prefix }}_get_template_part( $path, $args, $echo = true ) {
    $template = {{ cookiecutter.function_prefix }}_locate_template( $path );
    if( !$template ) {
        throw new \Exception( "Could not locate template '$path'." );
    }

    if( !$echo ) {
        ob_start();
        include $template;
        return ob_get_clean();
    }

    include $template;
}

function {{ cookiecutter.function_prefix }}_locate_template( $path ) {
    $paths = [
        get_stylesheet_directory() . '{{ cookiecutter.plugin_slug }}/' . $path . '.php',
        get_template_directory() . '{{ cookiecutter.plugin_slug}}/' . $path . '.php',
        {{ cookiecutter.constant_prefix }}_DIR . 'templates/' . $path . '.php'
    ];

    foreach( $paths as $path ) {
        if( file_exists( $path ) ) return $path;
    }

    return false;
}




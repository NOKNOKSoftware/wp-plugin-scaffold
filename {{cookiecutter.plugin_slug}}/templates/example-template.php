<?php

/**
 * This is a template example file
 * 
 * You can call this template with 
 * - {{ cookiecutter.function_prefix }}_get_template_part( 'example-template', [ 'header' => 'Test' ] )
 * 
 * Template files can be overriden in either the parent or child theme. The following paths are searched in order
 * -   [STYLESHEET_DIR]/{{ cookiecutter.plugin_slug }}/example-template.php
 * -   [TEMPLATE_DIR]/{{ cookiecutter.plugin_slug }}/example-template.php
 * -   [PLUGIN_DIR]/templates/example-template.php
 */

if( !defined( 'ABSPATH' ) ) exit;

$args = wp_parse_args( $args, [
    'header' => ''
] );

?>
<h1><?= esc_html( args.header ) ?></h1>

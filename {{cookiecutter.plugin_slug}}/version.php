<?php 
/*
 * Gulp Bump uses JSON to recognise and bump version numbers (automatically generated) 
 * so this is a clean way of loading in auto-version numbers without too much 
 * of a performance overhead.
 */
$version_json = '
    {
        "version": "0.0.1-pre.0"
    }
';

define( '{{ cookiecutter.constant_prefix }}_VERSION', json_decode( $version_json )->version );
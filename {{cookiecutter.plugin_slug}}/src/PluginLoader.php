<?php

namespace {{ cookiecutter.plugin_namespace }};

if( !defined( 'ABSPATH' ) ) exit;


class PluginLoader {

    protected static $instance;

    function __construct() {
        
        // Enqueue Scripts
        new PluginScripts();

        // Start building your plugin here

    }

    static function init() {
        if( self::$instance ) {
            throw new \Exception( "Plugin is already initialized." );
        }

        self::$instance = new PluginLoader();
    }

    static function instance() {
        if( !self::$instance ) {
            throw new \Exception( 'Plugin is not initialized' );
        }

        return self::$instance;
    }

}
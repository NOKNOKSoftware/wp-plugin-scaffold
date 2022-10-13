<?php

declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use Isolated\Symfony\Component\Finder\Finder;

use pxlrbt\PhpScoper\PrefixRemover\IdentifierExtractor;
use pxlrbt\PhpScoper\PrefixRemover\RemovePrefixPatcher;

// Allow's IdenfifierExtractor past security checks
define( 'ABSPATH', true );

// These stubs will be scanned for global functions. These functions will not 
// be prefixed when they are used
$extractor = (new IdentifierExtractor())
    ->addStub('vendor/php-stubs/wordpress-stubs/wordpress-stubs.php')
    ->addStub('vendor/php-stubs/woocommerce-stubs/woocommerce-stubs.php')
    ->addStub('vendor/paulthewalton/acf-pro-stubs/acf-pro-stubs.php');

// Get array of function names
$identifiers = $extractor->extract();


return [
    'prefix' => '{{ cookiecutter.prefixer_namespace }}',
    'finders' => [

        // Source Files & Templates
        Finder::create()->files()
            ->in('src')
            ->in('templates'),

        // Vendor files
        Finder::create()
            ->files()
            ->ignoreVCS(true)
            ->notName('/LICENSE|.*\\.md|.*\\.dist|Makefile|composer\\.json|composer\\.lock/')
            ->exclude([
                'doc',
                'test',
                'test_old',
                'tests',
                'Tests',
                'vendor-bin',
                'bin',
                'php-stubs',
                'pxlrbt'
            ])
            ->in('vendor'),

        // Files in root directory
        Finder::create()->append([
            '{{cookiecutter.plugin_slug}}-functions.php',
            '{{cookiecutter.plugin_slug}}-plugin.php',
            'version.php',
            'composer.json'
        ]),
    ],

    'expose-global-constants' => true,
    'expose-global-classes'   => true,
    'expose-global-functions' => true,

    'expose-namespaces'       => [
        '{{cookiecutter.plugin_namespace}}'
    ],

    'patchers' => [
        ( new RemovePrefixPatcher( $identifiers ) ),

        // We've added stubs for global functions files.
        // This will keep those functions files in the global scope by removing the namespace clause
        ( function( $filepath, $prefix, $content ) use ($functions_files) {
            $relative_file = str_replace( getcwd() . DIRECTORY_SEPARATOR, '', $filepath );
            if( !in_array( $relative_file, $functions_files ) ) {
                return $content;
            }

            $content = str_replace( 'namespace ' . $prefix . ';',  '', $content );
            return $content;
        } )
    ],
];

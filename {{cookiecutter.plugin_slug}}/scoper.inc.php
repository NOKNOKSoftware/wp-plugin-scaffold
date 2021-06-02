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
$identifiers = (new IdentifierExtractor())
    ->addStub('vendor/php-stubs/wordpress-stubs/wordpress-stubs.php')
    ->addStub('vendor/php-stubs/woocommerce-stubs/woocommerce-stubs.php')
    ->addStub('vendor/paulthewalton/acf-pro-stubs/acf-pro-stubs.php')
    ->extract();

// Track our own functions files and add them as stubs
$functions_files = [
    'noknok-test-plugin-functions.php',
    'noknok-test-plugin-plugin.php'
];

foreach( $functions_files as $functions_file ) {
    $extractor->addStub( $functions_file );
}

// Get array of function names
$identifiers = $extractor->extract();


return [
    'prefix' => '{{ cookiecutter.prefixer_namespace }}',
    'finders' => [
        Finder::create()->files()
            ->in('src')
            ->in('templates'),
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
            ])
            ->in('vendor'),
        Finder::create()->append([
            '{{cookiecutter.plugin_slug}}-functions.php',
            '{{cookiecutter.plugin_slug}}-plugin.php',
            'version.php',
            'composer.json'
        ]),
    ],
    'files-whitelist' => [ ],

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
    'whitelist-global-constants' => true,
    'whitelist-global-classes' => true,
    'whitelist-global-functions' => true,
];

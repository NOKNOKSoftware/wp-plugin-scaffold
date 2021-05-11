<?php

declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use Isolated\Symfony\Component\Finder\Finder;

use pxlrbt\PhpScoper\PrefixRemover\IdentifierExtractor;
use pxlrbt\PhpScoper\PrefixRemover\RemovePrefixPatcher;

// Allow's IdenfifierExtractor past security checks
define( 'ABSPATH', true );

$identifiers = (new IdentifierExtractor())
    ->addStub('vendor/php-stubs/wordpress-stubs/wordpress-stubs.php')
    ->addStub('vendor/php-stubs/woocommerce-stubs/woocommerce-stubs.php')
    ->addStub('vendor/paulthewalton/acf-pro-stubs/acf-pro-stubs.php')
    ->addStub('{{cookiecutter.plugin_slug}}-functions.php')
    ->extract();

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
    
    'files-whitelist' => [
        '{{cookiecutter.plugin_slug}}-functions.php',
        'version.php',
    ],

    'patchers' => [
        ( new RemovePrefixPatcher( $identifiers ) ),
    ],

    'whitelist-global-constants' => true,
    'whitelist-global-classes' => true,
    'whitelist-global-functions' => true,
];

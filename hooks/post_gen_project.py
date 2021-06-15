import os
import shutil
import pathlib

workingDirectory = os.getcwd()

{% for name, settings in cookiecutter.sass_projects|dictsort %}

# Resolve Paths
path = os.path.join( workingDirectory, "assets", "sass", "{{name}}" )
file = os.path.join( path, "{{ name }}.scss" )

# Remove Directory if already exists
shutil.rmtree( path, ignore_errors=True)
pathlib.Path( path ).mkdir(parents=True)

# Create empty scss file
open( file, 'a' ).close()

{% endfor %}


{% for name, settings in cookiecutter.js_projects|dictsort %}

# Resolve Paths
path = os.path.join( workingDirectory, "assets", "js", "{{name}}" )
file = os.path.join( path, "{{ name }}.js" )

# Remove Directory if already exists
shutil.rmtree( path, ignore_errors=True)
pathlib.Path( path ).mkdir(parents=True)


# Create empty js file
open( file, 'a' ).close()

{% endfor %}

os.system( "git init" )
os.system( "npm install" )
os.system( "composer update" )
os.system( "gulp build" )
os.system( "gulp build:wp-pot" )
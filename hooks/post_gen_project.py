import os
import shutil

{% for name, settings in cookiecutter.sass_projects|dictsort %}

path = "./assets/sass/{{ name }}/"
shutil.rmtree( path, ignore_errors=True)
os.mkdir(path)

file = "./assets/sass/{{ name }}/{{ name }}.scss"
open( file, 'a' ).close()

{% endfor %}


{% for name, settings in cookiecutter.js_projects|dictsort %}

path = "./assets/js/{{ name }}/"
shutil.rmtree( path, ignore_errors=True)
os.mkdir(path)

file = "./assets/js/{{ name }}/{{ name }}.js"
open( file, 'a' ).close()

{% endfor %}

os.system( "git init" )
os.system( "npm install" )
os.system( "composer update" )
os.system( "gulp build" )
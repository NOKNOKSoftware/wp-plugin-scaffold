import subprocess
import requests

phar_download = 'https://github.com/coenjacobs/mozart/releases/download/0.7.1/mozart.phar'
r = requests.get(phar_download, allow_redirects=True)
open('mozart.phar', 'wb').write(r.content)


subprocess.run( 'npm update', shell=True, check=True )

subprocess.run( 'cd packages/ && python -m cookiecutter https://github.com/NOKNOKSoftware/typescript-web-bundler-scaffold --config-file typescript-web-bundler-scaffold.yaml --no-input', shell=True, check=True )
subprocess.run( 'cd packages/ && python -m cookiecutter https://github.com/NOKNOKSoftware/typescript-web-bundler-scaffold --config-file typescript-web-bundler-scaffold-admin.yaml --no-input', shell=True, check=True )
subprocess.run( 'rm packages/typescript-web-bundler-scaffold.yaml', shell=True, check=True )
subprocess.run( 'rm packages/typescript-web-bundler-scaffold-admin.yaml', shell=True, check=True )

subprocess.run( 'cd assets/scss/ && python -m cookiecutter https://github.com/NOKNOKSoftware/scss-web-bundler-scaffold --config-file scss-web-bundler-scaffold.yaml --no-input', shell=True, check=True )
subprocess.run( 'cd assets/scss/ && python -m cookiecutter https://github.com/NOKNOKSoftware/scss-web-bundler-scaffold --config-file scss-web-bundler-scaffold-admin.yaml --no-input', shell=True, check=True )
subprocess.run( 'rm assets/scss/scss-web-bundler-scaffold.yaml', shell=True, check=True )
subprocess.run( 'rm assets/scss/scss-web-bundler-scaffold-admin.yaml', shell=True, check=True )

subprocess.run( 'composer update', shell=True, check=True )
# subprocess.run( 'gulp build', shell=True, check=True )

if '{{cookiecutter.github_plugin_url}}' :
    plugin_url = '{{cookiecutter.github_plugin_url}}'.replace( 'https://github.com/', 'git@github.com:' )
    subprocess.run( 'git init && git remote add origin ' + plugin_url, shell=True, check=True )





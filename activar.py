#!/usr/bin/env python
# -*- coding:utf-8 -*-

from livereload import Server
from subprocess import Popen, PIPE
from os import chdir
from sys import argv
from app.app import iniciar_app


def shutdown():
    print("Chau, hasta luego!")
    quit()

if __name__ == '__main__':

    if len(argv) > 1:
        iniciar_app(argv[1])
    else:
        iniciar_app()

    from app.app import app, cfg

    r = './app/'
    chdir(r)

    h = cfg['server_host']
    p = cfg['server_port']
    l = cfg['live_port']
    url = f'http://{h}:{p}'

    pb = Popen(f'{cfg["browser"]}"{url}"',
        shell=True, stdout=PIPE, stderr=PIPE)

    app.browser = pb
    app.livereload_shutdown = shutdown

    server = Server(app.wsgi_app)

    server.setHeader('Access-Control-Allow-Origin', '*')
    server.setHeader('Access-Control-Allow-Methods', '*')

    server.watch('static/*', ignore=True)

    server.serve(root='./', liveport=l, host=h, port=p, debug=cfg['server_debug'])

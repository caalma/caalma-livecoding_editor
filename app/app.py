#!/usr/bin/env python
# -*- coding:utf-8 -*-

import yaml
from os import listdir
from os.path import splitext
from flask import ( Flask, render_template, request,
                   url_for, redirect, jsonify, send_file)
from subprocess import Popen, PIPE
from .lib import grabar


# configuración

cfg = {}
ru_codigos = None
ru_samples = None
ru_synth = None
ar_cfg_actual = None

def so_audio_volumen():
    cmd = "amixer -D pulse sget 'Master' | tail -n 1 | grep 'Right:' | awk -F'[][]' '{ print $2 }' | sed 's/%//'"
    p = Popen(cmd, shell=True, stdout=PIPE)
    return p.stdout.read().decode().strip()

def iniciar_app(ar='./basico.yml'):
    global cfg, ru_codigos, ru_samples, ru_synth, ar_cfg_actual
    if ar_cfg_actual == None:
        ar_cfg_actual = '../' + ar

    with open(ar, 'r') as f:
        cfg = yaml.safe_load(f)
        ru_codigos = '../' + cfg['carpeta']['codigos']
        ru_samples = '../' + cfg['carpeta']['samples']
        ru_synth = '../' + cfg['carpeta']['synth']
    grabar.activar(cfg)

# aplicación flash

app = Flask(__name__)
app.debug = True
app.config['TEMPLATES_AUTO_RELOAD'] = True


# enrutamientos

@app.route('/')
def editor():
    iniciar_app(ar_cfg_actual)
    return render_template('editor.html', cfg=cfg, **locals())


@app.route('/fin')
def finalizar():
    app.browser.kill()
    app.livereload_shutdown()
    return ''


@app.route('/codigos/', methods=('GET','POST'))
def codigos_lista():
    lista = []
    if request.method == 'POST':
        subruta = request.form['ruta']
        for ar in listdir(ru_codigos + subruta):
            lista.append(splitext(ar)[0])
        return '\n'.join(lista)


@app.route('/codigo/leer/', methods=('GET','POST'))
def codigo_leer():
    if request.method == 'POST':
        nomb = request.form['nombre']
        with open(f'{ru_codigos}{nomb}', 'r') as f:
            return f.read()
    return 'error'

@app.route('/codigo/grabar/', methods=('GET','POST'))
def codigo_grabar():
    if request.method == 'POST':
        nomb = request.form['nombre']
        with open(f'{ru_codigos}{nomb}', 'w') as f:
            f.write(request.form['texto'])
            return ''
    return 'error'


@app.route('/publico/', methods=('GET','POST'))
def publico_lista():
    lista = []
    if request.method == 'POST':
        subruta = request.form['ruta']
        for ar in listdir('./static/' + subruta):
            lista.append(ar)
        return jsonify(lista)


# grabacion de audio

@app.route('/grabar_audio/iniciar/', methods=('GET','POST'))
def grabar_audio_ini():
    if request.method == 'POST':
        entrada = request.form['entrada']
        etiqueta = request.form['etiqueta']
        duracion = request.form['duracion']
        resp = grabar.iniciar(entrada, etiqueta, duracion)
        return jsonify(resp)
    else:
        return jsonify({'error': True})

@app.route('/grabar_audio/finalizar/', methods=('GET','POST'))
def grabar_audio_fin():
    if request.method == 'POST':
        pid = request.form['pid']
        resp = grabar.finalizar(pid)
        return jsonify(resp)
    else:
        return jsonify({'error': True})

@app.route('/grabar_audio/actualizar/', methods=('GET','POST'))
def grabar_audio_actualizar_lista():
    resp = grabar.actualizar()
    return jsonify(resp)


@app.route('/grabar_audio/entradas/', methods=('GET','POST'))
def audio_ls_entradas():
    return jsonify(grabar.listar_entradas())


# controles del sistema operativo
@app.route('/audio/volumen/set/', methods=('GET','POST'))
def audio_volumen_set():
    if request.method == 'POST':
        volumen = request.form['volumen']
        tipo = 'Master'
        cmd = f'amixer -q -D pulse sset "{tipo}" "{volumen}"%'
        Popen(cmd, shell=True)
        return jsonify({'error': False})
    else:
        return jsonify({'error': True})

@app.route('/audio/volumen/get/', methods=('GET','POST'))
def audio_volumen_get():
    return jsonify({'value': so_audio_volumen()})


# carpetas estáticas de recursos

@app.route('/static/samples/<path:archivo>', methods=('GET', 'POST'))
def static_samples(archivo=''):
    r_doc = f'{ru_samples}{archivo}'
    if r_doc:
        return send_file(r_doc)
    else:
        return ''

@app.route('/static/synth/<path:archivo>', methods=('GET', 'POST'))
def static_synth(archivo=''):
    r_doc = f'{ru_synth}{archivo}'
    if r_doc:
        return send_file(r_doc)
    else:
        return ''

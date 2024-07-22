#!/usr/bin/env python
# -*- coding:utf-8 -*-

import yaml
import json
from os import listdir
from os.path import splitext, exists, realpath
from flask import ( Flask, render_template, request,
                   url_for, redirect, jsonify, send_file)
from subprocess import Popen, PIPE
from .lib import grabar, graficar


# configuración

cfg = {}
ru_codigos = ru_samples = ru_synth = ru_audmini = ar_cfg_actual = None

def so_audio_volumen():
    cmd = "amixer -D pulse sget 'Master' | tail -n 1 | grep 'Right:' | awk -F'[][]' '{ print $2 }' | sed 's/%//'"
    p = Popen(cmd, shell=True, stdout=PIPE)
    return p.stdout.read().decode().strip()

def iniciar_app(ar='./basico.yml'):
    global cfg, ru_codigos, ru_samples, ru_synth, ru_audmini, ar_cfg_actual
    if ar_cfg_actual == None:
        ar_cfg_actual = '../' + ar

    with open(ar, 'r') as f:
        cfg = yaml.safe_load(f)
        ru_codigos = '../' + cfg['carpeta']['codigos']
        ru_samples = '../' + cfg['carpeta']['samples']
        ru_synth = '../' + cfg['carpeta']['synth']
        ru_audmini = '../' + cfg['carpeta']['audmini']
    grabar.activar(cfg)

# aplicación flash

app = Flask(__name__)
app.debug = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

app.jinja_env.globals.update(tojson = json.dumps)

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
        formato = request.form['formato']
        canales = request.form['canales']
        resp = grabar.iniciar(entrada, etiqueta, duracion, formato, canales)
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

@app.route('/static/audmini/<path:archivo>', methods=('GET', 'POST'))
def static_audmini(archivo=''):
    r_doc = f'{ru_audmini}{archivo}'
    if r_doc:
        return send_file(r_doc)
    else:
        return ''

# listado de samples
@app.route('/samples/ls/', methods=('GET', 'POST'))
def samples_listar():
    lista = []
    if request.method == 'POST':
        subruta = request.form['ruta']
        for ar in listdir(f'{ru_samples}{subruta}'):
            lista.append(ar)
        return jsonify(lista)


# graficar audios
@app.route('/audio/graficar/<path:archivo>', methods=('GET','POST'))
def graficar_audio(archivo=''):
    try:
        graficar.setear(ruta_imagen=ru_audmini)
        r_aud = f'../{archivo}'
        resp = graficar.generar(r_aud)
        return jsonify({'error': False, 'rutas': resp})
    except:
        return jsonify({'error': True})


# explorar audioss
@app.route('/audio/explorar/', methods=('GET','POST'))
def explorar_audio():
    iniciar_app(ar_cfg_actual)
    ls = {}
    ru = '../'+cfg['carpeta']['samples']
    for ar in listdir(ru):
        ar_json = f'{ru}/{ar}/samples.json'
        if exists(ar_json):
            with open(ar_json, 'r') as f:
                ls[ar] = json.load(f)
                ls[ar]['_bAbsoluta'] = realpath(ru)
    return render_template('explorar_audio.html', cfg=cfg, **locals())


# editar : audios, textos
@app.route('/editar/audio/<path:archivo>', methods=('GET','POST'))
def editar_audio(archivo=''):
    try:
        r_aud = realpath(f'../{archivo}')
        editor = cfg['software_externo']['editor_de_audio']
        p = Popen(editor.format(archivo=r_aud), shell=True, stdout=PIPE, stderr=PIPE)
        # stdout = p.stdout.read();
        resp = graficar.generar(r_aud)
        return jsonify({'error': False, 'path': r_aud})
    except:
        return jsonify({'error': True})

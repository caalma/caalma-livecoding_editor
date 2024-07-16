#!/usr/bin/env python
# -*- coding:utf-8 -*-

from subprocess import Popen, PIPE
from os import listdir
from os.path import realpath, isdir
from sys import argv
from datetime import datetime
import json

def ejecutar(cmd, devolver_resultado=False):
    p = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE)
    r = p.stdout.read()
    if devolver_resultado:
        return r.decode('utf-8')

def ejecutar_y_esperar(cmd):
    p = Popen(cmd, shell=True)
    return p.pid

def registrar_grabacion():
    dat = { '_base': rg.replace('../', '/static/') }
    idx = None

    for gr in sorted(listdir(rgAbs)):
        ruta_grupo = f'{rgAbs}{gr}/'
        if isdir(ruta_grupo):
            for ar in sorted(listdir(ruta_grupo)):
                if not gr in dat:
                    dat[gr] = []
                dat[gr].append(f'{gr}/{ar}')

    with open(arjsong, 'w') as f:
        f.write(json.dumps(dat))

def procesar_entradas(r):
    ee = r.strip().split('\n')
    r = {}
    for e in ee:
        d = e.split('\t')
        r[d[0]] = d[1]
    return r



def iniciar(entrada='1', etiqueta= 'ne', duracion='0', formato='wav'):
    duracion = float(duracion)
    inp = entradas[entrada]
    now = datetime.now()
    ins = now.strftime("%Y-%m-%d_%H-%M-%S")
    nom = f'{etiqueta}/{ins}'
    frm = fg if not formato in formatos_permitidos else formato
    arc = f'{rgAbs}{nom}.{frm}'

    cmd_gr = f'mkdir -p "{rgAbs}{etiqueta}"'
    ejecutar(cmd_gr)

    idx = len(listdir(f'{rgAbs}{etiqueta}'))
    param_duracion = f'-t {duracion}' if duracion > 0 else ''
    cmd = f'ffmpeg -v quiet -f pulse -i "{inp}" {param_duracion} {sg} -preset slower "{arc}"'

    pid = ejecutar_y_esperar(cmd)

    autocorte = param_duracion != ''

    return {
        'nom': nom,
        'pid': pid,
        'cmd': cmd,
        'idx': idx,
        'dur': duracion,
        'autocorte': autocorte
        }


def finalizar(pid_s):
    if pid_s:
        pid = int(pid_s) + 1
        cmd = f'kill {pid}'
        ejecutar(cmd)
        registrar_grabacion()

        return {'cmd': cmd}
    return {'status': False}


def listar_entradas():
    global entradas
    entradas = procesar_entradas(ejecutar('pactl list short sources', True))
    return entradas


def actualizar():
    registrar_grabacion()
    return {'status': True}


def activar(cfg):
    global rg
    global rgAbs
    global arjsong
    global fg
    global sg
    global entradas
    global arc

    rg = cfg['grabacion']['ruta']
    rgAbs = realpath(rg) + '/'
    arjsong = cfg['grabacion']['json']
    fg = cfg['grabacion']['formato']
    sg = '-y' if cfg['grabacion']['sobreescribir'] else ''
    entradas = procesar_entradas(ejecutar('pactl list short sources', True))

sep_et = '___'
rg = ''
rgAbs = ''
arjsong = ''
formatos_permitidos = ['mp3', 'wav', 'm4a', 'flac', 'ogg']
fg = ''
sg = ''
entradas = ''
arc = ''

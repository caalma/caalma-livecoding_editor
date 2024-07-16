#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from sys import argv
from os.path import dirname, basename, splitext, realpath
from subprocess import Popen, PIPE
import matplotlib.pyplot as plt
import numpy as np
import wave

arAu = arEx = mFrec = nMues = lTiem = tSegu = nCana = None
bSena = eSena = sePos = izSen = deSen = izPos = dePos = None
ruDe = './'
ruta_conversiones_temporales = '/tmp/'
img_format = 'png'
imAlto, imAncho = 20, 5
colorIz, colorDe, colorMo =  '#ff0000', '#00ff00', '#ffff00'
compModo = 'CopyGreen'
modos_de_composicion_testeados = [
    'ColorDodge',
    'Colorize',
    'CopyBlue',
    'CopyGreen',
    'CopyRed',
    'CopyYellow',
    'Difference',
    'SoftLight',
    ]


def nombre_sin_extension():
    ar = realpath(arAu)
    ar = ar.replace(ruta_conversiones_temporales, '')
    return splitext(ar)[0].replace('/','@')

def frecuencias():
    fig, ax = plt.subplots(figsize=(imAlto, imAncho))
    ax.set_facecolor('#440053')
    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    plt.margins(0)
    plt.gca().xaxis.set_major_locator(plt.NullLocator())
    plt.gca().yaxis.set_major_locator(plt.NullLocator())
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    d = izSen if nCana == 2 else sePos
    ax.specgram(d, Fs=mFrec, vmin=-40, vmax=40)

    ar = f'{ruDe}{nombre_sin_extension()}-fre.{img_format}'
    plt.savefig(ar)
    return ar


def volumen():
    fig, ax = plt.subplots(figsize=(imAlto, imAncho))
    ax.set_facecolor('#000000')
    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    plt.margins(0)
    plt.gca().xaxis.set_major_locator(plt.NullLocator())
    plt.gca().yaxis.set_major_locator(plt.NullLocator())
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    if nCana == 2:
        ax.plot(np.linspace(0, 1, num=dePos.shape[0]), dePos, colorDe)
        ax.plot(np.linspace(0, 1, num=izPos.shape[0]), izPos, colorIz, alpha=0.4)
    else:
        ax.plot(np.linspace(0, 1, num=sePos.shape[0]), sePos, colorMo)

    ar = f'{ruDe}{nombre_sin_extension()}-vol.{img_format}'
    plt.savefig(ar)
    return ar


def componer(i1, i2, m):
    ar = f'{ruDe}{nombre_sin_extension()}-mix-{m}.{img_format}'
    cmd = f'composite -compose "{m}" "{i1}" "{i2}" "{ar}"'
    p = Popen(cmd, shell=True, stdout=PIPE)
    p.stdout.read()
    return ar

def converir_a_wav(ar):
    arW = f'{ruta_conversiones_temporales}{nombre_sin_extension()}.wav'
    cmd = f'ffmpeg -i "{ar}" -y "{arW}"'
    p = Popen(cmd, shell=True, stdout=PIPE)
    p.stdout.read()
    return arW

def setear(ruta_imagen=None, formato_imagen=None, modo_composicion=None):
    global ruDe, compModo, img_format
    if ruta_imagen: ruDe = ruta_imagen
    if formato_imagen: img_format = formato_imagen
    if modo_composicion: compModo = modo_composicion

def generar(archivoAuio):
    global arAu, arEx, ruDe, mFrec, nMues, lTiem, tSegu, nCana
    global bSena, eSena, sePos, izSen, deSen, izPos, dePos, compModo

    arAu = archivoAuio
    arEx = splitext(arAu)[-1].lower()
    if not arEx == '.wav':
        arAu = converir_a_wav(arAu)

    wo = wave.open(arAu, 'rb')

    mFrec = wo.getframerate()
    nMues = wo.getnframes()
    lTiem = np.linspace(0, nMues/mFrec, num=nMues)
    tSegu = nMues / mFrec
    nCana = wo.getnchannels()
    bSena = wo.readframes(nMues)
    eSena = np.frombuffer(bSena, dtype=np.int16)
    sePos = np.clip(eSena, a_min = 0, a_max = np.inf)

    if nCana == 2:
        izSen = eSena[0::2]
        deSen = eSena[1::2]
        izPos = np.clip(izSen, a_min = 0, a_max = np.inf)
        dePos = np.clip(deSen, a_min = 0, a_max = np.inf)

    arImVol = volumen()
    arImFre = frecuencias()
    arImCom = componer(arImVol, arImFre, compModo)

    return {
        'volu_frec': [dirname(arImCom), basename(arImCom)],
        'volu': [dirname(arImVol), basename(arImVol)],
        'frec': [dirname(arImFre), basename(arImFre)],
    }

if __name__ == '__main__':
    graficar(argv[1])

#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from os.path import splitext, basename, dirname
from os import walk, chdir
from sys import argv
import json

def generar_json(ruta, extensiones_validas=['wav', 'ogg', 'mp3', 'm4a']):
    nombre = basename(ruta.rstrip('/'))

    print(nombre)

    data = {
        '_base': f'/static/samples/{nombre}/'
    }

    chdir(ruta)
    for dir_name, _, file_list in walk('.'):
        if dir_name == '.' or dir_name.startswith('./.'):
            continue
        dir_name = dir_name[2:]
        data[dir_name] = []
        for file_name in file_list:
            ext = splitext(file_name)[1].strip('.')

            if ext in extensiones_validas:
                data[dir_name].append(f'{dir_name}/{file_name}')

    for k, v in data.items():
        if type(v) == list:
            data[k] = sorted(v)

    with open(f'samples.json', 'w') as f:
        json.dump(data, f, separators=(',', ':'))

if __name__ == '__main__':
    generar_json(argv[1])

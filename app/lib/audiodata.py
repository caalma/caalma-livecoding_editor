from pydub import AudioSegment
from os.path import dirname, basename, exists
from os import stat
from datetime import datetime

def get_data(uri):
    if not exists(uri):
        return {}

    au = AudioSegment.from_file(uri)
    ad = stat(uri)
    ff = datetime.fromtimestamp(ad.st_mtime)

    d = {
        'ruta': dirname(uri)+'/',
        'nombre': basename(uri),
        'instante': f'{ff.year}/{ff.month}/{ff.day} {ff.hour}:{ff.minute}:{ff.second}',
        'canales': au.channels,
        'segundos': au.duration_seconds,
        'muestreo': au.frame_rate
        }
    return d

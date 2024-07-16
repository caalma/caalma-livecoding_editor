# Editor para Livecoding (de Caalma)

> Editor para livecoding con audio e imagen.

+ Audio desde [Strudel](https://strudel.cc/) y Javascript.
+ Imagen desde Hydra (aún no disponible).


## Requiere

+ Python 3
+ Python: Flask, Livereload, pyyaml
+ Python: Numpy, Matplotlib (para graficación de audios)
+ Ffmpeg (para conversión de audios en graficación)
+ PulseAudio (para la utilidad de grabación)
+ GNU/Linux (para la utilidad de grabación)
+ Tipografía "Fira Code" (para el modo-offline). Puede obtenerse desde: https://fonts.google.com/selection?query=fira+code

## Características:

+ Interfaz personalizable.
+ Dispone de dos área claras: una para bloques de código y la otra para utilidades variadas.
+ El área de código está integrada por:
  + Un bloque de código Strudel.
  + Un bloque para notas.
  + Un bloque de código Javascript.
+ Cada bloque de código graba y lee desde archivos específicos almacenados dentro de la carpeta `./codigos/`.
+ El área de útiles incluye:
  + Menú general
  + Menú Strudel
  + Controles de audio del sistema operativo
  + Panel para grabaciones (que se incorporan como samples)
  + Cronómetro
  + Graficación de audios
  + Panel para carga de web externa
+ Para Strudel está disponible una versión offline. Dicha versión está modificada para que cargue los samples y los synth desde local. La versión offline es Strudel 1.1.0.


## Pendiente
+ Incluir Hydra.
+ Hacer adaptación para configuraciones de sistemas operativos diferentes de GNU/Linux.

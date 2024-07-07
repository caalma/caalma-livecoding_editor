# Editor para Livecoding (de Caalma)

> Editor para livecoding con audio e imagen.

+ Audio desde [Strudel](https://strudel.cc/) y Javascript.
+ Imagen desde Hydra (aún no disponible).


## Requiere

+ Python 3
+ Livereload

## Características:

+ Personalizable, con la edición de `seteos.yml`.
+ Menú superior:
  + Conmutar visibilidad con `Key Escape`.
  + Área de comando. Para ejecutar código javascript.
  + Botones de ejecución del Strudel-REPL.
  + Botones para conmutar características del Strudel-REPL.
  + Dimensiones de ventana.
  + Botón para apagar el server y cerrar la ventana de la web-app.
+ Comando javascript específicos:
  + `leer("nombre_del_archivo")`: Lee el código con dicho nombre y extensión `.js` ubicado en la carpeta `./codigos/`, y lo introduce en el REPL.
  + `grabar("nombre_del_archivo")`: Graba el código actual del REPL en un archivo con dicho nombre y extensión `.js` en la carpeta `./codigos/`.
  + `chau()`: Detiene el server y cierra la web app.

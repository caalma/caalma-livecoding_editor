const ControlesAudio = CA = {
    html: `<label for="audioVolumen"><span>VOLUMEN</span>
              <input id="audioVolumen" min="0" max="100" type="range">
           </label>`,
    elem: undefined,
    vol: undefined,
    activar: () => {
        CA.elem = document.getElementById('controlesAudio');
        if(! CA.elem) return true;

        CA.elem.innerHTML = CA.html;
        CA.vol = CA.elem.querySelector('#audioVolumen');

        CA.iniciar_volumen();
        CA.eventos_de_teclado();
    },
    iniciar_volumen: () => {
        ajax_post('/audio/volumen/get/', {}, r => {
            CA.vol.value = JSON.parse(r)['value'];
        });
    },
    setear_volumen: () => {
        ajax_post('/audio/volumen/set/', {'volumen': CA.vol.value}, r => {} );
    },
    eventos_de_teclado: () => {
        ['change', 'mousemove'].forEach( evento => {
            CA.vol.addEventListener(evento, CA.setear_volumen);
        });
    }
}

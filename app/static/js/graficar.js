const Graficar = GF = {
    html: `<div>
              <input type="text" value="" class="archivo" placeholder="Ruta del archivo a graficar ..." title="Ruta al archivo de audio. Relativa a la carpeta de la aplicación.">
              <select class="tipo visible-con-datos" title="Formato de imagen y datos.">
                 <option value="" name="volu+frec">Volumen+Frecuencias</option>
                 <option value="" name="volu">Volumen</option>
                 <option value="" name="frec">Frecuencias</option>
              </select>
              <div class="visor visible-con-datos">
                 <img class="imagen" src="">
                 <div class="seleccion"></div>
              </div>
              <div class="visible-con-datos">
                 <div class="d-flex">
                    <span class="valor vini"></span>
                    <input type="range" min="0" max="1" value="0" step="0.01" class="rango rini" title="Posicionar inicio de región.">
                 </div>
                 <div class="d-flex">
                    <span class="valor vfin"></span>
                    <input type="range" min="0" max="1" value="1" step="0.01" class="rango rfin" title="Posicionar final de región.">
                 </div>
              </div>
           </div>`,
    cAct: 'activo',
    key: 'F6',
    elem: undefined,
    arch: undefined,
    imag: undefined,
    tipo: undefined,
    rini: undefined,
    vini: undefined,
    rfin: undefined,
    vfin: undefined,
    sele: undefined,
    activar: () => {
        GF.elem = document.getElementById('graficarAudio');
        if(! GF.elem) return true;

        GF.elem.innerHTML = GF.html;
        GF.arch = GF.elem.querySelector('.archivo');
        GF.imag = GF.elem.querySelector('.imagen');
        GF.tipo = GF.elem.querySelector('.tipo');
        GF.rini = GF.elem.querySelector('.rini');
        GF.vini = GF.elem.querySelector('.vini');
        GF.rfin = GF.elem.querySelector('.rfin');
        GF.vfin = GF.elem.querySelector('.vfin');
        GF.sele = GF.elem.querySelector('.seleccion');


        GF.tipo.addEventListener('change', GF.mostrar_actual);
        GF.arch.addEventListener('keyup', ev => {
            if(ev.code == 'Enter'){
                GF.generar(GF.arch.value);
            }
        });

        ['change', 'mousemove'].forEach( evento => {
            GF.rini.addEventListener(evento, ev => {
                GF.posini(ev.target.value, false)
            });
            GF.rfin.addEventListener(evento, ev => {
                GF.posfin(ev.target.value, false)
            });
        });
        GF.visible();
        GF.eventos_de_teclado()
    },
    posini: (val, actualizar_deslizador=true) => {
        let pos = val * GF.imag.width;
        GF.sele.style.left = `${pos}px`;
        GF.vini.innerHTML = val;
        if(GF.rfin.value < val){
            GF.posfin(val);
            GF.rfin.value = val;
        }
        if(actualizar_deslizador){
            GF.rini.value = val;
        }
    },
    posfin: (val, actualizar_deslizador=true) => {
        let pos = GF.imag.width - (val * GF.imag.width);
        GF.sele.style.right = `${pos}px`;
        GF.vfin.innerHTML = val;
        if(GF.rini.value > val){
            GF.posini(val);
            GF.rini.value = val;
        }
        if(actualizar_deslizador){
            GF.rfin.value = val;
        }
    },
    eventos_de_teclado: () => {
        window.addEventListener('keydown', ev => {
            if(ev.code == GF.key){
                GF.visible(!GF.elem.classList.contains(GF.cAct));
                ev.preventDefault();
            }
        });
    },
    visible: (e=true) => {
        if(e){
            GF.elem.classList.add(GF.cAct);
        }else{
            GF.elem.classList.remove(GF.cAct);
        }
    },
    generar: (ar) => {
        GF.elem.classList.remove('con-datos');
        GF.arch.value = ar;
        ajax_get(`/audio/graficar/${ar}`, {}, resp => {
            GF.setear(JSON.parse(resp))
        });
    },
    setear: (dat) => {
        if(dat.error){
            GF.elem.classList.remove('con-datos');
        }else{
            GF.tipo.querySelector('[name="volu"]').value = dat.rutas.volu[1];
            GF.tipo.querySelector('[name="frec"]').value = dat.rutas.frec[1];
            GF.tipo.querySelector('[name="volu+frec"]').value = dat.rutas.volu_frec[1];
            GF.mostrar_actual();
            GF.elem.classList.add('con-datos');
            GF.posini(0);
            GF.posfin(1);
        }
    },
    mostrar_actual: () => {
        GF.imag.src = '/static/audmini/' + GF.tipo.value;
    }

}

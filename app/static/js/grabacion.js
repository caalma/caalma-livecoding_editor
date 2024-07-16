const Grabacion = GR = {
    html: `<div>
              <select class="entradas" title="Dispositivo de entrada de audio"></select>
              <input type="text" class="etiqueta" value="grA" title="Gruṕo">
              <div class="d-flex">
                 <input type="number" class="duracion" value="0" title="Duración (segundos)">
                 <select class="formato" title="Formato de archivo">
                    <option value="wav">wav</option>
                    <option value="flac">flac</option>
                    <option value="m4a">m4a</option>
                    <option value="mp3">mp3</option>
                    <option value="ogg">ogg</option>
                 </select>
              </div>
            </div>
            <nav>
              <button class="iniciar" title="Comenzar a grabar el audio">GRABAR</button>
              <button class="actualizar" title="Regenerar samples.json de las grabaciones">Re-Listar</button>
            </nav>
            <ul class="lista"></ul>`,
    cAct: 'activo',
    key: 'F5',
    elem: undefined,
    inic: undefined,
    actu: undefined,
    entr: undefined,
    etiq: undefined,
    dura: undefined,
    frmt: undefined,
    list: undefined,
    activar: () => {
        GR.elem = document.getElementById('grabacion');
        if(! GR.elem) return true;

        GR.elem.innerHTML = GR.html;
        GR.inic = GR.elem.querySelector('.iniciar');
        GR.actu = GR.elem.querySelector('.actualizar');
        GR.entr = GR.elem.querySelector('.entradas');
        GR.etiq = GR.elem.querySelector('.etiqueta');
        GR.dura = GR.elem.querySelector('.duracion');
        GR.frmt = GR.elem.querySelector('.formato');
        GR.list = GR.elem.querySelector('.lista');

        GR.inic.addEventListener('click', GR.iniciar);
        GR.actu.addEventListener('click', GR.actualizar_lista);

        GR.entradas_disponibles();
        GR.visible();
        GR.eventos_de_teclado()
    },
    entradas_disponibles: () => {
        ajax_post('/grabar_audio/entradas/', {}, resp => {
            resp = JSON.parse(resp);
            let opt = [];
            for( let k in resp) {
                opt.push(`<option value="${k}">${resp[k]}</option>`);
            }
            GR.entr.innerHTML = opt.join('');
        });
    },
    eventos_de_teclado: () => {
        window.addEventListener('keydown', ev => {
            if(ev.code == GR.key){
                GR.visible(!GR.elem.classList.contains(GR.cAct));
                ev.preventDefault();
            }
        });
    },
    visible: (e=true) => {
        if(e){
            GR.elem.classList.add(GR.cAct);
        }else{
            GR.elem.classList.remove(GR.cAct);
        }
    },
    iniciar: () => {
        let dat = {
            entrada: GR.entr.value,
            etiqueta: GR.etiq.value,
            formato: GR.frmt.value,
            duracion: GR.dura.value
        };
        ajax_post('/grabar_audio/iniciar/', dat, resp => {
            console.log(JSON.parse(resp));
            GR.agregar(JSON.parse(resp));
        });
    },
    finalizar: (pid) => {
        let dat  = {pid: pid};
        ajax_post('/grabar_audio/finalizar/', dat, resp => {
            console.log('Finalizada', JSON.parse(resp));
        });
    },
    actualizar_lista: () => {
        ajax_post('/grabar_audio/actualizar/', {}, resp => {
            console.log('Lista actualizada', JSON.parse(resp));
        });
    },
    agregar: (dat) => {
        let html = `<b>${dat.idx}</b> : <span>${dat.nom}</span><button class="fin" title="Finalizar grabación">FIN</button>`;
        let el = document.createElement('li');
        el.innerHTML = html;
        GR.list.appendChild(el);
        let btnFin = el.querySelector('.fin');
        if(dat.autocorte){
            btnFin.remove();
            setTimeout(()=>{
                el.remove();
                GR.actualizar_lista();
            },dat.dur*1000);
        }

        btnFin.addEventListener('click', ()=>{
            GR.finalizar(dat.pid);
            el.remove();
        });
    }
}

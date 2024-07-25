const Notas = NT = {
    html: `<div class="archivo">
              <input spellcheck="false" autocorrect="off" autocapitalize="off" translate="no" list="NT_ls_archivos">
              <datalist id="NT_ls_archivos"></datalist>
           </div>
           <div class="cnt">...</div>`,
    cAct: 'activo',
    key: 'F3',
    elem: undefined,
    cnt: undefined,
    cnt_attribs: {
        contenteditable: true,
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        translate: "no",
    },
    arc_cnt: undefined,
    arc_inp: undefined,
    arc_lis: undefined,
    cfg: {},
    ruta: '',
    archivo_inicial: '',
    priorizar_sesion: true,
    visible: true,
    keySesionArchivo: 'CodeNotasArchivo',

    activar: () => {
        NT.elem = document.getElementById('codeNotas');
        if(! NT.elem) return true;

        NT.elem.innerHTML = NT.html;
        NT.cnt = NT.elem.querySelector('.cnt');
        NT.arc_cnt = NT.elem.querySelector('.archivo');
        NT.arc_inp = NT.arc_cnt.querySelector('input');
        NT.arc_lis = NT.arc_cnt.querySelector('datalist');

        NT.ruta = NT.cfg.ruta;
        NT.priorizar_sesion = NT.cfg.priorizar_sesion;
        NT.archivo_inicial = NT.cfg.archivo;
        NT.visible = NT.cfg.visible;

        for(let k in NT.cnt_attribs){
            NT.cnt.setAttribute(k, NT.cnt_attribs[k]);
        }

        NT.visibilizar(NT.visible);
        NT.setear_eventos();
        NT.carga_inicial();
    },

    carga_inicial: () => {
        if(NT.priorizar_sesion){
            NT.leer(sessionStorage.getItem(NT.keySesionArchivo) || NT.archivo_inicial);
        }else{
            NT.leer(NT.archivo_inicial);
        }
    },

    setear_eventos: () => {
        NT.arc_inp.addEventListener('focus', ev => {
            CC.lista('notas/', NT.actualizar_lista_archivos);
        });

        NT.arc_inp.addEventListener('keyup', ev => {
            if(ev.code == 'Enter'){
                if(ev.ctrlKey){
                    NT.grabar();
                }else{
                    NT.leer();
                }
            }
        });


        window.addEventListener('keydown', ev => {
            if(ev.code == NT.key){
                if(ev.ctrlKey){
                    NT.visibilizar(!NT.elem.classList.contains(NT.cAct));
                }else{
                    NT.visibilizar(true);
                    NT.foco();
                }
                ev.preventDefault();
            }
        });
    },

    actualizar_lista_archivos: (ls) => {
        let op = [];
        ls.forEach(ar => {
            op.push(`<option value="${ar}"></option>`)
        })
        NT.arc_lis.innerHTML = op.join('');
    },

    insertar: (t, al_inicio=false) => {
        if(al_inicio){
            NT.cnt.innerText = t + '\n' + NT.cnt.innerText;
        }else{
            NT.cnt.innerText += '\n' + t;
        }

    },
    reemplazar: (t) => {
        NT.cnt.innerHTML = '';
        NT.cnt.innerText = t;
    },
    limpiar: () => {
        NT.reemplazar('');
    },

    visibilizar: (e=true) => {
        if(e){
            NT.elem.classList.add(NT.cAct);
        }else{
            NT.elem.classList.remove(NT.cAct);
        }
    },
    foco: () => {
        NT.cnt.focus();
    },
    transformar: (cb) => {
        NT.cnt.innerText = cb(NT.cnt.innerText);
    },
    leer: path => {
        if(path == undefined){
            path = NT.arc_inp.value;
        }else{
            NT.arc_inp.value = path;
        }
        CC.leer(NT.ruta + path, '', NT.reemplazar);
        NT.set_sesion();
    },
    grabar: path => {
        if(path == undefined){
            path = NT.arc_inp.value;
        }else{
            NT.arc_inp.value = path;
        }
        CC.grabar(NT.ruta + path, '', NT.cnt.innerText);
        NT.set_sesion();
    },
    set_sesion: () => {
        if(NT.priorizar_sesion){
            sessionStorage.setItem(NT.keySesionArchivo, NT.arc_inp.value);
        }
    }

}

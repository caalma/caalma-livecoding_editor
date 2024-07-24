const CodeJs = CJ = {
    html: `<div class="archivo">
              <input spellcheck="false" autocorrect="off" autocapitalize="off" translate="no" list="CJ_ls_archivos">
              <datalist id="CJ_ls_archivos"></datalist>
           </div>
           </p><textarea class="cnt">...</textarea>`,
    cAct: 'activo',
    key: 'F2',
    keyEval: ['Enter', true, true], // key, ctrl: eval todo, shift: eval bloque
    elem: undefined,
    cnt: undefined,
    arc_cnt: undefined,
    arc_inp: undefined,
    arc_lis: undefined,
    cnt_attribs: {
        contenteditable: true,
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        translate: "no",
    },
    visible: true,
    archivo_inicial: '',
    priorizar_sesion: true,
    ruta: '',
    keySesionArchivo: 'CodeJavascripArchivo',

    activar: () => {
        CJ.elem = document.getElementById('codeJs');
        if(! CJ.elem) return true;

        CJ.elem.innerHTML = CJ.html;
        CJ.cnt = CJ.elem.querySelector('.cnt');
        CJ.arc_cnt = CJ.elem.querySelector('.archivo');
        CJ.arc_inp = CJ.arc_cnt.querySelector('input');
        CJ.arc_lis = CJ.arc_cnt.querySelector('datalist');

        for(let k in CJ.cnt_attribs){
            CJ.cnt.setAttribute(k, CJ.cnt_attribs[k]);
        }

        CJ.ruta = CJ.cfg.ruta;
        CJ.visible = CJ.cfg.visible;
        CJ.archivo_inicial = CJ.cfg.archivo;
        CJ.priorizar_sesion = CJ.cfg.priorizar_sesion;

        CJ.visibilizar();
        CJ.setear_eventos();
        CJ.cnt.addEventListener('input', CJ.auto_resize, false);
        CJ.carga_inicial();
    },

    carga_inicial: () => {
        if(CJ.priorizar_sesion){
            CJ.leer(sessionStorage.getItem(CJ.keySesionArchivo) || CJ.archivo_inicial);
        }else{
            CJ.leer(NT.archivo_inicial);
        }
    },

    setear_eventos: () => {
        CJ.arc_inp.addEventListener('focus', ev => {
            CC.lista('extra/', CJ.actualizar_lista_archivos);
        });

        CJ.arc_inp.addEventListener('keyup', ev => {
            if(ev.code == 'Enter'){
                if(ev.ctrlKey){
                    CJ.grabar();
                }else{
                    CJ.leer();
                }
            }
        });

        window.addEventListener('keydown', ev => {
            if(ev.code == CJ.key){
                if(ev.ctrlKey){
                    CJ.visibilizar(!CJ.elem.classList.contains(CJ.cAct));
                }else{
                    CJ.visibilizar(true);
                    CJ.foco();
                }
                ev.preventDefault();
            }
        });
        CJ.cnt.addEventListener('keydown', ev => {
            if(ev.code == CJ.keyEval[0]){
                if(ev.ctrlKey === CJ.keyEval[1]){
                    CJ.eval(CJ.cnt.value);
                }else if(ev.shiftKey === CJ.keyEval[2]){
                    CJ.eval(CJ.codigo_bloque_actual());
                    ev.preventDefault();
                }
            }

        });
    },

    eval: (c) => {
        try {
            eval(c);
            CJ.flash(true);
        }catch (err) {
            console.log('error de codejs', err)
            CJ.flash(false);
        }

    },

    insertar: (t) => {
        CJ.cnt.value += '\n' + t;
    },

    reemplazar: (t) => {
        CJ.cnt.value = '';
        CJ.cnt.value = t;
        CJ.auto_resize();

    },

    limpiar: () => {
        CJ.reemplazar('');
    },

    visibilizar: (e=true) => {
        if(e){
            CJ.elem.classList.add(CJ.cAct);
        }else{
            CJ.elem.classList.remove(CJ.cAct);
        }
    },

    foco: () => {
        CJ.cnt.focus();
    },

    transformar: (cb) => {
        CJ.cnt.value = cb(CJ.cnt.value);
    },

    actualizar_lista_archivos: (ls) => {
        let op = [];
        ls.forEach(ar => {
            op.push(`<option value="${ar}"></option>`)
        })
        CJ.arc_lis.innerHTML = op.join('');
    },

    leer: path => {
        if(path == undefined){
            path = CJ.arc_inp.value;
        }else{
            CJ.arc_inp.value = path;
        }
        CC.leer(CJ.ruta + path, '', CJ.reemplazar);
        CJ.set_sesion();
    },

    grabar: path => {
        if(path == undefined){
            path = CJ.arc_inp.value;
        }else{
            CJ.arc_inp.value = path;
        }
        CC.grabar(CJ.ruta + path, '', CJ.cnt.value.trim());
        CJ.set_sesion();
    },

    flash: (success) => {
        let c = 'flash';
        let e = success ? 'bien': 'error';
        CJ.elem.classList.add(c, e);
        setTimeout(()=> CJ.elem.classList.remove(c, e), 100);
    },

    auto_resize: () => {
        CJ.cnt.style.height = (CJ.cnt.scrollHeight) + "px";
    },

    linea_actual: () => {
        return CJ.cnt.value.substr(0, CJ.cnt.selectionStart).split("\n").length;
    },

    codigo_bloque_actual: () => {
        let tex_sel = window.getSelection().toString();
        if(tex_sel.length == 0){
            return CJ.cnt.value.split('\n')[CJ.linea_actual()-1];
        }
        return tex_sel;
    },

    set_sesion: () => {
        if(CJ.priorizar_sesion){
            sessionStorage.setItem(CJ.keySesionArchivo, CJ.arc_inp.value);
        }
    }
}

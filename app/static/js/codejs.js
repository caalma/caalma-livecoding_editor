const CodeJs = CJ = {
    html: `<p class="archivo" contentEditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" translate="no">
           </p><textarea class="cnt">...</textarea>`,
    cAct: 'activo',
    key: 'F2',
    keyEval: ['Enter', true, true], // key, ctrl: eval todo, shift: eval bloque
    elem: undefined,
    cnt: undefined,
    arc: undefined,
    cnt_attribs: {
        contenteditable: true,
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        translate: "no",
    },
    ruta: '',
    activar: () => {
        CJ.elem = document.getElementById('codeJs');
        if(! CJ.elem) return true;

        CJ.elem.innerHTML = CJ.html;
        CJ.cnt = CJ.elem.querySelector('.cnt');
        CJ.arc = CJ.elem.querySelector('.archivo');

        for(let k in CJ.cnt_attribs){
            CJ.cnt.setAttribute(k, CJ.cnt_attribs[k]);
        }

        CJ.visible();
        CJ.eventos_de_teclado();
        CJ.cnt.addEventListener('input', CJ.auto_resize, false);
    },
    eventos_de_teclado: () => {
        window.addEventListener('keydown', ev => {
            if(ev.code == CJ.key){
                if(ev.ctrlKey){
                    CJ.visible(!CJ.elem.classList.contains(CJ.cAct));
                }else{
                    CJ.visible(true);
                    CJ.foco();
                }
                ev.preventDefault();
            }
        });
        CJ.elem.addEventListener('keydown', ev => {
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
    visible: (e=true) => {

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
    leer: path => {
        if(path == undefined){
            path = CJ.arc.innerHTML;
        }else{
            CJ.arc.innerHTML = path;
        }
        CC.leer(CJ.ruta + path, '', CJ.reemplazar);
    },
    grabar: path => {
        if(path == undefined){
            path = CJ.arc.innerHTML;
        }else{
            CJ.arc.innerHTML = path;
        }
        CC.grabar(CJ.ruta + path, '', CJ.cnt.value.trim());
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
    }
}

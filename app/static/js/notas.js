const Notas = NT = {
    html: `<p class="archivo" contentEditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" translate="no"></p>
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
    arc: undefined,
    ruta: '',
    activar: () => {
        NT.elem = document.getElementById('codeNotas');
        if(! NT.elem) return true;

        NT.elem.innerHTML = NT.html;
        NT.cnt = NT.elem.querySelector('.cnt');
        NT.arc = NT.elem.querySelector('.archivo');

        for(let k in NT.cnt_attribs){
            NT.cnt.setAttribute(k, NT.cnt_attribs[k]);
        }


        NT.visible();
        NT.eventos_de_teclado()

    },
    eventos_de_teclado: () => {
        window.addEventListener('keydown', ev => {
            if(ev.code == NT.key){
                if(ev.ctrlKey){
                    NT.visible(!NT.elem.classList.contains(NT.cAct));
                }else{
                    NT.visible(true);
                    NT.foco();
                }
                ev.preventDefault();
            }
        });
    },
    insertar: (t, al_inicio=false) => {
        if(al_inicio ){
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
    visible: (e=true) => {

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
            path = NT.arc.innerHTML;
        }else{
            NT.arc.innerHTML = path;
        }
        CC.leer(NT.ruta + path, '', NT.reemplazar);
    },
    grabar: path => {
        if(path == undefined){
            path = NT.arc.innerHTML;
        }else{
            NT.arc.innerHTML = path;
        }
        CC.grabar(NT.ruta + path, '', NT.cnt.innerText);
    }

}

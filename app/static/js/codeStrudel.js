const repl = document.createElement('strudel-editor');

const repl_code = (c) => repl.editor.setCode(c);
const repl_eval = () => repl.editor.evaluate();

const repl_conmutar_visibilidad = () => {
    repl.editor.root.classList.toggle('oculto');
}
const repl_en_foco = () => {
    repl.editor.root.classList.remove('oculto');
    repl_cnt.focus();
}
const repl_ocultar = () => {
    repl.editor.root.classList.add('oculto');
}


var onCodeErrors = ()=>{ repl.editor.root.style.border ='5px solid #a00'; };
var onCodeOk = ()=>{ repl.editor.root.style.border = '' };

const repl_start = () => repl.editor.repl.start();
const repl_pause = () => repl.editor.repl.pause();
const repl_stop = () => repl.editor.repl.stop();

const repl_lineNumber = (e) => repl.editor.setLineNumbersDisplayed(Boolean(e));
const repl_textWrap = (e) => repl.editor.setLineWrappingEnabled(Boolean(e));
const repl_autoCompletion = (e) => repl.editor.setAutocompletionEnabled(Boolean(e));

const toggle_ln = () => { ln = !ln; repl_lineNumber(ln)};
const toggle_tw = () => { tw = !tw; repl_textWrap(tw)};
const toggle_ac = () => { ac = !ac; repl_autoCompletion(ac)};

const list_themes = (cb=console.log) => cb(Object.keys(themes).sort().join('\n'));
const set_theme = (k) => repl.editor.setTheme(k);
const list_functions = (cb=console.log) => cb(Object.keys(controls).sort().join('\n'));

var ln, tw, ac, repl_cnt;

const CodeStrudel = CS = {
    html: `<div class="archivo">
              <input spellcheck="false" autocorrect="off" autocapitalize="off" translate="no" list="CS_ls_archivos">
              <datalist id="CS_ls_archivos"></datalist>
           </div>
           <div id="codeStrudel" title=""></div>`,
    html_menu:`<div>
                  <span>STRUDEL: </span>
                  <button class="btn link" id="btnEval" title="Evaluar e Iniciar">=</button>
                  <button class="btn link" id="btnStart" title="Reproducir/Continuar">></button>
                  <button class="btn link" id="btnPause" title="Pausar y Esperar">-</button>
                  <button class="btn link" id="btnStop" title="Detener y Reiniciar">·</button>
                  <span>---</span>
                  <button class="btn link" id="btnLineNumberToggle" title="Conmutar Visibilidad de Números de Línea">LN</button>
                  <button class="btn link" id="btnWrapTextToggle" title="Conmutar Corte de línea de texto.">CT</button>
                  <button class="btn link" id="btnAutoCommpleteToggle" title="Conmutar Ayuda y Autocompletado">AC</button>
               </div>`,
    elem: undefined,
    elem_menu: undefined,
    arc_cnt: undefined,
    arc_inp: undefined,
    arc_lis: undefined,
    arc_cod: undefined,
    cfg: {},
    visible: true,
    archivo_inicial: '',
    priorizar_sesion: true,
    keySesionArchivo: 'CodeStrudelArchivo',
    titulo: '',

    activar: () => {
        if(CS.elem) return true;

        CS.elem = document.getElementById('containerStrudel');
        CS.elem.innerHTML = CS.html;

        CS.elem_menu = document.getElementById('menuStrudel');
        CS.elem_menu.innerHTML = CS.html_menu;
        CS.elem_menu.classList.add('menu');
        if(CS.cfg.menu_visible){ CS.elem_menu.classList.add('activo'); }

        CS.arc_cnt = CS.elem.querySelector('.archivo');
        CS.arc_inp = CS.arc_cnt.querySelector('input');
        CS.arc_lis = CS.arc_cnt.querySelector('datalist');
        CS.arc_cod = CS.elem.querySelector('#codeStrudel');

        CS.visible = CS.cfg.visible;
        CS.archivo_inicial = CS.cfg.archivo;
        CS.priorizar_sesion = CS.cfg.priorizar_sesion;

        CS.setear_repl();
        CS.setear_eventos();
        CS.carga_inicial();
    },

    carga_inicial: () => {
        if(CS.priorizar_sesion){
            CS.leer(sessionStorage.getItem(CS.keySesionArchivo) || CS.archivo_inicial);
        }else{
            CS.leer(CS.archivo_inicial);
        }
    },

    setear_repl: () => {
        window.codeStrudel.append(repl);

        ln = repl.settings.isLineNumbersDisplayed;
        tw = repl.settings.isLineWrappingEnabled;
        ac = repl.settings.isAutoCompletionEnabled;

        repl.editor.setFontFamily(font_family);
        set_theme(theme_key);
        repl_textWrap(true);

        setTimeout(()=>{
            document.body.style.backgroundColor = settings[theme_key].background;
        }, 0);

        repl_cnt = document.querySelector('.cm-content.cm-lineWrapping');

        CS.visibilizar(CS.visible);
    },

    visibilizar: (e=true) => {
        if(e){
            repl_en_foco();
        }else{
            repl_ocultar();
        }
    },

    setear_menu: () => {
        window.btnEval.addEventListener('click', repl_eval);
        window.btnStart.addEventListener('click', repl_start);
        window.btnPause.addEventListener('click', repl_pause);
        window.btnStop.addEventListener('click', repl_stop);
        window.btnLineNumberToggle.addEventListener('click', toggle_ln);
        window.btnWrapTextToggle.addEventListener('click', toggle_tw);
        window.btnAutoCommpleteToggle.addEventListener('click', toggle_ac);
    },

    setear_eventos: () => {
        CS.arc_inp.addEventListener('focus', ev => {
            CC.lista('strudel/', CS.actualizar_lista_archivos);
        });

        CS.arc_inp.addEventListener('keyup', ev => {
            if(ev.code == 'Enter'){
                if(ev.ctrlKey){
                    CS.grabar();
                }else{
                    CS.leer();
                }
            }
        });

        window.addEventListener('keydown', ev => {
            if(ev.code === 'F1'){
                if(ev.ctrlKey){
                    repl_conmutar_visibilidad();
                }else{
                    repl_en_foco();
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
        CS.arc_lis.innerHTML = op.join('');
    },

    leer: path => {
        if(path == undefined){
            path = CS.arc_inp.value;
        }else{
            CS.arc_inp.value = path;
        }
        CC.leer(`${path_code_strudel}${path}`, '', repl_code);
        CS.set_sesion();
    },

    grabar: path => {
        if(path == undefined){
            path = CS.arc_inp.value;
        }else{
            CS.arc_inp.value = path;
        }
        CC.grabar(`${path_code_strudel}${path}`, '', repl.editor.code);
        CS.set_sesion();
    },

    set_sesion: () => {
        if(CS.priorizar_sesion){
            sessionStorage.setItem(CS.keySesionArchivo, CS.arc_inp.value);
        }
    }
}

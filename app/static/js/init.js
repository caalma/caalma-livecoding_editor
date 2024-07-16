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

const shutdown_app = chau = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/fin', true);
    xhr.send();
    setTimeout( window.close, 500);
};
const informar_dimensiones = () => {
    window.dimensiones.innerHTML = `${window.innerWidth}x${window.innerHeight}`;
}

var ln, tw, ac, repl_cnt;

window.addEventListener('load', e => {

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

    window.btnEval.addEventListener('click', repl_eval);
    window.btnStart.addEventListener('click', repl_start);
    window.btnPause.addEventListener('click', repl_pause);
    window.btnStop.addEventListener('click', repl_stop);
    window.btnLineNumberToggle.addEventListener('click', toggle_ln);
    window.btnWrapTextToggle.addEventListener('click', toggle_tw);
    window.btnAutoCommpleteToggle.addEventListener('click', toggle_ac);
    window.btnShutdown.addEventListener('click', shutdown_app);


    window.codeComando.addEventListener('keydown', e => {
        let el = e.currentTarget,
            cB = 'bien',
            cE = 'error';
        el.classList = [];
        if(e.code === 'Enter'){
            try{
                eval(el.value);
                el.classList.add(cB);
                setTimeout(() => { el.classList.remove(cB) }, 1000);
            }catch{
                el.classList.add(cE);
            }

        }
    });

    window.addEventListener('resize', informar_dimensiones);

    window.addEventListener('keydown', ev=>{
        if(ev.code === 'Escape'){
            if(ev.ctrlKey){
                window.menuLCE.classList.toggle('activo');
            }else{
                window.menuLCE.classList.add('activo');
                window.codeComando.focus();
            }
            ev.preventDefault();
        }else if(ev.code === 'F1'){
            if(ev.ctrlKey){
                repl_conmutar_visibilidad();
            }else{
                repl_en_foco();
            }
            ev.preventDefault();
        }else if(ev.code === 'F5'){
            ev.preventDefault();
        }
    });


    if(codeStrudel_visible){
        repl_en_foco();
    }else{
        repl_ocultar();
    }

    informar_dimensiones();

    /* ajuste de posicion para el area de utilidades */
    window.addEventListener('scroll', e=>{
        window.areaUtiles.style.marginTop = `${window.scrollY}px`;
    });

    CS.leer(G._codeStrudel_archivo_inicial);
});

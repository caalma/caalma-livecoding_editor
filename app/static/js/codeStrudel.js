const CodeStrudel = CS = {
    elem: undefined,
    arc: undefined,
    activar: () => {
        CS.elem = document.getElementById('containerStrudel');
        if(! CS.elem) return true;
        CS.arc = CS.elem.querySelector('.archivo');
    },
    leer: path => {
        if(path == undefined){
            path = CS.arc.textContent;
        }else{
            CS.arc.textContent = path;
        }
        CC.leer(`${path_code_strudel}${path}`, '', repl_code);
    },
    grabar: path => {
        if(path == undefined){
            path = CS.arc.textContent;
        }else{
            CS.arc.textContent = path;
        }
        CC.grabar(`${path_code_strudel}${path}`, '', repl.editor.code);
    }

}

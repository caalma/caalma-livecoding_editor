const CodeStrudel = CS = {
    elem: undefined,
    arc_cnt: undefined,
    arc_inp: undefined,
    arc_lis: undefined,
    activar: () => {
        CS.elem = document.getElementById('containerStrudel');
        if(! CS.elem) return true;
        CS.arc_cnt = CS.elem.querySelector('.archivo');
        CS.arc_inp = CS.arc_cnt.querySelector('input');
        CS.arc_lis = CS.arc_cnt.querySelector('datalist');
    },
    leer: path => {
        if(path == undefined){
            path = CS.arc_inp.value;
        }else{
            CS.arc_inp.value = path;
        }
        CC.leer(`${path_code_strudel}${path}`, '', repl_code);
    },
    grabar: path => {
        if(path == undefined){
            path = CS.arc_inp.value;
        }else{
            CS.arc_inp.value = path;
        }
        CC.grabar(`${path_code_strudel}${path}`, '', repl.editor.code);
    },
}

var G = new Object; // objeto para uso global

var U = new Object; // utilidades globales


U.recargar = () => { // recargar la página
    window.location.reload()
}

U.limpiar_sesion = () => { // Limpiar la sesión actual
    sessionStorage.clear();
}
U.ayuda = (m='l', a='ayuda.txt') => { // mostrar ayuda
    if('g' == m){
        NT.grabar(a);
    }else{
        NT.leer(a);
    }
}

U.sls = (sep = ' | ') => { // listar samples
    AM.ls(l => NT.reemplazar(l.join(sep)))
}

U.gls = (id, sep = ' | ') => { // listar bancos de audio del grupo
    if(id !== undefined){ G._sgrp = id; }
    AM.ids(G._sgrp, l => NT.insertar('---> '+G._sgrp + '\n'+ l.join(sep)));
}

U.sda = (id) => { // datos del sample actual
    if(id !== undefined){ G._sban = id; }
    AM.elem(G._sban, G._sgrp, d => {
        G._aud = d;
        NT.insertar(G._aud.dat());
    });
}

U.sau = (n=0, id=undefined) => { // devuelve el audio específico
    if(id === undefined){ id = G._sban; }
    AM.elem(id, G._sgrp, d => {
        d.aud(n).play();
    });
}

U.gau = (n=0, id=undefined) => { // graficar un audio específico
    if(id === undefined){ id = G._sban; }
    AM.elem(id, G._sgrp, d => {
        GF.generar(d.url(n).replace('/static', ''));
    });
}

U.sDuplicados = (cb=v=>{}, out_json=true) => { // devuelve los samples colicion de nombres
    let ts = {},
        ss = {},
        sr = {};

    AM.ls(d => {
        let idx = 0;
        for(let c of d){
            AM.ids(c, v => {
                ts[c] = v;
                idx +=1;

                if(idx == (d.length-1)){
                    for(k of Object.keys(ts)){
                        let v = ts[k];
                        for(let s of v){
                            if(! (s in ss)){ ss[s] = []; }
                            ss[s].push(k);
                        }
                    }
                    for(k of Object.keys(ss)){
                        let v = ss[k];
                        if(v.length > 1){ sr[k] = v; }
                    }
                    if(out_json) sr = JSON.stringify(sr);
                    cb(sr);
                }
            })
        }
    });
}

U.sExiste = (nombre, cb=v=>{}, out_json=true) => { // buscar nombre de samples
    let ts = {},
        sr = [];

    AM.ls(d => {
        let idx = 0;
        for(let c of d){
            AM.ids(c, v => {
                ts[c] = v;
                idx +=1;

                if(idx == (d.length-1)){
                    for(k of Object.keys(ts)){
                        let v = ts[k];
                        for(let s of v){
                            if(nombre == s){
                                sr.push(k);
                            }
                        }
                    }
                    if(out_json) sr = JSON.stringify(sr);
                    cb(sr);
                }
            })
        }
    });
}


U.sBuscar = (bus, cb=v=>{}, out_json=true) => { // buscar nombre de samples
    let ts = {},
        sr = {};

    AM.ls(d => {
        let idx = 0;
        for(let c of d){
            AM.ids(c, v => {
                ts[c] = v;
                idx +=1;

                if(idx == (d.length-1)){
                    setTimeout(()=>{
                        for(k of Object.keys(ts)){
                            let v = ts[k];
                            for(let s of v){
                                if(s.includes(bus)){
                                    if(! (k in sr)){ sr[k] = []; }
                                    sr[k].push(s);
                                }
                            }
                        }
                        if(out_json) sr = JSON.stringify(sr);
                        cb(sr);
                    }, 500);
                }
            })
        }
    });
}


U.fijar = () => {
    NT.grabar();
    CJ.grabar();
    CS.grabar();
}

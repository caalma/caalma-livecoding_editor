const WebExterna = WE = {
    html: `<input type="text" value="">
           <iframe src=""></iframe>`,
    cAct: 'activo',
    elem: undefined,
    inp_url: undefined,
    ifr: undefined,
    cfg: {},
    visible: true,
    url: undefined,
    activar: () => {
        if(WE.elem) return true;

        WE.visible = WE.cfg.visible;
        WE.url = WE.cfg.url;

        WE.elem = document.getElementById('webExterna');
        WE.elem.innerHTML = WE.html;

        WE.inp_url = WE.elem.querySelector('input');
        WE.inp_url.value = WE.url;

        WE.ifr = WE.elem.querySelector('iframe');
        WE.ifr.style.height = WE.cfg.height;

        WE.setear_eventos();
        WE.visibilizar(WE.visible);
        WE.cargar();

    },

    setear_eventos: () => {
        WE.inp_url.addEventListener('change', ev => {
            WE.url = ev.currentTarget.value;
            WE.cargar();
        })
    },

    cargar: () => {
        if(WE.url){
            WE.ifr.src = WE.url;
        }
    },

    visibilizar: (e=true) => {
        if(e){
            WE.elem.classList.add(WE.cAct);
        }else{
            WE.elem.classList.remove(WE.cAct);
        }
    },

}

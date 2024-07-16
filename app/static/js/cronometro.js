const Cronometro = CR = {
    html: `<div class="visor"></div>
            <div class="controles">
                <button class="iniciar" title="INICIAR"></button>
                <button class="pausar" title="PAUSAR"></button>
                <button class="detener" title="DETENER"></button>
                <button class="limpiar" title="LIMPIAR"></button>

                <input class="etiqueta" type="text" placeholder="Nota" title="Etiqueta de registro">
                <button class="registrar" title="REGISTRAR"></button>
                <button class="copiar" title="COPIAR al portapapeles"></button>
            </div>
            <ul class="registro"></ul>`,
    cAct: 'activo',
    key: 'F4',
    elem: undefined,
    visor: undefined,
    registro: undefined,
    etiqueta: undefined,
    bini: undefined,
    bpau: undefined,
    bdet: undefined,
    blim: undefined,
    breg: undefined,
    bcop: undefined,
    minimo: 1000,
    intervalo: undefined,
    total: 0,
    registro_previo: 0,
    activar: () => {
        CR.elem = document.getElementById('cronometro');
        if(! CR.elem) return true;

        CR.elem.innerHTML = CR.html;

        CR.visor = CR.elem.querySelector('.visor');
        CR.registro = CR.elem.querySelector('.registro');
        CR.etiqueta = CR.elem.querySelector('.etiqueta');
        CR.bini = CR.elem.querySelector('.iniciar');
        CR.bpau = CR.elem.querySelector('.pausar');
        CR.bdet = CR.elem.querySelector('.detener');
        CR.blim = CR.elem.querySelector('.limpiar');
        CR.breg = CR.elem.querySelector('.registrar');
        CR.bcop = CR.elem.querySelector('.copiar');

        CR.bini.addEventListener('click', CR.iniciar);
        CR.bpau.addEventListener('click', CR.pausar);
        CR.bdet.addEventListener('click', CR.detener);
        CR.blim.addEventListener('click', CR.limpiar);
        CR.breg.addEventListener('click', CR.registrar);
        CR.bcop.addEventListener('click', CR.copiar);
        CR.etiqueta.addEventListener('keydown', ev => {
            console.log(ev);
            if(ev.code == 'Enter'){
                CR.registrar();
            }
        });

        CR.mostrar();
        CR.eventos_de_teclado();
    },
    eventos_de_teclado: () => {
        window.addEventListener('keydown', ev => {
            if(ev.code == CR.key){
                CR.visible(!CR.elem.classList.contains(CR.cAct));
                ev.preventDefault();
            }
        });
    },


    iniciar: () => {
        if(CR.intervalo == undefined){
            CR.intervalo = setInterval(
                ()=>{
                    CR.total += 1;
                    CR.mostrar();
                }, CR.minimo);
        }
    },
    pausar: () => {
        window.clearInterval(CR.intervalo);
        CR.intervalo = undefined;
    },
    detener: () => {
        CR.pausar();
        CR.total = 0;
        CR.registro_previo = 0;
        CR.mostrar();
    },
    registrar: () => {
        let r = document.createElement('li'),
            instante = CR.visor.innerText,
            etiqueta = CR.etiqueta.value,
            distancia = CR.total - CR.registro_previo;
        r.innerHTML = `<b>${instante}</b>  <span>(${distancia})</span> <i>${etiqueta}</i>`;
        CR.registro.appendChild(r);
        CR.registro_previo = CR.total;
    },
    mostrar: () => {
        let hor = parseInt(CR.total / 3600),
            min = parseInt((CR.total % 3600) / 60),
            seg = parseInt((CR.total % 3600) % 60);
            seg = parseInt((CR.total % 3600) % 60);
        CR.visor.innerHTML = `${hor}h ${min}m ${seg}s`;
    },
    copiar: () => {
        navigator.clipboard.writeText(CR.registro.innerText);
    },
    limpiar: () => {
        CR.detener();
        CR.registro.innerHTML = '';
        CR.etiqueta.value = '';
    },
    visible: (e=true) => {
        if(e){
            CR.elem.classList.add(CR.cAct);
        }else{
            CR.elem.classList.remove(CR.cAct);
        }
    },

}

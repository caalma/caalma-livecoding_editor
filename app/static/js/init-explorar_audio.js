const filtrar_samples_con = (tex) => {
    let cCoin = 'coincide',
        cFilt = 'con-filtrado',
        cSinC = 'sin-coincidencias';

    window.listaGrupos.classList.remove(cFilt);
    window.listaGrupos.querySelectorAll(`.${cCoin}`).forEach(el => {
        el.classList.remove(cCoin);
    });
    window.listaGrupos.querySelectorAll(`.${cSinC}`).forEach(el => {
        el.classList.remove(cSinC);
    });


    if(tex.length > 0){
        window.listaGrupos.classList.add(cFilt);
        btnsSamples.forEach(el => {
            if(el.attributes.data_ids.value.includes(tex)){
                el.classList.add(cCoin);
            }
        });
        btnsGrupos.forEach(el => {
            if(el.parentElement.querySelector('.'+cCoin) === null){
                el.parentElement.classList.add(cSinC);
            }
        });

    }
};

const seleccionar_banco_audios = (id_grp, ru_base, ru_babsoluta, id_sam, dat) => {
    window.baSeleccionadoTitulo.innerHTML = `${id_grp} --> ${id_sam}`;
    window.baSeleccionadoItems.innerHTML = '';
    window.baSeleccionadoInfo.innerHTML = '';
    let cnt = 0;
    dat.forEach(path => {
        let elem = document.createElement('li');
        elem.attributes.data_base = ru_base;
        elem.attributes.data_babsoluta = ru_babsoluta;
        elem.attributes.data_path = path;
        elem.attributes.data_num = cnt;
        elem.innerHTML = `<button class="btn info" title="${ru_base}${path}">${cnt}</button>
                          <button class="btn oir" title="Oir">O</button><button class="btn ver" title="Ver">V</button><button class="btn editar" title="Editar">E</button>
                         `;
        window.baSeleccionadoItems.appendChild(elem);
        cnt += 1;
    });

    window.baSeleccionadoItems.querySelectorAll('.btn.info').forEach(el => {
        el.addEventListener('click', ev =>{
            let cInf = 'informando',
                datos = '',
                prev = el.parentElement.parentElement.querySelector(`.${cInf}`);

            if(!el.classList.contains(cInf)){
                if(prev){
                    prev.classList.remove(cInf);
                }
            }

            el.classList.toggle(cInf);
            if(el.classList.contains(cInf)){
                let ela = el.parentElement.attributes,
                    rutaServer = `${ela.data_base}${ela.data_path}`,
                    rutaReal = `${ela.data_babsoluta}/${id_grp}/${ela.data_path}`;
                datos = `<p>${rutaServer}</p><p class="separador"></p><p>${rutaReal}</p>`;
            }
            window.baSeleccionadoInfo.innerHTML = datos;
        });
    });

    window.baSeleccionadoItems.querySelectorAll('.btn.oir').forEach(el => {
        el.addEventListener('click', ev =>{
            let aud = new AudioElem(
                id_grp, id_sam,
                dat,
                el.parentElement.attributes.data_base
            );
            aud.aud(el.parentElement.attributes.data_num).play();
        });
    });

    window.baSeleccionadoItems.querySelectorAll('.btn.ver').forEach(el => {
        el.addEventListener('click', ev =>{
            let ela = el.parentElement.attributes,
                ruta = `${ela.data_base}${ela.data_path}`;
            GF.generar(ruta.replace('/static/', '/'));
        });
    });

    window.baSeleccionadoItems.querySelectorAll('.btn.editar').forEach(el => {
        el.addEventListener('click', ev =>{
            let ela = el.parentElement.attributes,
                ruta = `${ela.data_base}${ela.data_path}`;
            ruta = ruta.replace('/static/', '/');
            ajax_get(`/editar/audio/${ruta}`, {}, resp => {
                resp = JSON.parse(resp);
                console.log(resp)
                if(!resp.error){
                    navigator.clipboard.writeText(resp.path);
                }
            });
        });
    });

};

var btnsGrupos = undefined;
var btnsSamples = undefined;
var btnsGruposActivos = undefined;
var btnsGruposNoActivos = undefined;


window.addEventListener('load', e => {
    let cDesp = 'desplegado',
        cOcul = 'oculto',
        cSaAc = 'samples-activos';

    btnsGrupos = document.querySelectorAll('.item-grupo .titulo');

    btnsGruposActivos = Array.prototype.filter.call(btnsGrupos, el => {
        return el.parentElement.classList.contains(cSaAc);
    });

    btnsGruposNoActivos = Array.prototype.filter.call(btnsGrupos, el => {
        return ! el.parentElement.classList.contains(cSaAc);
    });

    btnsSamples = document.querySelectorAll('.btn.sample');


    window.filtrarSamples.addEventListener('keyup', ev => {
        if(ev.code == 'Enter'){
            filtrar_samples_con(ev.target.value);
        }
    });

    window.soloActivos.addEventListener('change', ev => {
        if(ev.target.checked){
            btnsGruposNoActivos.forEach(el => {
                el.parentElement.classList.add(cOcul);
            });
        }else{
            btnsGruposNoActivos.forEach(el => {
                el.parentElement.classList.remove(cOcul);
            });
        }
    });

    window.desplegarGrupos.addEventListener('click', ev =>{
        btnsGrupos.forEach(el => {
            el.parentElement.classList.add(cDesp);
        });
    });

    window.colapsarGrupos.addEventListener('click', ev =>{
        btnsGrupos.forEach(el => {
            el.parentElement.classList.remove(cDesp);
        });
    });


    btnsGrupos.forEach(el=>{
        el.addEventListener('click', ev => {
            el.parentElement.classList.toggle(cDesp)
        });
    });

    btnsSamples.forEach(el => {
        el.addEventListener('click', ev => {
            seleccionar_banco_audios(
                el.attributes.data_grp.value,
                el.attributes.data_base.value,
                el.attributes.data_babsoluta.value,
                el.attributes.data_ids.value,
                JSON.parse(el.attributes.data_samples.value)
            );
        });
    });


});

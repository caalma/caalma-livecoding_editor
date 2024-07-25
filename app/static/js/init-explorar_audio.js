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
            if(el.parentElement.parentElement.querySelector('.' + cCoin) === null){
                el.parentElement.parentElement.classList.add(cSinC);
            }
        });
    }
};

const seleccionar_banco_audios = (id_grp, ru_base, ru_babsoluta, id_sam, dat) => {
    sessionStorage.setItem(ksesion_bancoactual, JSON.stringify({
        'id_grp':id_grp,
        'ru_base': ru_base,
        'ru_babsoluta': ru_babsoluta,
        'id_sam': id_sam,
        'dat': dat
    }));
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
                    rutaReal = `${ela.data_babsoluta}/${id_grp}/${ela.data_path}`,
                    ar = `${ela.data_base}${ela.data_path}`.replace('/static/','');

                ajax_get(`/audio/datos/${ar}`, {}, r => {
                    r = JSON.parse(r);
                    datos = `<!--<p>${rutaServer}</p>-->
                             <p class="separador"></p><small>${rutaReal}</small>
                             <p class="separador"></p><small>
                                <span>${r.datos.instante}</span> ---
                                <span>${r.datos.segundos.toPrecision(2)} seg</span> ---
                                <span>${r.datos.canales} canales</span> ---
                                <span>${r.datos.muestreo} kHz</span>
                             </small>`;
                    window.baSeleccionadoInfo.innerHTML = datos;
                });
            }else{
                window.baSeleccionadoInfo.innerHTML = datos;
            }
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
            ajax_get(`/audio/editar/${ruta}`, {}, resp => {
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

const ksesion_filtrado = 'EXSA-filtrado',
      ksesion_soloactivos = 'EXSA-soloactivos',
      ksesion_bancoactual = 'EXSA-bancoactual';

window.addEventListener('load', e => {
    let cDesp = 'desplegado',
        cOcul = 'oculto',
        cSaAc = 'samples-activos';

    btnsGrupos = document.querySelectorAll('.item-grupo .titulo');

    btnsGruposActivos = Array.prototype.filter.call(btnsGrupos, el => {
        return el.parentElement.parentElement.classList.contains(cSaAc);
    });

    btnsGruposNoActivos = Array.prototype.filter.call(btnsGrupos, el => {
        return ! el.parentElement.parentElement.classList.contains(cSaAc);
    });

    btnsSamples = document.querySelectorAll('.btn.sample');


    window.filtrarSamples.addEventListener('keyup', ev => {
        if(ev.code == 'Enter'){
            let v = ev.target.value;
            filtrar_samples_con(v);
            sessionStorage.setItem(ksesion_filtrado, v);
        }
    });

    window.soloActivos.addEventListener('change', ev => {
        if(ev.target.checked){
            btnsGruposNoActivos.forEach(el => {
                el.parentElement.parentElement.classList.add(cOcul);
            });
        }else{
            btnsGruposNoActivos.forEach(el => {
                el.parentElement.parentElement.classList.remove(cOcul);
            });
        }

        sessionStorage.setItem(ksesion_soloactivos, ev.target.checked);
    });

    window.desplegarGrupos.addEventListener('click', ev =>{
        btnsGrupos.forEach(el => {
            let it = el.parentElement.parentElement,
                ksesion = `EXSA-collapse-${it.id}`;
            it.classList.add(cDesp);
            sessionStorage.setItem(ksesion, it.classList.contains(cDesp));
        });
    });

    window.colapsarGrupos.addEventListener('click', ev =>{
        btnsGrupos.forEach(el => {
            let it = el.parentElement.parentElement,
                ksesion = `EXSA-collapse-${it.id}`;
            it.classList.remove(cDesp);
            sessionStorage.setItem(ksesion, it.classList.contains(cDesp));
        });
    });

    window.limpiarSesion.addEventListener('click', ev => {
        U.limpiar_sesion();

    });

    btnsGrupos.forEach(el=>{
        let it = el.parentElement.parentElement;
        let ksesion = `EXSA-collapse-${it.id}`;
        el.addEventListener('click', ev => {
            it.classList.toggle(cDesp);
            sessionStorage.setItem(ksesion, it.classList.contains(cDesp));
        });
        el.parentElement.querySelector('.btn.regenerar').addEventListener('click', ev => {
            ajax_post('/samples/regenerar/', {'idgrp': ev.target.attributes.data_idgrp.value}, r => {
                U.recargar();
            });
        });
        if(eval(sessionStorage.getItem(ksesion))){
            it.classList.add(cDesp);
        }

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

    /* reactivar sesion */
    let filtrado_value = sessionStorage.getItem(ksesion_filtrado);
    if(filtrado_value){
        window.filtrarSamples.value = filtrado_value;
        filtrar_samples_con(window.filtrarSamples.value);
    }

    let soloactivos_value = sessionStorage.getItem(ksesion_soloactivos);
    if(soloactivos_value){
        window.soloActivos.click();
    }

    let bancoactual_value = sessionStorage.getItem(ksesion_bancoactual);
    if(bancoactual_value){
        let ba_d = JSON.parse(bancoactual_value);
        seleccionar_banco_audios(
            ba_d.id_grp,
            ba_d.ru_base,
            ba_d.ru_babsoluta,
            ba_d.id_sam,
            ba_d.dat
        );
    }
});

window.addEventListener('load', e => {

    window.btnShutdown.addEventListener('click', shutdown_app);

    window.limpiarSesion.addEventListener('click', U.limpiar_sesion);

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

    window.exploradorRecursos.addEventListener('keydown', e => {
        let el = e.currentTarget,
            cB = 'bien',
            cE = 'error';
        el.classList = [];
        if(e.code === 'Enter'){
            ajax_post('/recurso/explorar/', {'uri': el.value}, rOk => {
                el.classList.add(cB);
                setTimeout(() => { el.classList.remove(cB) }, 1000);
            }, rEr => {
                el.classList.add(cE);
            });
        }
    });


    CS.setear_menu();

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
        }else if(ev.code === 'F5'){
            ev.preventDefault();
        }
    });


    const keySesionUtilesVisible = 'ED-utiles-visible';
    window.areaUtiles.querySelector('.ajuste').addEventListener('click', ()=>{
        window.areaUtiles.classList.toggle('visible');
        window.areaCode.classList.toggle('completo');
        localStorage.setItem(keySesionUtilesVisible, window.areaUtiles.classList.contains('visible'));
    });
    if(!JSON.parse(localStorage.getItem(keySesionUtilesVisible))){
        window.areaUtiles.querySelector('.ajuste').click();
    }

    informar_dimensiones();

    /* ajuste de posicion para el area de utilidades */
    window.addEventListener('scroll', e=>{
        window.areaUtiles.style.marginTop = `${window.scrollY}px`;
    });
});

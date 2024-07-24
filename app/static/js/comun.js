// --- funcionalidades de códigos

const CC = {
    grabar: (nom, ext='', texto='') => {
        // --- graba el contenido de un campo de código en el archivo indicado
        let ne = nom + ext;
        ajax_post('/codigo/grabar/', {nombre: ne, 'texto': texto });
    },

    leer: (nom, ext='', cb=()=>{}) => {
        // --- lee el codigo según el nombre de archivo indicado
        let ne = nom + ext;
        ajax_post('/codigo/leer/', {nombre: ne}, resp => {
            cb(resp);
        });
    },

    lista: (ruta= '', cb_ok = ()=>{}) => {
        // --- lista los archivos de codigos disponibles
        ajax_post('/codigos/', {ruta: ruta}, resp => {
            cb_ok(JSON.parse(resp));
        });
    }
}

const Publico = PU = {
    lista: (ruta='', cb_ok = ()=>{}) => {
        ajax_post('/publico/', {ruta: ruta}, resp => {
            cb_ok(JSON.parse(resp));
        });
    }
}

const ajax_post = (url, data, cb_ok=(or)=>{}, cb_err=(or)=>{}) => {
    // --- llamada al servidor con metodo post
    let xhr = new XMLHttpRequest(),
        fd = new FormData();

    Object.keys(data).forEach( k => { fd.append(k, data[k]) });
    xhr.open('POST', url, true);
    xhr.send(fd);
    xhr.onload = () => {
        if(xhr.status === 200) {
            cb_ok(xhr.response);
        }else{
            cb_err(xhr.response);
        }
    }
}

const ajax_get = (url, data, cb_ok=(or)=>{}, cb_err=(or)=>{}) => {
    // --- llamada al servidor con metodo get
    let xhr = new XMLHttpRequest(),
        fd = new FormData();

    Object.keys(data).forEach( k => { fd.append(k, data[k]) });
    xhr.open('GET', url, true);
    xhr.send(fd);
    xhr.onload = () => {
        if(xhr.status === 200) {
            cb_ok(xhr.response);
        }else{
            cb_err(xhr.response);
        }
    }
}

const shutdown_app = chau = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/fin', true);
    xhr.send();
    setTimeout(window.close, 500);
};

const informar_dimensiones = () => {
    window.dimensiones.innerHTML = `${window.innerWidth}x${window.innerHeight}`;
}

const AudioMuestra = AM = {
    ls: (cb=()=>{}) => {
        ajax_post('/samples/ls/', {ruta:''}, resp => {
            let d = JSON.parse(resp);
            cb(d.filter(e => {
                if(!e.endsWith('.md') && !e.endsWith('.py')) return true;
            }))
        });
    },
    dat: (ca, cb=()=>{}) => {
        ajax_get(`/static/samples/${ca}/samples.json`, {}, resp => {
            cb(JSON.parse(resp));
        });
    },
    ids: (ca, cb=()=>{}) => {
        AM.dat(ca, d=>{
            let result = [];
            for(let k in d){
                if(k != '_base'){
                    result.push(k);
                }
            }
            cb(result);
        });
    },
    elem: (k, ca, cb=()=>{}) => {
        AM.dat(ca, d=>{
            cb(new AudioElem(ca, k, d[k], d['_base']));
        });
    },
    bus: (b, ca, cb=()=>{}) => {
        AM.dat(ca, d=>{
            let result = [];
            for(let k in d){
                if(k.includes(b)){
                    result.push(new AudioElem(ca, k, d[k], d['_base']));
                }
            }
            cb(result);
        });
    },
}


class AudioElem {
    volume = 0.9;

    constructor(a, k, v, b){
        this.a = a;
        this.k = k;
        this.v = v;
        this.b = b;
    }

    url(n){
        return this.b + this.v[n];
    }

    aud(n){
        let t = document.createElement('audio');
        t.src = this.url(n);
        t.volume = this.volume;
        return t;
    }

    dat(completo=false){
        let r = [this.a, this.k, this.v.length];
        if(completo) r.push(this.b);
        return r;
    }
}

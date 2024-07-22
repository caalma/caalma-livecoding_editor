const AudioMuestra = AM = {
    ls: (cb=()=>{}) => {
        ajax_post('/samples/ls/', {ruta:''}, resp => {
            let d = JSON.parse(resp);
            cb(d.filter(e => {
                if(!e.endsWith('.md') && !e.endsWith('.py')) return true;
            }))
        });
    },
    dat: (grp, cb=()=>{}) => {
        ajax_get(`/static/samples/${grp}/samples.json`, {}, resp => {
            cb(JSON.parse(resp));
        });
    },
    ids: (grp, cb=()=>{}) => {
        AM.dat(grp, d=>{
            let result = [];
            for(let k in d){
                if(k != '_base'){
                    result.push(k);
                }
            }
            cb(result);
        });
    },
    elem: (k, grp, cb=()=>{}) => {
        AM.dat(grp, d=>{
            cb(new AudioElem(grp, k, d[k], d['_base']));
        });
    },
    bus: (b, grp, cb=()=>{}) => {
        AM.dat(grp, d=>{
            let result = [];
            for(let k in d){
                if(k.includes(b)){
                    result.push(new AudioElem(grp, k, d[k], d['_base']));
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

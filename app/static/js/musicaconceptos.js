const MusicaConceptos = MC = {
    eCroma: 'A A# B C C# D D# E F F# G G#'.split(' '),
    estruc: {
        menor: '1 3 4 6 8 9 11'.split(' ').map(v => parseInt(v)),
        menorAum: '1 3 4 6 8 10 11'.split(' ').map(v => parseInt(v)),
        menorDim: '1 2 4 6 8 9 11'.split(' ').map(v => parseInt(v)),
        mayor: '1 3 5 6 8 10 12'.split(' ').map(v => parseInt(v)),
        mayorAum: '1 3 5 7 8 10 12'.split(' ').map(v => parseInt(v)),
        mayorDim: '1 3 5 6 8 10 11'.split(' ').map(v => parseInt(v)),
        disminuida: '1 2 4 6 7 9 11'.split(' ').map(v => parseInt(v)),
    },
    modos: {
        jonico: '', // mayor
        mixolidio: '', // mayor 7° disminuida
        lidio: '', // mayor 4° aumentada
        eolico: '', // menor
        dorico: '', // menor 6° aumentada
        frigio: '', // menor 2° disminuida
        locrio: '', // disminuida ??
    },
    reposicionar: (pri) => {
        let i = MC.eCroma.findIndex(v=>v==pri),
            an = MC.eCroma.toSpliced(i),
            po = MC.eCroma.toSpliced(0, i);
        return po.concat(an);
    },
    escala: (ton='C', estK='mayor', formatear=true) => {
        let ecro = MC.reposicionar(ton);
        let esc = [];
        for(let i in ecro){
            i = parseInt(i);
            if(MC.estruc[estK].includes(i+1)){
                esc.push(ecro[i]);
            }
        }
        if(formatear){
            return `${ton}:${estK} [ ${esc.join(' ')} ]`;
        }else{
            return esc;
        }

    },
    familia: (ton='C', estK='mayor') => {
        let matriz = MC.escala(ton, estK, false);
        console.log(matriz)
        let fam = [];
        for(let i=0; i < matriz.length; i++){
            let an = matriz.toSpliced(i),
                po = matriz.toSpliced(0, i);
            fam.push(po.concat(an).join(' '));
        }
        return fam.join('\n');
    }
}

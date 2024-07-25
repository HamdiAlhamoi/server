const Util ={
    copyGrid: function(from, to){
        for(let i=0;i<from.length;i++){
            to[i]= [...from[i]]
        }
    }
}

export {Util}
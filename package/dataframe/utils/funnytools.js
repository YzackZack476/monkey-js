import {Typing} from '../typing/typing.js';

class FunnytoolsArray{
    static size(array){
        Typing.validate_typings([Typing.Array, array]);
        return array.length;
    }

    static value_counts_from_array(array){
        Typing.validate_typings([Typing.Array, array], [Typing.Same(), array]);
        return array.reduce((set,next)=>{
            set[next] === undefined ?  set[next]=1:set[next]+=1;
            return set;
        }, {});
    }

    static apply_callback_function(array,func){
        if(func === undefined) throw new Error('Callback function does not be undefined');
        Typing.validate_typings([Typing.Array, array]);
        return array.map(element=>func(element));
    }
}

export {FunnytoolsArray}
import {Typing} from '../typing/typing.js';


class PolymorphismFunctions{

    static create_zip_from_objects(){
        const objects_recived = Array.from(arguments);        
        Typing.validate_typings([Typing.Array,objects_recived]);
        return objects_recived.at().map((_,index)=>objects_recived.map(item=>item[index]))
    }
}


export {PolymorphismFunctions};
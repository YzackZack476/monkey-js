import {Typing} from '../typing/typing.js';
import { ArithmeticArray } from "../arithmetic/arithmetic.js";

class LogicalArray{
    static element_from_array_is_in_another_array(array_input, array_filter){
        Typing.validate_typings([Typing.Array, array_input],[Typing.Array, array_filter]);
        return array_input.map(elemet=>array_filter.includes(elemet));
    }
   
    static element_from_array_is_not_in_another_array(array_input, array_filter){
        Typing.validate_typings([Typing.Array, array_input],[Typing.Array, array_filter]);
        return array_input.map(elemet=>!array_filter.includes(elemet));
    }

    static and_logical_operation(){
        const objects_recived = Array.from(arguments);        
        Typing.validate_typings([Typing.Array,objects_recived]);

        const zipper = objects_recived.at().map((_,index)=>objects_recived.map(item=>item[index]))
        return zipper.map(boolean_array=>ArithmeticArray.and_logical_sum_from_array(boolean_array));
    }

    static or_logical_operation(){

        const objects_recived = Array.from(arguments);        
        Typing.validate_typings([Typing.Array,objects_recived]);

        const zipper = objects_recived.at().map((_,index)=>objects_recived.map(item=>item[index]))
        return zipper.map(boolean_array=>ArithmeticArray.or_logical_sum_from_array(boolean_array));
    }
}

export {LogicalArray}
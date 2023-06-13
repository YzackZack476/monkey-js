import {Typing} from '../typing/typing.js';


class ArithmeticArray{
    static first_element_from_array(array){
        Typing.validate_typings([Typing.Array, array]);
        return array.at(0);
    }

    static last_element_from_array(array){
        Typing.validate_typings([Typing.Array, array])
        return array.at(-1);
    }

    static get_the_max_value_element(array){
        //* Validate the array is Array object
        Typing.validate_typings(
            [Typing.Array, array],
            [Typing.Same(), array]
        );

        const regex_datetime=/^\d{4}-(0[0-9]|1[0-2])-\d \d{2}:\d{2}:\d{2}$/;
        switch(typeof array.at()) {
            case 'number':
                return array.reduce((acum, current)=>Math.max(acum, current));
                break;
            case 'string':
                switch(regex_datetime.test(array.at())) {
                    case true: // Is datetime
                        return array.reduce((acum, curr) => acum > curr ? acum:curr);
                        break;
                    case false: // Is string
                        return array.reduce((flag_max, next) => {
                            flag_max = flag_max == null ? next:next.localeCompare(flag_max)>0 ? next:flag_max;
                            return flag_max;
                        }, null);
                        break;
                }
                break;
        }
    }

    static get_the_min_value_element(array){
        //* Validate the array is Array object
        Typing.validate_typings(
            [Typing.Array, array],
            [Typing.Same(), array]
        );

        const regex_datetime=/^\d{4}-(0[0-9]|1[0-2])-\d \d{2}:\d{2}:\d{2}$/;
        switch(typeof array.at()) {
            case 'number':
                return array.reduce((acum, current)=>Math.min(acum, current));
                break;
            case 'string':
                switch(regex_datetime.test(array.at())) {
                    case true: // Is datetime
                        return array.reduce((acum, curr) => acum < curr ? acum:curr);
                        break;
                    case false: // Is string
                        return array.reduce((flag_min, next) => {
                            flag_min = flag_min == null ? next:next.localeCompare(flag_min)<0 ? next:flag_min;
                            return flag_min;
                        }, null);
                        break;
                }
                break;
        }
    }

    static get_unique_values_from_array(array){
        Typing.validate_typings([Typing.Array, array]);
        return Array.from(new Set(array));  
    }

    static and_logical_sum_from_array(array){
        Typing.validate_typings([Typing.Array, array], [Typing.Same(Typing.Boolean), array]);
        return  array.reduce((sum, next)=> sum && next, true);
    }

    static or_logical_sum_from_array(array){
        Typing.validate_typings([Typing.Array, array], [Typing.Same(Typing.Boolean), array]);
        return  array.reduce((sum, next)=> sum || next, false);
    }

    static sum_all_values_from_array(array, sep=''){
        Typing.validate_typings(
            [Typing.Array, array],
            [Typing.Same(), array]
        );
        
        switch(true){
            case (typeof array.at() === Typing.Number):
                return array.reduce((a, b) => a+b); 
                break;

            case (typeof array.at() === Typing.String):
                return array.reduce((a, b) => a+sep+b);   
                break;
        }
    }

    static avg_all_values_from_array(array){
        Typing.validate_typings(
            [Typing.Array, array],
            [Typing.Same(Typing.Number), array]
        );
        const sum = array.reduce((a, b) => a+b);   
        return sum/array.length; 
    }

}

export {ArithmeticArray};

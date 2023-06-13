class Typing{
    static get Array(){
        return 'array';
    }

    static get String(){
        return 'string';
    }

    static get Number(){ 
        return'number';
    }

    static get Boolean(){ 
        return'boolean';
    }

    static Same(type_value){ 
        return type_value!=undefined ? 'same'+'-'+type_value:'same';
    }
    
    static raiseException(error_message){
        error_message = 'Invalid Typing: '+ error_message;
        throw new Error(error_message);
    }

    static validate_typings(){
        const validation2check = Array.from(arguments);
        let error_message=undefined;


        const validation_result =  validation2check.every(([typeof_target, value2evaluate] = curr_validation) => {

            switch(typeof_target) {
                case 'array':
                    error_message = "The value must be an array";
                    return Array.isArray(value2evaluate);
                    break;

                case 'string':
                    error_message = "The value must be a string";
                    return  typeof value2evaluate === 'string';
                    break;

                case 'number':
                    error_message = "The value must be a number";
                    return  typeof value2evaluate === 'number';
                    break;

                case 'same':
                    const sub_type_value_target = typeof value2evaluate.at(0);
                    error_message = "All values must be of the same type";
                    return value2evaluate.every(each_value => typeof each_value === sub_type_value_target);
                    break;

                default:
                    const sub_typeof_target = typeof_target.split('-').at(-1);
                    error_message = "All values must be of the same type as "+sub_typeof_target;
                    return value2evaluate.every(each_value => typeof each_value === sub_typeof_target);
                    break;

            }
        });

        validation_result ? true:this.raiseException(error_message);
        return validation_result;
    }
    
}

export {Typing};
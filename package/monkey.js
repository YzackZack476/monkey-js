 
//NOTE: ======================================================================
//NOTE: Funciones de operadores aritmeticos  
function calc_first(array){
	return array.at(0);
}
function calc_last(array){
	return array.at(-1);
}   
function calc_max(array){
    switch (typeof array.at()){
        case 'string':
            let reg_datetime = /\d\d\d\d-\d\d-\d\d \d\d:\d\d/;
            const are_all_datetime = array.every(item=> reg_datetime.test(item));

            if (are_all_datetime){
                return array.reduce((acumulado, actual) => acumulado > actual ? acumulado : actual);
            }else{
                throw('Solo valido para datos numericos y tipo fecha; no sea imbecíl!');
            }
        case 'number':
            const max = array.reduce((a, b) => Math.max(a, b));    
            return max;
    }
}
function calc_min(array){
    switch (typeof array.at()){
        case 'string':
            let reg_datetime = /\d\d\d\d-\d\d-\d\d \d\d:\d\d/;
            if (reg_datetime.test(array.at(0))){
                return array.reduce((acumulado, actual) => acumulado < actual ? acumulado : actual);
            }else{
                throw('Solo valido para datos numericos y tipo fecha');
            }
        case 'number':
            const min = array.reduce((a, b) => Math.min(a, b));    
            return min;
    }

}
function calc_sum(array, sep=''){
    if (typeof array.at() === 'number'){
        const sum = array.reduce((a, b) => a+b);    
        return sum;
    }else{
        const sum = array.reduce((a, b) => a+sep+b);    
        return sum;
    }
}
function calc_avg(array){
    if(typeof array.at() !== 'number'){
        return undefined;
    }
    const sum = array.reduce((a, b) => a+b);   
    return sum/array.length; 
}
function calc_opr(){
    const operador = arguments[0];
    const array = arguments[1];
    return array.map(nominal=> eval(nominal+operador));
}
function calc_count(array){
    return array.length;
}
function calc_unique(array){
    return Array.from(new Set(array));   
}
function calc_booleans(array){
    return  array.reduce((sum, next)=> sum && next, true);
}
function calc_zip(args){
    return args.at(0).map((_,i) => args.map(item=>item[i]) )
}


//! ==============================================================================
//! Funciones de operadores comparativos        


function indexes_2_series(length, indexes){
    let series = new Array(length).fill(false);
    indexes.forEach(index=>series[index]=true);
    return series;
}

function calc_equals(nominal, array){
    let indexes=[];
    let idx = array.indexOf(nominal);

    while(idx !== -1){
        indexes.push(idx);
        idx = array.indexOf(nominal, idx + 1);
    }
    return indexes;
}

function calc_not_equals(nominal, array){
    let drop_indexes=[];
    let idx = array.indexOf(nominal);

    while(idx !== -1){
        drop_indexes.push(idx);
        idx = array.indexOf(nominal, idx + 1);
    }

    const all_indexes = Array.from({length: array.length}, (_,index) => index);
    const not_indexes = all_indexes.filter(item=> !drop_indexes.includes(item));
    
    return not_indexes;
}

function calc_isin(nominal_array, array){
    return nominal_array.map(nominal=>{
        return calc_equals(nominal,array);
    }).reduce((before,current)=> before.concat(current));
}

function evaluate(operador,nominal,array){
    switch (operador){
        case ">":
            return array.map((item, index)=> item > nominal ? index:'pass').filter(each=>each!='pass');

        case ">=":
            return array.map((item, index)=> item >= nominal ? index:'pass').filter(each=>each!='pass');

        case "<":
        return array.map((item, index)=> item < nominal ? index:'pass').filter(each=>each!='pass');

        case "<=":
            return array.map((item, index)=> item <= nominal ? index:'pass').filter(each=>each!='pass');
        
        case "<>":
            return array.map((item, index)=> item != nominal ? index:'pass').filter(each=>each!='pass');
        
    }
}

function between(low,hight,array){
    return array.map((item, index)=> ((item <= hight) && (item >= low)) ? index:'pass').filter(each=>each!='pass');
}

//+ ==============================================================================
//+ Funciones de operadores logicos         
function and(){
    let array_main= arguments[0];
    for(let i=0; i<arguments.length-1; i++){
        array_main = array_main.filter(index=> arguments[i+1].includes(index));
    }
    return calc_unique(array_main);
}

function or(){
    let array_main= arguments[0];
    for(let i=0; i<arguments.length-1; i++){
        array_main = array_main.concat(arguments[i+1]);
    }
    return calc_unique(array_main);
}



//% ==============================================================================
//% Funciones para el Dataframe     

function merge(){

    //+ Default parameters
    let df_a    = arguments[0];
    let df_b    = arguments[1];
    const how   = arguments[2];
    const args  = arguments[3];
    const debug = arguments[4];

    let on = args['on'];
    let left_on = args['left_on'];
    let right_on = args['right_on'];
    const suffixies = args['suffixies'] ? args['suffixies']:['_X','_Y'];


    //* Declare variables to use into de function =================
    let reg_merged = [];    // Will storate the data merged
    let matches_list;       
    let match_per_row;      
    let existed_matches;    


    //+ Create two arrays "left_on" and "right_on" always =================
    if (on !== undefined){
        left_on = on;
        right_on = on;
    }    
    on = calc_zip([left_on,right_on]);

    //* Renname columns that coexist in both dataframes ====================
    const dont_touch = left_on.concat(right_on);    // Except these

    const conservate_a =  df_a.columns.filter(column => !dont_touch.includes(column));
    const conservate_b =  df_b.columns.filter(column => !dont_touch.includes(column));
    const col_collision = conservate_a.filter(column => conservate_b.includes(column));
    const rename_a_values = col_collision.map(column => column+suffixies[0]);
    const rename_b_values = col_collision.map(column => column+suffixies[1]);

    // Renaming data and crearing new dataframes
    const dict_rename_a = Object.fromEntries(calc_zip([col_collision,rename_a_values])); 
    const dict_rename_b = Object.fromEntries(calc_zip([col_collision,rename_b_values])); 

    df_a = new DataFrame(rename_columns(df_a.datos, dict_rename_a));
    df_b = new DataFrame(rename_columns(df_b.datos, dict_rename_b));
    
    //% Iterate for each row in df_a    ====================
    for(let i=0; i<df_a.shape.at(); i++){

        existed_matches = false;
        //! Iterate for each row in df_b
        for(let e=0; e<df_b.shape.at(); e++){
            
            //+ Iterate for each columns to comparate | on = ['ID','NAME']
            matches_list = on.map( ( [left_on, right_on] =  zipped) =>{ 
                return df_a[left_on][i] == df_b[right_on][e] ? true:false; 
            });
                                                            //* .......................................................   col1 | col2 | col3
            match_per_row = calc_booleans(matches_list);    //* Sum the row results, example:  df_a[row1] vs df_b[row1] | [true, true, true] = true
            
            //* If match_per_row is true, merge both rows together
            match_per_row ? reg_merged.push({...df_a.datos[i],...df_b.datos[e]}):false;
            match_per_row ? existed_matches=true:false
            
        } //! Next row in df_b

        existed_matches===false && how==='left' ? reg_merged.push({...df_a.datos[i]}):false;

    }   //% Next row in df_a

    if (debug===true) console.table(reg_merged);
    return new DataFrame(reg_merged);
}

function concatenate(){
    const df_a = arguments[0];
    const df_b = arguments[1];
    const debug = arguments[2];

    const new_data = df_a.datos.concat(df_b.datos);
    
    if (debug === true) console.table(new_data);
    return new DataFrame(new_data);
}

function rename_columns(table_array, columns_dict={}){
    let table_array_copy = structuredClone(table_array);

    return table_array_copy.map(row=>{
        Object.entries(columns_dict).forEach(([older, newer] = item) =>{
            row[newer] = row[older];
            delete row[older];
        });
        return row;
    });
}

function get_by_index(array,indexes){
    const array_values=[];
    indexes.forEach(index=> array_values.push(array.at(index)));
    return array_values;
}

//! ==============================================================================
//! Funciones para agrupaciones        
function get_column_values(table_array=[], column){
    let array=[];
    table_array.forEach(row=> array.push(row[column]));
    return array;    
}

function conservarte_columns(table_array, column_list){
    return table_array.map(row=>{
        const new_row={};
        column_list.forEach(column=>{
            new_row[column] = row[column];
        });
        return new_row;
    });
}



//% ==============================================================================
//% Clases      
class Grouper{
    constructor(group, by, columns, debug){
        this.data_grouped = group;                //*------------------------------- Data gruped with keys
        this.by = by;                             //*------------------------------- Columns in by list
        this.all_columns = columns;               //*------------------------------- All columns in the df
        this.ungruped_columns = columns.filter(each => ! by.includes(each));
        this.debug = debug; 

        let table_grouped = Object.values(this.data_grouped).map(each_table_group=>each_table_group.at());
        this.table_grouped = conservarte_columns(table_grouped, this.by)


        if (debug===true) console.table(this.table_grouped);
    }

    
    agg(agg_dict, sep={}){
        //+ 1.- Make agrupation and the other columns become in a list
        //*Trying to do the next: {Grupo: 'A', Color: 'Morado', Calificacion: [], Audiencia: [] } 
        let table_arrays = Object.values(this.data_grouped).map(table_group=>{
            let uniq_records = {...table_group.at()};    

            for(let column of this.ungruped_columns){   
                let series = get_column_values(table_group,column);

                delete uniq_records[column];
                uniq_records[column] = series;
            }

            return uniq_records;
        });
        
        //* 2.- Adding functions to the columns in agg_dict
        let final_df_grouped = table_arrays.map(row=>{
            for(let [column_target, funcion_2_aplicate] of Object.entries(agg_dict)){
                
                
                funcion_2_aplicate = Array.isArray(funcion_2_aplicate) ?  funcion_2_aplicate:[funcion_2_aplicate];
                
                for (const funcion of funcion_2_aplicate){
                    let result;      

                    switch(funcion){
                        case 'first':
                            result = calc_first(row[column_target]);
                            break;
                        case 'last':
                            result = calc_last(row[column_target]);
                            break;
                        case 'max':
                            result = calc_max(row[column_target]);
                            break;    
                        case 'min':
                            result = calc_min(row[column_target]);
                            break;    
                        case 'sum':
                            result = (sep[column_target] === undefined) ? calc_sum(row[column_target],'') : calc_sum(row[column_target], sep[column_target]);
                            break;
                        case 'avg':
                            result = calc_avg(row[column_target]);
                            break;
                        case 'unique':
                            result = calc_unique(row[column_target]);
                            break;
                        case 'count':
                            result = calc_count(row[column_target]);
                            break;
                        default:
                            console.log("That functions is not defined yet");
                    }
    
                    row[`${column_target}_${funcion}`] = result;   
                }
                delete row[column_target];
            }

            return row;
        });


        //* 3.- Return just columns in by and agg_dict + function done

        const columns_in_agg = [];
        for(const[key,value] of Object.entries(agg_dict)){
            Array.isArray(value) ? value.forEach(item=>columns_in_agg.push(`${key}_${item}`)) : columns_in_agg.push(`${key}_${value}`) 
        }
        let columns_to_conservate =  this.by.concat(columns_in_agg);         
        let final_df = conservarte_columns(final_df_grouped, columns_to_conservate);

        if (this.debug===true) console.table(final_df);
        return new DataFrame(final_df);
    }
    
}

class DataFrame{
    #data;
    constructor(initial_data=[], debug=false){
        this.#initial_setter([...initial_data]);
        this.debug = debug;
    }

    #initial_setter(in_data){
        this.#data = in_data;
        if(this.is_empty == true) return {};

        this.columns.forEach(column_name => {
            let values = get_column_values(this.#data, column_name);

            this[column_name] = new Object(Object.assign([],values));
            this[column_name].first = (in_array=values)=>calc_first(in_array);
            this[column_name].last = (in_array=values)=>calc_last(in_array);
            this[column_name].max = (in_array=values)=>calc_max(in_array);  
            this[column_name].min = (in_array=values)=>calc_min(in_array);  
            this[column_name].sum = (in_array=values, sep='')=>calc_sum(in_array, sep);  
            this[column_name].count = (in_array=values)=>calc_count(in_array);  
            this[column_name].unique = (in_array=values)=>calc_unique(in_array);
            this[column_name].avg = (in_array=values)=>calc_avg(in_array);
            
            //* Funtions in series
            this[column_name].equals = (nominal, array=values)=>calc_equals(nominal,array);
            this[column_name].isin = (nominal_array,array=values)=>calc_isin(nominal_array,array);
            this[column_name].evaluate = (operador,nominal,array=values)=>evaluate(operador,nominal,array);
            this[column_name].bewteen = (low,hight,array=values)=>between(low,hight,array);
            this[column_name].opr = (operador, array=values)=> calc_opr(operador,array);
            this[column_name].zip = (array_zipper, array=values)=> calc_zip([array_zipper,array]);

            this[column_name].not_equals = (nominal, array=values)=>calc_not_equals(nominal,array); 
        });
    }



    //* ==============================================================
    
    //% Metodos GETTER ==========
    get is_empty(){
        return this.#data.length===0?true:false;
    }

    get me(){
        return console.table(this.datos);
    }

    get shape(){
        if(this.is_empty == true) return 'DataFrame empty';
        return [this.datos.length, Object.keys(this.datos.at()).length];
    }

    get columns(){
        if(this.is_empty == true) return [];
        return Object.keys(this.datos.at());
    }

    get datos(){
        return this.#data;
    }

    //% ========================


    //! Metodos SETTER ===========
    set datos(new_data){
        this.#initial_setter(new_data);
        if (this.debug===true) this.me;
    }

    //+ Metodos en la morfologia 
    add_column(column_name, column_values){
        const data2restructure = structuredClone(this.datos);
        data2restructure.forEach((row,index)=> row[column_name] = column_values[index]);
        this.datos = data2restructure;
    }

    //+ Metodos comunes ==========
    head(qty_rows=5){
        console.table(this.datos.slice(0,qty_rows));
    }

    tail(qty_rows=5){
        console.table(this.datos.slice(this.datos.length-qty_rows, this.datos.length));
    }

    groupby(by=[], debug=false){
        let data_grouped={};

        this.datos.forEach(row=>{
            let key = by.map(column => `[${column}](${row[column]})`).join('|');  
            key in data_grouped ? data_grouped[key].push(row):data_grouped[key]=[row]; 
        });

        return new Grouper(data_grouped,by,this.columns,debug);
    }

    merge(df_b, how, args, debug=false){
        return merge(this, df_b, how, args, debug);
    }

    where(index_condition, debug=false){
        //! Deveria devolver un nuevo dataframe
        if ((index_condition === undefined) || (index_condition.length === 0)) return undefined;

        const new_data = this.datos.filter((_,index)=> index_condition.includes(index));
        
        if (debug===true) console.table(new_data);
        return new DataFrame(new_data);
    }

    concatenate(df_b, debug=false){
        return concatenate(this, df_b, debug);
    }
    
    get_by_indexes(indexes){
        return get_by_index(this.datos, indexes);
    }
}
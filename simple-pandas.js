

//% Funciones para columnas ===================
function calc_max(array){
    if (typeof array.at() === 'string'){ throw('No valido para strings');}
    const max = array.reduce((a, b) => Math.max(a, b));    
    return max;
}

function calc_min(array){
    const min = array.reduce((a, b) => Math.min(a, b));    
    return min;
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

function merge(){

    //+ Default parameters
    let df_a = arguments[0];
    let df_b = arguments[1];
    const how = arguments[2];
    arguments=arguments[3];
    let on = arguments['on'];
    let left_on = arguments['left_on'];
    let right_on = arguments['right_on'];
    const suffixies = arguments['suffixies'] ? arguments['suffixies']:['_X','_Y'];


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
    on = calc_zip(args=[left_on,right_on]);

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
            matches_list = on.map( ([left_on, right_on] =  zipped) =>{ 
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

    console.table(reg_merged);
    return new DataFrame(reg_merged);
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

//! Funciones para agrupaciones ===================
function get_column_values(table_array=[], column){
    let lista=[];
    table_array.forEach(row=> lista.push(row[column]));
    return lista;    
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

//% Clases
class Grouper{
    constructor(group, by, columns){
        this.data_grouped = group;                //*------------------------------- Data gruped with keys
        this.by = by;                             //*------------------------------- Columns in by list
        this.all_columns = columns;               //*------------------------------- All columns in the df
        this.ungruped_columns = columns.filter(each => ! by.includes(each));


        let table_grouped = Object.values(this.data_grouped).map(each_table_group=>each_table_group.at());
        this.table_grouped = conservarte_columns(table_grouped, this.by)

        // //* Show
        console.table(this.table_grouped);
    }

    
    agg(agg_dict, sep=[]){

        let columns_in_agg = Object.keys(agg_dict);
        
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
            for(const [column_target, func2apply] of Object.entries(agg_dict)){
                
                let result;      
                switch(func2apply){
                    case 'max':
                        result = calc_max(row[column_target]);
                        break;    
                    case 'min':
                        result = calc_min(row[column_target]);
                        break;    
                    case 'sum':
                        result = (sep[column_target] === undefined) ? calc_sum(row[column_target],'') : calc_sum(row[column_target], sep[column_target]);
                        break;
                    case 'unique':
                        result = calc_unique(row[column_target]);
                        break;
                    default:
                        console.log("That functions is not defined yet");
                }

                delete row[column_target];
                row[column_target] = result;   
                
                }

            return row;
        });

        //* 3.- Return just columns in by and agg_dict
        let columns_to_conservate =  this.by.concat(columns_in_agg); 
        let final_df = conservarte_columns(final_df_grouped, columns_to_conservate);

        console.table(final_df);
        return new DataFrame(final_df);
    }
    
}

class DataFrame{
    #data;
    #shape;
    constructor(initial_data){
        this.#initial_setter([...initial_data]);
    }

    #initial_setter(in_data){
        this.#data = in_data;
        this.columns.forEach(column_name => {
            let values = get_column_values(this.#data, column_name);

            this[column_name] = new Object(Object.assign([],values));
            this[column_name].max = (params=values)=>calc_max(params);  
            this[column_name].min = (params=values)=>calc_min(params);  
            this[column_name].sum = (valores=values, sep='')=>calc_sum(valores, sep);  
            this[column_name].count = (params=values)=>calc_count(params);  
            this[column_name].unique = (params=values)=>calc_unique(params);
        });
    }


    //* ==============================================================
    
    //% Metodos GETTER ==========
    get me(){
        return console.table(this.datos);
    }

    get shape(){
        this.#shape = [this.datos.length, Object.keys(this.datos.at()).length];
        return this.#shape;
    }

    get columns(){
        return Object.keys(this.datos.at());
    }

    get datos(){
        return this.#data;
    }
    //% ========================


    //! Metodos SETTER ===========
    set datos(new_data){
        this.#initial_setter(new_data);
        return this.me;
    }


    //+ Metodos comunes ==========
    groupby(by=[]){
        let data_grouped={};

        this.datos.forEach(row=>{
            let key = by.map(column => `[${column}](${row[column]})`).join('|');  
            key in data_grouped ? data_grouped[key].push(row):data_grouped[key]=[row]; 
        });

        return new Grouper(data_grouped,by,this.columns);
    }

    merge(df_b, how, args){
        return merge(this, df_b, how, args);
    }

}
// let datos = [
//     {"Grupo": "A", "Color":"Rojo", "Calificacion":10, "Audiencia":10},
//     {"Grupo": "A", "Color":"Rojo", "Calificacion":5, "Audiencia":5},
//     {"Grupo": "A", "Color":"Morado", "Calificacion":20, "Audiencia":3},
//     {"Grupo": "B", "Color":"Verde", "Calificacion":10, "Audiencia":2},
//     {"Grupo": "B", "Color":"Verde", "Calificacion":4, "Audiencia":15},
//     {"Grupo": "C", "Color":"Azul", "Calificacion":10, "Audiencia":9}
// ]



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
    get see(){
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

}


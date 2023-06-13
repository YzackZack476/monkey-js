function add_ts_sheet(node, ts_sheet){
    node.innerHTML+=ts_sheet;
}

async function ts_compiler(path_array){
    //% Lectura
    const ts_files_promise_array = path_array.map(path=>fetch(path));
    const ts_response_array= await Promise.all(ts_files_promise_array);
    const ts_sheets = await Promise.all(ts_response_array.map(sheet_response=>sheet_response.text()))
    
    //% Compilado 
    let node = document.createElement("script");
    node.setAttribute("defer",true);

    ts_sheets.forEach(ts_sheet_code=>{
        const ts_compiled = ts.transpileModule(ts_sheet_code, {}).outputText;
        add_ts_sheet(node,ts_compiled);
    });

    document.head.appendChild(node);
}

export { ts_compiler as ts_compiler };

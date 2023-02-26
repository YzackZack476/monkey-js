// https://covidtracking.com/data/api
const URL = 'https://api.covidtracking.com/v1/us/daily.json';
fetch(URL)
    .then((response)=>response.json())
    .then((data)=>main(data))


function main(data){
    const df = new DataFrame(initial_data=data, debug=true);
    df.me;
}

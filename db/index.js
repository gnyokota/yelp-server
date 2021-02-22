const {Pool} = require('pg'); 

//postgres automatically knows that the variables are in the .ENV file
const pool = new Pool();

module.exports ={
    query: (text,params) => pool.query(text,params)
};
require('dotenv').config(); 
const express = require('express');
const db = require('./db/index');
// express allows me to send data back as JSON. 
const app = express();

//middleware using express:
app.use(express.json());

//with res.status(200//404//400) I can define the status of the request. 
//1. get all restaurants
app.get('/api/v1/restaurants', async(req,res)=>{
    try{
        const results = await db.query('SELECT * FROM restaurants');
        const data = await res.status(200).json({
            data:{
                restaurants: results.rows[0]
            }
        });
    }catch(err){
        console.error(err.message); 
    }
});

//2.get one resturant
//:id is a params inside the req obj.  
app.get('/api/v1/restaurants/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        //I can not use string concatenation in the query below
        //It makes my server open to attacks, we must use a placeholder  
        const result = await db.query('SELECT * FROM restaurants WHERE id=$1',[id]);
        const data = await res.status(200).json({
            restaurant: result.rows[0]
        });
    }catch(err){
        console.error(err.message); 
    }
});

//3.create a restaurant:
app.post('/api/v1/restaurants', async(req,res)=>{
    try{
        const{name,location,price}= req.body; 
        const results = await db.query('INSERT INTO restaurants (name,location,price_range) VALUES ($1,$2,$3) RETURNING *',[name,location,price]);
        const data = await res.status(201).json({
            restaurant: results.rows[0]
        });
    }catch(err){
        console.error(err.message); 
    }
});

//4.update a resturant:
app.put('/api/v1/restaurants/:id', async(req,res)=>{
    try{
        const{name,location,price}= req.body; 
        const id = req.params.id;
        const result = await db.query('UPDATE restaurants SET name=$1,location=$2,price_range=$3 WHERE id=$4 RETURNING  *',[name,location,price,id]);
        const data = await res.status(200).json({
            status:'sucessfully edited',
            restaurant: result.rows[0]
        });
    }catch(err){
        console.error(err.message); 
    }
});

//5. delete a resturant:
app.delete('/api/v1/restaurants/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const result = await db.query('DELETE FROM restaurants WHERE id=$1',[id]);
        const data = await res.status(204).json({
            status:'sucessfully deleted',
        });
    }catch(err){
        console.error(err.message); 
    }
});

const port = process.env.PORT || 4001; 
app.listen(port,()=> console.log(`The server is running on port ${port}`)); 

//npm run start-dev 

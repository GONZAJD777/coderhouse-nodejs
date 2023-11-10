import ProductManager from "./ProductManager.js";
import express from "express";

const pm = new ProductManager ('./db/products.json');
const app= express();

app.get('/products', async(request,response)=>{
    let {limit} = request.query; 
    const result= await pm.getProducts({limit});
    response.json(result);   

});

app.get('/products/:pid', async(request,response)=>{
    const id=Number(request.params.pid);
    const result= await pm.getProductById(id);
    if (!result){
        response.status(404).json({message: 'El producto con Id '+id+' no existe.'});
    }else {
        response.json(result);
    }
    
});

app.listen(8080);
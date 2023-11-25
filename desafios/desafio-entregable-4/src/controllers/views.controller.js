import ProductsManager from "../manager/products.manager.js";

const pm = new ProductsManager ();

export async function getController (request,response){
    const productsList = await pm.getProducts();
    response.render('home', { productsList });
}

export async function getRealTimeController (request,response){
    const productsList = await pm.getProducts();
    response.render('realTimeProducts', { productsList }); 
}
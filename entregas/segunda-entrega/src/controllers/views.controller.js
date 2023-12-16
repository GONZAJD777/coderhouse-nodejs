import ProductsManager from "../dao/mongo/managers/products.manager.js";
import CartsManager from "../dao/mongo/managers/carts.manager.js";
//import ProductsManager from "../dao/fileSystem/managers/products.manager.js";

const pm = new ProductsManager ();
const cm = new CartsManager ();

export async function getController (request,response){
    try{
    const cartId = request.params.cid;
    const result = await pm.getProductsPaginate(request.query);
    const products = result.payload;
    const currentPage = result.page;
    const {status,totalPages,prevPage,nextPage, hasPrevPage, hasNextPage, prevLink, nextLink } = result;
    const responseObject = {status,products,cartId,totalPages,prevPage,nextPage,currentPage,hasPrevPage,hasNextPage,prevLink,nextLink}

    response.render("products", {responseObject});

} catch (error)
{ 
    response.status(400).json({Result: 'ERROR', Operation: 'GetProducts' ,Code:error.code, Message: error.message});
    console.log({Result: 'ERROR', Operation: 'GetProducts' ,Code:error.code, Message: error.message});
} 
}

export async function getRealTimeController (request,response){
    try{
    const {limit,category,stock,price} = request.query;
    const productsList = await pm.getProducts({limit,category,stock,price});
    response.render('realTimeProducts', { productsList }); 
    } catch (error)
    {        
        response.status(400).json({Result: 'ERROR', Operation: 'GetProducts' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'GetProducts' ,Code:error.code, Message: error.message});
    }    

}


export async function getCartProducts (request,response){
    try{
    const cartId = request.params.cid;
    const result = await cm.getCartById(cartId);
    const productsList = result[0].cartDetail;
    let CartTotalAmount = productsList.reduce((total, productsList) => total + productsList.product.price*productsList.quantity, 0);
    response.render('carts', { productsList,CartTotalAmount,cartId}); 
    } catch (error)
    {        
        response.status(400).json({Result: 'ERROR', Operation: 'getCartById' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'getCartById' ,Code:error.code, Message: error.message});
    }    
}
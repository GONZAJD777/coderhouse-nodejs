import CartsManager from "../../services/mongo/carts.manager.js";
//import ProductsManager from "../dao/fileSystem/managers/carts.manager.js";

const cm = new CartsManager ();

export async function getController (request,response){
    const result= await cm.getCarts();
    response.json(result);   
}

export async function getIdController (request,response){
    const id=request.params.cid
    //let id=Number(request.params.cid);
    try {
        const result= await cm.getCartById(id);
        response.json({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Objeto encontrado', Object: result});
    }catch (error){
        response.status(400).json({Result: 'ERROR', Operation: 'Find by ID' ,Code:error.code, Message: error.message});
        }
    
}

export async function postController(request,response){
    try {
        //const id=undefined;
        const result= await cm.addCart();
        response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message});
    }
}

export async function postAddItemController(request,response){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        const result= await cm.updateCartAndProduct(cid,pid,1,true);
        response.json({Result: 'OK' , Operation: 'AddProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'AddProduct' ,Code:error.code, Message: error.message});
    }
}

export async function AddToCartController(request,response){
    try {
        const pid = request.body.pid;
        const cid = request.body.cid;
        const result= await cm.updateCartAndProduct(cid,pid,1,true);
        response.json({Result: 'OK' , Operation: 'AddProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'AddProduct' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Register' ,Code:error.code, Message: error.message});
    }
}



export async function deleteRemoveItemController(request,response){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        //const pid = parseInt(request.params.pid);
        //const cid = parseInt(request.params.cid);
        const result= await cm.deleteProductFromCart(cid,pid,);
        response.json({Result: 'OK' , Operation: 'RemoveProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'RemoveProduct' ,Code:error.code, Message: error.message});
    }

}

export async function deleteCartController(request,response){
    try {
        const cid = request.params.cid;
        //const pid = parseInt(request.params.pid);
        //const cid = parseInt(request.params.cid);
        const result= await cm.deleteCart(cid);
        response.json({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se elimino el carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'Delete' ,Code:error.code, Message: error.message});
    }
}

export async function putQuantityController(request,response){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        let {quantity}= request.body;        
        const result= await cm.updateCartProductQuantity(cid,pid,quantity);
        response.json({Result: 'OK' , Operation: 'UpdateQuantity',Code: "200" ,Message: 'Se modifico la cantidad unidades del producto en el carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'UpdateQuantity' ,Code:error.code, Message: error.message});
    }
}

export async function putCartProductsController(request,response){
    try {
        const cid = request.params.cid;
        let {cartDetail}= request.body;        
        const result= await cm.updateCartProducts(cid,cartDetail);
        response.json({Result: 'OK' , Operation: 'UpdateCart',Code: "200" ,Message: 'Se modifico el carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'UpdateCart' ,Code:error.code, Message: error.message});
    }
}
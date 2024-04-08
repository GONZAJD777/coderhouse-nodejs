import CartsManager from "../../services/carts.manager.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js"

const cm = new CartsManager ();

export async function getController (request,response){
    const result= await cm.getCarts();
    response.status(200).send(result);   
}

export async function getIdController (request,response,next){
    const id=request.params.cid
    try {
        const result= await cm.getCartById(id);
        response.status(200).send({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Objeto encontrado', Object: result});
    }catch (error){
        responseErrorHandler(error,request,response,next)
        }
    
}

export async function postController(request,response,next){
    try {
        const result= await cm.addCart();
        response.status(200).send({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}

//Controller para agregar items al carrito, informacion de entrada via parametros
export async function postAddItemController(request,response,next){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        const result= await cm.updateCartAndProduct(cid,pid,1,true);
        response.status(200).send({Result: 'OK' , Operation: 'AddProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}

//Controller para agregar items al carrito desde web, se envian parametros a travez del body
export async function AddToCartController(request,response,next){
    try {
        const pid = request.body.pid;
        const cid = request.body.cid;
        const result= await cm.updateCartAndProduct(cid,pid,1,true);
        response.status(200).send({Result: 'OK' , Operation: 'AddProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}


//Controller para quitar del carrito el 1 item enviado como parametro
export async function deleteRemoveItemController(request,response,next){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        const result= await cm.deleteProductFromCart(cid,pid);
        response.status(200).send({Result: 'OK' , Operation: 'RemoveProduct',Code: "200" ,Message: 'Se ha quitado el producto del carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }

}

//Controller para vaciar carrito (no se eliminan los carritos)
export async function deleteCartController(request,response,next){
    try {
        const cid = request.params.cid;
        const result= await cm.deleteCart(cid);
        response.status(200).send({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se ha vaciado el carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}
//Controller para actualizar 1 item del carrito con los parametros enviados en el body
export async function putQuantityController(request,response,next){
    try {
        const pid = request.params.pid;
        const cid = request.params.cid;
        let {quantity}= request.body;        // "quantity": 10
        const result= await cm.updateCartProductQuantity(cid,pid,Number(quantity));
        response.status(200).send({Result: 'OK' , Operation: 'UpdateQuantity',Code: "200" ,Message: 'Se modifico la cantidad unidades del producto en el carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}

//Controller para actualizar todo el cartDetail, sobreescribe el detalle con el nuevo array de objetos
export async function putCartProductsController(request,response,next){
    try {
        const cid = request.params.cid;
        let cartDetail= request.body;  
        const result= await cm.updateCartProducts(cid,cartDetail);
        response.status(200).send({Result: 'OK' , Operation: 'UpdateCart',Code: "200" ,Message: 'Se modifico el carrito.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
    }
}


export async function deleteAllCartsController(request,response,next){
    try {
        const result= await cm.deleteAllCart();
        response.json({Result: 'OK' , Operation: 'DeleteAllCart',Code: "200" ,Message: 'Se eliminaron todos los carritos.', Object: result});
    }catch (error){ 
        responseErrorHandler(error,request,response,next)
        //response.status(400).json({Result: 'ERROR', Operation: 'DeleteAllCart' ,Code:error.code, Message: error.message});
    }
}
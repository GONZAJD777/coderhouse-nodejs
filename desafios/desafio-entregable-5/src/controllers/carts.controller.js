import CartsManager from "../dao/mongo/managers/carts.manager.js";
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
        //const pid = parseInt(request.params.pid);
        //const cid = parseInt(request.params.cid);
        const result= await cm.updateCartAndProduct(cid,pid);
        response.json({Result: 'OK' , Operation: 'AddProduct',Code: "200" ,Message: 'Se agrego el porducto al carrito.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'AddProduct' ,Code:error.code, Message: error.message});
    }

}
import CartsManager from "../manager/carts.manager.js";

const cm = new CartsManager ();

export async function getController (request,response){
    const result= await cm.getCarts();
    response.json(result);   
}

export async function getIdController (request,response){
    let id=Number(request.params.cid);
    try {
        const result= await cm.getCartById(id);
        response.json({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Objeto encontrado', Object: result});
    }catch (error){
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Find by ID' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
    
}

export async function postController(request,response){
    try {
        //const id=undefined;
        const result= await cm.createCart();
        response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
}

export async function postAddItemController(request,response){
    try {
        const pid = parseInt(request.params.pid);
        const cid = parseInt(request.params.cid);
        const result= await cm.updateCartAndProduct(cid,pid);
        response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
}
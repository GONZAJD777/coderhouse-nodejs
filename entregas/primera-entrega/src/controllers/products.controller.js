import ProductsManager from "../manager/products.manager.js";

const pm = new ProductsManager ();

export async function getController (request,response){
    let {limit} = request.query; 
    const result= await pm.getProducts(limit);
    response.json(result);   
}

export async function getIdController (request,response){
    let id=Number(request.params.pid);
    try {
        const result= await pm.getProductById(id);
        response.json({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Objeto encontrado', Object: result});
    }catch (error){
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Find by ID' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
    
}

export async function postController(request,response){
    try {
        const id=undefined;
        const result= await pm.addProduct({...request.body,id});
        response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
}

export async function putController (request,response){
    const pid = parseInt(request.params.pid);
    try {
        const update = ({ ...request.body, id: pid }) 
        const result= await pm.updateProduct(update);
        response.json({Result: 'OK' , Operation: 'Update',Code: "200" ,Message: 'Se actualizo el objeto', Object: result});
    }catch (error){ 
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Update' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
    }
}

export async function deleteController (request,response){
        let id=Number(request.params.pid);
        try {
            const result= await pm.deleteProduct(id);
            response.json({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se elimino el objeto', Object: result});
        }catch (error){ 
            const str = error.message.indexOf("|");
            response.status(400).json({Result: 'ERROR', Operation: 'Delete' ,Code:error.message.substring(0,str), Message: error.message.substring(str+1) });
        } 
        
}




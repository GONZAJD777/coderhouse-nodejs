import ProductsManager from "../dao/mongo/managers/products.manager.js";
//import ProductsManager from "../dao/fileSystem/managers/products.manager.js";
import { CustomError, NotFoundError } from '../model/custom.error.js';

const pm = new ProductsManager ();

export async function getController (request,response){
    let {limit} = request.query; 
    const result= await pm.getProducts(limit);
    response.json(result);   
}

export async function getIdController (request,response){
    const id=request.params.pid;
    //const id=Number(request.params.pid); 
    try {
        const result= await pm.getProductById(id);
        response.json({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Objeto encontrado', Object: result});
    }catch (error){
        const str = error.message.indexOf("|");
        response.status(400).json({Result: 'ERROR', Operation: 'Find by ID' ,Code:error.code, Message: error.message});  
    }
    
}

export async function postController(request,response){
    try {
        const id=undefined;
        const result= await pm.addProduct({...request.body,id});
        response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message});  
      }
}

export async function putController (request,response){
    const pid = request.params.pid;
    //const pid = parseInt(request.params.pid);
    const {title,description,thumbnail,status,category,code,stock,price} = request.body
    try {
        const update = ({id:pid,title,description,thumbnail,status,category,code,stock,price});
        Object.keys(update).forEach(key => update[key] === undefined && delete update[key])
        const result= await pm.updateProduct(update);
        response.json({Result: 'OK' , Operation: 'Update',Code: "200" ,Message: 'Se actualizo el objeto', Object: result});
    }catch (error){ 
        response.status(400).json({Result: 'ERROR', Operation: 'Update' ,Code:error.code, Message: error.message});
    }
}

export async function deleteController (request,response){
    const id = request.params.pid;
    //const id=Number(request.params.pid);
        try {
            const result= await pm.deleteProduct(id);
            response.json({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se elimino el objeto', Object: result});
        }catch (error){ 
            response.status(400).json({Result: 'ERROR', Operation: 'Delete' ,Code:error.code, Message: error.message});
        } 
        
}




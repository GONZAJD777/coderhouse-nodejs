import ProductsManager from "../../services/products.manager.js";
import {mockProducts} from "../../mocks/products.js"
import responseErrorHandler from "../../middlewares/error.response.middleware.js"
import {emitProducts} from "../../config/socket.config.js";

const pm = new ProductsManager ();


export async function mockController (request,response,next){
        try {
            const result= await mockProducts();
            response.json({Result: 'OK' , Operation: 'Mock Products generation',Code: "200" ,Message: 'Objetos creados', Object: result});
        }catch (error){
            responseErrorHandler(error,request,response,next);  
        }
}

export async function getController (request,response,next){
    const {limit} = request.query;
        try {
            const result= await pm.getProducts(limit);
            response.json({Result: 'OK' , Operation: 'List All',Code: "200" ,Message: 'Producto encontrado', Object: result});
        }catch (error){
            responseErrorHandler(error,request,response,next);
        }
}

export async function getIdController (request,response,next){
    const id=request.params.pid;
        try {
            const result= await pm.getProductById(id);
            response.json({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Producto encontrado', Object: result});
        }catch (error){
            responseErrorHandler(error,request,response,next);
        }
    
}

export async function getPaginateController (request,response,next){
    try{
       
        const result = await pm.getProductsPaginate(2,request.query);
        const products = result.payload;
        const currentPage = result.page;
        const {totalPages,prevPage,nextPage, hasPrevPage, hasNextPage,prevLink,nextLink} = result;
              
        response.json({status: 'OK' , payload: products,totalPages,prevPage,nextPage,currentPage,hasPrevPage,hasNextPage,prevLink,nextLink});

    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function postController(request,response,next){
        try {
            const {title,description,thumbnail,status,category,code,stock,price} = request.body;
            const owner = request.user._id;
            const result= await pm.addProduct({title,description,thumbnail,status,category,code,stock,price,owner});
            emitProducts(); 
            response.status(201).send({Result: 'OK' , Operation: 'create',Code: "201" ,Message: 'Se creo el Producto correctamente.', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}

export async function putController (request,response,next){
    const pid = request.params.pid;
    const {title,description,thumbnail,status,category,code,stock,price} = request.body
        try {
            const update = ({title,description,thumbnail,status,category,code,stock,price});
            Object.keys(update).forEach(key => update[key] === undefined && delete update[key])
            const result= await pm.updateProduct(pid,update);
            response.status(200).send({Result: 'OK' , Operation: 'Update',Code: "200" ,Message: 'Se actualizo el Producto', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}

export async function deleteController (request,response,next){
    const id = request.params.pid;
        try {
            const result= await pm.deleteProduct(id);
            emitProducts(); 
            response.status(200).send({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se elimino el Producto', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        } 
        
}




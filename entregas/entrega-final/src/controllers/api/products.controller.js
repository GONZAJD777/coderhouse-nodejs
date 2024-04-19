import ProductsManager from "../../services/products.manager.js";
import {mockProducts} from "../../mocks/products.js"
import responseErrorHandler from "../../middlewares/error.response.middleware.js"
import {emitProducts} from "../../config/socket.config.js";
import { deleteProductNotificator } from "../../config/mailer.config.js";
import ProductsDTO from "../../dao/dto/products.DTO.js";

const pm = new ProductsManager ();


export async function mockController (request,response,next){
        try {
            const result= await mockProducts();
            response.status(200).send({Result: 'OK' , Operation: 'Mock Products generation',Code: "200" ,Message: 'Objetos creados', Object: result});
        }catch (error){
            responseErrorHandler(error,request,response,next);  
        }
}


export async function getIdController (request,response,next){
        try {
            const result= await pm.getProduct(ProductsDTO.build({id:request.params.pid}));
            response.status(200).send({Result: 'OK' , Operation: 'Find by ID',Code: "200" ,Message: 'Producto encontrado', Object: result});
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
              
        response.status(200).send({status: 'OK' , payload: products,totalPages,prevPage,nextPage,currentPage,hasPrevPage,hasNextPage,prevLink,nextLink});

    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function postController(request,response,next){
        try {
            const result= await pm.addProduct(ProductsDTO.build({...request.body,owner:request.user.id}));
            emitProducts(); 
            response.status(201).send({Result: 'OK' , Operation: 'create',Code: "201" ,Message: 'Se creo el Producto correctamente.', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}

export async function putController (request,response,next){
        try {
            const result= await pm.updateProduct(ProductsDTO.build({id:request.params.pid,...request.body}));
            response.status(200).send({Result: 'OK' , Operation: 'Update',Code: "200" ,Message: 'Se actualizo el Producto', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}

export async function deleteController (request,response,next){
        try {
            const result= await pm.deleteProduct(ProductsDTO.build({id:request.params.pid}));
            emitProducts(); 
            deleteProductNotificator(request.user,result);
            response.status(200).send({Result: 'OK' , Operation: 'Delete',Code: "200" ,Message: 'Se elimino el Producto', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}




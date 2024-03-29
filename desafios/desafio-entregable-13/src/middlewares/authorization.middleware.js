import jwt from "jsonwebtoken";
import { CKE_SCT } from "../config/config.js";
import { CustomError,UnauthorizedError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import responseErrorHandler from "./error.response.middleware.js";
import ProductsManager from "../services/products.manager.js";

const PRIVATE_KEY = CKE_SCT;
const pm = new ProductsManager();

export const authorization = (roles,ownership) => {
    return async (request,response,next) => {
        try {

            const user = request.user;
            const object = {
                cart:request.params.cid || request.body.cid,
                product:request.params.pid || request.body.pid,
                user:request.params.uid || request.body.uid
            } 
            
        
            if(!request.user) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
            if(!roles.includes(request.user.role.toLowerCase())) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
            if(ownership) await permission(ownership,object,user); 
            next();

        } catch (error) {
            responseErrorHandler(error,request,response,next);
        }
    }
}

export const authToken = (request,response,next) => {
    try {
        const authHeader = request.headers.authorization ?? "Bearer "+request.signedCookies['token'];
        if(!authHeader) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
        
        const token = authHeader.split (' ')[1];
        jwt.verify(token,PRIVATE_KEY,(error,credentials) => {
            if(error) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
            request.user=credentials.user;
            next();
        })
//'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImY0MDBhMTVmLTM4NjQtNDRlZC1hZTZlLTdlZGQ2MDcyYmY1ZSIsImZpcnN0TmFtZSI6Ikp1YW4iLCJsYXN0TmFtZSI6IlJvZHJpZ3VleiIsImVtYWlsIjoianJvZHJpZ3VlekBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ3emZJTmxXaGx4R2pLVG1UeDhLa1FlSko3VU1vZEVCalpNTHhSai4uekdGNGk4R2tXN1JEbSIsImFnZSI6MjksInJvbGUiOiJ1c2VyIiwibGFzdENvbm5lY3Rpb24iOiIyOS8zLzIwMjQgMDE6NDE6NDEiLCJjYXJ0IjoiYjc3NDQyODctYmY3Yi00NjA3LTgwYzEtODJjZWE4MDZkNGVlIiwiZG9jdW1lbnRzIjpbeyJuYW1lIjoiYXZhdGFyIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXHByb2ZpbGVzXFxhdmF0YXItMTcxMTYxNTM1MzA4OS0yNjAxMzA5MjYucG5nIn0seyJuYW1lIjoidXNlcklkRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlcklkRG9jLTE3MTE2ODU3NjYwNTEtOTcyNzMyMTk5LnBuZyJ9LHsibmFtZSI6InVzZXJBZGRyZXNzRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlckFkZHJlc3NEb2MtMTcxMTY4NTc2NjA1Mi0zMzY5OTQ2NTYucG5nIn0seyJuYW1lIjoidXNlckFjY291bnREb2MiLCJyZWZlcmVuY2UiOiJwdWJsaWNcXGltZ1xcZG9jdW1lbnRzXFx1c2VyQWNjb3VudERvYy0xNzExNjg1NzY2MDUyLTM1NDY5Mzc2Ni5wbmcifV19LCJpYXQiOjE3MTE2ODczMDMsImV4cCI6MTcxMTc3MzcwM30.RsULMFpryDkZIzT69SekNF75tfaCMbenIry47x0RDtk'
//'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImY0MDBhMTVmLTM4NjQtNDRlZC1hZTZlLTdlZGQ2MDcyYmY1ZSIsImZpcnN0TmFtZSI6Ikp1YW4iLCJsYXN0TmFtZSI6IlJvZHJpZ3VleiIsImVtYWlsIjoianJvZHJpZ3VlekBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ3emZJTmxXaGx4R2pLVG1UeDhLa1FlSko3VU1vZEVCalpNTHhSai4uekdGNGk4R2tXN1JEbSIsImFnZSI6MjksInJvbGUiOiJ1c2VyIiwibGFzdENvbm5lY3Rpb24iOiIyOS8zLzIwMjQgMDE6NDE6NDEiLCJjYXJ0IjoiYjc3NDQyODctYmY3Yi00NjA3LTgwYzEtODJjZWE4MDZkNGVlIiwiZG9jdW1lbnRzIjpbeyJuYW1lIjoiYXZhdGFyIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXHByb2ZpbGVzXFxhdmF0YXItMTcxMTYxNTM1MzA4OS0yNjAxMzA5MjYucG5nIn0seyJuYW1lIjoidXNlcklkRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlcklkRG9jLTE3MTE2ODU3NjYwNTEtOTcyNzMyMTk5LnBuZyJ9LHsibmFtZSI6InVzZXJBZGRyZXNzRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlckFkZHJlc3NEb2MtMTcxMTY4NTc2NjA1Mi0zMzY5OTQ2NTYucG5nIn0seyJuYW1lIjoidXNlckFjY291bnREb2MiLCJyZWZlcmVuY2UiOiJwdWJsaWNcXGltZ1xcZG9jdW1lbnRzXFx1c2VyQWNjb3VudERvYy0xNzExNjg1NzY2MDUyLTM1NDY5Mzc2Ni5wbmcifV19LCJpYXQiOjE3MTE2ODczMDMsImV4cCI6MTcxMTc3MzcwM30.RsULMFpryDkZIzT69SekNF75tfaCMbenIry47x0RDtk'   
//"       eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImY0MDBhMTVmLTM4NjQtNDRlZC1hZTZlLTdlZGQ2MDcyYmY1ZSIsImZpcnN0TmFtZSI6Ikp1YW4iLCJsYXN0TmFtZSI6IlJvZHJpZ3VleiIsImVtYWlsIjoianJvZHJpZ3VlekBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ3emZJTmxXaGx4R2pLVG1UeDhLa1FlSko3VU1vZEVCalpNTHhSai4uekdGNGk4R2tXN1JEbSIsImFnZSI6MjksInJvbGUiOiJ1c2VyIiwibGFzdENvbm5lY3Rpb24iOiIyOS8zLzIwMjQgMDE6NDE6NDciLCJjYXJ0IjoiYjc3NDQyODctYmY3Yi00NjA3LTgwYzEtODJjZWE4MDZkNGVlIiwiZG9jdW1lbnRzIjpbeyJuYW1lIjoiYXZhdGFyIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXHByb2ZpbGVzXFxhdmF0YXItMTcxMTYxNTM1MzA4OS0yNjAxMzA5MjYucG5nIn0seyJuYW1lIjoidXNlcklkRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlcklkRG9jLTE3MTE2ODU3NjYwNTEtOTcyNzMyMTk5LnBuZyJ9LHsibmFtZSI6InVzZXJBZGRyZXNzRG9jIiwicmVmZXJlbmNlIjoicHVibGljXFxpbWdcXGRvY3VtZW50c1xcdXNlckFkZHJlc3NEb2MtMTcxMTY4NTc2NjA1Mi0zMzY5OTQ2NTYucG5nIn0seyJuYW1lIjoidXNlckFjY291bnREb2MiLCJyZWZlcmVuY2UiOiJwdWJsaWNcXGltZ1xcZG9jdW1lbnRzXFx1c2VyQWNjb3VudERvYy0xNzExNjg1NzY2MDUyLTM1NDY5Mzc2Ni5wbmcifV19LCJpYXQiOjE3MTE2ODg3NTAsImV4cCI6MTcxMTc3NTE1MH0.DY3qpmWQLJFPSP98ppPphQqs6z3Wmz8yX6CY2bOfxqQ"
}catch (error) {
        responseErrorHandler(error,request,response,next);
    }}

export const permission = async (ownership,object,user) => {
    try {

        //PREMIUM sólo pueda borrar los productos que le pertenecen.
        //ADMIN pueda borrar cualquier producto, aún si es de un owner
        //Sólo ADMIN puede crear,actualizar y eliminar productos.
        //Sólo el USER/PREMIUM puede enviar mensajes al chat.
        //Sólo el USER/PREMIUM puede agregar productos a su carrito.

        const ownCart = ownership.cart; 
        const ownProduct = ownership.product;
        const ownUser = ownership.user;
        const cart = object.cart;
        let product = "";
        if(object.product) {product = await pm.getProductById(object.product)};
        

        if (ownCart ==='owner') {
            if (cart != user.cart) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        } else if (ownCart ==='notOwner') {
            if (cart == user.cart) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        }

        if (ownProduct ==='owner') {
            if (product.owner != user._id && user._id != 'admin' ) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        } else if (ownProduct ==='notOwner') {
            if (product.owner == user._id && user._id != 'admin') throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        }

        if (ownUser ==='owner') {
            if (object.user != user._id && user._id != 'admin' ) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        } else if (ownUser ==='notOwner') {
            if (object.user == user._id && user._id != 'admin') throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
        }

       /*TODO 
       // if (ownCart ==='owner') {
       //     if (cart != user.cart) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
       // } else if (ownCart ==='notOwner') {
       //     if (cart == user.cart) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]); 
       // }
       // if (ownCart ==='owner' && cart != user.cart) {throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);} 
       // if (ownCart ==='notOwner' && cart == user.cart) {throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);} 
        */
        
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT, errorMessages[errorCodes.ERROR_CREATE_PRODUCT]+ ' | ' + error );
    }
}




 

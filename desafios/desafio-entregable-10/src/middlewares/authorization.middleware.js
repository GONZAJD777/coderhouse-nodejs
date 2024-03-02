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
                product:request.params.pid || request.body.pid
            } 
            
        
            if(!request.user) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
            if(!roles.includes(request.user.role.toLowerCase())) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
            if(ownership) await permission(ownership,object,user); 
            //request.ownership = ownership;
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

        
        
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT, errorMessages[errorCodes.ERROR_CREATE_PRODUCT]+ ' | ' + error );
    }
}




 

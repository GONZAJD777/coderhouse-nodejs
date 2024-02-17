import jwt from "jsonwebtoken";
import { CKE_SCT,CKE_OPT } from "../config/config.js";
import { UnauthorizedError,NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import responseErrorHandler from "./error.response.middleware.js"

const PRIVATE_KEY = CKE_SCT

export const authorization = (roles) => {
    return async (request,response,next) => {
        try {
        
            const cid = request.params.cid || request.body.cid ;
            if(!request.user)  throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
            //return response.status(401).send({error:"Unauthorized"})
            if(!roles.includes(request.user.role.toLowerCase())) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
            //return response.status(403).send({error:"No permissions"})
            if(cid){if(request.user.cart != cid) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED])};
                //return response.status(403).send({error:"No permissions"})}
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
    }
}




 

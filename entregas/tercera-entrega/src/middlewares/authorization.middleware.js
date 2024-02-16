import jwt from "jsonwebtoken";
import { CKE_SCT,CKE_OPT } from "../config/config.js";


const PRIVATE_KEY = CKE_SCT

export const authorization = (roles) => {

    return async (request,response,next) => {
        const cid = request.params.cid || request.body.cid ;
        if(!request.user) return response.status(401).send({error:"Unauthorized"})
        if(!roles.includes(request.user.role.toLowerCase())) return response.status(403).send({error:"No permissions"})
        if(cid){if(request.user.cart != cid) return response.status(403).send({error:"No permissions"})}
        next();
    }
}

export const authToken = (request,response,next) => {
    const authHeader = request.headers.authorization ?? "Bearer "+request.signedCookies['token'];
    if(!authHeader) return response.status(401).send({error:"Not Authenticated"}); //si no hay header, es porque no hay token y por tanto no ha sido autenticado

    const token = authHeader.split (' ')[1];
    jwt.verify(token,PRIVATE_KEY,(error,credentials) => {

        if(error) return response.status(403).send({error:"Not Authorized"});
        request.user=credentials.user;
        next();
    })
}




 

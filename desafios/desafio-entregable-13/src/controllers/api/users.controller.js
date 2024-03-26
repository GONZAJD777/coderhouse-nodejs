import { logger,cusLogLevelsOpts } from "../../config/logger.config.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import UserManager from "../../services/users.manager.js"
import fs from "fs";

const um = new UserManager();
export async function swapUserRoleController (request,response,next){
    try{
        const id = request.params.uid;
        const result= await um.updateRole({_id:id});
        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "200" ,Message: 'Se ha modificado el role del usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function uploadDocController (request,response,next){
    try{
        const id = request.params.uid;
        const {avatar,userIdDoc,userAddressDoc,userAccountDoc}=request.files;
        const result= await um.updateDoc({_id:id},{avatar,userIdDoc,userAddressDoc,userAccountDoc});

        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "200" ,Message: 'Se ha cargado la documentacion correctamente', Object: result});
    } catch (error)
    { 
        Object.values(request.files).forEach(element => {fs.rmSync(element[0].path)})
        responseErrorHandler(error,request,response,next);
    } 
}
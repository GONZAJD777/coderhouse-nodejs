import { ADMIN_USER } from "../../config/config.js";
import { logger,cusLogLevelsOpts } from "../../config/logger.config.js";
import { errorCodes,errorMessages } from "../../dictionaries/errors.js";
import { CustomError } from "../../errors/custom.error.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import UserManager from "../../services/users.manager.js"


const um = new UserManager();

export async function getUserInfoController (request,response,next){
    try{
        const id = request.params.uid;
        let result={};
        if(id!=ADMIN_USER._id){
        result= await um.getBy({_id:id})}
        else {result={...ADMIN_USER}}
        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "200" ,Message: 'Informacion de usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function swapUserRoleController (request,response,next){
    try{
        const id = request.params.uid;
        let result={};
        if(id===ADMIN_USER._id)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);                         
        result= await um.updateRole({_id:id})
        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "200" ,Message: 'Se ha modificado el role del usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function uploadDocController (request,response,next){
    try{
        const id = request.params.uid;
        let result={};
        if(id==ADMIN_USER._id)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);   
        const {avatar,userIdDoc,userAddressDoc,userAccountDoc}=request.files;
        result= await um.updateDoc({_id:id},{avatar,userIdDoc,userAddressDoc,userAccountDoc});
        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "200" ,Message: 'Se ha cargado la documentacion correctamente', Object: result});
    } catch (error)
    { 
        Object.values(request.files).forEach(element => {fs.rmSync(element[0].path)})
        responseErrorHandler(error,request,response,next);
    } 
}
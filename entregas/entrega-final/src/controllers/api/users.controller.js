import { ADMIN_USER } from "../../config/config.js";
import { errorCodes,errorMessages } from "../../dictionaries/errors.js";
import { CustomError } from "../../errors/custom.error.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import UserManager from "../../services/users.manager.js"
import UsersDTO from "../../dao/dto/users.DTO.js";
import UserDocDTO from "../../dao/dto/user.documents.DTO.js"
import { deleteUserNotificator } from "../../config/mailer.config.js";
import UserDocsDTO from "../../dao/dto/user.documents.DTO.js";


const um = new UserManager();

export async function getAllUsersController (request,response,next){
    try{
        const result= await um.get();
        response.status(200).send({Result: 'OK' , Operation: 'Get Users',Code: "200" ,Message: 'Informacion de usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function getUserInfoController (request,response,next){
    try{
        let result={};
        if(request.params.uid===ADMIN_USER.id){result={...ADMIN_USER}}
        else {result= await um.getBy(UsersDTO.build({id:request.params.uid}))} 
        if(result.documents){
            result.documents=UserDocsDTO.docsScriptResp(result.documents);
        }       
        response.status(200).send({Result: 'OK' , Operation: 'Get User Information',Code: "200" ,Message: 'Informacion de usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function swapUserRoleController (request,response,next){
    try{
        if(request.params.uid===ADMIN_USER.id)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);                         
        const result= await um.updateRole(UsersDTO.build({id:request.params.uid}));
        response.status(200).send({Result: 'OK' , Operation: 'Change User Role',Code: "200" ,Message: 'Se ha modificado el role del usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function uploadDocController (request,response,next){
    try{
        if(request.params.uid==ADMIN_USER.id)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);   
        const result= await um.updateDoc(UsersDTO.build({id:request.params.uid,documents:UserDocDTO.buildFromMulter(request.files)}));
        response.status(200).send({Result: 'OK' , Operation: 'Document Upload',Code: "200" ,Message: 'Se ha cargado la documentacion correctamente', Object: result});
    } catch (error)
    { 
        //Object.values(request.files).forEach(element => {fs.rmSync(element[0].path)})
        responseErrorHandler(error,request,response,next);
    } 
}

export async function clearInactiveUsersController (request,response,next){
    try{
        const result= await um.deleteAllInactiveUsers();
        deleteUserNotificator(result);
        response.status(200).send({Result: 'OK' , Operation: 'Clear Inactive Users',Code: "200" ,Message: 'Usuarios eliminados', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function deleteUserController (request,response,next){
    try{
        const result= await um.deleteOne(UsersDTO.build({id:request.params.uid}));
        deleteUserNotificator([result]);
        response.status(200).send({Result: 'OK' , Operation: 'Delete User',Code: "200" ,Message: 'Informacion de usuario', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}
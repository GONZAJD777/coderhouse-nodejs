import { ADMIN_USER } from "../config/config.js";
import UserDocsDTO from "../dao/dto/user.documents.DTO.js";
import UsersDTO from "../dao/dto/users.DTO.js";
import { errorCodes, errorMessages } from "../dictionaries/errors.js";
import { CustomError } from "../errors/custom.error.js";
import UserManager from "../services/users.manager.js";
import { logger } from "../config/logger.config.js";
import fs from "fs";



const um = new UserManager()

export const registerUploadFiles = async (request,response,next) => {

    try{
        const {avatar,userIdDoc,userAddressDoc,userAccountDoc}=request.files;
        if(request.params.uid===ADMIN_USER)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);
        if(avatar || userIdDoc || userAddressDoc || userAccountDoc) 
        {await um.updateDoc(UsersDTO.build({id:request.params.uid,documents:UserDocsDTO.buildFromMulter(request.files)}))}
        
        next();
    } catch (error)
    { 
        response.error=error;
        logger.log('error','registerUploadFiles registra error: '+error)              

        Object.values(request.files).forEach(element => {fs.rmSync(element[0].path)})
        next();
    }    
}
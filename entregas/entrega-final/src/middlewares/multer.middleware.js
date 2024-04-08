import { ADMIN_USER } from "../config/config.js";
import { errorCodes, errorMessages } from "../dictionaries/errors.js";
import { CustomError } from "../errors/custom.error.js";
import UserManager from "../services/users.manager.js";
import fs from "fs";


const um = new UserManager()

export const registerUploadFiles = async (request,response,next) => {

    try{
        const id = request.params.uid;
        const {avatar,userIdDoc,userAddressDoc,userAccountDoc}=request.files;
        if(id===ADMIN_USER._id)throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);
        if(avatar || userIdDoc || userAddressDoc || userAccountDoc) 
        {await um.updateDoc({_id:id},{avatar,userIdDoc,userAddressDoc,userAccountDoc})}
        
        next();
    } catch (error)
    { 
        response.error=error;
        Object.values(request.files).forEach(element => {fs.rmSync(element[0].path)})
        next();
    }    
}
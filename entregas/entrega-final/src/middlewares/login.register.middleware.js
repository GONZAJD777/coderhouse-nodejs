import UserManager from "../services/users.manager.js";
import { createHash,isValidPassword,generateToken, verifyToken } from "../utils.js";
import { mailSender } from "../config/mailer.config.js";
import responseErrorHandler from "../middlewares/error.response.middleware.js";
import { BadRequestError,UnauthorizedError } from "../errors/custom.error.js";
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { CKE_SCT,CKE_AGE, PORT, ADMIN_USER} from "../config/config.js";
import { logger } from "../config/logger.config.js";
import UsersDTO from "../dao/dto/users.DTO.js";


const um = new UserManager ();

export const connectionRegistry = async (request,response,next) => {
    try {
        if(request.user.id!=ADMIN_USER.id){
            await um.update(UsersDTO.build({id:request.user.id},{lastConnection : new Date().toISOString()}))  
            logger.log('info','Usuario '+request.user.email+' ejecuta --> '+request.originalUrl);
        }
        
        next();
    }catch (error) {
        responseErrorHandler(error,request,response,next);
    }
}



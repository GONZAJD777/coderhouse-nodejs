import UserManager from "../services/users.manager.js";
import { createHash,isValidPassword,generateToken, verifyToken } from "../utils.js";
import { mailSender } from "../config/mailer.config.js";
import responseErrorHandler from "../middlewares/error.response.middleware.js";
import { BadRequestError,UnauthorizedError } from "../errors/custom.error.js";
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { CKE_SCT,CKE_AGE, PORT, ADMIN_USER} from "../config/config.js";
import { logger } from "../config/logger.config.js";


const um = new UserManager ();
const COOKIE_OPTS = { signed: true, httpOnly: true, maxAge: CKE_AGE  };

export const connectionRegistry = async (request,response,next) => {
    try {
        if(request.user._id!=ADMIN_USER._id){
            await um.update({_id:request.user._id},{lastConnection : new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()})  
            logger.log('info','Usuario '+request.user.email+' ejecuta --> '+request.originalUrl);
        }
        
        next();
    }catch (error) {
        responseErrorHandler(error,request,response,next);
    }
}



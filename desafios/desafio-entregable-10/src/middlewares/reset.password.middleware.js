import UserManager from "../services/users.manager.js";
import { createHash,isValidPassword,generateToken, verifyToken } from "../utils.js";
import { mailSender } from "../config/mailer.config.js";
import responseErrorHandler from "../middlewares/error.response.middleware.js";
import { CustomError,UnauthorizedError } from "../errors/custom.error.js";
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { CKE_SCT,CKE_AGE} from "../config/config.js";
import { logger } from "../config/logger.config.js";


const um = new UserManager ();
const COOKIE_OPTS = { signed: true, httpOnly: true, maxAge: CKE_AGE  };

export const generateResetLink = async (request,response,next) => {
    try {
        const {email,password} = await um.getBy({email:request.body.email});
        const user = {email:email,password:password};
        const linkToken = generateToken(user,10);
        const receivers = user.email;
        const subject = "Coder Ecommmerce - Reset Password Link";
        const message = '\"http://localhost\:8080/resetPassword/'+linkToken+'\"';
        await mailSender(receivers,subject,message);    
        next();
    }catch (error) {
        responseErrorHandler(error,request,response,next);
    }
}

export const verifyLinkToken = async (request,response,next) => {
    try {
            const resetToken = request.params.tid;
            if(!resetToken) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
            
            const user = verifyToken(resetToken);

            if(!user) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);

            response.cookie('token', resetToken, COOKIE_OPTS);
            next();

    }catch (error) {
        response.error=error;
        next();
    }
}

export const resetPassword = async (request,response,next) => {
    try {
        const {password,passwordConf} = request.body;
       
        if(!password===passwordConf) throw new CustomError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
        if(isValidPassword(request.user,password)) throw new CustomError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
        const newPassword = createHash(password);
        await um.update({email:request.user.email,password:newPassword});
        response.clearCookie('token', COOKIE_OPTS);
        next();
            
    }catch (error) {
        responseErrorHandler(error,request,response,next);
    }
}
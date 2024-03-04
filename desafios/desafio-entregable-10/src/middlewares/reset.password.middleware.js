import UserManager from "../services/users.manager.js";
import { createHash,isValidPassword,generateToken, verifyToken } from "../utils.js";
import { mailSender } from "../config/mailer.config.js";
import responseErrorHandler from "../middlewares/error.response.middleware.js";
import { BadRequestError,UnauthorizedError } from "../errors/custom.error.js";
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { CKE_SCT,CKE_AGE} from "../config/config.js";
import { logger } from "../config/logger.config.js";


const um = new UserManager ();
const COOKIE_OPTS = { signed: true, httpOnly: true, maxAge: CKE_AGE  };

export const generateResetLink = async (request,response,next) => {
    try {
        const {email,password} = await um.getBy({email:request.body.email});
        const user = {email:email,password:password};
        const linkToken = generateToken(user,60*60);
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

            const oldUser = await um.getBy({email:user.email});
            //validamos si el password que viaja en el token es aun el que se encuentra cargado en la base.
            //si son distintos, significa que el usuario a logrado cambiar el password y el link ya no es valido.
            if(user.password!==oldUser.password)throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED])

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
       //se verifica que el password halla sido cargado 2 veces de la misma forma.
        if(password!==passwordConf) throw new BadRequestError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
       //luego verificamos que el paswword nuevo sea diferente al anterior.  
        if(isValidPassword(request.user,password)) throw new BadRequestError(errorCodes.ERROR_NOT_AUTHENTICATED, errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]);
        const newPassword = createHash(password);
        await um.update({email:request.user.email,password:newPassword});
        response.clearCookie('token', COOKIE_OPTS);
        next();
            
    }catch (error) {
        responseErrorHandler(error,request,response,next);
    }
}
import { appendJwtAsCookie,removeJwtFromCookies } from "../../middlewares/authentication.middleware.js"; 
import Router from "express";
import passport from "passport";
import { logger } from "../../config/logger.config.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js";
import { CustomError } from "../../errors/custom.error.js";
import { resetLinkController,resetPassController } from "../../controllers/api/sessions.controller.js";
import { generateResetLink,authResetToken,resetPassword } from "../../middlewares/reset.password.middleware.js";
import { connectionRegistry } from "../../middlewares/login.register.middleware.js";
import { authToken } from "../../middlewares/authorization.middleware.js";
import { refreshUserInfo } from "../../middlewares/token.refresh.middleware.js";

export const sessionRouter = Router();

sessionRouter.post('/sessions/register',passport.authenticate('register',{failureRedirect:'/api/sessions/failedRegister',session:false}), 
appendJwtAsCookie,
connectionRegistry, 
async function (request, response) {response.status(201).send({status:'Success,',user:request.user,token: request.signedCookies['token']})
});
sessionRouter.get('/sessions/failedRegister', async (request,response,next) => {
    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Failed Register Strategy');
    responseErrorHandler(new CustomError(errorCodes.ERROR_WRONG_CREDENTIALS,errorMessages[errorCodes.ERROR_WRONG_CREDENTIALS]) ,request,response,next);
});

//*************************************************************************************************************** */
sessionRouter.post('/sessions/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin',session:false}), 
appendJwtAsCookie,
connectionRegistry,
async function (request, response) {response.status(200).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});

sessionRouter.get('/sessions/failedLogin', async (request,response,next) => {
    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Failed Login Strategy');
    responseErrorHandler(new CustomError(errorCodes.ERROR_WRONG_CREDENTIALS,errorMessages[errorCodes.ERROR_WRONG_CREDENTIALS]) ,request,response,next);
});
//*************************************************************************************************************** */

sessionRouter.post('/sessions/resetLink',generateResetLink,resetLinkController); 

//una vez en el form de reseteo de contraseña, el usuario cagara el nuevo password y enviara la informacion
//este endpoint tomara las contraseñas y el token de cookies y validara los datos para verificar que 
// la informacion ingresada sea la correcta, hara las modificaciones si es posible y respodnera en consecuencia, redireccionando a /login
sessionRouter.put('/sessions/resetPass',authResetToken,resetPassword,resetPassController);

//*************************************************************************************************************** */
sessionRouter.get('/sessions/github',passport.authenticate('github',{scope:['user:email'],session:false}),async(request,response)=>{})

sessionRouter.get('/sessions/githubCallback',passport.authenticate('github',{failureRedirect:'/api/sessions/login',session:false}),
appendJwtAsCookie,
connectionRegistry,async(request,response)=>{
    response.redirect('/products')
});
//*************************************************************************************************************** */

sessionRouter.put('/sessions/refreshToken',authToken,refreshUserInfo,appendJwtAsCookie,async(request,response)=>{
    response.status(200).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});


sessionRouter.get('/sessions/current',passport.authenticate('jwt',{session:false}),(request,response) => {
    response.status(200).send({status:"success",payload:request.user});
});

sessionRouter.delete('/sessions/logout',passport.authenticate('jwt',{session:false}),
removeJwtFromCookies,
connectionRegistry,(request,response) => {
    response.status(200).send({status:"success",message:"Logout Correct"});
});
import { appendJwtAsCookie,removeJwtFromCookies } from "../../middlewares/authentication.middleware.js"; 
import Router from "express";
import passport from "passport";
import { authToken } from "../../middlewares/authorization.middleware.js";
import { logger } from "../../config/logger.config.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js";
import { CustomError } from "../../errors/custom.error.js";

export const sessionRouter = Router();

sessionRouter.post('/sessions/register',passport.authenticate('register',{failureRedirect:'/api/sessions/failedRegister',session:false}), 
appendJwtAsCookie, 
async function (request, response) {response.status(201).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});

sessionRouter.get('/sessions/failedRegister', async (request,response,next) => {
    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Failed Register Strategy');
    responseErrorHandler(new CustomError(errorCodes.ERROR_NOT_AUTHENTICATED,errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]) ,request,response,next);
});

sessionRouter.post('/sessions/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin',session:false}), 
appendJwtAsCookie,
async function (request, response) {response.status(200).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});

sessionRouter.get('/sessions/failedLogin', async (request,response,next) => {
    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Failed Login Strategy');
    responseErrorHandler(new CustomError(errorCodes.ERROR_NOT_AUTHENTICATED,errorMessages[errorCodes.ERROR_NOT_AUTHENTICATED]) ,request,response,next);
});

sessionRouter.get('/sessions/github',passport.authenticate('github',{scope:['user:email'],session:false}),async(request,response)=>{})

sessionRouter.get('/sessions/githubCallback',passport.authenticate('github',{failureRedirect:'/api/sessions/login',session:false}),
appendJwtAsCookie,async(request,response)=>{
    response.redirect('/products')
});



sessionRouter.get('/sessions/current',passport.authenticate('jwt',{session:false}),(request,response) => {
    response.status(200).send({status:"success",payload:request.user});
});

sessionRouter.delete('/sessions/current',removeJwtFromCookies,(request,response) => {
    response.status(200).send({status:"success",message:"Logout Correct"});
});
import { loginController, logoutController, registerController } from "../../controllers/api/sessions.controller.js"
import Router, { response } from "express";
import passport from "passport";
import { authToken,appendJwtAsCookie, removeJwtFromCookies } from "../../utils.js";

export const sessionRouter = Router();

//sessionRouter.post('/sessions/register',registerController);
//sessionRouter.post('/sessions/login',loginController);
sessionRouter.post('/sessions/logout',logoutController);

sessionRouter.post('/sessions/register',passport.authenticate('register',{failureRedirect:'/api/sessions/failedRegister',session:false}), 
//async (request,response) => {response.send({status:'Success', message: 'User registered'})},
appendJwtAsCookie, 
async function (request, response) {response.status(201).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});

sessionRouter.get('/sessions/failedRegister', async (request,response) => {
    console.log('Failed Strategy');
    response.status(400).send({status:'Failed'})
});

sessionRouter.post('/sessions/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin',session:false}), 
//async (request,response) => {response.send({status:'Success', message: 'User loged'}),
appendJwtAsCookie,
async function (request, response) {response.status(200).send({status:'Success,',User:request.user,Token:request.signedCookies['token']})
});

sessionRouter.get('/sessions/failedLogin', async (request,response) => {
    console.log('Failed Strategy');
    response.status(400).send({status:'Failed'})
});

sessionRouter.get('/sessions/github',passport.authenticate('github',{scope:['user:email'],session:false}),async(request,response)=>{})

sessionRouter.get('/sessions/githubCallback',passport.authenticate('github',{failureRedirect:'/api/sessions/login',session:false}),
appendJwtAsCookie,
async(request,response)=>{response.redirect('/products')})

sessionRouter.get('/sessions/current',passport.authenticate('jwt',{session:false}),(request,response) => {
    response.status(200).send({status:"success",payload:request.user});
})

sessionRouter.delete('/sessions/current',removeJwtFromCookies,(request,response) => {
    response.status(200).send({status:"success",message:"Logout Correct"});
})
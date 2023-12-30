import { loginController, logoutController, registerController } from "../controllers/sessions.controller.js"
import Router, { response } from "express";
import passport from "passport";

export const sessionRouter = Router();

//sessionRouter.post('/sessions/register',registerController);
//sessionRouter.post('/sessions/login',loginController);
sessionRouter.post('/sessions/logout',logoutController);

sessionRouter.post('/sessions/register',passport.authenticate('register',{failureRedirect:'/api/sessions/failedRegister'}), async (request,response) => {
    response.send({status:'Success', message: 'User registered'})
});
sessionRouter.get('/sessions/failedRegister', async (request,response) => {
    console.log('Failed Strategy');
    response.status(400).send({status:'Failed'})
});

sessionRouter.post('/sessions/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin'}), async (request,response) => {
    response.send({status:'Success', message: 'User loged'})
});
sessionRouter.get('/sessions/failedLogin', async (request,response) => {
    console.log('Failed Strategy');
    response.status(400).send({status:'Failed'})
});

sessionRouter.get('/sessions/github',passport.authenticate('github',{scope:['user:email']}),async(request,response)=>{})

sessionRouter.get('/sessions/githubCallback',passport.authenticate('github',{failureRedirect:'/api/sessions/login'}),async(request,response)=>{
   // request.session.passport.user=request.user._doc;
    response.redirect('/products')
})

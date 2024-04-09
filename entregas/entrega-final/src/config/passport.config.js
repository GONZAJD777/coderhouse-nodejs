import passport from 'passport';
import local from 'passport-local';
import GitHub from 'passport-github2';
import JWT from 'passport-jwt';
import UserManager from '../services/users.manager.js';
import { createHash,isValidPassword,cookieExtractor } from '../utils.js';
import { CKE_SCT,ADMIN_USER,
         GITHUB_CB_URL, GITHUB_CLT_ID, GITHUB_CLT_SCT, 
         GITHUB_DEF_PASS, GITHUB_DEF_FNAME, GITHUB_DEF_LNAME } from './config.js';
import { logger } from "../config/logger.config.js";
import UsersDTO from "../dao/dto/users.DTO.js";



const userManager = new UserManager();
const localStragegy = local.Strategy;
const GitHubStrategy = GitHub.Strategy;
const JWTStragety = JWT.Strategy;
const ExtractJWT = JWT.ExtractJwt;
const initializePassport = () => {
    passport.use('register', new localStragegy(
        {passReqToCallback:true,usernameField:'email'},async (request,username,password,done)=> {
        const {firstName,lastName,email,age} = request.body;
        try {
            const newUser = {firstName,lastName,email:username,age,password:createHash(password)};
            await userManager.create(UsersDTO.build(newUser));
            let result = await userManager.getBy(UsersDTO.build({email:username}))
            return done (null,result);
        }catch (error){
            return done ('Error al obtener el usuario: '+ error);
        }}));

    passport.use('login',new localStragegy(
        {usernameField:'email'},async (username,password,done)=> {
        try {
                let user = {};
                if(username===ADMIN_USER.email && password===ADMIN_USER.password){
                    user={...ADMIN_USER};
                }
                else {
                    user = await userManager.getBy(UsersDTO.build({email:username}))
                        if(!user) {
                            logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'El Usuario: '+ username  + ' no existe.');
                            return done (null,false);
                        }
                        if(!isValidPassword(user,password)) {
                            logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'El password ingresado es incorrecto.');
                            return done (null,false)
                        };
                    }
            return done (null,user);
        } catch(error){
            return done(error)
        }}));

    passport.use('github',new GitHubStrategy({
        clientID:GITHUB_CLT_ID,
        clientSecret:GITHUB_CLT_SCT,
        callbackURL:GITHUB_CB_URL
    }, async (accessToken,refreshToken,profile,done) => {          
        try {
            let user = await userManager.getBy(UsersDTO.build({email:profile._json.email}))
            if(!user) {
                let newUser = {
                    firstName:profile._json.name || GITHUB_DEF_FNAME,
                    lastName:GITHUB_DEF_LNAME,
                    age:18,
                    email:profile._json.email,
                    password:createHash(GITHUB_DEF_PASS) //se deberia generar un password random pero simplificamos
                }
                await userManager.create(UsersDTO.build(newUser));
                let result = await userManager.getBy(UsersDTO.build({email:profile._json.email}))
                done(null,result);
            }
            else{
                done(null,user);
            }
            
        }catch(error){
            return done(error);
        }}));    

    passport.use('jwt',new JWTStragety({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:CKE_SCT}, async (jwt_payload,done) => {
            try {
                return done(null,jwt_payload.user);
            }catch (error)
            {
                return done(error);
        }}));
    
        passport.serializeUser((user,done) => {
            done(null,user);
        });

        passport.deserializeUser(async (id,done) => {
            let user= await userManager.getBy({email:id});
            done(null,user);
        });
}

export default initializePassport
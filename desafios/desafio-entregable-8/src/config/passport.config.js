import passport from 'passport';
import local from 'passport-local';
import GitHub from 'passport-github2';
import JWT from 'passport-jwt';
import UserManager from '../negocio/managers/mongo/users.manager.js';
import { createHash,isValidPassword,cookieExtractor } from '../utils.js';
import { CKE_SCT, 
         GITHUB_CB_URL, GITHUB_CLT_ID, GITHUB_CLT_SCT, 
         ADMIN_PASS, ADMIN_EMAIL, ADMIN_ID, ADMIN_FNAME, ADMIN_LNAME, ADMIN_ROLE, ADMIN_CART, 
         GITHUB_DEF_PASS, GITHUB_DEF_FNAME, GITHUB_DEF_LNAME } from './config.js';

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
            await userManager.create(newUser);
            let result = await userManager.getBy({email:username})
            return done (null,result);
        }catch (error){
            return done ('Error al obtener el usuario: '+ error);
        }}));

    passport.use('login',new localStragegy(
        {usernameField:'email'},async (username,password,done)=> {
        try {
                let user = {};
                if(username===ADMIN_EMAIL && password===ADMIN_PASS){
                    user = [{_id:ADMIN_ID,
                             firstName:ADMIN_FNAME,
                             lastName: ADMIN_LNAME,
                             email:ADMIN_EMAIL,
                             role:ADMIN_ROLE,
                             cart:ADMIN_CART}];
                }
                else {
                    user = await userManager.getBy({email:username})
                        if(!user || user.length===0) {
                            console.log('Usuario no existe');
                            return done (null,false);
                        }
                        if(!isValidPassword(user,password)) return done (null,false);
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
            console.log(profile);
            let user = await userManager.getBy({email:profile._json.email.toLowerCase()})
            if(!user[0]) {
                let newUser = {
                    firstName:profile._json.name || GITHUB_DEF_FNAME,
                    lastName:GITHUB_DEF_LNAME,
                    age:18,
                    email:profile._json.email.toLowerCase(),
                    password:createHash(GITHUB_DEF_PASS) //se deberia generar un password random pero simplificamos
                }
                await userManager.create(newUser);
                let result = await userManager.getBy({email:profile._json.email.toLowerCase()})
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
import passport from 'passport';
import local from 'passport-local';
import UserManager from '../dao/mongo/managers/users.manager.js';
import { createHash,isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const userManager = new UserManager();
const localStragegy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new localStragegy(
        {passReqToCallback:true,usernameField:'email'},async (request,username,password,done)=> {
        const {firstName,lastName,email,age} = request.body;
        try {
            const newUser = {firstName,lastName,email:username,age,password:createHash(password)};
            let result = await userManager.create(newUser);
            return done (null,result);
        }catch (error){
            return done ('Error al obtener el usuario: '+ error);
        }}));

    passport.use('login',new localStragegy(
        {usernameField:'email'},async (username,password,done)=> {
        try {
                let user = {};
                if(username==="adminCoder@coder.com" && password==="adminCod3r123"){
                    user = [{ _id:"1234",
                            firstName:"Coder",
                            lastName:"Admin",
                            email:username,
                            role:"Admin",
                            cart:"65821a21dcf8e0ab1172dfe0"}];
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
        clientID:"Iv1.b1dfdda414a387b3",
        clientSecret:"ec79e3f050ab2416f0c10622e27f36e029fc5b7c",
        callbackURL:"http://localhost:8080/api/sessions/githubCallback"
    }, async (accessToken,refreshToken,profile,done) => {          
        try {
            console.log(profile);
            let user = await userManager.getBy({email:profile._json.email.toLowerCase()})
            if(!user[0]) {
                let newUser = {
                    firstName:profile._json.name || 'Jhon',
                    lastName:'Doe',
                    age:18,
                    email:profile._json.email.toLowerCase(),
                    password:createHash('1234') //se deberia generar un password random pero simplificamos
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

        passport.serializeUser((user,done) => {
            done(null,user);
        });

        passport.deserializeUser(async (id,done) => {
            let user= await userManager.getBy({email:id});
            done(null,user);
        });
}

export default initializePassport
import UserManager from "../dao/mongo/managers/users.manager.js";
import CartManager from "../dao/mongo/managers/carts.manager.js"
import { CustomError } from "../model/custom.error.js";
import { createHash,isValidPassword } from "../utils.js";

const userManager = new UserManager();

export async function loginController (request,response){
    try{
        const {password,email}=request.body;
        let user =[];
        if(email==="adminCoder@coder.com" && password==="adminCod3r123"){
                 user = [{firstName:"Coder",
                          lastName:"Admin",
                          email:email,
                          role:"Admin",
                          cart:"65821a21dcf8e0ab1172dfe0"}];
         
        }else {
                user = await userManager.getBy({email});
                if (!isValidPassword(user[0],password)) throw new CustomError(20035, 'User/Password Invalido');
                delete user[0].password;
        }       

        request.session.user=user;
        return response.status(200).json({ status: 'success'});
    } catch (error)
    { 
        response.status(400).json({Result: 'ERROR', Operation: 'Login' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Login' ,Code:error.code, Message: error.message});
    } 
}

export async function registerController (request,response){
    try{
        let {firstName,lastName,email,age,password} = request.body;
        password=createHash(password);
        await userManager.create({firstName,lastName,email,age,password});
        return response.status(201).json({ status: 'success'});
    } catch (error)
    { 
        response.status(400).json({Result: 'ERROR', Operation: 'Register' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Register' ,Code:error.code, Message: error.message});
    } 
}

export async function logoutController (request,response){
    try{
    request.session.destroy();
    response.send("Se ha cerrado la session")
    } catch (error)
    {        
        response.status(500).json({Result: 'ERROR', Operation: 'Logout' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Logout' ,Code:error.code, Message: error.message});
    }    
}
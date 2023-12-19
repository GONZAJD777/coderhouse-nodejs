import SessionManager from "../dao/mongo/managers/session.manager.js";
import UserManager from "../dao/mongo/managers/users.manager.js";
import CartManager from "../dao/mongo/managers/carts.manager.js"

const userManager = new UserManager();
const sessionManager = new SessionManager();
const cartManager = new CartManager();

export async function getUserController (request,response){
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
                user = await userManager.getBy({ email, password });
        }
        
        const session= await sessionManager.createSession(email);
        response.cookie('session',session._id,{expires:session.sExpireDate}) ;
        response.cookie('user',user,{expires:session.sExpireDate}) ;
        return response.status(200).json({ status: 'success'});
    } catch (error)
    { 
        response.status(400).json({Result: 'ERROR', Operation: 'Login' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Login' ,Code:error.code, Message: error.message});
    } 
}

export async function postUserController (request,response){
    try{
        const cartId = await cartManager.addCart();
        await userManager.create({...request.body,cart:cartId._id});
        return response.status(201).json({ status: 'success'});
    } catch (error)
    { 
        response.status(400).json({Result: 'ERROR', Operation: 'Register' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Register' ,Code:error.code, Message: error.message});
    } 
}

export async function postLogoutUserController (request,response){
    try{
    const logout =sessionManager.deleteSession(request.cookies.session)
    response.clearCookie('session');
    response.clearCookie('user');
    response.send("Se ha cerrado la session")
    } catch (error)
    {        
        response.status(400).json({Result: 'ERROR', Operation: 'Logout' ,Code:error.code, Message: error.message});
        console.log({Result: 'ERROR', Operation: 'Logout' ,Code:error.code, Message: error.message});
    }    
}
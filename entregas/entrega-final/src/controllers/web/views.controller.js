import ProductsManager from "../../services/products.manager.js";
import CartsManager from "../../services/carts.manager.js";
import TicketsManager from "../../services/tickets.manager.js";
import UserManager from "../../services/users.manager.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js"
import { UnauthorizedError } from "../../errors/custom.error.js";
import { ADMIN_USER } from "../../config/config.js";
import { purchaseNotificator } from "../../config/mailer.config.js";
import UsersDTO from "../../dao/dto/users.DTO.js";
import UserDocsDTO from "../../dao/dto/user.documents.DTO.js";


const pm = new ProductsManager ();
const cm = new CartsManager ();
const tm = new TicketsManager();
const um = new UserManager();

export async function resetPasswordController (request,response,next){
    try{

        if (response.error) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
        
        response.render("resetPassword", {});
    } catch (error)
    { 
        response.render("login", {error});
    } 
}

export async function getController (request,response,next){
    try{
        const user = request.user;   
        const result = await pm.getProductsPaginate(1,request.query);
        const products = result.payload;
        const currentPage = result.page;
        const {status,totalPages,prevPage,nextPage, hasPrevPage, hasNextPage, prevLink, nextLink } = result;
        const responseObject = {status,...user,products,totalPages,prevPage,nextPage,currentPage,hasPrevPage,hasNextPage,prevLink,nextLink};
        response.render("products", {responseObject});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}

export async function purchaseController(request,response,next){
    const cid = request.params.cid;
    try {
        const result= await tm.createTicket(cid);
        purchaseNotificator(request.user,result.ticket)
        response.render('tickets', result);
    }catch (error){ 
        responseErrorHandler(error,request,response,next);
    }
}

export async function getRealTimeController (request,response,next){
    try{
        const {limit,category,stock,price} = request.query;
        const productsList = await pm.getProducts({limit,category,stock,price});
        response.render('realTimeProducts', { productsList }); 
    } catch (error)
    {        
        responseErrorHandler(error,request,response,next);
    }    

}


export async function getCartProducts (request,response,next){
    try{
        const cartId = request.params.cid;
        const result = await cm.getCartById(cartId);
        const productsList = result.cartDetail;
        let CartTotalAmount = productsList.reduce((total, productsList) => {if(productsList.product) total + productsList.product.price*productsList.quantity},0);
        response.render('carts', { productsList,CartTotalAmount,cartId}); 
    } catch (error)
    {        
        responseErrorHandler(error,request,response,next);
    }    
}

export async function registerUser (request,response,next){
    try{
        response.render('register'); 
    } catch (error)
    {     
        responseErrorHandler(error,request,response,next);   
    }    
}

export async function loginUser (request,response,next){
    try{
        response.render('login'); 
    } catch (error)
    {        
        responseErrorHandler(error,request,response,next);
    }    
}

export async function getUserViewController (request,response,next){
    try{
        const id = request.params.uid;
        let user={};
        if(id===ADMIN_USER.id) {user={...ADMIN_USER} } 
        else {user = await um.getBy(UsersDTO.build({id:request.params.uid}))}
        if (!response.error) {
            if(user.documents){
                user.documents=UserDocsDTO.docsStandarResp(user.documents);
            }
        }
        response.render('profile',user); 
    } catch (error)
    {        
        responseErrorHandler(error,request,response,next);
    }    
}

export async function redirectUserViewController (request,response,next){
    try{
        response.redirect('/users/'+request.params.uid); 
    } catch (error)
    {        
        responseErrorHandler(error,request,response,next);
    }    
}

export async function userAdminViewController (request,response,next){
    try{

        if (response.error) throw new UnauthorizedError(errorCodes.ERROR_NOT_AUTHORIZED, errorMessages[errorCodes.ERROR_NOT_AUTHORIZED]);
        
        const usersArray= await um.get();
        response.render("userAdmin",{usersArray});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}
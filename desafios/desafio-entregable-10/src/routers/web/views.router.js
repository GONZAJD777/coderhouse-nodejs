import Router from "express";
import {getController, 
        getRealTimeController, 
        getCartProducts,
        purchaseController,
        registerUser,
        loginUser,
        resetPasswordController} from "../../controllers/web/views.controller.js"
import { verifyLinkToken }  from "../../middlewares/reset.password.middleware.js";



export const viewsRouter = Router();

viewsRouter.get('/', getController); 
viewsRouter.get('/products', getController);    //Vista de productos
viewsRouter.get('/products/:cid', getController);               //Vista de productos para agregar al carrito :cid
viewsRouter.get('/realTimeProducts', getRealTimeController);    //Vista para gestion de productos
viewsRouter.get('/carts/:cid',getCartProducts);                 //Vista del carrito seleccionado
viewsRouter.get('/carts/:cid/purchase',purchaseController);                 //Vista del carrito seleccionado
viewsRouter.get('/register',registerUser)                       //Vista con FORM de registro de Usuarios
viewsRouter.get('/login',loginUser)                             //Vista con FORM de login de Usuarios

// localhost/8080/resetPassword/token
// este endpoint recibira el token enviado como parametro, debera recuperar la informacion encriptada y validar si es valido
// las validaciones incluiran, verificar q el usuario exista, verificar que este dentro de la ventana de valides
// si es valido, redireccionar a la vista de reseeteo, enviando token por cookie, de lo contrario redireccionar a Login para q pueda volver a generar otro link.
viewsRouter.get('/resetPassword/:tid',verifyLinkToken,resetPasswordController)  

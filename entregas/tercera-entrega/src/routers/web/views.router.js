import {getController, 
        getRealTimeController, 
        getCartProducts,
        purchaseController,
        registerUser,
        loginUser} from "../../controllers/web/views.controller.js"
import Router from "express";


export const viewsRouter = Router();

viewsRouter.get('/', getController); 
viewsRouter.get('/products', getController);    //Vista de productos
viewsRouter.get('/products/:cid', getController);               //Vista de productos para agregar al carrito :cid
viewsRouter.get('/realTimeProducts', getRealTimeController);    //Vista para gestion de productos
viewsRouter.get('/carts/:cid',getCartProducts);                 //Vista del carrito seleccionado
viewsRouter.get('/carts/:cid/purchase',purchaseController);                 //Vista del carrito seleccionado
viewsRouter.get('/register',registerUser)                       //Vista con FORM de registro de Usuarios
viewsRouter.get('/login',loginUser)                             //Vista con FORM de login de Usuarios

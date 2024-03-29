import Router from "express";
import {getController, 
        getRealTimeController, 
        getCartProducts,
        purchaseController,
        registerUser,
        loginUser,
        resetPasswordController,
        getUserViewController,
        redirectUserViewController} from "../../controllers/web/views.controller.js"
import {upload} from "../../config/multer.config.js";
import { verifyLinkToken }  from "../../middlewares/reset.password.middleware.js";
import { authToken,authorization } from "../../middlewares/authorization.middleware.js";
import { registerUploadFiles } from "../../middlewares/multer.middleware.js";



export const viewsRouter = Router();

viewsRouter.get('/', getController); 
viewsRouter.get('/products', getController);    //Vista de productos
viewsRouter.get('/products/:cid', getController);               //Vista de productos para agregar al carrito :cid

//Vista para gestion de productos, actualiza en tiempo real
viewsRouter.get('/realTimeProducts',
                authToken,
                authorization(['admin','premium']), 
                getRealTimeController);    

//** POST// FINALIZA LA COMPRA GENERANDO EL TICKET                  
viewsRouter.get('/carts/:cid/purchase',
                authToken,
                authorization(['user','admin','premium'],{cart:'owner'}),
                purchaseController); 


//** GET//Vista del carrito seleccionado
viewsRouter.get('/carts/:cid',
                authToken,
                authorization(['user','admin','premium'],{cart:'owner'}),
                getCartProducts);                 


//viewsRouter.get('/carts/:cid/purchase',purchaseController);                 //Vista del carrito seleccionado
viewsRouter.get('/register',registerUser)                       //Vista con FORM de registro de Usuarios
viewsRouter.get('/login',loginUser)                             //Vista con FORM de login de Usuarios

// localhost/8080/resetPassword/token
// este endpoint recibira el token enviado como parametro, debera recuperar la informacion encriptada y validar si es valido
// las validaciones incluiran, verificar q el usuario exista, verificar que este dentro de la ventana de valides
// si es valido, redireccionar a la vista de reseeteo, enviando token por cookie, de lo contrario redireccionar a Login para q pueda volver a generar otro link.
viewsRouter.get('/resetPassword/:tid',
                verifyLinkToken,
                resetPasswordController)  

viewsRouter.get('/users/:uid',
                authToken,
                authorization(['user','admin','premium'],{user:'owner'}),
                getUserViewController);                                   

viewsRouter.post('/users/:uid/documents',authToken
                ,authorization(['admin','premium','user'],{user:'owner'})
                ,upload.fields([{name:'avatar', maxCount: 1},
                                {name:'userIdDoc', maxCount: 1},
                                {name:'userAddressDoc', maxCount: 1},
                                {name:'userAccountDoc', maxCount: 1} ])
                ,registerUploadFiles                               
                ,redirectUserViewController);               
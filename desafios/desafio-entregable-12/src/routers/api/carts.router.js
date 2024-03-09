import {getController,
        getIdController,
        postController,
        postAddItemController,
        deleteCartController,
        deleteRemoveItemController,
        putQuantityController,
        putCartProductsController,
        AddToCartController} from "../../controllers/api/carts.controller.js"
import { purchaseController } from "../../controllers/api/tickets.controller.js";
import {authToken, authorization} from "../../middlewares/authorization.middleware.js"    

import { Router } from "express";

export const cartsRouter=Router();


//** GET/ -> listar TODOS los carritos
cartsRouter.get('/carts/',getController);                                                                                                                                       

//** POST/ -> Crear carrito con id autoincremental
cartsRouter.post('/carts/',postController);                                                                           
//********************************************************************************************* */
//** GET/:cid -> listar carrito cid
cartsRouter.get('/carts/:cid',getIdController);   

//** PUT// actualiza el array de productos y cantidades del carrito pisando la vigente.
cartsRouter.put('/carts/:cid',
                authToken,
                authorization(['admin']),
                putCartProductsController);

//** DELETE//carts/:cid/products/:pid -> elimina todos los productos del carrito.
cartsRouter.delete('/carts/:cid',
                authToken,
                authorization(['admin']),
                deleteCartController);      

//********************************************************************************************* */
//** POST/ :cid/producto/:pid -> agregar 1 unidad del item especificado al carrito
cartsRouter.post('/carts/:cid/products/:pid',
                authToken,
                authorization(['user','admin','premium'],{product:'notOwner',cart:'owner'}),
                postAddItemController); 
                
//** PUT// carts/:cid/products/:pid -> actualiza la cantidad del producto al valor enviado en el body.
cartsRouter.put('/carts/:cid/products/:pid',
                authToken,
                authorization(['user','admin','premium'],{product:'notOwner',cart:'owner'}),
                putQuantityController);                                                                                 

//** DELETE//carts/:cid/products/:pid -> quita el producto elegido carrito                
cartsRouter.delete('/carts/:cid/products/:pid',
                authToken,
                authorization(['user','admin','premium'],{cart:'owner'}),
                deleteRemoveItemController); 

//********************************************************************************************* */

//** POST/ endpoint utilizado para agregar item al carrito desde WEB, se envian parametros desde el body
cartsRouter.post('/carts/AddToCart',
                authToken,
                authorization(['user','admin','premium'],{product:'notOwner',cart:'owner'}),
                AddToCartController);                                                                                     

//** POST// FINALIZA LA COMPRA GENERANDO EL TICKET                  
cartsRouter.post('/carts/:cid/purchase',
                authToken,
                authorization(['user','admin','premium'],{cart:'owner'}),
                purchaseController);                                                                                  




                      
        

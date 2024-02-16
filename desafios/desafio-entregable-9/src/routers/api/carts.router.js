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



cartsRouter.get('/carts/',getController);                                                                             // -- GET/ -> listar TODOS los carritos
                                
cartsRouter.get('/carts/:cid',getIdController);                                                                       // -- GET/:cid -> listar carrito cid
                                
cartsRouter.post('/carts/',postController);                                                                           // -- POST/ -> Crear carrito con id autoincremental
cartsRouter.post('/carts/:cid/products/:pid',authToken,authorization(['user','admin']),postAddItemController);        // -- POST/ :cid/producto/:pid -> agregar 1 unidad del item especificado al carrito
cartsRouter.post('/carts/AddToCart',authToken,authorization(['user','admin']),AddToCartController);                   // -- POST/ endpoint utilizado para agregar item al carrito desde WEB, se envian parametros desde el body    

cartsRouter.post('/carts/:cid/purchase',authToken,authorization(['user','admin']),purchaseController);                // -- POST/ FINALIZA LA COMPRA GENERANDO EL TICKET  

cartsRouter.put('/carts/:cid',authToken,authorization(['user','admin']),putCartProductsController);                   //PUT//actualiza el array de productos y cantidades del carrito pisando la vigente.
cartsRouter.put('/carts/:cid/products/:pid',authToken,authorization(['user','admin']),putQuantityController);         //PUT//carts/:cid/products/:pid -> actualiza la cantidad del producto al valor enviado en el body.

cartsRouter.delete('/carts/:cid/products/:pid',authToken,authorization(['user','admin']),deleteRemoveItemController); //DELETE//carts/:cid/products/:pid -> quita el producto elegido carrito
cartsRouter.delete('/carts/:cid',authToken,authorization(['user','admin']),deleteCartController);                            //DELETE//carts/:cid/products/:pid -> elimina todos los productos del carrito.
        

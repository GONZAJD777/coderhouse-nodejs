import {getController,getIdController, postController,postAddItemController} from "../controllers/carts.controller.js"
import { Router } from "express";

export const cartsRouter=Router();



cartsRouter.get('/carts/',getController); // -- GET/ -> listar TODOS los carritos

cartsRouter.get('/carts/:cid',getIdController); // -- GET/:cid -> listar carrito cid

cartsRouter.post('/carts/',postController); // -- POST/ -> Crear carrito con id autoincremental

cartsRouter.post('/carts/:cid/products/:pid',postAddItemController); // -- POST/ :cid/producto/:pid -> agregar item :pid al carrito :cid

    
//cartsRouter.put('/api/carts/:pid',putController);  
 
//cartsRouter.delete('/api/carts/:pid',deleteController);

//cartsRouter.get('/api/carts/',getController);
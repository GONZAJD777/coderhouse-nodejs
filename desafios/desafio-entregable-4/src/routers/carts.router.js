import {getController,getIdController, postController,postAddItemController} from "../controllers/carts.controller.js"

import { Router } from "express";

export const cartsRouter=Router();



cartsRouter.get('/api/carts/',getController); // -- GET/ -> listar TODOS los carritos

cartsRouter.get('/api/carts/:cid',getIdController); // -- GET/:cid -> listar carrito cid

cartsRouter.post('/api/carts/',postController); // -- POST/ -> Crear carrito con id autoincremental

cartsRouter.post('/api/carts/:cid/product/:pid',postAddItemController); // -- POST/ :cid/producto/:pid -> agregar item :pid al carrito :cid

    
//cartsRouter.put('/api/carts/:pid',putController);  
 
//cartsRouter.delete('/api/carts/:pid',deleteController);

//cartsRouter.get('/api/carts/',getController);
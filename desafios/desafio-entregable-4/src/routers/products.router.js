import {getController, getIdController,postController,putController,deleteController} from "../controllers/products.controller.js"
import { Router } from "express";

export const productsRouter= Router();

productsRouter.get('/products/',getController);

productsRouter.get('/products/:pid',getIdController);

productsRouter.post('/products/',postController);
    
productsRouter.put('/products/:pid',putController);  
 
productsRouter.delete('/products/:pid',deleteController);
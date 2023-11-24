import {getController, getIdController,postController,putController,deleteController} from "../controllers/products.controller.js"
import { Router } from "express";

export const productsRouter= Router();



productsRouter.get('/api/products/',getController);

productsRouter.get('/api/products/:pid',getIdController);

productsRouter.post('/api/products/',postController);
    
productsRouter.put('/api/products/:pid',putController);  
 
productsRouter.delete('/api/products/:pid',deleteController);
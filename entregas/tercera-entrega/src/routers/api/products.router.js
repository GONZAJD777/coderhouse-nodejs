
import {getController, 
        getIdController,
        postController,
        putController,
        deleteController, 
        getPaginateController } from "../../controllers/api/products.controller.js";
import { Router } from "express";

export const productsRouter= Router();

productsRouter.get('/products/',getPaginateController);

productsRouter.get('/products/:pid',getIdController);

productsRouter.post('/products/',postController);
    
productsRouter.put('/products/:pid',putController);  
 
productsRouter.delete('/products/:pid',deleteController);

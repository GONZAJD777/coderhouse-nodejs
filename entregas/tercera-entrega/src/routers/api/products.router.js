
import {getIdController,
        postController,
        putController,
        deleteController, 
        getPaginateController } from "../../controllers/api/products.controller.js";
import {authToken, authorization} from "../../middlewares/authorization.middleware.js"    
import { Router } from "express";

export const productsRouter= Router();

productsRouter.get('/products/',getPaginateController);

productsRouter.get('/products/:pid',getIdController);

productsRouter.post('/products/',authToken,authorization('admin'),postController);
    
productsRouter.put('/products/:pid',authToken,authorization('admin'),putController);  
 
productsRouter.delete('/products/:pid',authToken,authorization('admin'),deleteController);

import {getController, getRealTimeController, getCartProducts} from "../controllers/views.controller.js"
import Router from 'express';

export const viewsRouter = Router();

viewsRouter.get('/products', getController);
viewsRouter.get('/products/:cid', getController);
viewsRouter.get('/realTimeProducts', getRealTimeController);
viewsRouter.get('/carts/:cid',getCartProducts);


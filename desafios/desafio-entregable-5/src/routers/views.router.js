import {getController, getRealTimeController} from "../controllers/views.controller.js"
import Router from 'express';

export const viewsRouter = Router();

//viewsRouter.get('/', getController);
viewsRouter.get('/realTimeProducts', getRealTimeController);



import {getController, postController} from "../../controllers/web/messages.controller.js"
import {authToken, authorization} from "../../middlewares/authorization.middleware.js"    

import Router from 'express';

export const messagesRouter = Router();

messagesRouter.get('/chat',authToken,authorization(['user','premium']), getController);
messagesRouter.post('/messages',authToken,authorization(['user','premium']), postController);
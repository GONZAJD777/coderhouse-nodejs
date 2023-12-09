import {getController, postController} from "../controllers/messages.controller.js"
import Router from 'express';

export const messagesRouter = Router();

messagesRouter.get('/', getController);
messagesRouter.post('/messages', postController);
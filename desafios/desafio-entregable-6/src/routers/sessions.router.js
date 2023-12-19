import {getUserController,postUserController,postLogoutUserController} from "../controllers/sessions.controller.js"
import Router from "express";


export const sessionRouter = Router();

sessionRouter.post('/sessions/login',getUserController);
sessionRouter.post('/sessions/register',postUserController)
sessionRouter.post('/sessions/logout',postLogoutUserController)
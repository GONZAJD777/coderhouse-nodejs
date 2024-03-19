import {swapUserRoleController} from "../../controllers/api/users.controller.js"
import {authToken, authorization} from "../../middlewares/authorization.middleware.js"    
import { Router } from "express";

export const usersRouter= Router();

usersRouter.put('/users/premium/:uid',authToken,authorization(['admin','premium','user']),swapUserRoleController);


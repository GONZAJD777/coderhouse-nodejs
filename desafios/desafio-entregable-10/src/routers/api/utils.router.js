import {deleteAllCartsController} from "../../controllers/api/carts.controller.js"
import {deleteAllUsersController} from "../../controllers/api/sessions.controller.js";
import { loggerTestController } from "../../controllers/api/utils.controller.js";
import { Router } from "express";

export const utilsRouter=Router();

  
//utilsRouter.delete('/utils/allCarts',deleteAllCartsController);
//utilsRouter.delete('/utils/allUsers',deleteAllUsersController);
utilsRouter.get('/utils/loggerTest',loggerTestController);




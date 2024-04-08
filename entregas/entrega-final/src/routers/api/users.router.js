import {getAllUsersController, 
        getUserInfoController,
        swapUserRoleController,
        uploadDocController,
        clearInactiveUsersController,
        deleteUserController} from "../../controllers/api/users.controller.js"
import {authToken, authorization} from "../../middlewares/authorization.middleware.js"    
import { Router } from "express";
import {upload} from "../../config/multer.config.js";
import { logger } from "../../config/logger.config.js"; 



export const usersRouter= Router();

usersRouter.get('/users',authToken
                        ,authorization(['admin']) 
                        ,getAllUsersController);
                            

usersRouter.get('/users/:uid',authToken
                             ,authorization(['admin','premium','user'],{user:'owner'}) 
                             ,getUserInfoController);

usersRouter.delete('/users/:uid',authToken
                                ,authorization(['admin']) 
                                ,deleteUserController); 
                                
usersRouter.post('/users/:uid/documents',authToken
                                        ,authorization(['admin','premium','user'],{user:'owner'})
                                        ,upload.fields([{name:'avatar', maxCount: 1},
                                                        {name:'userIdDoc', maxCount: 1},
                                                        {name:'userAddressDoc', maxCount: 1},
                                                        {name:'userAccountDoc', maxCount: 1} ])
                                        ,uploadDocController);

usersRouter.put('/users/premium/:uid',authToken
                                     ,authorization(['admin','premium','user'],{user:'owner'})
                                     ,swapUserRoleController);

usersRouter.delete('/users/clearInactive',authToken
                                         ,authorization(['admin']) 
                                         ,clearInactiveUsersController); 



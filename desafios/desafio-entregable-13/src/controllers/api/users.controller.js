import { logger,cusLogLevelsOpts } from "../../config/logger.config.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";
import UserManager from "../../services/users.manager.js"

const um = new UserManager();
export async function swapUserRoleController (request,response,next){
    try{
        const id = request.params.uid;
        const result= await um.updateRole({_id:id});
        response.status(200).send({Result: 'OK' , Operation: 'create',Code: "201" ,Message: 'Se creo el Producto correctamente.', Object: result});
    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}
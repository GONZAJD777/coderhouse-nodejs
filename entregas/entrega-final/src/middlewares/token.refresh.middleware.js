import UsersDTO from "../dao/dto/users.DTO.js";
import UserManager from "../services/users.manager.js";
import responseErrorHandler from "./error.response.middleware.js";


const um = new UserManager();
export   const refreshUserInfo = async (request,response,next) => {
        try {

            const user = await um.getBy (UsersDTO.build({id:request.user.id}))
                           //await um.getBy(UsersDTO.build({id:request.params.uid}))
            
            request.user={...user};
            
            next();

        } catch (error) {
            responseErrorHandler(error,request,response,next);
        }
}
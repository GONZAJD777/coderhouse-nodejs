import UserManager from "../services/users.manager.js";

const um = new UserManager();
export   const refreshUserInfo = async (request,response,next) => {
        try {

            const user = await um.getBy ({_id:request.user._id})
            
            request.user={...user};
            
            next();

        } catch (error) {
            responseErrorHandler(error,request,response,next);
        }
}
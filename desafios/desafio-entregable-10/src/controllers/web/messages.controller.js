import MessagesManager from "../../services/messages.manager.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js"

const mm = new MessagesManager ();

export async function getController (request,response,next){
    try {
    const messages = await mm.getMessages();
    response.render('chat', { messages }); 
    }
    catch(error)
        {
            responseErrorHandler(error,request,response,next);
        }
}
export async function postController (request,response,next){
    try {
    await mm.addMessage(request.body);
    response.redirect('/chat');
    }
    catch(error)
        {
            responseErrorHandler(error,request,response,next);
        }
}




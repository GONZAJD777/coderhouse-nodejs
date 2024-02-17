import MessagesManager from "../../services/messages.manager.js";

const mm = new MessagesManager ();

export async function getController (request,response,next){
    try {
    const messages = await mm.getMessages();
    response.render('chat', { messages }); 
    }
    catch(error)
        {
            responseErrorHandler(error,request,response,next);
            console.log({Result: 'ERROR', Operation: 'user message' ,Code:error.code, Message: error.message})
        }
}
export async function postController (request,response,next){
    try {
    await mm.addMessage(request.body);
    response.redirect('/');
    }
    catch(error)
        {
            responseErrorHandler(error,request,response,next);
            console.log({Result: 'ERROR', Operation: 'redirect' ,Code:error.code, Message: error.message})
        }
}




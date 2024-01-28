import MessagesManager from "../../../negocio/managers/mongo/messages.manager.js";

const mm = new MessagesManager ();

export async function getController (request,response){
    try {
    const messages = await mm.getMessages();
    response.render('chat', { messages }); 
    }
    catch(error)
        {
            console.log({Result: 'ERROR', Operation: 'user message' ,Code:error.code, Message: error.message})
        }
}
export async function postController (request,response){
    try {
    await mm.addMessage(request.body);
    response.redirect('/');
    }
    catch(error)
        {
            console.log({Result: 'ERROR', Operation: 'redirect' ,Code:error.code, Message: error.message})
        }
}




import MessagesManager from "../dao/mongo/managers/messages.manager.js";

const mm = new MessagesManager ();

export async function getController (request,response){
    try {
    const messages = await mm.getMessages();
    //const messages = await mm.find({}, 'user message').lean();
    response.render('chat', { messages }); 
    //response.render('chat'); 
    }
    catch(error)
        {
            //socket._error({Result: 'ERROR', Operation: 'user message' ,Code:error.code, Message: error.message})
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
            //socket._error({Result: 'ERROR', Operation: 'redirect' ,Code:error.code, Message: error.message})
            console.log({Result: 'ERROR', Operation: 'redirect' ,Code:error.code, Message: error.message})
        }
}




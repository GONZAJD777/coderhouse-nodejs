import SessionManager from "../dao/mongo/managers/session.manager.js";

const sessionManager = new SessionManager();

export async function validateSession (request,response,next){

        //const session = await sessionManager.getSession(request.signedCookies.session);
        if(!request.session.passport) {response.render("login");}
        else {next();}
        
}
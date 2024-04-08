import TicketsManager from "../../services/tickets.manager.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js"
import { purchaseNotificator } from "../../config/mailer.config.js";

const tm = new TicketsManager ();

export async function purchaseController(request,response,next){
    const cid = request.params.cid;
        try {
            const result= await tm.createTicket(cid);
            purchaseNotificator(request.user,result.ticket)
            response.status(201).send({Result: 'OK' , Operation: 'Create',Code: "201" ,Message: 'Se creo el objeto.', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}
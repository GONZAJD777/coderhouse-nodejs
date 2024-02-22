import TicketsManager from "../../services/tickets.manager.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js"

const tm = new TicketsManager ();

export async function purchaseController(request,response,next){
    const cid = request.params.cid;
        try {
            const result= await tm.createTicket(cid);
            response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
        }catch (error){ 
            responseErrorHandler(error,request,response,next);
        }
}
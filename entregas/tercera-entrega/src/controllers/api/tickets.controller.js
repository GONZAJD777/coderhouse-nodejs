import TicketsManager from "../../services/tickets.manager.js";

const tm = new TicketsManager ();

export async function purchaseController(request,response){
    const cid = request.params.cid;
        try {
            const result= await tm.createTicket(cid);
            response.json({Result: 'OK' , Operation: 'Create',Code: "200" ,Message: 'Se creo el objeto.', Object: result});
        }catch (error){ 
            response.status(400).json({Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message});  
        }
}
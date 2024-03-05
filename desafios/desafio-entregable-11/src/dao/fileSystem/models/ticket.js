import { randomUUID } from 'node:crypto'

class Ticket {

    #_id;               //autogenerado por Mongo
    #code;              //autogenerado y unico
    #purchase_datetime; //fecha y hora exacta de la compra
    #amount;            //total de la compra          
    #purchaser;         //correo del usuario asociado al carrito
    
    constructor({purchase_datetime,amount,purchaser}){
       this.#_id=randomUUID();
       this.#code=randomUUID();
       this.#purchase_datetime=purchase_datetime;
       this.#amount = amount;
       this.#purchaser = purchaser; 
    }

    get _id() { return this.#_id }
    get code() { return this.#code }
    get purchase_datetime() { return this.#purchase_datetime }
    get amount() { return this.#amount }
    get purchaser() { return this.#purchaser }

    set purchase_datetime(value) {this.#purchase_datetime = value}
    set amount(value) {this.#amount = value}
    set purchaser(value) {this.#purchaser = value}

    getTicketPOJO (){ //Plain Old Javascript Object
        return {
                    _id : this.#_id,
                    code : this.#code,
                    purchase_datetime : this.#purchase_datetime,
                    amount : this.#amount,
                    purchaser : this.#purchaser
                }
    }
}

export default Ticket;

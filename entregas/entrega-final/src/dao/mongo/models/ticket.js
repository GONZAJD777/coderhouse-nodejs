import { randomUUID } from 'node:crypto'

class Ticket {

    #_id;               //autogenerado por Mongo
    #code;              //autogenerado y unico
    #purchase_datetime; //fecha y hora exacta de la compra
    #amount;            //total de la compra          
    #purchaser;         //correo del usuario asociado al carrito
    #ticketDetail;
    
    constructor({id,purchase_datetime,amount,purchaser,ticketDetail}){
       this.#_id=id;
       this.#code=randomUUID();
       this.#purchase_datetime=purchase_datetime;
       this.#amount = amount;
       this.#purchaser = purchaser; 
       this.#ticketDetail = ticketDetail || [];
    }

    get _id() { return this.#_id }
    get code() { return this.#code }
    get purchase_datetime() { return this.#purchase_datetime }
    get amount() { return this.#amount }
    get purchaser() { return this.#purchaser }
    get ticketDetail() { return this.#ticketDetail }

    set _id(value) {this.#_id = value}
    set code(value) {this.#code = value}
    set purchase_datetime(value) {this.#purchase_datetime = value}
    set amount(value) {this.#amount = value}
    set purchaser(value) {this.#purchaser = value}
    set ticketDetail(value) {this.#ticketDetail = value}

    getTicketPOJO (){ //Plain Old Javascript Object
        return {
                    _id : this.#_id,
                    code : this.#code,
                    purchase_datetime : this.#purchase_datetime,
                    amount : this.#amount,
                    purchaser : this.#purchaser,
                    ticketDetail : this.#ticketDetail
                }
    }
}

class TicketDetail {
    #product;
    #quantity;

    constructor({productObj, quantity}) {
        this.product = productObj || {};
        this.quantity = quantity;
    }

    get product() { return this.#product }
    get quantity() { return this.#quantity }

    set product(value) {this.#product = value}
    set quantity(value) {this.#quantity = value}

    getTicketDetailPOJO (){ //Plain Old Javascript Object
        return {
                    productId : this.#product,
                    quantity : this.#quantity
                }
    }

}

export {Ticket,TicketDetail};

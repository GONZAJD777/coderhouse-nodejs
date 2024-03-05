import { randomUUID } from 'node:crypto'

class Message {

    #_id;
    #user;
    #message;

    constructor ({user,message}) {
        this.#_id = randomUUID();
        this.user = user;
        this.message = message;     
    }

    get _id(){return this.#_id}
    get user(){return this.#user}
    get message(){return this.#message}

    set user(value) {this.#user = value}
    set message(value) {this.#message = value}

    getMessagePOJO (){ //Plain Old Javascript Object
        return {
                    _id : this.#_id,
                    user : this.#user,
                    message : this.#message
                }
    }
}

export default Message;
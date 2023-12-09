import messageModel from "../models/message.js";
import { NotFoundError, CustomError } from '../../../model/custom.error.js';

export default class MessagesManager {


getMessages = async () => {
    try {
        return await messageModel.find().lean();
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(20010, 'Error al obtener los mensajes');
    }
}


addMessage = async (body) => {
    try {
        return messageModel.create(body);
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(20020, 'Error al agregar el producto');
    }
}

}
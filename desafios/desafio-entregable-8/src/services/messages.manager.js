import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';

const DAOFactory = getPersistence();
const MessagesDAO = DAOFactory.MessagesDAO;

export default class MessagesManager {


    getMessages = async () => {
        try {
            return await MessagesDAO.readMany({});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los mensajes' + error);
        }
    }
    
    
    addMessage = async (body) => {
        try {
            return MessagesDAO.create(body);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
        }
    }
    
    }
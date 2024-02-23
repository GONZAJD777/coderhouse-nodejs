import CartsManager from "./carts.manager.js";
import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { logger } from "../config/logger.config.js";


const DAOFactory = getPersistence();
const UsersDAO = DAOFactory.UsersDAO;
const CartManager = new CartsManager();

export default class UserManager {
    
    get = async () => {
        try {
            return UsersDAO.readMany();
        } catch (error){
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    getBy = async (params) => {
        try {
           params.email= params.email.toLowerCase()
           const user = await UsersDAO.readOne(params);
           return user;
        } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    create = async (body) => {
        try {
            body.email= body.email.toLowerCase()
            let user = await UsersDAO.readOne({email:body.email});//revisar DAO de usuarios para recibir email:email
            if(user) throw new CustomError(errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE]+ ' | ' + body.email );

            user = await UsersDAO.create(body);
            
            const cart = await CartManager.addCart();
            user.cart = cart._id;
            await UsersDAO.updateOne({email:body.email},{cart:cart._id})
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    deleteAll = async (params) => {
        try {
            const result = await UsersDAO.deleteMany(params);
            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }
    }
}
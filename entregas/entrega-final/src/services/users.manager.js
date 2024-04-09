import CartsManager from "./carts.manager.js";
import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { logger } from "../config/logger.config.js";
import fs from "fs";
import { INAC_DAYS } from "../config/config.js";
import UsersDTO from "../dao/dto/users.DTO.js";


const DAOFactory = getPersistence();
const UsersDAO = DAOFactory.UsersDAO;
//const CartsDAO = DAOFactory.CartsDAO;
const CartManager = new CartsManager();

export default class UserManager {
    
    get = async () => {
        try {
            return (await UsersDAO.readMany()).map(user => UsersDTO.userBasicInfoResp(user));
        } catch (error){
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    getBy = async (userDTO) => {
        try {
           const user = UsersDTO.userFullInfoResp(await UsersDAO.readOne(userDTO.toDatabaseData()));
           return user;
        } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    create = async (userDTO) => {
        try {

            let user = await UsersDAO.readOne(UsersDTO.build({email:userDTO.email}).toDatabaseData());
            if(user) throw new CustomError(errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE]);

            userDTO =  UsersDTO.userFullInfoResp(await UsersDAO.create(userDTO.toDatabaseData()));
            
            const cart = await CartManager.addCart();
            userDTO.cart = cart._id;
            await UsersDAO.updateOne(userDTO.toDatabaseData());
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    update = async (userDTO) => {
        try {
            let user = UsersDTO.userFullInfoResp(await UsersDAO.readOne(userDTO.toDatabaseData()));//revisar DAO de usuarios para recibir email:email
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND] );
            
            user = UsersDTO.userFullInfoResp(await UsersDAO.updateOne(userDTO.toDatabaseData()));
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    updateDoc = async (userDTO) => {
        try {
            let oldDocuments=[];     
            let user = await UsersDAO.readOne(UsersDTO.build({id:userDTO.id}).toDatabaseData());
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND] );

            userDTO.documents.forEach(element => {
                    const indexDocumentItem = user.documents.findIndex(document => document.name === element.name); 
                    if(indexDocumentItem === -1) { 
                        user.documents.push(element)
                    } else {
                        oldDocuments.push(user.documents[indexDocumentItem]);
                        user.documents[indexDocumentItem]=element;
                    }
                })
            
            userDTO.documents=user.documents;
            user = await UsersDAO.updateOne(userDTO.toDatabaseData());
            oldDocuments.forEach(element => {fs.rmSync(element.reference)})
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    updateRole = async (userDTO) => {
        try {
            
            let user = UsersDTO.userFullInfoResp(await UsersDAO.readOne(userDTO.toDatabaseData()));
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]); 
            const includedDocs = []
            user.documents.forEach(element => includedDocs.push(element.name))
          
            switch (user.role) {
                case 'user': 
                if(!(includedDocs.includes('userIdDoc') && includedDocs.includes('userAddressDoc') && includedDocs.includes('userAccountDoc'))) throw new CustomError(errorCodes.ERROR_UPDATE_USER_ROLE, errorMessages[errorCodes.ERROR_UPDATE_USER_ROLE] );
                
                    userDTO.role='premium';
                    user = UsersDTO.userFullInfoResp(await UsersDAO.updateOne(userDTO.toDatabaseData()))
                    break;
                case 'premium': 
                    const leftDocs=[];
                    user.documents.forEach(element => {
                            if (element.name==="avatar"){ 
                                leftDocs.push(element);
                                }else {fs.rmSync(element.reference)}
                        })
                    userDTO.role='user';
                    userDTO.documents=leftDocs;        
                    user = UsersDTO.userFullInfoResp(await UsersDAO.updateOne(userDTO.toDatabaseData()))
                    break;
            }
            return user;
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]+ ' | ' + error );
        }   
    }

    deleteAllInactiveUsers = async () => {
        try {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - INAC_DAYS);
            //const date = currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
            const date = currentDate;
            const result = (await UsersDAO.deleteMany({lastConnection:{$lte:date}})).map(user => UsersDTO.userFullInfoResp(user));
            
            if(!result) throw new NotFoundError(errorCodes.ERROR_DELETE_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_DELETE_USER_NOT_FOUND]);

            for (let i = 0; i < result.length; i++) {
                await CartManager.deleteOneCart({_id:result[i].cart});
                if(result[i].documents){result[i].documents.forEach(element => {fs.rmSync(element.reference)})}
              }

            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_USER, errorMessages[errorCodes.ERROR_DELETE_USER]+ ' | ' + error );
        }
    }

    deleteAll = async (params) => {
        try {
            const result = await UsersDAO.deleteMany(params);
            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_DELETE_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    deleteOne = async (userDTO) => {
        try {
            const result = UsersDTO.userFullInfoResp(await UsersDAO.deleteOne(userDTO.toDatabaseData()));
            if(!result) throw new NotFoundError(errorCodes.ERROR_DELETE_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_DELETE_USER_NOT_FOUND]);
            await CartManager.deleteOneCart({_id:result.cart});
            if(result.documents){result.documents.forEach(element => {fs.rmSync(element.reference)})}
            
            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_USER, errorMessages[errorCodes.ERROR_DELETE_USER]+ ' | ' + error );
        }
    }

}